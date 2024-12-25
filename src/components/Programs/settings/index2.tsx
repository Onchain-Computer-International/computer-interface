import { Settings as SettingsIcon } from 'lucide-react';
import Settings from './Settings';
import type { Program } from '../../Desktop/Desktop';

export const config: Program = {
  id: 'settings',
  title: 'Settings',
  icon: <SettingsIcon className="w-5 h-5" />,
  content: <Settings />,
}; 