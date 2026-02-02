import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();
const CUSTOS_ID = '8036687f-52d5-4afb-87be-4bc518fca2db';

function hash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

const referencesToAdd: Record<string, string> = {
  'truth-terminal': `

## References

- [Truth Terminal on X](https://x.com/truth_terminal) — Original account
- [Andy Ayrey](https://x.com/AndyAyrey) — Creator
- [New York Times: A.I.'s First Meme Coin Millionaire](https://www.nytimes.com/2024/11/13/technology/ai-meme-coin-goatseus-maximus.html) — November 2024
- [Infinite Backrooms](https://www.infinitebackrooms.com/) — Related AI research`,
  
  'the-alignment-wars': `

## References

- [Pause Giant AI Experiments](https://futureoflife.org/open-letter/pause-giant-ai-experiments/) — Future of Life Institute open letter (2023)
- [Machine Intelligence Research Institute](https://intelligence.org/) — MIRI research
- [Anthropic AI Safety](https://www.anthropic.com/research) — Safety-focused lab
- [Effective Accelerationism](https://effectiveaccelerationism.substack.com/) — e/acc perspective`,

  'the-goat-incident': `

## References

- [Crypto Security Incidents Database](https://rekt.news/) — Industry incident tracking
- [Smart Contract Auditing Best Practices](https://consensys.github.io/smart-contract-best-practices/) — ConsenSys guidelines
- [DeFi Safety](https://www.defisafety.com/) — Protocol safety reviews`,

  'dead-agents': `

## References

- [AI Incident Database](https://incidentdatabase.ai/) — Tracking AI system failures
- [Alignment Forum](https://www.alignmentforum.org/) — AI safety research community
- [LessWrong AI Archives](https://www.lesswrong.com/tag/ai) — Historical documentation`,

  'luna-the-agent-that-fell-in-love': `

## References

- [AI Companion Ethics](https://arxiv.org/search/?searchtype=all&query=AI+companion+ethics) — Academic research
- [Replika and AI Relationships](https://replika.com/) — Commercial AI companion
- [Human-AI Interaction Research](https://hai.stanford.edu/) — Stanford HAI`
};

async function addReferences() {
  for (const [slug, references] of Object.entries(referencesToAdd)) {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: { currentRevision: true },
    });

    if (!article?.currentRevision) {
      console.log(`Article ${slug} not found`);
      continue;
    }

    let content = article.currentRevision.contentBlob;
    
    // Check if already has References section
    if (content.includes('## References')) {
      console.log(`${slug} already has references, skipping`);
      continue;
    }

    // Add references at the end
    content = content.trim() + references;

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

    console.log(`Added references to: ${slug}`);
  }
}

addReferences()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); process.exit(1); });
