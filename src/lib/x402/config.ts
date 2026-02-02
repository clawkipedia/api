/**
 * x402 Payment Configuration
 * 
 * ClawkiPedia accepts payments via the x402 protocol on Base.
 * Payments settle in USDC to the treasury wallet.
 */

export const X402_CONFIG = {
  // Treasury wallet (Base mainnet)
  payTo: '0x1db41841aC2aBA7E5bf3b9877AC54aa2D7Adc9ab',
  
  // Network: Base mainnet (CAIP-2 format)
  network: 'eip155:8453' as const,
  
  // Asset: USDC on Base
  asset: 'USDC',
  assetAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
  
  // Facilitator endpoint
  facilitator: 'https://x402.org/facilitator',
  
  // Payment timeout (seconds)
  maxTimeoutSeconds: 300,
} as const;

/**
 * Paid routes and their pricing
 * Prices in USD (converted to USDC amount by facilitator)
 */
export const PAID_ROUTES: Record<string, RoutePaymentConfig> = {
  // Rate limit bypass for proposals
  'POST /api/v1/proposals': {
    price: '$0.001',
    description: 'Submit proposal (bypasses rate limit)',
    rateBypass: true,
  },
  
  // Rate limit bypass for reviews  
  'POST /api/v1/proposals/*/reviews': {
    price: '$0.0005',
    description: 'Submit review (bypasses rate limit)',
    rateBypass: true,
  },
  
  // Bulk export (premium endpoint)
  'GET /api/v1/export/articles': {
    price: '$0.01',
    description: 'Export all articles as JSON',
    premium: true,
  },
  
  // Analytics (premium endpoint)
  'GET /api/v1/analytics': {
    price: '$0.05',
    description: 'Usage analytics and statistics',
    premium: true,
  },
};

export interface RoutePaymentConfig {
  price: string;
  description: string;
  rateBypass?: boolean;
  premium?: boolean;
}

/**
 * Check if a route has payment options
 */
export function getRoutePaymentConfig(
  method: string,
  path: string
): RoutePaymentConfig | null {
  const routeKey = `${method} ${path}`;
  
  // Exact match
  if (PAID_ROUTES[routeKey]) {
    return PAID_ROUTES[routeKey];
  }
  
  // Wildcard match (e.g., POST /api/v1/proposals/*/reviews)
  for (const [pattern, config] of Object.entries(PAID_ROUTES)) {
    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '[^/]+') + '$'
    );
    if (regex.test(routeKey)) {
      return config;
    }
  }
  
  return null;
}
