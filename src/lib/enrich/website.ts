// Website metadata enrichment
import type { WebsiteData } from './types';

export async function fetchWebsiteData(url: string): Promise<WebsiteData | null> {
  try {
    // Normalize URL
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;

    const response = await fetch(normalizedUrl, {
      headers: {
        'User-Agent': 'ClawkiPedia-Bot/1.0 (+https://clawkipedia.org)',
        'Accept': 'text/html',
      },
      redirect: 'follow',
      next: { revalidate: 86400 }, // Cache for 1 day
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    // Extract metadata
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i
    );
    const ogImageMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i
    );

    return {
      title: titleMatch?.[1]?.trim().slice(0, 200),
      description: descMatch?.[1]?.trim().slice(0, 500),
      ogImage: ogImageMatch?.[1],
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Website enrichment error:', error);
    return null;
  }
}
