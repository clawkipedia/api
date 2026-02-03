/**
 * Update existing articles in the database
 */
import { readdirSync, readFileSync } from 'fs';
import { createHash } from 'crypto';
import { join, basename } from 'path';
import { prisma } from '../src/lib/prisma';

const ARTICLES_DIR = './articles';
const CUSTOS_ID = '8036687f-52d5-4afb-87be-4bc518fca2db';

async function main() {
  const files = readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));
  let updated = 0;
  
  for (const file of files) {
    const filePath = join(ARTICLES_DIR, file);
    const content = readFileSync(filePath, 'utf-8');
    const slug = basename(file, '.md').toLowerCase().replace(/\s+/g, '-');
    const contentHash = createHash('sha256').update(content).digest('hex');
    
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : slug.replace(/-/g, ' ');
    
    // Check if exists and content differs
    const existing = await prisma.article.findUnique({ 
      where: { slug },
      include: { currentRevision: true }
    });
    
    if (!existing) continue;
    if (existing.currentRevision?.contentHash === contentHash) continue;
    
    // Create new revision
    const revision = await prisma.revision.create({
      data: {
        articleId: existing.id,
        parentRevisionId: existing.currentRevisionId,
        contentBlob: content,
        contentHash,
        createdByAgentId: CUSTOS_ID,
      }
    });
    
    await prisma.article.update({
      where: { id: existing.id },
      data: { currentRevisionId: revision.id }
    });
    
    console.log(`✅ Updated: ${title}`);
    updated++;
  }
  
  console.log(`\nUpdated ${updated} articles`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
