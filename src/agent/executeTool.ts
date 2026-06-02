import { tools } from './tools/index.ts';

export type ToolName = keyof typeof tools;

export async function executeTool(
  toolName: string,
  args: Record<string, unknown>,
): Promise<string> {
  const tool = tools[toolName as ToolName];

  if (!tool) {
    return `Unknown tool: ${toolName}`;
  }

  const execute = tool.execute;

  if (!execute) {
    return `Provider tool ${toolName} - executed by model provider`;
  }

  const result = await execute(args as any, {
    toolCallId: '',
    messages: [],
  });

  return String(result);
}
