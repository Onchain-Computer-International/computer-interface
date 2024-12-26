import { FileIcon, Terminal as TerminalIcon } from 'lucide-react';
import FileBrowser from './FileBrowser';
import type { Program } from '../../Desktop/Desktop';

export const config: Program = {
  id: 'filebrowser',
  title: 'File Browser',
  icon: <FileIcon className="w-5 h-5" />,
  content: <FileBrowser />,
}; 