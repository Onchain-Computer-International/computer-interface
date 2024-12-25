import { Music as MusicIcon } from 'lucide-react';
import MusicPlayer from './MusicPlayer';
import type { Program } from '../../Desktop/Desktop';

export const config: Program = {
  id: 'modplayer',
  title: 'Music Player',
  icon: <MusicIcon className="w-5 h-5" />,
  content: <MusicPlayer />,
}; 