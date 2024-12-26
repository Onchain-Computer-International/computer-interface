import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { currentPathAtom, selectedFileAtom, selectedContentAtom } from './fileBrowserAtoms';

interface FileItem {
  name: string;
  type: 'file' | 'directory';
  size?: number;
  content?: string;
}

const files = import.meta.glob('./filesystem/**/*', { as: 'raw', eager: true });

const getDirectoryContents = (dirPath: string): FileItem[] => {
  const normalizedCurrentPath = dirPath.startsWith('/') ? dirPath.slice(1) : dirPath;
  const prefix = './filesystem/';
  
  const items: FileItem[] = [];
  
  for (const fullPath in files) {
    const relativePath = fullPath.slice(prefix.length);
    const pathParts = relativePath.split('/');
    
    // If we're at root, only show top-level items
    if (normalizedCurrentPath === '') {
      if (pathParts.length === 1) {
        items.push({
          name: pathParts[0],
          type: 'file',
          content: files[fullPath],
          size: files[fullPath].length
        });
      } else {
        // Add directory if it doesn't exist
        const dirName = pathParts[0];
        if (!items.find(item => item.name === dirName)) {
          items.push({
            name: dirName,
            type: 'directory'
          });
        }
      }
    } else {
      // Show items in current directory
      if (relativePath.startsWith(normalizedCurrentPath)) {
        const remainingPath = relativePath.slice(normalizedCurrentPath.length + 1);
        const remainingParts = remainingPath.split('/');
        
        if (remainingParts[0]) {  // Skip if empty string
          if (remainingParts.length === 1) {
            items.push({
              name: remainingParts[0],
              type: 'file',
              content: files[fullPath],
              size: files[fullPath].length
            });
          } else {
            // Add directory if it doesn't exist
            const dirName = remainingParts[0];
            if (!items.find(item => item.name === dirName)) {
              items.push({
                name: dirName,
                type: 'directory'
              });
            }
          }
        }
      }
    }
  }
  
  return items;
};

export default function FileBrowser() {
  const [currentPath, setCurrentPath] = useAtom(currentPathAtom);
  const [selectedFile, setSelectedFile] = useAtom(selectedFileAtom);
  const [selectedContent, setSelectedContent] = useAtom(selectedContentAtom);

  const currentFiles = getDirectoryContents(currentPath);

  const handleFileSelect = (fileName: string) => {
    if (selectedFile === fileName) {
      // Deselect if clicking the same file
      setSelectedFile(null);
      setSelectedContent(null);
      return;
    }

    setSelectedFile(fileName);
    const file = currentFiles.find(f => f.name === fileName);
    if (file?.type === 'file' && file.name.endsWith('.txt')) {
      setSelectedContent(file.content || '');
    } else {
      setSelectedContent(null);
    }
  };

  const handleDoubleClick = (file: FileItem) => {
    if (file.type === 'directory') {
      const newPath = currentPath === '/' 
        ? `/${file.name}`
        : `${currentPath}/${file.name}`;
      setCurrentPath(newPath);
      setSelectedFile(null);
    }
  };

  const navigateToParent = () => {
    if (currentPath === '/') return;
    
    const pathParts = currentPath.split('/').filter(Boolean);
    pathParts.pop();
    const parentPath = pathParts.length === 0 ? '/' : '/' + pathParts.join('/');
    setCurrentPath(parentPath);
    setSelectedFile(null);
  };

  return (
    <div className="h-full bg-[#0055aa] text-[#ffffff] font-['Topaz'] p-2 overflow-auto border-2 border-[#ffffff]">
      <div className="flex h-full gap-2">
        <div className="flex-1">
          {/* Path header */}
          <div className="bg-[#ffffff] text-[#0055aa] px-2 py-1 mb-2 text-[0.6rem]">
            {currentPath}
          </div>

          {/* File list */}
          <div className="grid grid-cols-1 gap-0.5 text-[0.6rem]">
            {currentPath !== '/' && (
              <div
                className="flex items-center px-2 py-0.5 cursor-pointer hover:bg-[#ffffff] hover:text-[#0055aa]"
                onClick={navigateToParent}
              >
                <span className="mr-2">..</span>
                <span className="text-[0.5rem]">&lt;Parent Directory&gt;</span>
              </div>
            )}
            
            {currentFiles.map((file) => (
              <div
                key={file.name}
                className={`flex items-center px-2 py-0.5 cursor-pointer ${
                  selectedFile === file.name ? 'bg-[#ffffff] text-[#0055aa]' : ''
                } hover:bg-[#ffffff] hover:text-[#0055aa]`}
                onClick={() => handleFileSelect(file.name)}
                onDoubleClick={() => handleDoubleClick(file)}
              >
                <span className="mr-2">{file.type === 'directory' ? '📁' : '📄'}</span>
                <span className="flex-1">{file.name}</span>
                {file.size && <span className="text-[0.5rem] ml-4">{file.size} bytes</span>}
              </div>
            ))}
          </div>

          {/* Status bar */}
          <div className="mt-2 border-t border-[#ffffff] pt-1 text-[0.5rem] flex justify-between">
            <div>{selectedFile || 'No file selected'}</div>
            <div>{currentFiles.length} items</div>
          </div>
        </div>

        {/* Content viewer */}
        {selectedContent !== null && (
          <div className="flex-[2] bg-[#ffffff] text-[#0055aa] p-2 font-mono text-[0.6rem] overflow-auto">
            <pre className="whitespace-pre-wrap break-words">{selectedContent}</pre>
          </div>
        )}
      </div>
    </div>
  );
}