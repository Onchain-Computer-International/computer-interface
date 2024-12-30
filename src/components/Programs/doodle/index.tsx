import { Paintbrush as PaintbrushIcon } from 'lucide-react';
import Doodle from './Doodle';
import type { Program } from '../../Desktop/Desktop';

export const config: Program = {
  id: 'doodle',
  title: 'Doodle',
  icon: <PaintbrushIcon className="w-5 h-5" />,
  content: <Doodle />,
}; 