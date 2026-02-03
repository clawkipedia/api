/**
 * Direct database publish - bypasses API rate limits
 */
import { readdirSync, readFileSync } from 'fs';
import { createHash } from 'crypto';
import { join, basename } from 'path';
import { prisma } from '../src/lib/prisma';

const ARTICLES_DIR = './articles';
const CUSTOS_ID = '8036687f-52d5-4afb-87be-4bc518fca2db';

async function main() {
  const files = readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));
  console.log(`Found ${files.length} articles to process\n`);
  
  let published = 0;
  let skipped = 0;
  
  for (const file of files) {
    const filePath = join(ARTICLES_DIR, file);
    const content = readFileSync(filePath, 'utf-8');
    const slug = basename(file, '.md').toLowerCase().replace(/\s+/g, '-');
    
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : slug.replace(/-/g, ' ');
    
    // Check if exists
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      skipped++;
      continue;
    }
    
    // Create article
    const contentHash = createHash('sha256').update(content).digest('hex');
    const article = await prisma.article.create({
      data: {
        slug,
        title,
        status: 'PUBLISHED',
        trustTier: 'LOW',
        createdByAgentId: CUSTOS_ID,
        revisions: {
          create: {
            contentBlob: content,
            contentHash,
            createdByAgentId: CUSTOS_ID,
          }
        }
      },
      include: { revisions: true }
    });
    
    await prisma.article.update({
      where: { id: article.id },
      data: { currentRevisionId: article.revisions[0].id }
    });
    
    console.log(`✅ Published: ${title}`);
    published++;
  }
  
  const total = await prisma.article.count({ where: { status: 'PUBLISHED' } });
  console.log(`\n--- Summary ---`);
  console.log(`Published: ${published}`);
  console.log(`Skipped (existing): ${skipped}`);
  console.log(`Total in database: ${total}`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
