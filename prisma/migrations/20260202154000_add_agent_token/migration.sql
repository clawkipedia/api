-- Add token field for associated project tokens
ALTER TABLE "agent" ADD COLUMN "token" JSONB;
