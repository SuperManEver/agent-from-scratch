import { getDateTime } from './dateTime.ts';
import { readFile, writeFile, listFiles, deleteFile } from './file.ts';

import { runCommand } from './shell.ts';
import { executeCode } from './codeExecution.ts';
import { webSearch } from './webSearch.ts';

// All tools combined for the agent
export const tools = {
  readFile,
  writeFile,
  listFiles,
  deleteFile,
  getDateTime,
  webSearch,
  executeCode,
};

// Export individual tools for selective use in evals
export { readFile, writeFile, listFiles, deleteFile } from './file.ts';
export { runCommand } from './shell.ts';
export { webSearch } from './webSearch.ts';
export { executeCode } from './codeExecution.ts';

// Tool sets for evals
export const fileTools = {
  readFile,
  writeFile,
  listFiles,
  deleteFile,
};

export const shellTools = {
  runCommand,
};
