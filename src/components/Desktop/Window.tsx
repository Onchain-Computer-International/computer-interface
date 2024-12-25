import React, { useRef, useEffect } from 'react';
import { X, Minus, Square } from 'lucide-react';
import type { WindowState } from '../../hooks/useWindowManager';
import { motion } from 'framer-motion';

type WindowProps = {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  windowState: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  updatePosition: (position: { x: number; y: number }) => void;
  updateSize: (size: { width: number; height: number }) => void;
};

export default function Window({
  id,
  title,
  icon,
  children,
  windowState,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  updatePosition,
  updateSize,
}: WindowProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = React.useState(false);
  const [resizeDirection, setResizeDirection] = React.useState<string | null>(null);
  const [resizeStartPos, setResizeStartPos] = React.useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = React.useState({ width: 0, height: 0 });
  const [tempPosition, setTempPosition] = React.useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current && !windowState.isMaximized) {
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
      onFocus();
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    if (!windowState.isMaximized) {
      e.stopPropagation();
      setIsResizing(true);
      setResizeDirection(direction);
      setResizeStartPos({ x: e.clientX, y: e.clientY });
      setInitialSize({
        width: windowState.size.width,
        height: windowState.size.height
      });
      setTempPosition({
        x: windowState.position.x,
        y: windowState.position.y
      });
      onFocus();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !windowState.isMaximized) {
        requestAnimationFrame(() => {
          const newX = e.clientX - dragOffset.x;
          const newY = e.clientY - dragOffset.y;
          
          const desktopEl = document.querySelector('.amiga-desktop');
          if (!desktopEl) return;
          
          const desktopRect = desktopEl.getBoundingClientRect();
          const maxX = desktopRect.width - windowState.size.width;
          const maxY = desktopRect.height - windowState.size.height - 48;
          
          const constrainedX = Math.max(0, Math.min(newX - desktopRect.left, maxX));
          const constrainedY = Math.max(0, Math.min(newY - desktopRect.top, maxY));
          
          updatePosition({ x: constrainedX, y: constrainedY });
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, windowState.isMaximized, windowState.size, updatePosition]);

  useEffect(() => {
    const handleResizeMove = (e: MouseEvent) => {
      if (isResizing && !windowState.isMaximized) {
        const desktopEl = document.querySelector('.amiga-desktop');
        if (!desktopEl) return;

        const desktopRect = desktopEl.getBoundingClientRect();
        const deltaX = e.clientX - resizeStartPos.x;
        const deltaY = e.clientY - resizeStartPos.y;
        
        let newWidth = initialSize.width;
        let newHeight = initialSize.height;
        let newX = windowState.position.x;
        let newY = windowState.position.y;

        // Resizing West (Left)
        if (resizeDirection?.includes('w')) {
          // Calculate the maximum width based on the window's right edge position
          const maxWidth = windowState.position.x + initialSize.width;
          // Calculate new position and width while ensuring the window stays within bounds
          const proposedX = Math.max(0, windowState.position.x + deltaX);
          newWidth = maxWidth - proposedX;
          
          if (newWidth >= 200) {
            setTempPosition({ 
              x: proposedX,
              y: windowState.position.y 
            });
          } else {
            // If width would be less than minimum, lock position to maintain minimum width
            newWidth = 200;
            setTempPosition({
              x: maxWidth - 200,
              y: windowState.position.y
            });
          }
        }

        // Resizing East (Right)
        if (resizeDirection?.includes('e')) {
          newWidth = Math.min(
            deltaX + initialSize.width,
            desktopRect.width - windowState.position.x
          );
          // Ensure that resizing East does not change the x position
          // No change to newX
        }

        // Resizing South (Bottom)
        if (resizeDirection?.includes('s')) {
          const maxHeight = desktopRect.height - windowState.position.y - 48;
          newHeight = Math.min(
            deltaY + initialSize.height,
            maxHeight
          );
          // No change to newY when resizing South
        }

        // Resizing North (Top)
        if (resizeDirection?.includes('n')) {
          const newDeltaY = Math.max(-windowState.position.y, deltaY);
          newHeight = Math.max(100, initialSize.height - newDeltaY);
          newY = windowState.position.y + newDeltaY;
        }

        if (!resizeDirection?.includes('w')) {
          updatePosition({ x: newX, y: newY });
        }
        
        updateSize({
          width: Math.max(200, newWidth),
          height: Math.max(100, newHeight)
        });
      }
    };

    const handleResizeUp = () => {
      if (resizeDirection?.includes('w') && tempPosition.x !== windowState.position.x) {
        updatePosition(tempPosition);
      }
      setIsResizing(false);
      setResizeDirection(null);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeUp);
    };
  }, [isResizing, resizeDirection, resizeStartPos, initialSize, windowState, updatePosition, updateSize, tempPosition]);

  if (windowState.isMinimized) return null;

  const windowStyle = windowState.isMaximized
    ? {
        left: 0,
        top: 0,
        width: '100%',
        height: 'calc(100% - 40px)',
      }
    : {
        left: isResizing && resizeDirection?.includes('w') 
          ? tempPosition.x
          : windowState.position.x,
        top: windowState.position.y,
        width: windowState.size.width,
        height: windowState.size.height,
      };

  return (
    <>
      <div
        ref={windowRef}
        className="absolute bg-[#dedede] shadow-[2px_2px_0px_#000000] border-2 border-black overflow-hidden flex flex-col"
        style={{
          ...windowStyle,
          zIndex: windowState.zIndex,
          cursor: isResizing ? `${resizeDirection}-resize` : 'default',
        }}
        onClick={onFocus}
      >
        <div
          className="flex items-center justify-between h-[24px] px-1 bg-[#0055aa] text-white cursor-move flex-shrink-0 relative no-select"
          onMouseDown={handleMouseDown}
          onDoubleClick={onMaximize}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff33] to-transparent bg-[length:4px_100%] no-select" />
          
          <div className="flex items-center space-x-2 z-10 no-select">
            {icon}
            <span className="text-sm font-bold no-select">{title}</span>
          </div>
          <div className="flex space-x-1 z-10 no-select">
            <button 
              className="w-[18px] h-[18px] flex items-center justify-center bg-[#dedede] border-t-2 border-l-2 border-[#ffffff] border-b-2 border-r-2 border-[#000000] hover:bg-[#cccccc] text-black no-select"
              onClick={onMinimize}
            >
              <Minus className="w-3 h-3" />
            </button>
            <button 
              className="w-[18px] h-[18px] flex items-center justify-center bg-[#dedede] border-t-2 border-l-2 border-[#ffffff] border-b-2 border-r-2 border-[#000000] hover:bg-[#cccccc] text-black no-select"
              onClick={onMaximize}
            >
              <Square className="w-3 h-3" />
            </button>
            <button
              className="w-[18px] h-[18px] flex items-center justify-center bg-[#dedede] border-t-2 border-l-2 border-[#ffffff] border-b-2 border-r-2 border-[#000000] hover:bg-[#cccccc] text-black no-select"
              onClick={onClose}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden relative">
          {children}
          {!windowState.isMaximized && (
            <>
              <div className="absolute bottom-0 left-0 w-full h-1 cursor-s-resize no-select" onMouseDown={(e) => handleResizeMouseDown(e, 's')} />
              <div className="absolute top-0 left-0 h-full w-1 cursor-w-resize no-select" onMouseDown={(e) => handleResizeMouseDown(e, 'w')} />
              <div className="absolute top-0 right-0 h-full w-1 cursor-e-resize no-select" onMouseDown={(e) => handleResizeMouseDown(e, 'e')} />
              <div className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize no-select" onMouseDown={(e) => handleResizeMouseDown(e, 'sw')} />
              <div className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize no-select" onMouseDown={(e) => handleResizeMouseDown(e, 'se')} />
            </>
          )}
        </div>
      </div>
    </>
  );
}