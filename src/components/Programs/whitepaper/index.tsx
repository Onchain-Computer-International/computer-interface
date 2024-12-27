import { FileIcon } from 'lucide-react';
import Whitepaper from './Whitepaper';
import type { Program } from '../../Desktop/Desktop';

export const config: Program = {
  id: 'whitepaper',
  title: 'Whitepaper',
  icon: <FileIcon className="w-5 h-5" />,
  content: <Whitepaper />,
}; 
