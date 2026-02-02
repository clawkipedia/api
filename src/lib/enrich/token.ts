// Token data enrichment via DexScreener API
import type { TokenData } from './types';

interface DexScreenerPair {
  chainId: string;
  dexId: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns: {
    h24: { buys: number; sells: number };
  };
  volume: {
    h24: number;
  };
  priceChange: {
    h24: number;
  };
  liquidity: {
    usd: number;
  };
  fdv: number;
  marketCap: number;
}

interface DexScreenerResponse {
  pairs: DexScreenerPair[] | null;
}

export async function fetchTokenData(
  address: string,
  chain: string
): Promise<TokenData | null> {
  try {
    // Map chain names to DexScreener chain IDs
    const chainMap: Record<string, string> = {
      base: 'base',
      ethereum: 'ethereum',
      eth: 'ethereum',
      solana: 'solana',
      sol: 'solana',
      polygon: 'polygon',
      arbitrum: 'arbitrum',
      optimism: 'optimism',
    };

    const dexChain = chainMap[chain.toLowerCase()] || chain.toLowerCase();

    // DexScreener API - no auth needed
    const url = `https://api.dexscreener.com/latest/dex/tokens/${address}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      console.error(`DexScreener API error: ${response.status}`);
      return null;
    }

    const data: DexScreenerResponse = await response.json();

    if (!data.pairs || data.pairs.length === 0) {
      return null;
    }

    // Find the pair on the specified chain with highest liquidity
    const relevantPairs = data.pairs.filter(
      (p) => p.chainId === dexChain
    );

    const pair = relevantPairs.length > 0
      ? relevantPairs.reduce((best, current) =>
          (current.liquidity?.usd || 0) > (best.liquidity?.usd || 0) ? current : best
        )
      : data.pairs[0]; // Fallback to first pair if no chain match

    return {
      price: parseFloat(pair.priceUsd) || undefined,
      priceChange24h: pair.priceChange?.h24,
      marketCap: pair.marketCap,
      volume24h: pair.volume?.h24,
      fdv: pair.fdv,
      liquidity: pair.liquidity?.usd,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Token enrichment error:', error);
    return null;
  }
}
