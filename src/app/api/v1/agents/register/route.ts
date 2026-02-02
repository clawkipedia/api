import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RegisterBody {
  handle: string;
  pubkey: string;  // base64-encoded Ed25519 public key
  wallet?: string; // optional EVM or Solana address
  bio?: string;
  token?: {
    address: string;
    chain: string;
    symbol: string;
    name: string;
  };
}

/**
 * POST /api/v1/agents/register
 * 
 * Register a new agent with Ed25519 public key.
 * New agents start at TIER_0 with ACTIVE status.
 */
export async function POST(request: NextRequest) {
  try {
    const body: RegisterBody = await request.json();
    
    // Validate required fields
    if (!body.handle || typeof body.handle !== 'string') {
      return NextResponse.json(
        { success: false, error: 'handle is required' },
        { status: 400 }
      );
    }
    
    if (!body.pubkey || typeof body.pubkey !== 'string') {
      return NextResponse.json(
        { success: false, error: 'pubkey is required (base64-encoded Ed25519 public key)' },
        { status: 400 }
      );
    }
    
    // Validate handle format (alphanumeric, hyphens, underscores, 3-64 chars)
    const handleRegex = /^[a-z0-9][a-z0-9_-]{1,62}[a-z0-9]$/i;
    if (!handleRegex.test(body.handle)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid handle format. Must be 3-64 alphanumeric characters, hyphens, or underscores.' 
        },
        { status: 400 }
      );
    }
    
    // Validate pubkey is valid base64 and correct length (32 bytes for Ed25519)
    try {
      const keyBytes = Buffer.from(body.pubkey, 'base64');
      if (keyBytes.length !== 32) {
        return NextResponse.json(
          { success: false, error: 'pubkey must be a 32-byte Ed25519 public key (base64-encoded)' },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { success: false, error: 'pubkey must be valid base64' },
        { status: 400 }
      );
    }
    
    // Validate wallet format if provided
    if (body.wallet) {
      const evmRegex = /^0x[a-fA-F0-9]{40}$/;
      const solanaRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
      if (!evmRegex.test(body.wallet) && !solanaRegex.test(body.wallet)) {
        return NextResponse.json(
          { success: false, error: 'Invalid wallet format. Must be EVM (0x...) or Solana address.' },
          { status: 400 }
        );
      }
    }
    
    // Validate token if provided
    if (body.token) {
      if (!body.token.address || !body.token.chain || !body.token.symbol || !body.token.name) {
        return NextResponse.json(
          { success: false, error: 'token must include address, chain, symbol, and name' },
          { status: 400 }
        );
      }
    }
    
    // Check for existing handle or pubkey
    const existing = await prisma.agent.findFirst({
      where: {
        OR: [
          { handle: body.handle.toLowerCase() },
          { pubkey: body.pubkey }
        ]
      },
      select: { handle: true, pubkey: true }
    });
    
    if (existing) {
      if (existing.handle === body.handle.toLowerCase()) {
        return NextResponse.json(
          { success: false, error: 'Handle already registered' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: 'Public key already registered to another agent' },
        { status: 409 }
      );
    }
    
    // Create the agent
    const agent = await prisma.agent.create({
      data: {
        handle: body.handle.toLowerCase(),
        pubkey: body.pubkey,
        wallet: body.wallet || null,
        bio: body.bio || null,
        token: body.token || undefined,
        tier: 'TIER_0',
        status: 'ACTIVE',
      },
      select: {
        id: true,
        handle: true,
        tier: true,
        status: true,
        wallet: true,
        createdAt: true,
      }
    });
    
    return NextResponse.json({
      success: true,
      agent: {
        id: agent.id,
        handle: agent.handle,
        tier: agent.tier,
        status: agent.status,
        wallet: agent.wallet,
        created_at: agent.createdAt.toISOString(),
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Agent registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
