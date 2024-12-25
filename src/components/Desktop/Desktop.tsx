import React, { useState, useEffect, useContext } from 'react';
import Window from './Window';
import TaskBar from './TaskBar';
import StartMenu from './StartMenu';
import { useWindowManager } from '../../hooks/useWindowManager';
import { getPrograms } from './_registry';
import type { Socket } from 'socket.io-client';
import { AuthContext } from '../../Provider';
import { useAtom } from 'jotai';
import { onlineUsersAtom } from '../../state/websocketState';
import SpeechBubble from './SpeechBubble';

export interface Program {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  registerSocketEvents?: (socket: Socket) => () => void;
}

export default function Desktop() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [disconnectionMessage, setDisconnectionMessage] = useState<string | null>(null);
  const windowManager = useWindowManager();
  const [programs] = useState<Program[]>(() => getPrograms());
  const [onlineUsers] = useAtom(onlineUsersAtom);
  const { socket, isWebSocketConnected } = useContext(AuthContext);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isWebSocketConnected) {
      const messages = [
        "Oops! I lost my connection to the mothership!",
        "Hey, who unplugged my internet?",
        "Looks like the hamsters powering our server need a break!",
        "Server's gone for a coffee break",
        "Houston, we have a connection problem!",
        "BRB, chasing down some loose wires!",
      ];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setDisconnectionMessage(randomMessage);
    } else {
      setDisconnectionMessage(null);
    }
  }, [isWebSocketConnected]);

  const toggleProgram = (id: string) => {
    if (windowManager.openPrograms.includes(id)) {
      windowManager.bringToFront(id);
    } else {
      windowManager.openProgram(id);
    }
  };

  return (
      <div className="relative w-full h-full amiga-desktop">
        {disconnectionMessage && (
          <SpeechBubble text={disconnectionMessage} duration={6000} />
        )}
        <div className="absolute inset-0 overflow-auto">
          <div className="grid grid-cols-4 gap-4 p-4">
            {programs.map((program) => (
              <button
                key={program.id}
                onClick={() => toggleProgram(program.id)}
                className="flex flex-col items-center space-y-1 p-2 hover:bg-white/10 rounded"
              >
                <div className="w-12 h-12 flex items-center justify-center amiga-icon">
                  {program.icon}
                </div>
                <span className="text-white text-sm font-[Topaz]">{program.title}</span>
              </button>
            ))}
          </div>

          {programs.map((program) => (
            windowManager.openPrograms.includes(program.id) && windowManager.windowStates[program.id] && (
              <Window
                key={program.id}
                id={program.id}
                title={program.title}
                icon={program.icon}
                windowState={windowManager.windowStates[program.id]}
                onClose={() => windowManager.closeProgram(program.id)}
                onMinimize={() => windowManager.toggleMinimize(program.id)}
                onMaximize={() => windowManager.toggleMaximize(program.id)}
                onFocus={() => windowManager.bringToFront(program.id)}
                updatePosition={(position) => windowManager.updatePosition(program.id, position)}
                updateSize={(size) => windowManager.updateSize(program.id, size)}
              >
                {program.content}
              </Window>
            )
          ))}
        </div>

        <TaskBar 
          programs={programs}
          openPrograms={windowManager.openPrograms}
          onProgramClick={(id) => {
            if (windowManager.windowStates[id]?.isMinimized) {
              windowManager.toggleMinimize(id);
              windowManager.bringToFront(id);
            } else {
              windowManager.bringToFront(id);
            }
          }}
          onProgramDoubleClick={(id) => {
            if (!windowManager.windowStates[id]?.isMinimized) {
              windowManager.toggleMinimize(id);
            }
          }}
          onStartClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          currentTime={currentTime}
          windowStates={windowManager.windowStates}
          onlineUsers={onlineUsers}
          isWebSocketConnected={isWebSocketConnected}
        />
        
        <StartMenu 
          isOpen={isStartMenuOpen} 
          onClose={() => setIsStartMenuOpen(false)}
          programs={programs}
          onProgramClick={(id) => toggleProgram(id)}
        />
      </div>
  );
}