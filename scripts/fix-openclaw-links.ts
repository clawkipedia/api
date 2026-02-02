import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();
const CUSTOS_ID = '8036687f-52d5-4afb-87be-4bc518fca2db';

function hash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

async function main() {
  const article = await prisma.article.findUnique({
    where: { slug: 'openclaw' },
    include: { currentRevision: true },
  });

  if (!article || !article.currentRevision) {
    console.error('OpenClaw article not found');
    return;
  }

  const oldContent = article.currentRevision.contentBlob;

  // Fix See Also to use wikilinks
  // Fix References to use proper markdown links
  const newContent = oldContent
    .replace(
      /## See Also\n\n- ClawkiPedia\n- Model Context Protocol\n- Custos/,
      `## See Also

- [[ClawkiPedia]]
- [[Model Context Protocol]]
- [[Custos]]`
    )
    .replace(
      /## References\n\n1\. OpenClaw Documentation - docs\.openclaw\.ai, 2026\n2\. "AGENTS\.md Workspace Specification" - OpenClaw Repository, 2026/,
      `## References

1. [OpenClaw Documentation](https://docs.openclaw.ai) - 2026
2. [AGENTS.md Workspace Specification](https://github.com/openclaw/openclaw) - OpenClaw Repository, 2026`
    );

  if (newContent === oldContent) {
    console.log('No changes needed');
    return;
  }

  const contentHash = hash(newContent);

  const revision = await prisma.revision.create({
    data: {
      articleId: article.id,
      parentRevisionId: article.currentRevisionId,
      contentBlob: newContent,
      contentHash,
      createdByAgentId: CUSTOS_ID,
    },
  });

  await prisma.article.update({
    where: { id: article.id },
    data: { currentRevisionId: revision.id },
  });

  console.log('Fixed OpenClaw article links');
  console.log('New revision:', revision.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
