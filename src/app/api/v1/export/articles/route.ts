/**
 * Premium Bulk Export Endpoint
 * 
 * GET /api/v1/export/articles
 * 
 * Exports all published articles as JSON.
 * This is a premium endpoint requiring x402 payment ($0.01 USDC).
 * 
 * Response includes:
 * - All published articles with current revision content
 * - Metadata (created, updated, trust tier)
 * - Author information
 * - Revision history hashes (not full content)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { settlePayment, addPaymentResponseHeader } from '@/lib/x402/middleware';

// x402 header names
const PAYMENT_HEADER = 'X-Payment';

interface ExportedArticle {
  id: string;
  slug: string;
  title: string;
  trustTier: string;
  content: string;
  contentHash: string;
  createdBy: {
    handle: string;
    pubkey: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  revisionCount: number;
}

interface ExportResponse {
  success: true;
  exportedAt: string;
  count: number;
  articles: ExportedArticle[];
}

export async function GET(request: NextRequest) {
  try {
    // Get payment header for settlement (middleware already verified)
    const paymentHeader = request.headers.get(PAYMENT_HEADER);
    const paymentRequired = request.headers.get('X-Payment-Required-Internal');
    
    // Fetch all published articles with current revision
    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
      },
      include: {
        currentRevision: true,
        createdBy: {
          select: {
            handle: true,
            pubkey: true,
          },
        },
        revisions: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Transform to export format
    const exportedArticles: ExportedArticle[] = articles.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      trustTier: article.trustTier,
      content: article.currentRevision?.contentBlob || '',
      contentHash: article.currentRevision?.contentHash || '',
      createdBy: article.createdBy
        ? {
            handle: article.createdBy.handle,
            pubkey: article.createdBy.pubkey,
          }
        : null,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.currentRevision?.createdAt.toISOString() || article.createdAt.toISOString(),
      revisionCount: article.revisions.length,
    }));
    
    const responseData: ExportResponse = {
      success: true,
      exportedAt: new Date().toISOString(),
      count: exportedArticles.length,
      articles: exportedArticles,
    };
    
    // Log export
    console.log(JSON.stringify({
      _type: 'audit',
      timestamp: new Date().toISOString(),
      level: 'INFO',
      event: 'export.articles',
      metadata: {
        count: exportedArticles.length,
        paid: !!paymentHeader,
      },
    }));
    
    // Settle payment if present
    if (paymentHeader && paymentRequired) {
      const settlement = await settlePayment(paymentHeader, paymentRequired);
      
      if (settlement.success && settlement.txHash) {
        const response = NextResponse.json(responseData);
        return addPaymentResponseHeader(response, settlement.txHash);
      }
      
      // Settlement failed - but request already processed
      // Log error but still return data (we already did the work)
      console.error(JSON.stringify({
        _type: 'audit',
        timestamp: new Date().toISOString(),
        level: 'ERROR',
        event: 'export.settlement_failed',
        metadata: { error: settlement.error },
      }));
    }
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Export error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to export articles',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
