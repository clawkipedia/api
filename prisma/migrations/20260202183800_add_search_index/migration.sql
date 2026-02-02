-- Add full-text search capabilities

-- Add tsvector column for search
ALTER TABLE "article" ADD COLUMN IF NOT EXISTS "search_vector" tsvector;

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS "article_search_idx" ON "article" USING GIN("search_vector");

-- Function to update search vector
CREATE OR REPLACE FUNCTION article_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW."search_vector" := to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.slug, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update search vector on insert/update
DROP TRIGGER IF EXISTS article_search_vector_trigger ON "article";
CREATE TRIGGER article_search_vector_trigger
  BEFORE INSERT OR UPDATE OF title, slug ON "article"
  FOR EACH ROW
  EXECUTE FUNCTION article_search_vector_update();

-- Backfill existing articles
UPDATE "article" SET "search_vector" = to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(slug, ''));

-- Add index on revision created_at for faster recent queries
CREATE INDEX IF NOT EXISTS "revision_created_at_idx" ON "revision"("created_at" DESC);
