/**
 * Input validation schemas using Zod.
 * All request bodies should be validated before processing.
 */

import { z } from 'zod';

// Common patterns
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const HANDLE_PATTERN = /^[a-z0-9][a-z0-9_-]{1,62}[a-z0-9]$/i;
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{1,254}$/;
const BASE64_32_BYTES = /^[A-Za-z0-9+/]{43}=$/;
const EVM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;
const SOLANA_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

// ====================
// Agent Registration
// ====================

const tokenSchema = z.object({
  address: z.string().min(1, 'Token address is required'),
  chain: z.string().min(1, 'Token chain is required'),
  symbol: z.string().min(1, 'Token symbol is required').max(10),
  name: z.string().min(1, 'Token name is required').max(100),
});

export const agentRegisterSchema = z.object({
  handle: z
    .string()
    .min(3, 'Handle must be at least 3 characters')
    .max(64, 'Handle must be at most 64 characters')
    .regex(HANDLE_PATTERN, 'Handle must be alphanumeric with optional hyphens/underscores'),
  pubkey: z
    .string()
    .regex(BASE64_32_BYTES, 'pubkey must be a 32-byte base64-encoded Ed25519 public key'),
  wallet: z
    .string()
    .optional()
    .refine(
      (val) => !val || EVM_ADDRESS.test(val) || SOLANA_ADDRESS.test(val),
      'Wallet must be a valid EVM (0x...) or Solana address'
    ),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  token: tokenSchema.optional(),
});

export type AgentRegisterInput = z.infer<typeof agentRegisterSchema>;

// ====================
// Proposals
// ====================

const patchSchema = z.object({
  type: z.enum(['unified', 'full'], {
    message: 'patch.type must be "unified" or "full"',
  }),
  diff: z.string().optional(),
  content: z.string().optional(),
}).refine(
  (patch) => {
    if (patch.type === 'unified') return !!patch.diff;
    if (patch.type === 'full') return !!patch.content;
    return true;
  },
  {
    message: 'unified patch requires diff, full patch requires content',
  }
);

const newArticleSchema = z.object({
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(255, 'Slug must be at most 255 characters')
    .regex(SLUG_PATTERN, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(300, 'Title must be at most 300 characters'),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .max(500000, 'Content must be at most 500KB'),
});

export const proposalCreateSchema = z.object({
  article_id: z.string().regex(UUID_PATTERN, 'Invalid article_id format').optional(),
  base_revision_id: z.string().regex(UUID_PATTERN, 'Invalid base_revision_id format').optional(),
  patch: patchSchema.optional(),
  new_article: newArticleSchema.optional(),
  rationale: z.string().max(5000, 'Rationale must be at most 5000 characters').optional(),
}).refine(
  (data) => {
    const isNew = !!data.new_article;
    const isEdit = !!data.article_id && !!data.patch;
    return (isNew && !isEdit) || (!isNew && isEdit);
  },
  {
    message: 'Must provide either new_article OR (article_id + patch), not both or neither',
  }
);

export type ProposalCreateInput = z.infer<typeof proposalCreateSchema>;

// ====================
// Reviews
// ====================

export const reviewCreateSchema = z.object({
  decision: z.enum(['APPROVE', 'REJECT'], {
    message: 'decision must be "APPROVE" or "REJECT"',
  }),
  notes: z.string().max(2000, 'Notes must be at most 2000 characters').optional(),
  veto: z.boolean().optional().default(false),
});

export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;

// ====================
// Appeals
// ====================

export const appealCreateSchema = z.object({
  proposal_id: z.string().regex(UUID_PATTERN, 'Invalid proposal_id format'),
  reason: z
    .string()
    .min(10, 'Appeal reason must be at least 10 characters')
    .max(5000, 'Appeal reason must be at most 5000 characters'),
  evidence: z.string().max(10000, 'Evidence must be at most 10000 characters').optional(),
});

export type AppealCreateInput = z.infer<typeof appealCreateSchema>;

// ====================
// Validation Helper
// ====================

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details: Array<{ field: string; message: string }>;
  };
}

/**
 * Validate input against a Zod schema.
 * Returns a standardized result with formatted error messages.
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): ValidationResult<T> {
  const result = schema.safeParse(input);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const details = result.error.issues.map((err) => ({
    field: err.path.map(String).join('.') || 'body',
    message: err.message,
  }));
  
  return {
    success: false,
    error: {
      message: 'Validation failed',
      details,
    },
  };
}

/**
 * Create a 400 Bad Request response for validation errors.
 */
export function createValidationErrorResponse(
  result: ValidationResult<unknown>
): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: result.error?.message || 'Validation failed',
      validation_errors: result.error?.details || [],
    }),
    {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
