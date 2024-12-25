import { AlertCircle } from 'lucide-react';
import Logs from './Logs';
import type { Program } from '../../Desktop/Desktop';

export const config: Program = {
  id: 'logs',
  title: 'System Logs',
  icon: <AlertCircle className="w-5 h-5" />,
  content: <Logs />,
}; 