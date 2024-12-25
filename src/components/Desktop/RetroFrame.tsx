import React, { useRef, useEffect, useMemo } from 'react';
import { useWindowManager } from '../../hooks/useWindowManager';
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import Snowfall from 'react-snowfall';
import SpeechBubble from './SpeechBubble';

const isFullscreenAtom = atomWithStorage('isFullscreen', false);

// Add array of possible speech bubble texts
const speechBubbleTexts = [
  "I've waited a long time for this...",
  "Booting up the nostalgia drive...",
  "I love my new computer!",
  "I'm so excited to use this!",
  "I never thought I'd see the day!",
  "So this is what raz was talking about?",
  "I'm afraid of the power of this thing...",
  "I'm afraid this may cause extreme satisfaction..."
];

interface RetroFrameProps {
  children: React.ReactNode;
}

export default function RetroFrame({ children }: RetroFrameProps) {
  const [isFullscreen, setIsFullscreen] = useAtom(isFullscreenAtom);
  const contentRef = useRef<HTMLDivElement>(null);
  const windowManager = useWindowManager();

  // Memoize the random text so it doesn't change on re-renders
  const randomText = useMemo(() => 
    speechBubbleTexts[Math.floor(Math.random() * speechBubbleTexts.length)],
    [] // Empty dependency array means this only runs once
  );

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        windowManager.adjustWindowPositions(width, height);
      }
    });

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => observer.disconnect();
  }, [windowManager]);

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-800 p-4 sm:p-6 
                     ${isFullscreen ? 'p-0' : ''}`}>
      {/* Add Snowfall effect */}
      <Snowfall 
        color="#ffffff"
        snowflakeCount={200}
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          zIndex: 0
        }}
      />
      
      {/* Update Speech Bubble to use random text */}
      <SpeechBubble text={randomText} />
      
      {/* Main computer case wrapper */}
      <div className={`relative w-[95%] max-w-5xl h-[85%] 
                      transform perspective-[2000px] rotate-y-[-3deg] rotate-x-[2deg]
                      ${isFullscreen ? 'w-full max-w-none h-full !rotate-y-0 !rotate-x-0' : ''}`}>
        
        {/* Deep back panel */}
        <div className="absolute inset-0 bg-[#a8a4a0] rounded-xl
                      transform translate-z-[-80px] scale-[1.04]
                      shadow-[0_0_40px_rgba(0,0,0,0.5)]" />

        {/* Chunky middle layer */}
        <div className="absolute -left-8 -right-8 -top-6 -bottom-6 
                      bg-[#c8c4bc] rounded-xl
                      transform translate-z-[-40px]
                      shadow-[inset_0_0_30px_rgba(0,0,0,0.3)]">
          {/* Side vents - left */}
          <div className="absolute left-4 top-1/4 bottom-1/4 w-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-full h-1 bg-[#a8a4a0] mb-2" />
            ))}
          </div>
          {/* Side vents - right */}
          <div className="absolute right-4 top-1/4 bottom-1/4 w-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-full h-1 bg-[#a8a4a0] mb-2" />
            ))}
          </div>
        </div>

        {/* Front casing with beveled edges */}
        <div className="absolute -left-4 -right-4 -top-3 -bottom-3 
                      bg-[#d8d4cc] rounded-lg
                      transform translate-z-[-20px]
                      shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]" />
        
        {/* Monitor body - main front panel */}
        <div className="relative w-full h-full 
                      bg-[#dcd8d0] rounded-lg
                      shadow-[6px_6px_20px_rgba(0,0,0,0.4),
                             inset_0_0_10px_rgba(255,255,255,0.5),
                             -3px_-3px_15px_rgba(0,0,0,0.2)]">
          
          {/* Add Fullscreen button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="absolute top-3 right-12 text-[#605850] text-xs hover:text-[#403830] z-10"
          >
            {isFullscreen ? '↙' : '↗'}
          </button>

          {/* Top vents */}
          <div className="absolute top-0 right-16 w-32 h-8 flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-1">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="w-full h-[2px] bg-[#b8b4ac] mb-1" />
                ))}
              </div>
            ))}
          </div>

          {/* Simple brand text */}
          <div className="absolute top-3 left-6 text-[#605850] text-xs">
            ONCHAIN COMPUTER
          </div>

          {/* Power LED */}
          <div className="absolute top-4 right-6 w-2 h-2 rounded-full bg-green-500 
                        shadow-[0_0_4px_rgba(74,222,128,0.4)]
                        animate-pulse" />

          {/* Monitor frame with screen */}
          <div className="relative w-full h-full rounded-lg p-6
                        border-[12px] border-[#d8d4cc]">
            
            {/* Screen bezel */}
            <div className="relative w-full h-full bg-gray-900 rounded-sm 
                          shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]">
              {/* Content */}
              <div className="relative w-full h-full overflow-hidden rounded-sm" ref={contentRef}>
                {children}
              </div>
              
              {/* Screen effects - using z-[9999] for maximum priority */}
              <div className="absolute inset-0 pointer-events-none rounded-sm z-[9999]">
                <div className="absolute inset-0 bg-scan-lines opacity-30" />
                <div className="absolute inset-0 bg-crt-curve opacity-90" />
              </div>
            </div>
          </div>

          {/* Simple control buttons */}
          <div className="absolute bottom-0 right-6 flex gap-3">
            {['BRIGHT', 'CONTRAST', 'VOLUME'].map((label) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#ccc8c0] 
                              shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)]" />
                <span className="text-[#605850] text-[8px]">{label}</span>
              </div>
            ))}
          </div>

          {/* Alpha sign */}
          <div className="absolute bottom-2 left-6 text-red-500 text-xl font-['Comic_Sans_MS'] transform -rotate-12">
            Alpha
          </div>

          {/* Model name plate */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 px-3 py-1 
                         bg-[#c8c4bc]
                         text-[#605850] text-[10px] font-bold tracking-wider
                         border border-[#a8a4a0] rounded-sm z-[10]
                         shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
            VIRTUOSA 1000
          </div>
        </div>
      </div>
    </div>
  );
} 