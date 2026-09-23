import React, { useState } from 'react';
import { useSound } from '../hooks/useSound';
import { virtualFileSystem } from '../services/virtualFileSystem';

const FileExplorer = ({ systemApps, onOpenApp }) => {
  const [currentPath, setCurrentPath] = useState("C:\\");
  const { playSound } = useSound();

  // Helper to extract the contents for the current path
  const resolvePath = (pathStr) => {
    const parts = pathStr.split('\\').filter(Boolean);
    let current = virtualFileSystem;
    
    for (const part of parts) {
      if (current[part] && current[part].type === 'dir') {
        current = current[part].contents; // step into folder contents
      } else {
        return null;
      }
    }
    return current; // Returns the contents object
  };

  const currentNode = resolvePath(currentPath);

  const handleNavigate = (folderName) => {
    playSound('click');
    if (currentPath === "C:\\") setCurrentPath(`C:\\${folderName}`);
    else setCurrentPath(`${currentPath}\\${folderName}`);
  };

  const handleUp = () => {
    playSound('click');
    if (currentPath === "C:\\") return;
    const parts = currentPath.split('\\');
    parts.pop(); // Remove current folder
    setCurrentPath(parts.join('\\') || "C:\\");
  };

  const handleFileExecute = (file) => {
    playSound('window-open');
    if (file.appId) onOpenApp(file.appId);
    else alert("Cannot open this file format natively yet.");
  };

  return (
    <div className="flex flex-col h-full bg-os-gray font-sans select-none">
      
      {/* File Explorer Tool Bar */}
      <div className="flex items-center gap-2 p-1 border-b border-os-dark-gray bg-os-gray">
        <button className="retro-btn text-xs px-2 py-0.5 font-bold" onClick={handleUp} disabled={currentPath === "C:\\"}>
           Up ⤴
        </button>
        <div className="flex-1 flex items-center bg-os-white shadow-retro-inset border border-os-dark-gray px-1 text-xs py-0.5">
          <span className="text-os-dark-gray mr-1">Address:</span>
          <span className="truncate">{currentPath}</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane: Tree View */}
        <div className="w-1/3 border-r border-os-dark-gray bg-os-white p-2 overflow-y-auto shadow-retro-inset">
          <ul className="text-xs">
            <li className="flex items-center gap-1 cursor-pointer font-bold mb-1 hover:bg-blue-900 hover:text-white" onClick={() => { playSound('click'); setCurrentPath("C:\\")}}>
              💻 My Computer
            </li>
            <ul className="pl-4">
              <li className="flex items-center gap-1 cursor-pointer font-bold mb-1 hover:bg-blue-900 hover:text-white" onClick={() => { playSound('click'); setCurrentPath("C:\\")}}>
                🖴 Local Disk (C:)
              </li>
              <ul className="pl-4 border-l border-dotted border-gray-400 ml-1">
                {virtualFileSystem["C:"].contents && Object.keys(virtualFileSystem["C:"].contents).map(folder => (
                  <li 
                    key={folder} 
                    className="flex items-center gap-1 cursor-pointer hover:bg-os-navy hover:text-white py-0.5 px-1"
                    onClick={() => handleNavigate(folder)}
                  >
                    📁 {folder}
                  </li>
                ))}
              </ul>
            </ul>
          </ul>
        </div>

        {/* Right Pane: File/Folder Contents */}
        <div className="flex-1 bg-os-white p-2 overflow-y-auto shadow-retro-inset">
          {currentNode && Object.keys(currentNode).length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 content-start">
              {Object.keys(currentNode).map(key => {
                const item = currentNode[key];
                const isDir = item.type === 'dir';
                
                return (
                  <div 
                    key={key} 
                    className="flex flex-col items-center justify-start p-1 cursor-pointer focus:bg-os-navy focus:text-white outline-none group"
                    tabIndex="0"
                    onDoubleClick={() => isDir ? handleNavigate(key) : handleFileExecute(item)}
                    onClick={() => playSound('click')}
                  >
                    <div className="text-3xl mb-1">{isDir ? '📁' : '📄'}</div>
                    <span className="text-xs text-center break-all px-1 leading-tight group-focus:bg-os-navy group-focus:border-dotted group-focus:border-white border border-transparent">
                      {key}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-xs text-os-dark-gray italic p-2">0 objects (Folder is empty)</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;