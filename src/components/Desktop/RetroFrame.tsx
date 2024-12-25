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
  "Does the terminal actually work?",
  "I'm stuck enjoying the tunes...",
  "I like the noise when you type. It's cool when you pay attention to the little things.",
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
    <div className={`fixed inset-0 flex items-center justify-center bg-[#2c3e50] p-4 sm:p-6 
                     ${isFullscreen ? 'p-0' : ''}`}>
      {/* Update Snowfall to be more subtle */}
      <Snowfall 
        color="#ffffff"
        snowflakeCount={100}
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.5
        }}
      />
      
      {/* Update Speech Bubble to use random text */}
      <SpeechBubble text={randomText} />
      
      {/* Main computer case wrapper - adjusted perspective */}
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
            className="absolute top-3 right-12 text-[#4a4236] text-xs 
                     hover:text-[#2a2216] transition-colors z-10"
          >
            {isFullscreen ? '↙' : '↗'}
          </button>

          {/* Top vents - updated color */}
          <div className="absolute top-0 right-16 w-32 h-8 flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-1">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="w-full h-[2px] bg-[#968c82] mb-1" />
                ))}
              </div>
            ))}
          </div>

          {/* Brand text - updated styling */}
          <div className="absolute top-3 left-6 text-[#4a4236] text-xs font-bold tracking-wide">
            ONCHAIN COMPUTER
          </div>

          {/* Power LED - enhanced glow */}
          <div className="absolute top-4 right-6 w-2 h-2 rounded-full bg-green-400 
                        shadow-[0_0_6px_rgba(74,222,128,0.6),0_0_2px_rgba(74,222,128,1)]
                        animate-pulse" />

          {/* Monitor frame - updated border color */}
          <div className="relative w-full h-full rounded-lg p-6
                        border-[12px] border-[#d8d4cc]">
            
            {/* Screen bezel - deeper black */}
            <div className="relative w-full h-full bg-[#121212] rounded-sm 
                          shadow-[inset_0_0_30px_rgba(0,0,0,0.6)]">
              {/* Content */}
              <div className="relative w-full h-full overflow-hidden rounded-sm" ref={contentRef}>
                {children}
              </div>
              
              {/* Enhanced screen effects */}
              <div className="absolute inset-0 pointer-events-none rounded-sm z-[9999]">
                <div className="absolute inset-0 bg-scan-lines opacity-40" />
                <div className="absolute inset-0 bg-crt-curve opacity-95" />
              </div>
            </div>
          </div>

          {/* Control buttons - updated styling */}
          <div className="absolute bottom-0 right-6 flex gap-3">
            {['BRIGHT', 'CONTRAST', 'VOLUME'].map((label) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#b4aa9f] 
                              shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]" />
                <span className="text-[#4a4236] text-[8px] font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* Alpha sign - updated styling */}
          <div className="absolute bottom-2 left-6 text-red-600 text-xl 
                         font-['Comic_Sans_MS'] transform -rotate-12
                         opacity-80">
            Alpha
          </div>

          {/* Model name plate - enhanced styling */}
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