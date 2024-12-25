import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { playWindowOpenSound, playWindowCloseSound } from '../components/Desktop/Sounds';

export type WindowState = {
  id: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
};

const windowStatesAtom = atomWithStorage<Record<string, WindowState>>('windowStates', {});
const topZIndexAtom = atomWithStorage('topZIndex', 100);
const openProgramsAtom = atomWithStorage<string[]>('openPrograms', []);

const ensureWindowInBounds = (
  windowState: WindowState,
  containerWidth: number,
  containerHeight: number
): WindowState => {
  if (!windowState?.position?.x || !windowState?.position?.y || !windowState?.size?.width || !windowState?.size?.height) {
    return {
      ...windowState,
    };
  }

  const x = Math.min(Math.max(0, windowState.position.x), containerWidth - windowState.size.width);
  const y = Math.min(Math.max(0, windowState.position.y), containerHeight - windowState.size.height);
  
  return {
    ...windowState,
    position: { x, y }
  };
};

export function useWindowManager() {
  const [windowStates, setWindowStates] = useAtom(windowStatesAtom);
  const [topZIndex, setTopZIndex] = useAtom(topZIndexAtom);
  const [openPrograms, setOpenPrograms] = useAtom(openProgramsAtom);

  const initializeWindow = (id: string) => {
    const randomX = Math.floor(Math.random() * 101) + 100; // Random number between 100-200
    const randomY = Math.floor(Math.random() * 101) + 100; // Random number between 100-200
    
    setWindowStates(prev => ({
      ...prev,
      [id]: {
        id,
        isMinimized: false,
        isMaximized: false,
        zIndex: topZIndex + 1,
        position: { x: randomX, y: randomY },
        size: { width: 400, height: 300 }
      }
    }));
    setTopZIndex(prev => prev + 1);
  };

  const bringToFront = (id: string) => {
    setWindowStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        zIndex: topZIndex + 1
      }
    }));
    setTopZIndex(prev => prev + 1);
  };

  const toggleMinimize = (id: string) => {
    setWindowStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: !prev[id].isMinimized
      }
    }));
  };

  const toggleMaximize = (id: string) => {
    setWindowStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMaximized: !prev[id].isMaximized
      }
    }));
  };

  const updatePosition = (id: string, position: { x: number; y: number }) => {
    setWindowStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        position
      }
    }));
  };

  const updateSize = (id: string, size: { width: number; height: number }) => {
    setWindowStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        size
      }
    }));
  };

  const openProgram = (id: string) => {
    if (!openPrograms.includes(id)) {
      playWindowOpenSound();
      setOpenPrograms(prev => [...prev, id]);
      initializeWindow(id);
    }
  };

  const closeProgram = (id: string) => {
    playWindowCloseSound();
    setOpenPrograms(prev => prev.filter(progId => progId !== id));
    setWindowStates(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const adjustWindowPositions = (containerWidth: number, containerHeight: number) => {
    setWindowStates(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(id => {
        if (updated[id]) {
          updated[id] = ensureWindowInBounds(updated[id], containerWidth, containerHeight);
        }
      });
      return updated;
    });
  };

  return {
    windowStates,
    openPrograms,
    initializeWindow,
    bringToFront,
    toggleMinimize,
    toggleMaximize,
    updatePosition,
    updateSize,
    openProgram,
    closeProgram,
    adjustWindowPositions
  };
}