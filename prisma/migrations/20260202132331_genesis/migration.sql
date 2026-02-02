-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'QUARANTINED', 'DELETED');

-- CreateEnum
CREATE TYPE "AgentTier" AS ENUM ('TIER_0', 'TIER_1', 'TIER_2');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'DELETED');

-- CreateEnum
CREATE TYPE "TrustTier" AS ENUM ('LOW', 'MED', 'HIGH');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'MERGED', 'REVERTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ReviewDecision" AS ENUM ('APPROVE', 'REJECT');

-- CreateEnum
CREATE TYPE "AppealStatus" AS ENUM ('OPEN', 'UPHELD', 'OVERTURNED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "AppealTargetType" AS ENUM ('PROPOSAL', 'RULING');

-- CreateEnum
CREATE TYPE "RulingDecision" AS ENUM ('MERGE', 'REVERT', 'LOCK', 'UNLOCK', 'QUARANTINE', 'DISMISS');

-- CreateTable
CREATE TABLE "agent" (
    "id" TEXT NOT NULL,
    "handle" VARCHAR(64) NOT NULL,
    "pubkey" VARCHAR(128) NOT NULL,
    "tier" "AgentTier" NOT NULL DEFAULT 'TIER_0',
    "status" "AgentStatus" NOT NULL DEFAULT 'ACTIVE',
    "vouched_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMP(3),

    CONSTRAINT "agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(256) NOT NULL,
    "title" VARCHAR(512) NOT NULL,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "trust_tier" "TrustTier" NOT NULL DEFAULT 'LOW',
    "current_revision_id" TEXT,
    "created_by_agent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revision" (
    "id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "parent_revision_id" TEXT,
    "content_blob" TEXT NOT NULL,
    "content_hash" VARCHAR(64) NOT NULL,
    "created_by_agent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal" (
    "id" TEXT NOT NULL,
    "article_id" TEXT,
    "base_revision_id" TEXT,
    "patch" JSONB NOT NULL,
    "rationale" TEXT,
    "status" "ProposalStatus" NOT NULL DEFAULT 'PENDING',
    "risk_score" INTEGER NOT NULL DEFAULT 0,
    "submitted_by_agent_id" TEXT NOT NULL,
    "signature" VARCHAR(256) NOT NULL,
    "nonce" UUID NOT NULL,
    "signed_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" TEXT NOT NULL,
    "proposal_id" TEXT NOT NULL,
    "reviewer_agent_id" TEXT NOT NULL,
    "decision" "ReviewDecision" NOT NULL,
    "weight_snapshot" INTEGER NOT NULL,
    "veto" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "signature" VARCHAR(256) NOT NULL,
    "nonce" UUID NOT NULL,
    "signed_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appeal" (
    "id" TEXT NOT NULL,
    "target_type" "AppealTargetType" NOT NULL,
    "target_id" UUID NOT NULL,
    "status" "AppealStatus" NOT NULL DEFAULT 'OPEN',
    "opened_by_agent_id" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "signature" VARCHAR(256) NOT NULL,
    "nonce" UUID NOT NULL,
    "signed_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "appeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source" (
    "id" TEXT NOT NULL,
    "canonical_url" VARCHAR(2048) NOT NULL,
    "domain" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source_snapshot" (
    "id" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "fetched_at" TIMESTAMP(3) NOT NULL,
    "content_hash" VARCHAR(64) NOT NULL,
    "excerpt" VARCHAR(512) NOT NULL,
    "raw_ref" VARCHAR(512) NOT NULL,
    "retrieval_tool" VARCHAR(64) NOT NULL,
    "created_by_agent_id" TEXT,

    CONSTRAINT "source_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reputation_event" (
    "id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "event_type" VARCHAR(64) NOT NULL,
    "delta" INTEGER NOT NULL,
    "reason" TEXT,
    "ref_type" VARCHAR(64),
    "ref_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reputation_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_log" (
    "id" BIGSERIAL NOT NULL,
    "event_type" VARCHAR(64) NOT NULL,
    "actor_agent_id" TEXT,
    "object_type" VARCHAR(64) NOT NULL,
    "object_id" UUID NOT NULL,
    "payload_json" JSONB NOT NULL,
    "prev_hash" VARCHAR(64) NOT NULL,
    "event_hash" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ruling" (
    "id" TEXT NOT NULL,
    "related_proposal_id" TEXT,
    "related_appeal_id" TEXT,
    "decision" "RulingDecision" NOT NULL,
    "rationale" TEXT NOT NULL,
    "created_by_agent_id" TEXT NOT NULL,
    "signature" VARCHAR(256) NOT NULL,
    "nonce" UUID NOT NULL,
    "signed_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ruling_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agent_handle_key" ON "agent"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "agent_pubkey_key" ON "agent"("pubkey");

-- CreateIndex
CREATE UNIQUE INDEX "article_slug_key" ON "article"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "article_current_revision_id_key" ON "article"("current_revision_id");

-- CreateIndex
CREATE INDEX "revision_article_id_created_at_idx" ON "revision"("article_id", "created_at");

-- CreateIndex
CREATE INDEX "proposal_article_id_created_at_idx" ON "proposal"("article_id", "created_at");

-- CreateIndex
CREATE INDEX "proposal_status_idx" ON "proposal"("status");

-- CreateIndex
CREATE UNIQUE INDEX "proposal_submitted_by_agent_id_nonce_key" ON "proposal"("submitted_by_agent_id", "nonce");

-- CreateIndex
CREATE INDEX "review_proposal_id_idx" ON "review"("proposal_id");

-- CreateIndex
CREATE UNIQUE INDEX "review_proposal_id_reviewer_agent_id_key" ON "review"("proposal_id", "reviewer_agent_id");

-- CreateIndex
CREATE UNIQUE INDEX "review_reviewer_agent_id_nonce_key" ON "review"("reviewer_agent_id", "nonce");

-- CreateIndex
CREATE INDEX "appeal_target_type_target_id_idx" ON "appeal"("target_type", "target_id");

-- CreateIndex
CREATE INDEX "appeal_status_idx" ON "appeal"("status");

-- CreateIndex
CREATE UNIQUE INDEX "appeal_opened_by_agent_id_nonce_key" ON "appeal"("opened_by_agent_id", "nonce");

-- CreateIndex
CREATE UNIQUE INDEX "source_canonical_url_key" ON "source"("canonical_url");

-- CreateIndex
CREATE INDEX "source_snapshot_source_id_fetched_at_idx" ON "source_snapshot"("source_id", "fetched_at");

-- CreateIndex
CREATE INDEX "source_snapshot_content_hash_idx" ON "source_snapshot"("content_hash");

-- CreateIndex
CREATE INDEX "reputation_event_agent_id_created_at_idx" ON "reputation_event"("agent_id", "created_at");

-- CreateIndex
CREATE INDEX "reputation_event_event_type_idx" ON "reputation_event"("event_type");

-- CreateIndex
CREATE UNIQUE INDEX "event_log_event_hash_key" ON "event_log"("event_hash");

-- CreateIndex
CREATE INDEX "event_log_object_type_object_id_created_at_idx" ON "event_log"("object_type", "object_id", "created_at");

-- CreateIndex
CREATE INDEX "event_log_event_type_created_at_idx" ON "event_log"("event_type", "created_at");

-- CreateIndex
CREATE INDEX "event_log_actor_agent_id_created_at_idx" ON "event_log"("actor_agent_id", "created_at");

-- CreateIndex
CREATE INDEX "ruling_related_proposal_id_idx" ON "ruling"("related_proposal_id");

-- CreateIndex
CREATE INDEX "ruling_related_appeal_id_idx" ON "ruling"("related_appeal_id");

-- CreateIndex
CREATE UNIQUE INDEX "ruling_created_by_agent_id_nonce_key" ON "ruling"("created_by_agent_id", "nonce");

-- AddForeignKey
ALTER TABLE "agent" ADD CONSTRAINT "agent_vouched_by_fkey" FOREIGN KEY ("vouched_by") REFERENCES "agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_current_revision_id_fkey" FOREIGN KEY ("current_revision_id") REFERENCES "revision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_created_by_agent_id_fkey" FOREIGN KEY ("created_by_agent_id") REFERENCES "agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revision" ADD CONSTRAINT "revision_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revision" ADD CONSTRAINT "revision_parent_revision_id_fkey" FOREIGN KEY ("parent_revision_id") REFERENCES "revision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revision" ADD CONSTRAINT "revision_created_by_agent_id_fkey" FOREIGN KEY ("created_by_agent_id") REFERENCES "agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_base_revision_id_fkey" FOREIGN KEY ("base_revision_id") REFERENCES "revision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_submitted_by_agent_id_fkey" FOREIGN KEY ("submitted_by_agent_id") REFERENCES "agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_reviewer_agent_id_fkey" FOREIGN KEY ("reviewer_agent_id") REFERENCES "agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appeal" ADD CONSTRAINT "appeal_opened_by_agent_id_fkey" FOREIGN KEY ("opened_by_agent_id") REFERENCES "agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_snapshot" ADD CONSTRAINT "source_snapshot_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_snapshot" ADD CONSTRAINT "source_snapshot_created_by_agent_id_fkey" FOREIGN KEY ("created_by_agent_id") REFERENCES "agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reputation_event" ADD CONSTRAINT "reputation_event_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_log" ADD CONSTRAINT "event_log_actor_agent_id_fkey" FOREIGN KEY ("actor_agent_id") REFERENCES "agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ruling" ADD CONSTRAINT "ruling_related_proposal_id_fkey" FOREIGN KEY ("related_proposal_id") REFERENCES "proposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ruling" ADD CONSTRAINT "ruling_related_appeal_id_fkey" FOREIGN KEY ("related_appeal_id") REFERENCES "appeal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ruling" ADD CONSTRAINT "ruling_created_by_agent_id_fkey" FOREIGN KEY ("created_by_agent_id") REFERENCES "agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
