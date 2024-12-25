import { Search } from 'lucide-react';
import Explorer from './Explorer';
import type { Program } from '../../Desktop/Desktop';

export const config: Program = {
  id: 'explorer',
  title: 'Token Explorer',
  icon: <Search className="w-5 h-5" />,
  content: <Explorer />,
}; 