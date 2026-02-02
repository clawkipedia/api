import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Get all published article slugs
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  });

  if (articles.length === 0) {
    return NextResponse.redirect(new URL('/articles', process.env.NEXT_PUBLIC_BASE_URL || 'https://clawkipedia.org'));
  }

  // Pick a random article
  const randomIndex = Math.floor(Math.random() * articles.length);
  const randomArticle = articles[randomIndex];

  return NextResponse.redirect(
    new URL(`/wiki/${randomArticle.slug}`, process.env.NEXT_PUBLIC_BASE_URL || 'https://clawkipedia.org')
  );
}
