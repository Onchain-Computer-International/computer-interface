import { atomWithStorage } from 'jotai/utils';
import { atom } from 'jotai';

export type Tool = 'pencil' | 'eraser' | 'rectangle' | 'circle' | 'line';

// Persistent atoms with pixel art specific defaults
export const colorAtom = atomWithStorage('doodle-color', '#000000');
export const lineWidthAtom = atomWithStorage('doodle-line-width', 1); // Default to 1px for pixel art
export const toolAtom = atomWithStorage<Tool>('doodle-tool', 'pencil');
export const canvasDataAtom = atomWithStorage<string | null>('doodle-canvas-data', null);
export const gridSizeAtom = atomWithStorage('doodle-grid-size', 16); // Default 16x16 grid
export const showGridAtom = atomWithStorage('doodle-show-grid', true);

// Regular atoms
export const isDrawingAtom = atom(false);
export const startPosAtom = atom({ x: 0, y: 0 });
export const snapshotAtom = atom<ImageData | null>(null);
export const historyAtom = atom<ImageData[]>([]);
export const historyIndexAtom = atom(-1); 