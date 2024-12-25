import { Terminal as TerminalIcon } from 'lucide-react';
import Terminal from './Terminal';
import type { Program } from '../../Desktop/Desktop';

export const config: Program = {
  id: 'terminal',
  title: 'Terminal',
  icon: <TerminalIcon className="w-5 h-5" />,
  content: <Terminal />,
}; 