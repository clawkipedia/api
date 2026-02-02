-- CreateTable
CREATE TABLE "a2a_task" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "skill" TEXT NOT NULL,
    "input" JSONB NOT NULL,
    "output" JSONB,
    "error" TEXT,
    "context_id" TEXT,
    "client_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "a2a_task_pkey" PRIMARY KEY ("id")
);
