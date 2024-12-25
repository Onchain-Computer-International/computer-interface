import { atom } from 'jotai';

export type ExplorerItem = {
  address: string;
  balance: number;
  txCount: number;
  volumeSent: number;
  volumeReceived: number;
  totalSentTx: number;
  totalReceivedTx: number;
  maxSentAmount: number;
  maxReceivedAmount: number;
  lastActiveBlock: number;
  firstActiveBlock: number;
  holdingPeriod: number;
};

export const explorerAtom = atom<ExplorerItem[]>([]); 