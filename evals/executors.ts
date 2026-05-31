import type {
  EvalData,
  SingleTurnResult,
  MultiTurnEvalData,
  MultiTurnResult,
} from './types.ts';

import { generateText, stepCountIs, tool, type ToolSet } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

import { buildMessages } from './utils.ts';

/**
 * Tool definitions for mocked single-turn evaluations.
 * These define the schema the LLM sees without real implementations.
 */
const TOOL_DEFINITIONS: Record<
  string,
  { description: string; parameters: z.ZodObject<z.ZodRawShape> }
> = {
  // File tools
  readFile: {
    description: 'Read the contents of a file at the specified path',
    parameters: z.object({
      path: z.string().describe('The path to the file to read'),
    }),
  },
  writeFile: {
    description: 'Write content to a file at the specified path',
    parameters: z.object({
      path: z.string().describe('The path to the file to write'),
      content: z.string().describe('The content to write to the file'),
    }),
  },
  listFiles: {
    description: 'List all files in a directory',
    parameters: z.object({
      path: z.string().describe('The directory path to list files from'),
    }),
  },
  deleteFile: {
    description: 'Delete a file at the specified path',
    parameters: z.object({
      path: z.string().describe('The path to the file to delete'),
    }),
  },
  // Shell tools
  runCommand: {
    description: 'Execute a shell command and return its output',
    parameters: z.object({
      command: z.string().describe('The shell command to execute'),
    }),
  },
};

export const singleTurnExecutorWithMocks = async (data: EvalData) => {
  const messages = buildMessages(data);

  const tools: ToolSet = {};

  for (const toolName of data.tools) {
    const toolDef = TOOL_DEFINITIONS[toolName];

    if (toolDef) {
      tools[toolName] = tool({
        description: toolDef.description,
        inputSchema: toolDef.parameters,
        execute: async () => {
          // No real execution in single-turn evals
          return 'mocked result';
        },
      });
    }
  }

  const { toolCalls } = await generateText({
    model: openai(data.config?.model ?? 'gpt-4o'),
    temperature: data.config?.temperature ?? 0,
    messages,
    tools,
    stopWhen: stepCountIs(1),
  });

  const calls = toolCalls.map((tc) => ({
    toolName: tc.toolName,
    args: 'args' in tc ? tc.args : {},
  }));

  const toolNames = calls.map((tc) => tc.toolName);

  return {
    toolCalls: calls,
    toolNames,
    selectedAny: toolNames.length > 0,
  } as SingleTurnResult;
};
