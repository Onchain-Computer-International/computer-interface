import React, { useContext, useEffect, useRef } from 'react';
import { Power, Settings, HelpCircle, Wallet, ChevronRight, Monitor, Network, Command, User } from 'lucide-react';
import { AuthContext } from '../../Provider';
import { playMenuSound, playLogoutSound } from './Sounds';
import type { Program } from './Desktop';

type StartMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  programs?: Program[];
  onProgramClick?: (id: string) => void;
};

export default function StartMenu({ isOpen, onClose, programs = [], onProgramClick }: StartMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useContext(AuthContext);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      playMenuSound();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogout = () => {
    playLogoutSound();
    setTimeout(() => {
      onClose();
      logout();
    }, 300);
  };

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div 
      ref={menuRef}
      className="absolute bottom-12 left-0 w-[280px] bg-[#0055aa] 
        border-2 border-white
        z-[9999] select-none animate-slideUp"
    >
      <div className="bg-[#0077cc] px-2 py-[6px] flex items-center space-x-2">
        <div className="bg-white p-[3px] rounded-sm">
          <Wallet className="w-5 h-5 text-[#0055aa]" />
        </div>
        <span className="text-white text-[11px] font-bold tracking-tight truncate">
          {user.address ? shortenAddress(user.address) : 'Not Connected'}
        </span>
      </div>
      
      <div className="py-[2px]">
        {programs.length > 0 && (
          <>
            {programs.map((program) => (
              <MenuItem 
                key={program.id}
                icon={program.icon}
                text={program.title}
                onClick={() => {
                  onProgramClick?.(program.id);
                  onClose();
                }}
              />
            ))}
            <Divider />
          </>
        )}
        <SubMenuItem 
          icon={<Settings className="w-4 h-4" />} 
          text="Settings" 
          subItems={[
            { 
              text: 'Display',
              icon: <Monitor className="w-4 h-4" />,
              onClick: () => console.log('Display settings'),
              shortcut: "Ctrl+D"
            },
            { 
              text: 'Network',
              icon: <Network className="w-4 h-4" />,
              onClick: () => console.log('Network settings'),
              shortcut: "Ctrl+N"
            },
            { 
              text: 'Advanced',
              icon: <Command className="w-4 h-4" />,
              subItems: [
                { 
                  text: 'User Preferences',
                  icon: <User className="w-4 h-4" />,
                  onClick: () => console.log('User preferences')
                }
              ]
            }
          ]} 
        />
        <MenuItem 
          icon={<HelpCircle className="w-4 h-4" />} 
          text="Help" 
          onClick={onClose}
          shortcut="F1"
        />
        <Divider />
        <MenuItem 
          icon={<Power className="w-4 h-4" />} 
          text="Disconnect Wallet" 
          onClick={handleLogout}
          className="text-red-700 hover:text-white"
          shortcut="Ctrl+Q"
        />
      </div>
    </div>
  );
}

type MenuItemProps = {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  className?: string;
  shortcut?: string;
};

function MenuItem({ icon, text, onClick, className = '', shortcut }: MenuItemProps) {
  return (
    <button 
      className={`w-full flex items-center px-[21px] py-[3px] hover:bg-[#0077cc] hover:text-white 
        text-left text-[11px] font-normal active:bg-[#0077cc] focus:bg-[#0077cc] focus:text-white 
        focus:outline-none group transition-none text-white ${className}`}
      onClick={onClick}
    >
      <div className="w-[16px] flex justify-center mr-[8px] group-hover:text-white">
        {icon}
      </div>
      <span className="flex-1">{text}</span>
      {shortcut && (
        <span className="ml-[16px] text-[10px] opacity-75 group-hover:text-white tabular-nums">
          {shortcut}
        </span>
      )}
    </button>
  );
}

type SubMenuItemProps = {
  icon: React.ReactNode;
  text: string;
  subItems: Array<{
    text: string;
    onClick: () => void;
    icon?: React.ReactNode;
    shortcut?: string;
    subItems?: Array<{ text: string; onClick: () => void; icon?: React.ReactNode; }>;
  }>;
};

function SubMenuItem({ icon, text, subItems }: SubMenuItemProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsHovered(false), 300);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button 
        className="w-full flex items-center px-[21px] py-[3px] hover:bg-[#0077cc] hover:text-white 
          text-left text-[11px] font-normal focus:bg-[#0077cc] focus:text-white focus:outline-none 
          group transition-none text-white"
      >
        <div className="w-[16px] flex justify-center mr-[8px] group-hover:text-white">
          {icon}
        </div>
        <span className="flex-1">{text}</span>
        <ChevronRight className="w-3 h-3 group-hover:text-white ml-[4px]" />
      </button>

      {isHovered && (
        <div 
          className="absolute left-full top-[-3px] w-[224px] bg-[#0055aa] 
            border-2 border-white
            -ml-[2px] animate-fadeIn z-50"
        >
          {subItems.map((item, index) => (
            item.subItems ? (
              <SubMenuItem
                key={index}
                icon={item.icon || <div className="w-4 h-4" />}
                text={item.text}
                subItems={item.subItems}
              />
            ) : (
              <MenuItem
                key={index}
                icon={item.icon || <div className="w-4 h-4" />}
                text={item.text}
                onClick={item.onClick}
                shortcut={item.shortcut}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
}

function Divider() {
  return (
    <div className="mx-2 h-[2px] my-[3px] bg-white opacity-50" />
  );
}