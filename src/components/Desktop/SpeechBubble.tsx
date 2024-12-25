import React, { useEffect, useState } from 'react';

interface SpeechBubbleProps {
  text: string;
  duration?: number;
}

export default function SpeechBubble({ text, duration = 3000 }: SpeechBubbleProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-10 right-0 z-[9998] animate-fade-in-up">
      <div className="relative bg-[#dcd8d0] rounded-lg p-4 min-w-[400px]
                    shadow-[6px_6px_20px_rgba(0,0,0,0.4),
                           inset_0_0_10px_rgba(255,255,255,0.5),
                           -3px_-3px_15px_rgba(0,0,0,0.2)]
                    border-[8px] border-[#d8d4cc]">
        <div className="absolute -bottom-4 right-24 z-[9997]
                      w-8 h-8 bg-[#dcd8d0] rotate-45
                      border-r-[8px] border-b-[8px] border-[#d8d4cc]" />
        <p className="text-[#605850] text-lg font-['VT323']">{text}</p>
      </div>
    </div>
  );
} 