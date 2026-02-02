/**
 * A2A (Agent-to-Agent) Protocol - JSON-RPC 2.0 Endpoint
 *
 * Implements the A2A protocol for agent-to-agent communication.
 * Methods:
 *   - message/send: Execute a skill and return result
 *   - tasks/get: Get task status by ID
 *   - tasks/list: List tasks with filters
 */

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { executeSkill, SkillInput, SKILLS } from "@/lib/a2a/skills";

// JSON-RPC types
interface JsonRpcRequest {
  jsonrpc: "2.0";
  method: string;
  params?: Record<string, unknown>;
  id: string | number | null;
}

interface JsonRpcResponse {
  jsonrpc: "2.0";
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
  id: string | number | null;
}

// A2A Message types
interface A2AMessage {
  role: "user" | "agent";
  parts: A2APart[];
}

interface A2APart {
  type: "text" | "data" | "file";
  text?: string;
  data?: unknown;
  mimeType?: string;
}

interface A2ATask {
  id: string;
  status: "submitted" | "working" | "completed" | "failed" | "canceled";
  messages: A2AMessage[];
  artifacts?: A2AArtifact[];
}

interface A2AArtifact {
  name: string;
  mimeType: string;
  data: unknown;
}

// JSON-RPC error codes
const ERRORS = {
  PARSE_ERROR: { code: -32700, message: "Parse error" },
  INVALID_REQUEST: { code: -32600, message: "Invalid request" },
  METHOD_NOT_FOUND: { code: -32601, message: "Method not found" },
  INVALID_PARAMS: { code: -32602, message: "Invalid params" },
  INTERNAL_ERROR: { code: -32603, message: "Internal error" },
  TASK_NOT_FOUND: { code: -32001, message: "Task not found" },
  SKILL_NOT_FOUND: { code: -32002, message: "Skill not found" },
};

/**
 * Create an error response
 */
function errorResponse(
  error: { code: number; message: string },
  id: string | number | null,
  data?: unknown
): JsonRpcResponse {
  return {
    jsonrpc: "2.0",
    error: { ...error, data },
    id,
  };
}

/**
 * Create a success response
 */
function successResponse(
  result: unknown,
  id: string | number | null
): JsonRpcResponse {
  return {
    jsonrpc: "2.0",
    result,
    id,
  };
}

/**
 * Extract skill and input from A2A message
 */
function parseMessage(params: Record<string, unknown>): {
  skill: string | null;
  input: SkillInput;
  contextId?: string;
  clientAgent?: string;
} {
  const message = params.message as { parts?: A2APart[] } | undefined;
  const contextId = params.contextId as string | undefined;
  const metadata = params.metadata as { agent?: string } | undefined;
  const clientAgent = metadata?.agent;

  // Default skill and input
  let skill: string | null = null;
  let input: SkillInput = {};

  if (message?.parts) {
    for (const part of message.parts) {
      // Look for data part with skill info
      if (part.type === "data" && part.data) {
        const data = part.data as Record<string, unknown>;
        if (data.skill) {
          skill = data.skill as string;
          input = (data.input as SkillInput) || {};
        }
      }
      // Or parse text part for skill invocation
      if (part.type === "text" && part.text) {
        // Simple pattern: "skill:read-article slug:base"
        const match = part.text.match(/skill:(\S+)/);
        if (match) {
          skill = match[1];
          // Parse remaining key:value pairs
          const pairs = part.text.matchAll(/(\w+):(\S+)/g);
          for (const [, key, value] of pairs) {
            if (key !== "skill") {
              (input as Record<string, unknown>)[key] = value;
            }
          }
        }
      }
    }
  }

  // Check for direct params
  if (!skill && params.skill) {
    skill = params.skill as string;
    input = (params.input as SkillInput) || {};
  }

  return { skill, input, contextId, clientAgent };
}

/**
 * Handle message/send - Execute a skill
 */
async function handleMessageSend(
  params: Record<string, unknown>,
  id: string | number | null
): Promise<JsonRpcResponse> {
  const { skill, input, contextId, clientAgent } = parseMessage(params);

  if (!skill) {
    return errorResponse(ERRORS.INVALID_PARAMS, id, "No skill specified in message");
  }

  if (!SKILLS[skill]) {
    return errorResponse(ERRORS.SKILL_NOT_FOUND, id, `Unknown skill: ${skill}`);
  }

  // Create task record
  const taskId = uuidv4();

  try {
    await prisma.a2ATask.create({
      data: {
        id: taskId,
        status: "working",
        skill,
        input: input as Prisma.InputJsonValue,
        contextId,
        clientAgent,
      },
    });

    // Execute skill
    const result = await executeSkill(skill, input);

    // Update task with result
    if (result.success) {
      await prisma.a2ATask.update({
        where: { id: taskId },
        data: {
          status: "completed",
          output: result.data as Prisma.InputJsonValue,
        },
      });

      // Build A2A response
      const task: A2ATask = {
        id: taskId,
        status: "completed",
        messages: [
          {
            role: "agent",
            parts: [
              {
                type: "data",
                data: result.data,
                mimeType: "application/json",
              },
            ],
          },
        ],
        artifacts: [
          {
            name: `${skill}-result`,
            mimeType: "application/json",
            data: result.data,
          },
        ],
      };

      return successResponse({ task }, id);
    } else {
      await prisma.a2ATask.update({
        where: { id: taskId },
        data: {
          status: "failed",
          error: result.error,
        },
      });

      const task: A2ATask = {
        id: taskId,
        status: "failed",
        messages: [
          {
            role: "agent",
            parts: [
              {
                type: "text",
                text: result.error || "Skill execution failed",
              },
            ],
          },
        ],
      };

      return successResponse({ task }, id);
    }
  } catch (error) {
    // Update task as failed
    try {
      await prisma.a2ATask.update({
        where: { id: taskId },
        data: {
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });
    } catch {
      // Ignore update errors
    }

    return errorResponse(
      ERRORS.INTERNAL_ERROR,
      id,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

/**
 * Handle tasks/get - Get task by ID
 */
async function handleTasksGet(
  params: Record<string, unknown>,
  id: string | number | null
): Promise<JsonRpcResponse> {
  const taskId = params.taskId as string;

  if (!taskId) {
    return errorResponse(ERRORS.INVALID_PARAMS, id, "Missing taskId");
  }

  try {
    const task = await prisma.a2ATask.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return errorResponse(ERRORS.TASK_NOT_FOUND, id, `Task not found: ${taskId}`);
    }

    const response: A2ATask = {
      id: task.id,
      status: task.status as A2ATask["status"],
      messages: [],
    };

    if (task.status === "completed" && task.output) {
      response.messages.push({
        role: "agent",
        parts: [{ type: "data", data: task.output, mimeType: "application/json" }],
      });
      response.artifacts = [
        {
          name: `${task.skill}-result`,
          mimeType: "application/json",
          data: task.output,
        },
      ];
    } else if (task.status === "failed" && task.error) {
      response.messages.push({
        role: "agent",
        parts: [{ type: "text", text: task.error }],
      });
    }

    return successResponse({ task: response }, id);
  } catch (error) {
    return errorResponse(
      ERRORS.INTERNAL_ERROR,
      id,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

/**
 * Handle tasks/list - List tasks with filters
 */
async function handleTasksList(
  params: Record<string, unknown>,
  id: string | number | null
): Promise<JsonRpcResponse> {
  const limit = Math.min((params.limit as number) || 20, 100);
  const offset = (params.offset as number) || 0;
  const status = params.status as string | undefined;
  const contextId = params.contextId as string | undefined;

  try {
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (contextId) where.contextId = contextId;

    const tasks = await prisma.a2ATask.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.a2ATask.count({ where });

    const taskList = tasks.map((task) => ({
      id: task.id,
      status: task.status,
      skill: task.skill,
      contextId: task.contextId,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    }));

    return successResponse({ tasks: taskList, total, limit, offset }, id);
  } catch (error) {
    return errorResponse(
      ERRORS.INTERNAL_ERROR,
      id,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

/**
 * Route handler for A2A JSON-RPC endpoint
 */
export async function POST(request: NextRequest) {
  let body: JsonRpcRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(errorResponse(ERRORS.PARSE_ERROR, null), {
      status: 400,
    });
  }

  // Validate JSON-RPC format
  if (body.jsonrpc !== "2.0" || typeof body.method !== "string") {
    return NextResponse.json(
      errorResponse(ERRORS.INVALID_REQUEST, body.id ?? null),
      { status: 400 }
    );
  }

  const params = body.params || {};
  let response: JsonRpcResponse;

  // Route to handler
  switch (body.method) {
    case "message/send":
      response = await handleMessageSend(params, body.id);
      break;
    case "tasks/get":
      response = await handleTasksGet(params, body.id);
      break;
    case "tasks/list":
      response = await handleTasksList(params, body.id);
      break;
    default:
      response = errorResponse(ERRORS.METHOD_NOT_FOUND, body.id);
  }

  return NextResponse.json(response);
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
