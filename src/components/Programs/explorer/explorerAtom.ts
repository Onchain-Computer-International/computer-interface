import { atomWithStorage } from 'jotai/utils';

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

export const explorerAtom = atomWithStorage<ExplorerItem[]>('explorer-data', []); 