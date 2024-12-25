import React, { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../../../Provider';

type Command = {
  id?: string;
  input: string;
  output?: string;
  messageId?: string;
  timestamp?: string;
};

export default function Terminal() {
  const { socket } = useContext(AuthContext);
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;

    const handleTerminalUpdate = (event: MessageEvent) => {
      console.log('Received event:', event.data);
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      console.log('Parsed data:', data);
      if (data.type === 'terminal-update') {
        console.log('Updating command:', data.command);
        setCommands(prev => {
          console.log('Previous commands:', prev);
          return prev.map(cmd => 
            cmd.id === data.command.id ? { ...data.command } : cmd
          );
        });
      }
    };

    socket.addEventListener('message', handleTerminalUpdate);

    return () => {
      socket.removeEventListener('message', handleTerminalUpdate);
    };
  }, [socket]);

  const handleCommand = (input: string) => {
    const timestamp = new Date().toISOString();
    const newCommand = { 
      id: crypto.randomUUID(),
      input, 
      timestamp 
    };
    setCommands(prev => [...prev, newCommand]);
    setCurrentInput('');

    // Broadcast command to other users
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'terminal-command',
        command: newCommand
      }));
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [commands]);

  const showPrompt = () => {
    // Only show prompt if there are no commands, or if the last command has an output
    if (commands.length === 0) return true;
    const lastCommand = commands[commands.length - 1];
    return !!lastCommand.output;
  };

  return (
    <div 
      ref={containerRef}
      className="h-full bg-[#0055aa] text-[#ffffff] font-['Topaz'] p-2 overflow-auto border-2 border-[#ffffff]"
      onClick={() => inputRef.current?.focus()}
    >
      {commands.map((cmd, i) => (
        <div key={i} className="mb-1">
          <div className="flex items-center text-[0.7rem] font-mono">
            <span className="text-[#ffffff]">1.Computer:\&gt;</span>
            <span className="ml-0.5">{cmd.input}</span>
          </div>
          {cmd.output && (
            <pre className="whitespace-pre-wrap text-[#ffffff] mt-0.5 ml-2 text-[0.7rem] font-mono">{cmd.output}</pre>
          )}
          {cmd.timestamp && (
            <div className="text-[0.5rem] text-[#aaaaaa] mt-0.5 ml-2 font-mono">
              {new Date(cmd.timestamp).toLocaleTimeString()}
              {cmd.messageId && ` [${cmd.messageId}]`}
            </div>
          )}
        </div>
      ))}
      {showPrompt() && (
        <div className="flex items-center text-[0.7rem] font-mono">
          <span className="text-[#ffffff]">1.Computer:\&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={e => setCurrentInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleCommand(currentInput);
              }
            }}
            className="flex-1 bg-transparent outline-none ml-0.5 text-[#ffffff] caret-[#ffffff]"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}