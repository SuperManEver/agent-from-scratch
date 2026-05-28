import 'dotenv/config';

import { generateText, type ModelMessage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { Laminar, getTracer } from '@lmnr-ai/lmnr';

import { SYSTEM_PROMPT } from './system/prompt.ts';

// tools
import { tools } from './tools/index.ts';
import { executeTool } from './executeTool.ts';

import type { AgentCallbacks } from '../types.ts';

Laminar.initialize({
  projectApiKey: process.env.LMNR_API_KEY,
});

const MODEL_NAME = 'gpt-5-mini';

export async function runAgent(
  userMessage: string,
  conversationHistory: ModelMessage[],
  callbacks: AgentCallbacks,
): Promise<any> {
  const { text, toolCalls } = await generateText({
    model: openai(MODEL_NAME),
    prompt: userMessage,
    system: SYSTEM_PROMPT,
    tools,
    experimental_telemetry: {
      isEnabled: true,
      tracer: getTracer(),
    },
  });

  console.log(text, toolCalls);
}

const userMessage = 'what is current time right now?';

runAgent(userMessage, [], {
  onToken: (token) => console.log('Token:', token),
  onToolCallStart: (name, args) =>
    console.log(`Tool call started: ${name}`, args),
  onToolCallEnd: (name, result) =>
    console.log(`Tool call ended: ${name}`, result),
  onComplete: (response) => console.log('Response complete:', response),
  onToolApproval: async (name, args) => {
    console.log(`Tool approval requested for: ${name}`, args);
    return true; // Approve all tool calls for this example
  },
}).catch(console.error);
