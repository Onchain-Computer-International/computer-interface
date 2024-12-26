import { atomWithStorage } from 'jotai/utils';

export const currentPathAtom = atomWithStorage('filebrowser-current-path', '/');
export const selectedFileAtom = atomWithStorage<string | null>('filebrowser-selected-file', null);
export const selectedContentAtom = atomWithStorage<string | null>('filebrowser-selected-content', null); 