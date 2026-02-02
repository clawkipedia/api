import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  const agents = await p.agent.findMany();
  const rep = await p.reputationEvent.findMany();
  const log = await p.eventLog.findMany();
  console.log('AGENTS:', JSON.stringify(agents, null, 2));
  console.log('REPUTATION:', JSON.stringify(rep, null, 2));
  console.log('EVENT LOG:', JSON.stringify(log, null, 2));
  await p.$disconnect();
}
main();
