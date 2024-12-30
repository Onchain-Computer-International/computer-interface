import { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import {
  canvasDataAtom,
  historyAtom,
  historyIndexAtom,
  isDrawingAtom,
  startPosAtom,
  snapshotAtom,
  toolAtom,
} from './atoms';
import { getCoordinates } from './utils';

export const useCanvasInitialization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasData] = useAtom(canvasDataAtom);
  const [, setHistory] = useAtom(historyAtom);
  const [historyIndex, setHistoryIndex] = useAtom(historyIndexAtom);

  const saveToHistory = (imageData: ImageData) => {
    setHistory(prev => [...prev.slice(0, historyIndex + 1), imageData]);
    setHistoryIndex(prev => prev + 1);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (canvasData) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
            saveToHistory(ctx.getImageData(0, 0, canvas.width, canvas.height));
          };
          img.src = canvasData;
        } else {
          saveToHistory(ctx.getImageData(0, 0, canvas.width, canvas.height));
        }
      }
    }
  }, [canvasData]);

  return { canvasRef };
};

export const useCanvasOperations = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const [history, setHistory] = useAtom(historyAtom);
  const [historyIndex, setHistoryIndex] = useAtom(historyIndexAtom);
  const [canvasData, setCanvasData] = useAtom(canvasDataAtom);

  const saveToHistory = (imageData: ImageData) => {
    const newHistory = [...history.slice(0, historyIndex + 1), imageData];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      setCanvasData(canvas.toDataURL('image/png'));
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          setHistoryIndex(historyIndex - 1);
          ctx.putImageData(history[historyIndex - 1], 0, 0);
          saveCanvasState();
        }
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          setHistoryIndex(historyIndex + 1);
          ctx.putImageData(history[historyIndex + 1], 0, 0);
          saveCanvasState();
        }
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveToHistory(ctx.getImageData(0, 0, canvas.width, canvas.height));
        saveCanvasState();
      }
    }
  };

  return {
    history,
    historyIndex,
    saveToHistory,
    saveCanvasState,
    undo,
    redo,
    clearCanvas
  };
};

export const useDrawing = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const [isDrawing, setIsDrawing] = useAtom(isDrawingAtom);
  const [startPos, setStartPos] = useAtom(startPosAtom);
  const [snapshot, setSnapshot] = useAtom(snapshotAtom);
  const [tool] = useAtom(toolAtom);
  const { saveToHistory, saveCanvasState } = useCanvasOperations(canvasRef);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const coords = getCoordinates(e, canvas);
        setStartPos(coords);
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
        setIsDrawing(true);

        if (tool !== 'pencil' && tool !== 'eraser') {
          setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
        }
      }
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          saveToHistory(ctx.getImageData(0, 0, canvas.width, canvas.height));
          saveCanvasState();
        }
      }
    }
    setIsDrawing(false);
    setSnapshot(null);
  };

  return {
    isDrawing,
    startPos,
    snapshot,
    startDrawing,
    stopDrawing
  };
}; 