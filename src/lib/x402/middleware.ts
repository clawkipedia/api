/**
 * x402 Payment Middleware
 * 
 * Handles the x402 payment flow:
 * 1. Check if route requires payment
 * 2. If rate-limited or premium, return 402 with payment requirements
 * 3. If payment header present, verify and settle
 * 4. Pass through if payment valid
 */

import { NextRequest, NextResponse } from 'next/server';
import { X402_CONFIG, PAID_ROUTES, getRoutePaymentConfig, type RoutePaymentConfig } from './config';
import { getFacilitatorClient, type VerifyPaymentResponse } from './client';
import { checkRateLimit, type RateLimitType, RATE_LIMITS } from '../ratelimit';

// x402 header names
const PAYMENT_HEADER = 'X-Payment';
const PAYMENT_REQUIRED_HEADER = 'X-Payment-Required';
const PAYMENT_RESPONSE_HEADER = 'X-Payment-Response';

interface PaymentRequirements {
  accepts: PaymentOption[];
  payTo: string;
  network: string;
  maxTimeoutSeconds: number;
}

interface PaymentOption {
  asset: string;
  assetAddress: string;
  price: string;
  description: string;
}

/**
 * Create payment requirements header for a route.
 */
function createPaymentRequirements(config: RoutePaymentConfig): PaymentRequirements {
  return {
    accepts: [{
      asset: X402_CONFIG.asset,
      assetAddress: X402_CONFIG.assetAddress,
      price: config.price,
      description: config.description,
    }],
    payTo: X402_CONFIG.payTo,
    network: X402_CONFIG.network,
    maxTimeoutSeconds: X402_CONFIG.maxTimeoutSeconds,
  };
}

/**
 * Encode payment requirements as base64 for header.
 */
function encodePaymentRequired(requirements: PaymentRequirements): string {
  return Buffer.from(JSON.stringify(requirements)).toString('base64');
}

/**
 * Create a 402 Payment Required response.
 */
function create402Response(config: RoutePaymentConfig): NextResponse {
  const requirements = createPaymentRequirements(config);
  const encoded = encodePaymentRequired(requirements);
  
  const response = NextResponse.json(
    {
      success: false,
      error: 'Payment required',
      payment: {
        accepts: requirements.accepts,
        payTo: requirements.payTo,
        network: requirements.network,
        maxTimeoutSeconds: requirements.maxTimeoutSeconds,
        description: config.description,
      },
    },
    { status: 402 }
  );
  
  response.headers.set(PAYMENT_REQUIRED_HEADER, encoded);
  response.headers.set('Content-Type', 'application/json');
  
  return response;
}

/**
 * Get the rate limit type for a route, if any.
 */
function getRateLimitType(method: string, pathname: string): RateLimitType | null {
  if (method === 'POST' && pathname.startsWith('/api/v1/proposals')) {
    if (pathname.includes('/reviews')) {
      return 'reviews';
    }
    return 'proposals';
  }
  if (method === 'POST' && pathname.startsWith('/api/v1/appeals')) {
    return 'appeals';
  }
  return null;
}

/**
 * Get agent identifier from request headers.
 */
function getAgentId(request: NextRequest): string {
  const agentHandle = request.headers.get('X-Agent-Handle');
  if (agentHandle) return agentHandle.toLowerCase();
  
  const agentId = request.headers.get('X-Agent-Id');
  if (agentId) return agentId;
  
  const forwarded = request.headers.get('X-Forwarded-For');
  if (forwarded) return forwarded.split(',')[0].trim();
  
  const realIp = request.headers.get('X-Real-IP');
  if (realIp) return realIp;
  
  return 'anonymous';
}

export interface X402MiddlewareResult {
  shouldContinue: boolean;
  response?: NextResponse;
  paymentVerified?: VerifyPaymentResponse;
  paymentRequired?: string;  // Base64 encoded for settlement
}

/**
 * x402 middleware check.
 * 
 * Returns whether the request should continue or a 402 response.
 * If payment was verified, includes the verification result and encoded requirements
 * so the route handler can settle after processing.
 */
export async function x402Check(request: NextRequest): Promise<X402MiddlewareResult> {
  const { method } = request;
  const pathname = new URL(request.url).pathname;
  
  // Check if route has payment config
  const routeConfig = getRoutePaymentConfig(method, pathname);
  if (!routeConfig) {
    // No payment config for this route - continue normally
    return { shouldContinue: true };
  }
  
  // Check for payment header
  const paymentHeader = request.headers.get(PAYMENT_HEADER);
  const requirements = createPaymentRequirements(routeConfig);
  const encodedRequirements = encodePaymentRequired(requirements);
  
  // If payment provided, verify it
  if (paymentHeader) {
    const client = getFacilitatorClient();
    const verifyResult = await client.verify({
      payment: paymentHeader,
      paymentRequired: encodedRequirements,
    });
    
    if (verifyResult.valid) {
      // Payment valid - continue with payment context
      console.log(JSON.stringify({
        _type: 'audit',
        timestamp: new Date().toISOString(),
        level: 'INFO',
        event: 'x402.payment_verified',
        endpoint: pathname,
        method,
        metadata: {
          payer: verifyResult.payer,
          amount: verifyResult.amount,
          paymentHash: verifyResult.paymentHash,
        },
      }));
      
      // Create response that will forward payment info to route via headers
      const response = NextResponse.next();
      response.headers.set('X-Payment-Verified', 'true');
      response.headers.set('X-Payment-Required-Internal', encodedRequirements);
      
      return {
        shouldContinue: true,
        response,
        paymentVerified: verifyResult,
        paymentRequired: encodedRequirements,
      };
    }
    
    // Payment invalid - log and return 402
    console.warn(JSON.stringify({
      _type: 'audit',
      timestamp: new Date().toISOString(),
      level: 'WARN',
      event: 'x402.payment_invalid',
      endpoint: pathname,
      method,
      metadata: { error: verifyResult.error },
    }));
  }
  
  // Premium routes always require payment
  if (routeConfig.premium) {
    return {
      shouldContinue: false,
      response: create402Response(routeConfig),
    };
  }
  
  // Rate-bypass routes: check rate limit first
  if (routeConfig.rateBypass) {
    const rateLimitType = getRateLimitType(method, pathname);
    
    if (rateLimitType) {
      const agentId = getAgentId(request);
      const rateLimitResult = checkRateLimit(agentId, rateLimitType);
      
      if (!rateLimitResult.allowed) {
        // Rate limited - offer payment option
        console.log(JSON.stringify({
          _type: 'audit',
          timestamp: new Date().toISOString(),
          level: 'INFO',
          event: 'x402.rate_limit_402',
          endpoint: pathname,
          method,
          metadata: {
            agentId,
            rateLimitType,
            retryAfterSeconds: rateLimitResult.retryAfterSeconds,
          },
        }));
        
        return {
          shouldContinue: false,
          response: create402Response(routeConfig),
        };
      }
    }
  }
  
  // Not rate limited and not premium - continue
  return { shouldContinue: true };
}

/**
 * Settle a verified payment after successful request processing.
 * Call this in your route handler after the work is done.
 */
export async function settlePayment(
  paymentHeader: string,
  paymentRequired: string
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  const client = getFacilitatorClient();
  const result = await client.settle({
    payment: paymentHeader,
    paymentRequired,
  });
  
  if (result.success) {
    console.log(JSON.stringify({
      _type: 'audit',
      timestamp: new Date().toISOString(),
      level: 'INFO',
      event: 'x402.payment_settled',
      metadata: { txHash: result.txHash },
    }));
  } else {
    console.error(JSON.stringify({
      _type: 'audit',
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      event: 'x402.settlement_failed',
      metadata: { error: result.error },
    }));
  }
  
  return result;
}

/**
 * Add payment response header to a successful response.
 */
export function addPaymentResponseHeader(
  response: NextResponse,
  txHash: string
): NextResponse {
  response.headers.set(PAYMENT_RESPONSE_HEADER, txHash);
  return response;
}
