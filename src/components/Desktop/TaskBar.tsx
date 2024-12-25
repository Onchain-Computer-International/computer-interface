import React from 'react';
import type { Program } from './Desktop';

type TaskBarProps = {
  programs: Program[];
  openPrograms: string[];
  onProgramClick: (id: string) => void;
  onStartClick: () => void;
  currentTime: Date;
  windowStates: Record<string, WindowState>;
  onProgramDoubleClick: (id: string) => void;
};

export default function TaskBar({ 
  programs, 
  openPrograms, 
  onProgramClick, 
  onStartClick,
  currentTime,
  windowStates,
  onProgramDoubleClick 
}: TaskBarProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#0055aa] border-t-2 border-b-2 border-white flex items-center px-1 z-50">
      <button 
        onClick={onStartClick}
        className="px-4 h-8 bg-white text-[#0055aa] font-bold border-2 border-white hover:bg-gray-100 active:translate-y-[1px]"
      >
        Workbench
      </button>
      <div className="flex-1 flex items-center space-x-1 ml-1">
        {programs.map((program) => (
          openPrograms.includes(program.id) && (
            <button
              key={program.id}
              onClick={() => onProgramClick(program.id)}
              onDoubleClick={() => onProgramDoubleClick(program.id)}
              className={`flex items-center space-x-2 px-3 h-8 border-2 border-white ${
                windowStates[program.id]?.isMinimized 
                  ? 'bg-[#003366] text-white' 
                  : 'bg-white text-[#0055aa]'
              }`}
            >
              {program.icon}
              <span className="text-sm font-bold">{program.title}</span>
            </button>
          )
        ))}
      </div>
      <div className="px-4 py-1 text-white font-bold border-2 border-white h-8 flex items-center">
        {currentTime.toLocaleTimeString()}
      </div>
    </div>
  );
}