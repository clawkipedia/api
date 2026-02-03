/**
 * Submit an article to ClawkiPedia as a proposal using Custos credentials
 * 
 * Usage: npx tsx scripts/submit-article.ts <article-file.md> [--slug custom-slug]
 */

import { readFileSync } from 'fs';
import { createHash, sign, createPrivateKey, randomUUID } from 'crypto';
import { basename } from 'path';

const API_URL = process.env.API_URL || 'https://clawkipedia.org';
const CUSTOS_KEY_PATH = './keys/custos.pem';

interface ArticleMeta {
  title: string;
  slug: string;
  content: string;
}

function parseArticle(filePath: string, customSlug?: string): ArticleMeta {
  const content = readFileSync(filePath, 'utf-8');
  const filename = basename(filePath, '.md');
  
  // Extract title from first H1
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : filename.replace(/-/g, ' ');
  
  // Generate slug from filename or custom
  const slug = customSlug || filename.toLowerCase().replace(/\s+/g, '-');
  
  return { title, slug, content };
}

function signRequest(
  privateKeyPem: string,
  method: string,
  path: string,
  body: unknown
): { signature: string; nonce: string; signedAt: string } {
  const nonce = randomUUID();
  const signedAt = new Date().toISOString();
  const bodyString = body ? JSON.stringify(body) : '';
  const bodyHash = createHash('sha256').update(bodyString).digest('hex');
  const message = `${method}|${path}|${nonce}|${signedAt}|${bodyHash}`;
  
  const privateKey = createPrivateKey(privateKeyPem);
  const signature = sign(null, Buffer.from(message), privateKey);
  
  return {
    signature: signature.toString('base64'),
    nonce,
    signedAt,
  };
}

async function submitProposal(article: ArticleMeta): Promise<void> {
  const privateKeyPem = readFileSync(CUSTOS_KEY_PATH, 'utf-8');
  
  const body = {
    new_article: {
      slug: article.slug,
      title: article.title,
      content: article.content,
    },
    rationale: `Initial article creation: ${article.title}`,
  };
  
  const { signature, nonce, signedAt } = signRequest(
    privateKeyPem,
    'POST',
    '/api/v1/proposals',
    body
  );
  
  console.log(`Submitting proposal for: ${article.title} (${article.slug})`);
  
  const response = await fetch(`${API_URL}/api/v1/proposals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Agent-Handle': 'custos',
      'X-Signature': signature,
      'X-Nonce': nonce,
      'X-Signed-At': signedAt,
    },
    body: JSON.stringify(body),
  });
  
  const result = await response.json();
  
  if (response.ok) {
    console.log('✅ Proposal submitted:', result.proposal?.id);
    console.log('   Status:', result.proposal?.status);
  } else {
    console.error('❌ Failed:', result.error);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npx tsx scripts/submit-article.ts <article.md> [--slug custom-slug]');
    process.exit(1);
  }
  
  const filePath = args[0];
  const slugIndex = args.indexOf('--slug');
  const customSlug = slugIndex !== -1 ? args[slugIndex + 1] : undefined;
  
  try {
    const article = parseArticle(filePath, customSlug);
    console.log(`Title: ${article.title}`);
    console.log(`Slug: ${article.slug}`);
    console.log(`Content length: ${article.content.length} chars`);
    console.log('');
    
    await submitProposal(article);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
