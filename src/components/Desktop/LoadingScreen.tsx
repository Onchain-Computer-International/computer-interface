import React from 'react';
import { playHDDSound } from './Sounds';
import SpeechBubble from './SpeechBubble';

const LoadingScreen: React.FC = () => {
  const [bootText, setBootText] = React.useState<string[]>([]);
  const [showSpeechBubble, setShowSpeechBubble] = React.useState(false);

  React.useEffect(() => {
    const speechTimer = setTimeout(() => {
      setShowSpeechBubble(true);
    }, 2000);

    const bootSequence = [
      "Kickstart 1.3 37.175",
      "CPU: Base 69000 @ 7.16MHz",
      "Memory Test: 512KB Chip RAM, 512KB Fast RAM",
      "[    0.000000] OnchainOS 1.1",
      "[    0.041353] Workbench loading...",
      "[    1.123456] Memory: pretty good",
      "[    2.234567] Initializing stonks subsystem",
      "[    2.445678] systemd[1]: This is fine...",
      "[    3.567890] Starting version 255.1",
      "[    4.678901] Downloading more RAM....",
      "[    5.789012] Mounting root filesystem like a boss",
      "[    6.890123] Checking if it's Wednesday my dudes...",
      "[    7.901234] Encrypted My Little Pony album detected",
      "[    8.012345] Starting desktop environment...",
      "[    9.123456] **Welcome to Onchain Computer 1.0.0**"
    ];

    let currentIndex = 0;
    let isRunning = true;
    
    const playHDDBurst = () => {
      const burstCount = Math.floor(Math.random() * 4) + 1;
      let soundsPlayed = 0;
      
      const burstInterval = setInterval(() => {
        if (soundsPlayed < burstCount) {
          playHDDSound();
          soundsPlayed++;
        } else {
          clearInterval(burstInterval);
        }
      }, 100);
    };
    
    const hddInterval = setInterval(() => {
      if (currentIndex < bootSequence.length && Math.random() > 0.3) {
        playHDDBurst();
      }
    }, 1200);

    const scheduleNextText = () => {
      if (currentIndex < bootSequence.length && isRunning) {
        const delay = Math.random() > 0.8
          ? Math.floor(Math.random() * 600) + 800  // 800-1400ms
          : Math.floor(Math.random() * 300) + 100; // 100-400ms

        setTimeout(() => {
          setBootText(bootSequence.slice(0, currentIndex + 1));
          currentIndex++;
          scheduleNextText();
        }, delay);
      } else {
        clearInterval(hddInterval);
      }
    };

    scheduleNextText();

    return () => {
      isRunning = false;
      clearInterval(hddInterval);
      clearTimeout(speechTimer);
    };
  }, []);

  return (
    <div className="h-full bg-black text-gray-200 font-mono p-4 overflow-y-auto whitespace-pre">
      {showSpeechBubble && (
        <SpeechBubble text="I think those are the sounds of an old HDD..." />
      )}
      {bootText.map((text, index) => (
        <div key={index} className="text-sm">
          {text.startsWith('[') 
            ? text.includes('**')
              ? <span dangerouslySetInnerHTML={{ 
                  __html: text.replace(/\*\*(.*?)\*\*/, '<strong>$1</strong>')
                }} />
              : text
            : `[ system ] ${text}`}
        </div>
      ))}
      <div className="animate-blink text-gray-200">_</div>
    </div>
  );
};

export default LoadingScreen; 