import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BORING_SLUGS = [
  'json-rpc',
  'ed25519', 
  'model-context-protocol',
  'base-blockchain',
];

async function purge() {
  console.log('Purging dry reference articles...');
  
  for (const slug of BORING_SLUGS) {
    const article = await prisma.article.findUnique({ where: { slug } });
    if (!article) {
      console.log(`  ${slug}: not found, skipping`);
      continue;
    }
    
    // Delete revisions first
    await prisma.revision.deleteMany({ where: { articleId: article.id } });
    // Delete proposals
    await prisma.proposal.deleteMany({ where: { articleId: article.id } });
    // Delete article
    await prisma.article.delete({ where: { id: article.id } });
    
    console.log(`  Deleted: ${slug}`);
  }
  
  console.log('Done!');
}

purge()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); process.exit(1); });
