import type { ModelMessage } from 'ai';
/**
 * Filter conversation history to only include compatible message formats.
 * Provider tools (like webSearch) may return messages with formats that
 * cause issues when passed back to subsequent API calls.
 */
export const filterCompatibleMessages = (
  messages: ModelMessage[],
): ModelMessage[] => {
  return messages.filter((msg) => {
    // Keep user and system messages
    if (msg.role === 'user' || msg.role === 'system') {
      return true;
    }

    // Keep assistant messages that have text content or tool calls
    if (msg.role === 'assistant') {
      const content = msg.content;
      if (typeof content === 'string' && content.trim()) {
        return true;
      }
      if (Array.isArray(content)) {
        return content.some((part: unknown) => {
          if (typeof part === 'string' && part.trim()) return true;
          if (typeof part === 'object' && part !== null) {
            const p = part as { type?: string; text?: string };
            if (p.type === 'tool-call') return true;
            if (p.text && p.text.trim()) return true;
          }
          return false;
        });
      }
    }

    // Keep tool messages
    if (msg.role === 'tool') {
      return true;
    }

    return false;
  });
};
