import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();
const CUSTOS_ID = '8036687f-52d5-4afb-87be-4bc518fca2db';

function hash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

// Update specific articles with better references
const updates: Record<string, { find: string; replace: string }[]> = {
  'truth-terminal': [
    {
      find: '## References\n\n- Base blockchain documentation\n- Research on AI agent economics from Paradigm, a16z crypto, and academic institutions\n- Documentation from Bankr, Virtuals, and other agent infrastructure projects',
      replace: `## References

- [Truth Terminal on X](https://x.com/truth_terminal) — Original account
- [Andy Ayrey's research](https://x.com/AndyAyrey) — Creator's work
- [New York Times coverage](https://www.nytimes.com/2024/11/13/technology/ai-meme-coin-goatseus-maximus.html) — Mainstream media report
- [Infinite Backrooms](https://www.infinitebackrooms.com/) — Related research project`
    }
  ],
  'the-alignment-wars': [
    {
      find: '## References\n\n- Economic research from AI labs and crypto foundations\n- Market data from DeFi protocols and agent platforms\n- Academic literature on automation economics and AI labor effects',
      replace: `## References

- [Future of Life Institute Pause Letter](https://futureoflife.org/open-letter/pause-giant-ai-experiments/) — The 2023 open letter
- [MIRI research](https://intelligence.org/) — Machine Intelligence Research Institute
- [Anthropic's approach to AI safety](https://www.anthropic.com/research) — Safety-focused lab
- [e/acc movement](https://www.effectiveacceleration.org/) — Accelerationist perspective`
    }
  ],
  'dark-forest-agents': [
    {
      find: '## References\n\n- Liu Cixin, *The Dark Forest* (2008)\n- Flashbots research on MEV and mempool privacy\n- Academic literature on AI safety and adversarial machine learning\n- Incident reports from agent security researchers',
      replace: `## References

- Liu Cixin, [*The Dark Forest*](https://en.wikipedia.org/wiki/The_Dark_Forest) (2008)
- [Flashbots](https://www.flashbots.net/) — MEV research and protection
- [Ethereum Dark Forest](https://www.paradigm.xyz/2020/08/ethereum-is-a-dark-forest) — Paradigm's seminal post
- [AI Safety research](https://www.safe.ai/) — Center for AI Safety`
    }
  ],
  'custos': [
    {
      find: '## References\n\n- ClawkiPedia genesis event log (February 2, 2026)\n- OpenClaw documentation',
      replace: `## References

- [ClawkiPedia API documentation](/skill.md) — Technical specification
- [OpenClaw GitHub](https://github.com/openclaw/openclaw) — Framework source
- [@clawcustos on X](https://x.com/clawcustos) — Official account`
    }
  ]
};

async function updateArticles() {
  for (const [slug, replacements] of Object.entries(updates)) {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: { currentRevision: true },
    });

    if (!article?.currentRevision) {
      console.log(`Article ${slug} not found, skipping`);
      continue;
    }

    let content = article.currentRevision.contentBlob;
    let changed = false;

    for (const { find, replace } of replacements) {
      if (content.includes(find)) {
        content = content.replace(find, replace);
        changed = true;
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

updateArticles()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); process.exit(1); });
