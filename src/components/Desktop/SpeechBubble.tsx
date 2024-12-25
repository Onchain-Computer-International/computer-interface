import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

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

  return createPortal(
      <div className="fixed right-60 bottom-6 bg-[#FFE0A7] rounded-lg p-4 max-w-[400px]
                    shadow-[0_0_40px_rgba(0,0,0,0.5),
                           6px_6px_20px_rgba(0,0,0,0.4)
                           inset_0_0_10px_rgba(255,255,255,0.5),
                           -3px_-3px_15px_rgba(0,0,0,0.2)]
                    border-[8px] border-[#FF9B71]">
        <div className="absolute -bottom-5 right-24 z-[9997]
                      w-8 h-8 bg-[#FFE0A7] rotate-45
                      border-r-[8px] border-b-[8px] border-[#FF9B71]" />
        <p className="text-[#B33F62] text-2xl font-['VT323']">{text}</p>
      </div>
    , document.body
  );
} 