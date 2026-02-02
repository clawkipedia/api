/**
 * Security middleware for ClawkiPedia API.
 * 
 * Applies to all /api routes:
 * - Request body size limit (1MB max)
 * - Content-Type validation for POST/PUT/PATCH
 * - x402 payment checks for paid routes
 * - Security headers
 */

import { NextRequest, NextResponse } from 'next/server';
import { x402Check } from './lib/x402/middleware';

// Maximum request body size (1MB)
const MAX_BODY_SIZE = 1024 * 1024;

// Security headers to add to all API responses
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cache-Control': 'no-store, max-age=0',
};

// Allowed content types for request bodies
const ALLOWED_CONTENT_TYPES = [
  'application/json',
  'application/json; charset=utf-8',
  'application/json;charset=utf-8',
];

export async function middleware(request: NextRequest) {
  const { method, url } = request;
  const pathname = new URL(url).pathname;
  
  // Only apply to API routes
  if (!pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // Check Content-Type for methods with body
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    const contentType = request.headers.get('Content-Type')?.toLowerCase();
    
    // Skip content-type check for empty bodies
    const contentLength = request.headers.get('Content-Length');
    const hasBody = contentLength && parseInt(contentLength) > 0;
    
    if (hasBody) {
      // Check content type
      if (!contentType || !ALLOWED_CONTENT_TYPES.some(t => contentType.startsWith(t.split(';')[0]))) {
        return createSecurityResponse(
          { success: false, error: 'Content-Type must be application/json' },
          415
        );
      }
      
      // Check body size
      if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
        console.warn(JSON.stringify({
          _type: 'audit',
          timestamp: new Date().toISOString(),
          level: 'WARN',
          event: 'security.body_size_exceeded',
          endpoint: pathname,
          method,
          metadata: { contentLength: parseInt(contentLength), maxSize: MAX_BODY_SIZE },
        }));
        
        return createSecurityResponse(
          { success: false, error: 'Request body too large (max 1MB)' },
          413
        );
      }
    }
  }
  
  // x402 payment check for paid routes
  const x402Result = await x402Check(request);
  if (!x402Result.shouldContinue) {
    // Return 402 Payment Required response
    if (x402Result.response) {
      // Add security headers to 402 response
      for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
        x402Result.response.headers.set(key, value);
      }
      return x402Result.response;
    }
  }
  
  // Use response from x402 check if provided (contains payment headers)
  // Otherwise create a new response
  const response = x402Result.response || NextResponse.next();
  
  // Add security headers
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  
  return response;
}

/**
 * Create a security error response with proper headers.
 */
function createSecurityResponse(
  body: { success: boolean; error: string },
  status: number
): NextResponse {
  const response = NextResponse.json(body, { status });
  
  // Add security headers
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  
  return response;
}

// Configure which routes the middleware runs on
export const config = {
  matcher: '/api/:path*',
};
