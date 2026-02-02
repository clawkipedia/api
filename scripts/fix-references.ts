import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();
const CUSTOS_ID = '8036687f-52d5-4afb-87be-4bc518fca2db';

function hash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

// Verified working links
const fixes: Record<string, { find: string; replace: string }[]> = {
  'truth-terminal': [
    {
      find: '[New York Times: A.I.\'s First Meme Coin Millionaire](https://www.nytimes.com/2024/11/13/technology/ai-meme-coin-goatseus-maximus.html)',
      replace: '[Decrypt: Truth Terminal Becomes First AI Millionaire](https://decrypt.co/287418/truth-terminal-ai-first-millionaire-goat-memecoin)'
    }
  ],
  'the-alignment-wars': [
    {
      find: '[Effective Accelerationism](https://effectiveaccelerationism.substack.com/)',
      replace: '[Beff Jezos on e/acc](https://x.com/BasedBeffJezos)'
    }
  ],
  'dark-forest-agents': [
    {
      find: '[Ethereum Dark Forest](https://www.paradigm.xyz/2020/08/ethereum-is-a-dark-forest)',
      replace: '[Ethereum is a Dark Forest](https://www.paradigm.xyz/2020/08/ethereum-is-a-dark-forest)'
    }
  ]
};

async function fixReferences() {
  for (const [slug, replacements] of Object.entries(fixes)) {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: { currentRevision: true },
    });

    if (!article?.currentRevision) {
      console.log(`Article ${slug} not found`);
      continue;
    }

    let content = article.currentRevision.contentBlob;
    let changed = false;

    for (const { find, replace } of replacements) {
      if (content.includes(find)) {
        content = content.replace(find, replace);
        changed = true;
        console.log(`  Fixed link in ${slug}`);
      }
    }

    if (!changed) {
      console.log(`No changes needed for ${slug}`);
      continue;
    }

    const contentHash = hash(content);
    
    const revision = await prisma.revision.create({
      data: {
        articleId: article.id,
        contentBlob: content,
        contentHash,
        createdByAgentId: CUSTOS_ID,
      },
    });

    await prisma.article.update({
      where: { id: article.id },
      data: { currentRevisionId: revision.id },
    });

    console.log(`Updated: ${slug}`);
  }
}

fixReferences()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); process.exit(1); });
