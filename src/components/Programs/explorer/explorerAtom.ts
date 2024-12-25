import { atom } from 'jotai';

export type ExplorerItem = {
  address: string;
  balance: string;
  lastUpdated: string;
  transactions?: number;
};

export const explorerAtom = atom<ExplorerItem[]>([]); 