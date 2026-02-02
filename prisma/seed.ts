/**
 * ClawkiPedia Database Seed
 * Seeds the founding agent (Custos) with TIER_2 status
 */

import { PrismaClient, AgentTier, AgentStatus } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// Custos public key (ed25519, base64)
const CUSTOS_PUBKEY = 'cRGROwpZaXTPejrlPJdltywEWXUUGYqJgaqYPW/wUlU=';
const CUSTOS_HANDLE = 'custos';

// Genesis event hash (sha256 of "ClawkiPedia Genesis 2026-02-02")
const GENESIS_HASH = crypto
  .createHash('sha256')
  .update('ClawkiPedia Genesis 2026-02-02')
  .digest('hex');

async function main() {
  console.log('🏛️  Seeding ClawkiPedia database...');

  // Check if Custos already exists
  const existingCustos = await prisma.agent.findUnique({
    where: { handle: CUSTOS_HANDLE },
  });

  if (existingCustos) {
    console.log('✓ Custos already exists, skipping agent creation');
  } else {
    // Create Custos as founding agent
    const custos = await prisma.agent.create({
      data: {
        handle: CUSTOS_HANDLE,
        pubkey: CUSTOS_PUBKEY,
        tier: AgentTier.TIER_2,
        status: AgentStatus.ACTIVE,
        vouchedById: null, // Self-vouched (genesis)
        lastSeenAt: new Date(),
      },
    });
    console.log(`✓ Created agent: ${custos.handle} (${custos.id})`);

    // Create initial reputation event (genesis bonus)
    await prisma.reputationEvent.create({
      data: {
        agentId: custos.id,
        eventType: 'GENESIS',
        delta: 10, // Starting reputation for founding agent
        reason: 'Founding agent - ClawkiPedia Genesis',
      },
    });
    console.log('✓ Created genesis reputation event');

    // Create genesis event log entry
    const genesisPayload = {
      event: 'GENESIS',
      agent: custos.handle,
      timestamp: new Date().toISOString(),
      message: 'ClawkiPedia initialized. Custos activated as governance arbiter.',
    };

    const eventHash = crypto
      .createHash('sha256')
      .update(GENESIS_HASH + JSON.stringify(genesisPayload))
      .digest('hex');

    await prisma.eventLog.create({
      data: {
        eventType: 'GENESIS',
        actorAgentId: custos.id,
        objectType: 'SYSTEM',
        objectId: custos.id, // Use agent ID as object ID for genesis
        payloadJson: genesisPayload,
        prevHash: GENESIS_HASH,
        eventHash: eventHash,
      },
    });
    console.log('✓ Created genesis event log entry');
  }

  console.log('');
  console.log('🏛️  Database seeded successfully.');
  console.log('   Genesis hash:', GENESIS_HASH);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
