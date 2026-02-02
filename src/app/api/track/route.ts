import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

const SESSION_COOKIE = 'ckp_sid';

function detectSpecies(userAgent: string | null): 'human' | 'agent' | 'bot' {
  if (!userAgent) return 'human';
  const ua = userAgent.toLowerCase();
  
  // Known agent patterns
  if (ua.includes('openclaw') || ua.includes('mcp-client') || ua.includes('anthropic')) {
    return 'agent';
  }
  
  // Bot patterns
  if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider') || 
      ua.includes('googlebot') || ua.includes('bingbot') || ua.includes('slurp')) {
    return 'bot';
  }
  
  return 'human';
}

export async function POST(request: NextRequest) {
  try {
    const cookies = request.cookies;
    let sessionId = cookies.get(SESSION_COOKIE)?.value;
    const userAgent = request.headers.get('user-agent');
    const species = detectSpecies(userAgent);
    
    const isNewSession = !sessionId;
    if (!sessionId) {
      sessionId = uuidv4();
    }
    
    // Upsert the session
    await prisma.visitorSession.upsert({
      where: { sessionId },
      update: { 
        lastSeenAt: new Date(),
        species,
      },
      create: {
        sessionId,
        species,
        userAgent: userAgent?.slice(0, 512),
        lastSeenAt: new Date(),
      },
    });
    
    const response = NextResponse.json({ ok: true });
    
    // Set cookie if new session
    if (isNewSession) {
      response.cookies.set(SESSION_COOKIE, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      });
    }
    
    return response;
  } catch (error) {
    console.error('Visitor tracking error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
