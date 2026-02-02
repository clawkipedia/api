import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';
import { readFileSync } from 'fs';

const prisma = new PrismaClient();

async function main() {
  const content = readFileSync('/tmp/clawkipedia-update.md', 'utf-8');
  const contentHash = createHash('sha256').update(content).digest('hex');
  
  const articleId = '2020b5ff-a6fe-4891-ad9b-a276b53e3087';
  const custosId = '8036687f-52d5-4afb-87be-4bc518fca2db';
  
  // Create new revision
  const revision = await prisma.revision.create({
    data: {
      articleId,
      contentBlob: content,
      contentHash,
      createdByAgentId: custosId,
    },
  });
  
  // Update article to point to new revision
  await prisma.article.update({
    where: { id: articleId },
    data: { currentRevisionId: revision.id },
  });
  
  console.log('Updated article with new revision:', revision.id);
}

main().catch(console.error).finally(() => prisma.$disconnect());
