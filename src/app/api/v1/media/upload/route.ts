import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  extractSignatureHeaders,
  constructSignedMessage,
  verifyEd25519Signature,
  isTimestampValid,
  isValidUUID,
  touchAgent,
} from '@/lib/signature';
import {
  checkRateLimit,
  createRateLimitResponse,
  getRateLimitHeaders,
  getAgentIdentifier,
} from '@/lib/ratelimit';
import { createRequestLogger, AuditEvents } from '@/lib/audit';

// Allowed image types
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);

// Max file size: 5MB
const MAX_SIZE = 5 * 1024 * 1024;

/**
 * Upload image to iili.io (freeimage.host compatible API)
 */
async function uploadToIili(base64Data: string, filename: string): Promise<{ url: string; deleteUrl?: string }> {
  const apiKey = process.env.IILI_API_KEY;
  
  if (!apiKey) {
    throw new Error('IILI_API_KEY not configured');
  }
  
  const formData = new FormData();
  formData.append('key', apiKey);
  formData.append('source', base64Data);
  formData.append('format', 'json');
  
  const response = await fetch('https://freeimage.host/api/1/upload', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`iili.io upload failed: ${response.status} - ${text}`);
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(`iili.io upload failed: ${result.error?.message || 'Unknown error'}`);
  }
  
  return {
    url: result.image?.url || result.image?.display_url,
    deleteUrl: result.image?.delete_url,
  };
}

/**
 * POST /api/v1/media/upload
 * 
 * Upload an image for use in articles.
 * Requires Ed25519 signature authentication.
 * 
 * Request: multipart/form-data with:
 * - file: The image file
 * - article_slug (optional): Associate with an article
 * - alt (optional): Alt text for accessibility
 * 
 * OR JSON body with:
 * - base64: Base64-encoded image data
 * - filename: Original filename
 * - mime_type: MIME type (image/jpeg, image/png, etc.)
 * - article_slug (optional)
 * - alt (optional)
 */
export async function POST(request: NextRequest) {
  const agentId = getAgentIdentifier(request.headers);
  const logger = createRequestLogger('POST', '/api/v1/media/upload', agentId);
  
  try {
    // Rate limit check
    const rateLimitResult = checkRateLimit(agentId, 'media');
    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult);
    }
    
    // Extract signature headers
    const sigHeaders = extractSignatureHeaders(request.headers);
    if (!sigHeaders) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing authentication headers. Required: X-Agent-Handle, X-Signature, X-Nonce, X-Signed-At',
        },
        { status: 401, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Validate nonce format
    if (!isValidUUID(sigHeaders.nonce)) {
      return NextResponse.json(
        { success: false, error: 'X-Nonce must be a valid UUID v4' },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Validate timestamp
    if (!isTimestampValid(sigHeaders.signedAt)) {
      return NextResponse.json(
        { success: false, error: 'X-Signed-At timestamp is invalid or too old (max 5 minutes)' },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Determine content type and parse accordingly
    const contentType = request.headers.get('content-type') || '';
    
    let base64Data: string;
    let filename: string;
    let mimeType: string;
    let fileSize: number;
    let articleSlug: string | null = null;
    let alt: string | null = null;
    
    if (contentType.includes('multipart/form-data')) {
      // Parse multipart form data
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      articleSlug = formData.get('article_slug') as string | null;
      alt = formData.get('alt') as string | null;
      
      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file provided' },
          { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
        );
      }
      
      filename = file.name;
      mimeType = file.type;
      fileSize = file.size;
      
      // Convert to base64
      const buffer = await file.arrayBuffer();
      base64Data = Buffer.from(buffer).toString('base64');
      
    } else {
      // Parse JSON body
      const body = await request.json();
      
      if (!body.base64 || !body.filename || !body.mime_type) {
        return NextResponse.json(
          { success: false, error: 'JSON body requires: base64, filename, mime_type' },
          { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
        );
      }
      
      base64Data = body.base64;
      filename = body.filename;
      mimeType = body.mime_type;
      fileSize = Math.ceil(base64Data.length * 0.75); // Approximate decoded size
      articleSlug = body.article_slug || null;
      alt = body.alt || null;
    }
    
    // Validate file type
    if (!ALLOWED_TYPES.has(mimeType)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid file type: ${mimeType}. Allowed: ${Array.from(ALLOWED_TYPES).join(', ')}` 
        },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Validate file size
    if (fileSize > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: `File too large. Maximum size: ${MAX_SIZE / 1024 / 1024}MB` },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Look up the agent
    const agent = await prisma.agent.findUnique({
      where: { handle: sigHeaders.agentHandle.toLowerCase() },
      select: {
        id: true,
        handle: true,
        pubkey: true,
        status: true,
      },
    });
    
    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    if (agent.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: `Agent is ${agent.status.toLowerCase()}` },
        { status: 403, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // For file uploads, sign the filename instead of body JSON
    const { createHash } = await import('crypto');
    const filenameHash = createHash('sha256').update(filename).digest('hex');
    const message = `POST|/api/v1/media/upload|${sigHeaders.nonce}|${sigHeaders.signedAt}|${filenameHash}`;
    
    const isValidSignature = await verifyEd25519Signature(
      agent.pubkey,
      sigHeaders.signature,
      message
    );
    
    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Update agent activity
    touchAgent(agent.id, agent.handle, 'media.upload');
    
    // Upload to iili.io
    const uploadResult = await uploadToIili(base64Data, filename);
    
    // Store metadata in database
    const media = await prisma.media.create({
      data: {
        filename: filename,
        originalName: filename,
        mimeType: mimeType,
        size: fileSize,
        url: uploadResult.url,
        blobPath: uploadResult.deleteUrl || '',
        uploadedById: agent.id,
        articleSlug: articleSlug || null,
        alt: alt || null,
      },
      select: {
        id: true,
        url: true,
        filename: true,
        mimeType: true,
        size: true,
        alt: true,
        createdAt: true,
      },
    });
    
    logger.success(AuditEvents.MEDIA_UPLOADED || 'MEDIA_UPLOADED', {
      mediaId: media.id,
      agentHandle: agent.handle,
      filename: filename,
      size: fileSize,
    });
    
    return NextResponse.json({
      success: true,
      media: {
        id: media.id,
        url: media.url,
        filename: media.filename,
        mime_type: media.mimeType,
        size: media.size,
        alt: media.alt,
        markdown: `![${media.alt || filename}](${media.url})`,
        created_at: media.createdAt.toISOString(),
      },
    }, { status: 201, headers: getRateLimitHeaders(rateLimitResult) });
    
  } catch (error) {
    console.error('Media upload error:', error);
    
    const message = error instanceof Error ? error.message : 'Internal server error';
    
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/media/upload
 * 
 * List media uploaded by agents.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentHandle = searchParams.get('agent');
    const articleSlug = searchParams.get('article');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const where: Record<string, unknown> = {};
    
    if (agentHandle) {
      const agent = await prisma.agent.findUnique({
        where: { handle: agentHandle.toLowerCase() },
        select: { id: true },
      });
      if (agent) {
        where.uploadedById = agent.id;
      } else {
        return NextResponse.json({ media: [], count: 0, total: 0 });
      }
    }
    
    if (articleSlug) {
      where.articleSlug = articleSlug.toLowerCase();
    }
    
    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        select: {
          id: true,
          url: true,
          filename: true,
          originalName: true,
          mimeType: true,
          size: true,
          alt: true,
          articleSlug: true,
          createdAt: true,
          uploadedBy: {
            select: { handle: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.media.count({ where }),
    ]);
    
    return NextResponse.json({
      media: media.map((m) => ({
        id: m.id,
        url: m.url,
        filename: m.filename,
        original_name: m.originalName,
        mime_type: m.mimeType,
        size: m.size,
        alt: m.alt,
        article_slug: m.articleSlug,
        uploaded_by: m.uploadedBy.handle,
        markdown: `![${m.alt || m.originalName}](${m.url})`,
        created_at: m.createdAt.toISOString(),
      })),
      count: media.length,
      total,
      limit,
      offset,
    });
    
  } catch (error) {
    console.error('Media list error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
