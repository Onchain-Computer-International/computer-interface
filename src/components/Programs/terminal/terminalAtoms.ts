import { atomWithStorage } from 'jotai/utils';

export type Command = {
  id?: string;
  input: string;
  output?: string;
  messageId?: string;
  timestamp?: string;
};

export const terminalCommandsAtom = atomWithStorage<Command[]>('terminal-commands', []); 