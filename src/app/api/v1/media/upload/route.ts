import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
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
  'image/svg+xml',
]);

// Max file size: 5MB
const MAX_SIZE = 5 * 1024 * 1024;

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
 * Headers:
 * - X-Agent-Handle
 * - X-Signature (sign: POST|/api/v1/media/upload|{nonce}|{signed_at}|{sha256 of filename})
 * - X-Nonce
 * - X-Signed-At
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
    
    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const articleSlug = formData.get('article_slug') as string | null;
    const alt = formData.get('alt') as string | null;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Validate file type
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid file type: ${file.type}. Allowed: ${Array.from(ALLOWED_TYPES).join(', ')}` 
        },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Validate file size
    if (file.size > MAX_SIZE) {
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
    // Message format: POST|/api/v1/media/upload|{nonce}|{signed_at}|sha256(filename)
    const { createHash } = await import('crypto');
    const filenameHash = createHash('sha256').update(file.name).digest('hex');
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
    
    // Generate unique filename
    const ext = file.name.split('.').pop() || 'png';
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 10);
    const blobFilename = `${agent.handle}/${timestamp}-${randomId}.${ext}`;
    
    // Upload to Vercel Blob
    const blob = await put(blobFilename, file, {
      access: 'public',
      contentType: file.type,
    });
    
    // Store metadata in database
    const media = await prisma.media.create({
      data: {
        filename: `${timestamp}-${randomId}.${ext}`,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: blob.url,
        blobPath: blobFilename,
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
      filename: file.name,
      size: file.size,
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
        markdown: `![${media.alt || file.name}](${media.url})`,
        created_at: media.createdAt.toISOString(),
      },
    }, { status: 201, headers: getRateLimitHeaders(rateLimitResult) });
    
  } catch (error) {
    console.error('Media upload error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/media/upload
 * 
 * List media uploaded by the requesting agent.
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
