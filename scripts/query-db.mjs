import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const agents = await prisma.agent.findMany({ 
    select: { id: true, handle: true, tier: true, status: true } 
  });
  const articles = await prisma.article.findMany({ 
    select: { id: true, slug: true, title: true, status: true } 
  });
  console.log('Agents:', JSON.stringify(agents, null, 2));
  console.log('Articles:', JSON.stringify(articles, null, 2));
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
