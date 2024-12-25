import React, { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { logsAtom } from './logsAtom';

export default function LogViewer() {
  const [logs, setLogs] = useAtom(logsAtom);
  const clearLogs = () => setLogs([]);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="h-full flex flex-col bg-[#1a1a3a] text-[#00ffcc] font-['Courier_New']">
      <div className="flex justify-between items-center bg-[#2a2a4a] border-b-2 border-[#00ffcc] px-2 py-0.5">
        <h2 className="text-[#00ffcc] text-sm uppercase tracking-wide">System Logs</h2>
        <button 
          onClick={clearLogs}
          className="px-1.5 py-0.5 text-xs border border-[#00ffcc] text-[#00ffcc] hover:bg-[#00ffcc] hover:text-[#1a1a3a] transition-colors"
        >
          Clear
        </button>
      </div>
      <div ref={logsContainerRef} className="flex-1 overflow-y-auto p-0.5 text-xs leading-4">
        {logs.map((log, index) => (
          <div 
            key={index} 
            className={`font-['Courier_New'] ${
              log.level === 'error' ? 'text-[#ff6b6b]' :
              log.level === 'warn' ? 'text-[#ffdd59]' :
              log.level === 'debug' ? 'text-[#74b9ff]' :
              'text-[#00ffcc]'
            }`}
          >
            <span className="opacity-80">{new Date(log.timestamp).toLocaleTimeString()}</span>
            <span className="mx-1 uppercase">{log.level}</span>
            <span>{log.message}</span>
            {log.metadata && (
              <pre className="opacity-70 ml-2 mt-0.5">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 