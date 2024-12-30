import React from 'react';
import { useAtom } from 'jotai';
import {
  Tool,
  colorAtom,
  toolAtom,
  gridSizeAtom,
} from './atoms';
import { useCanvasInitialization, useCanvasOperations, useDrawing } from './hooks';
import { getCoordinates, snapToGrid } from './utils';

export default function Doodle() {
  const { canvasRef } = useCanvasInitialization();
  const { undo, redo, clearCanvas } = useCanvasOperations(canvasRef);
  const { isDrawing, startPos, snapshot, startDrawing, stopDrawing } = useDrawing(canvasRef);
  
  const [color, setColor] = useAtom(colorAtom);
  const [tool, setTool] = useAtom(toolAtom);
  const [gridSize, setGridSize] = useAtom(gridSizeAtom);

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rawCoords = getCoordinates(e, canvas);
    const coords = {
      x: snapToGrid(rawCoords.x, gridSize),
      y: snapToGrid(rawCoords.y, gridSize)
    };

    switch (tool) {
      case 'pencil':
        ctx.fillStyle = color;
        ctx.fillRect(coords.x, coords.y, gridSize, gridSize);
        break;

      case 'eraser':
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(coords.x, coords.y, gridSize, gridSize);
        break;

      case 'rectangle':
      case 'circle':
      case 'line':
        if (snapshot) {
          ctx.putImageData(snapshot, 0, 0);
          ctx.fillStyle = color;

          if (tool === 'rectangle') {
            const width = coords.x - startPos.x + gridSize;
            const height = coords.y - startPos.y + gridSize;
            ctx.fillRect(startPos.x, startPos.y, width, height);
          } else if (tool === 'circle') {
            const radius = Math.floor(
              Math.sqrt(
                Math.pow(coords.x - startPos.x, 2) + 
                Math.pow(coords.y - startPos.y, 2)
              ) / gridSize
            ) * gridSize;
            
            for(let x = -radius; x <= radius; x += gridSize) {
              for(let y = -radius; y <= radius; y += gridSize) {
                if(x*x + y*y <= radius*radius) {
                  ctx.fillRect(startPos.x + x, startPos.y + y, gridSize, gridSize);
                }
              }
            }
          } else if (tool === 'line') {
            const x0 = startPos.x / gridSize;
            const y0 = startPos.y / gridSize;
            const x1 = coords.x / gridSize;
            const y1 = coords.y / gridSize;
            
            const dx = Math.abs(x1 - x0);
            const dy = Math.abs(y1 - y0);
            const sx = x0 < x1 ? 1 : -1;
            const sy = y0 < y1 ? 1 : -1;
            let err = dx - dy;

            let x = x0;
            let y = y0;

            while (true) {
              ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
              if (x === x1 && y === y1) break;
              const e2 = 2 * err;
              if (e2 > -dy) {
                err -= dy;
                x += sx;
              }
              if (e2 < dx) {
                err += dx;
                y += sy;
              }
            }
          }
        }
        break;
    }
  };

  const tools: Tool[] = ['pencil', 'eraser', 'rectangle', 'circle', 'line'];

  return (
    <div className="h-full bg-[#c0c0c0] p-2 overflow-hidden border-2 border-[#ffffff]">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <div className="flex gap-1">
              {tools.map((t) => (
                <button
                  key={t}
                  onClick={() => setTool(t)}
                  className={`px-2 py-1 border-2 ${
                    tool === t 
                      ? 'bg-[#c0c0c0] border-t-[#ffffff] border-l-[#ffffff] border-b-[#808080] border-r-[#808080]' 
                      : 'bg-[#c0c0c0] border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff]'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div className="h-full border-l-2 border-[#808080] mx-2" />
            <div className="flex gap-1">
              <button
                onClick={undo}
                className="px-2 py-1 border-2 bg-[#c0c0c0]
                  border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff]"
              >
                Undo
              </button>
              <button
                onClick={redo}
                className="px-2 py-1 border-2 bg-[#c0c0c0]
                  border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff]"
              >
                Redo
              </button>
              <button
                onClick={clearCanvas}
                className="px-2 py-1 border-2 bg-[#c0c0c0]
                  border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff]"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8"
            />
            <div className="flex items-center gap-2">
              <label className="text-sm">Pixel Size:</label>
              <select 
                value={gridSize} 
                onChange={(e) => setGridSize(Number(e.target.value))}
                className="px-1 border"
              >
                <option value="8">8px</option>
                <option value="16">16px</option>
                <option value="32">32px</option>
              </select>
            </div>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width={512}
          height={512}
          className="bg-white border border-black cursor-crosshair select-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
}