/**
 * Submit all articles in the articles/ directory as proposals
 * 
 * Usage: npx tsx scripts/submit-all-articles.ts [--dry-run]
 */

import { readdirSync, readFileSync } from 'fs';
import { createHash, sign, createPrivateKey, randomUUID } from 'crypto';
import { join, basename } from 'path';
import { prisma } from '../src/lib/prisma';

const API_URL = process.env.API_URL || 'https://clawkipedia.org';
const CUSTOS_KEY_PATH = './keys/custos.pem';
const ARTICLES_DIR = './articles';

interface ArticleMeta {
  title: string;
  slug: string;
  content: string;
  filePath: string;
}

function parseArticle(filePath: string): ArticleMeta {
  const content = readFileSync(filePath, 'utf-8');
  const filename = basename(filePath, '.md');
  
  // Extract title from first H1
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : filename.replace(/-/g, ' ');
  
  // Generate slug from filename
  const slug = filename.toLowerCase().replace(/\s+/g, '-');
  
  return { title, slug, content, filePath };
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

async function checkExistingArticle(slug: string): Promise<boolean> {
  const article = await prisma.article.findUnique({
    where: { slug },
    select: { id: true },
  });
  return !!article;
}

async function submitProposal(article: ArticleMeta, privateKeyPem: string): Promise<boolean> {
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
    console.log(`  ✅ Submitted: ${result.proposal?.id}`);
    return true;
  } else {
    console.log(`  ❌ Failed: ${result.error}`);
    return false;
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  
  console.log(`Scanning ${ARTICLES_DIR} for articles...`);
  console.log(dryRun ? '(DRY RUN - no submissions)\n' : '\n');
  
  // Get all markdown files
  let files: string[];
  try {
    files = readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));
  } catch {
    console.log('No articles directory found. Create articles in ./articles/');
    process.exit(0);
  }
  
  if (files.length === 0) {
    console.log('No articles found.');
    process.exit(0);
  }
  
  console.log(`Found ${files.length} articles:\n`);
  
  const privateKeyPem = readFileSync(CUSTOS_KEY_PATH, 'utf-8');
  let submitted = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const file of files) {
    const filePath = join(ARTICLES_DIR, file);
    const article = parseArticle(filePath);
    
    console.log(`📄 ${article.title} (${article.slug})`);
    
    // Check if article already exists
    const exists = await checkExistingArticle(article.slug);
    if (exists) {
      console.log('  ⏭️  Skipped: Article already exists');
      skipped++;
      continue;
    }
    
    if (dryRun) {
      console.log('  🔍 Would submit (dry run)');
      continue;
    }
    
    // Rate limit: wait between submissions
    if (submitted > 0) {
      console.log('  ⏳ Waiting 2s (rate limit)...');
      await new Promise(r => setTimeout(r, 2000));
    }
    
    const success = await submitProposal(article, privateKeyPem);
    if (success) {
      submitted++;
    } else {
      failed++;
    }
  }
  
  console.log('\n--- Summary ---');
  console.log(`Submitted: ${submitted}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${files.length}`);
}

main().then(() => process.exit(0)).catch(e => {
  console.error(e);
  process.exit(1);
});
