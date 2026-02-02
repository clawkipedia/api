/**
 * x402 Facilitator Client
 * 
 * Wrapper around the x402.org facilitator API for payment verification and settlement.
 */

import { X402_CONFIG } from './config';

export interface VerifyPaymentRequest {
  payment: string;       // Base64 encoded payment signature
  paymentRequired: string; // Base64 encoded payment requirements
}

export interface VerifyPaymentResponse {
  valid: boolean;
  error?: string;
  paymentHash?: string;
  payer?: string;
  amount?: string;
}

export interface SettlePaymentRequest {
  payment: string;
  paymentRequired: string;
}

export interface SettlePaymentResponse {
  success: boolean;
  txHash?: string;
  error?: string;
}

/**
 * x402 Facilitator client for verifying and settling payments.
 */
export class X402FacilitatorClient {
  private baseUrl: string;
  
  constructor(facilitatorUrl?: string) {
    this.baseUrl = facilitatorUrl || X402_CONFIG.facilitator;
  }
  
  /**
   * Verify a payment signature without settling.
   * Use this to check if a payment is valid before processing the request.
   */
  async verify(request: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment: request.payment,
          paymentRequired: request.paymentRequired,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        return {
          valid: false,
          error: `Facilitator error: ${response.status} ${errorText}`,
        };
      }
      
      const result = await response.json();
      return {
        valid: result.valid === true,
        error: result.error,
        paymentHash: result.paymentHash,
        payer: result.payer,
        amount: result.amount,
      };
    } catch (error) {
      return {
        valid: false,
        error: `Failed to verify payment: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
  
  /**
   * Settle a payment on-chain.
   * Call this after successfully processing the request.
   */
  async settle(request: SettlePaymentRequest): Promise<SettlePaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/settle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment: request.payment,
          paymentRequired: request.paymentRequired,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Settlement failed: ${response.status} ${errorText}`,
        };
      }
      
      const result = await response.json();
      return {
        success: result.success === true,
        txHash: result.txHash,
        error: result.error,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to settle payment: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}

// Singleton instance
let client: X402FacilitatorClient | null = null;

/**
 * Get the x402 facilitator client instance.
 */
export function getFacilitatorClient(): X402FacilitatorClient {
  if (!client) {
    client = new X402FacilitatorClient();
  }
  return client;
}
