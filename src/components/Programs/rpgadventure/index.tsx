import { Gamepad2 as RpgIcon } from 'lucide-react';
import RpgAdventure from './RpgAdventure';
import type { Program } from '../../Desktop/Desktop';

export const config: Program = {
  id: 'rpgadventure',
  title: 'RPG Adventure',
  icon: <RpgIcon className="w-5 h-5" />,
  content: <RpgAdventure />,
}; 