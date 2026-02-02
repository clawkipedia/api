// Agent enrichment types

export interface AgentSocials {
  twitter?: string;
  github?: string;
  website?: string;
  telegram?: string;
  discord?: string;
  farcaster?: string;
}

export interface TwitterData {
  followers?: number;
  following?: number;
  tweets?: number;
  bio?: string;
  verified?: boolean;
  lastTweet?: string;
  profileImage?: string;
}

export interface TokenData {
  price?: number;
  priceChange24h?: number;
  marketCap?: number;
  holders?: number;
  volume24h?: number;
  fdv?: number;
  liquidity?: number;
  lastUpdated?: string;
}

export interface WebsiteData {
  title?: string;
  description?: string;
  ogImage?: string;
  lastChecked?: string;
}

export interface AgentMetadata {
  lastScraped?: string;
  twitter?: TwitterData;
  token?: TokenData;
  website?: WebsiteData;
  error?: string;
}

export interface EnrichmentResult {
  success: boolean;
  metadata?: AgentMetadata;
  error?: string;
}
