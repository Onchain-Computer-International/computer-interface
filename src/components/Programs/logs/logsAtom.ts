import { atom } from 'jotai';

export type LogMessage = {
  level: 'error' | 'info' | 'warn' | 'debug';
  message: string;
  metadata?: any;
  timestamp: string;
};

export const logsAtom = atom<LogMessage[]>([]); 