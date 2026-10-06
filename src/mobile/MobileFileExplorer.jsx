import React, { useState } from 'react';
import { useSound } from '../hooks/useSound';
import { folderIcon, notepadIcon } from '../utils/icons';

const MobileFileExplorer = ({ fsApi, systemApps, onOpenApp }) => {
  const [currentPath, setCurrentPath] = useState("C:\\");
  const { playSound } = useSound();
  const { resolvePath } = fsApi;

  const currentNode = resolvePath(currentPath) || {};

  const handleUpClick = () => {
    playSound('click');
    if (currentPath === "C:\\") return;
    const parts = currentPath.split('\\');
    parts.pop();
    setCurrentPath(parts.join('\\') || "C:\\");
  };

  const handleItemClick = (name, item) => {
    playSound('click');
    if (item.type === 'dir') {
      setCurrentPath(currentPath === "C:\\" ? `C:\\${name}` : `${currentPath}\\${name}`);
    } else if (item.type === 'file' && item.appId) {
      onOpenApp(item.appId);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full h-full bg-white text-black font-sans text-sm">
      {/* Mobile Toolbar */}
      <div className="flex items-center p-1.5 bg-os-gray border-b border-os-dark-gray gap-2 shrink-0">
        <button 
          onClick={handleUpClick}
          disabled={currentPath === "C:\\"}
          className={`retro-btn px-4 py-1 text-xs font-bold ${currentPath === "C:\\" ? 'opacity-50 text-os-dark-gray active:shadow-retro-outset' : 'text-black'}`}
        >
          Up
        </button>
        <div className="flex-1 min-w-0 shadow-retro-inset bg-white px-2 py-1.5 truncate text-xs border border-os-dark-gray">
          {currentPath}
        </div>
      </div>

      {/* Directory Contents List (Strict internal scrolling) */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-1 bg-white">
        {Object.keys(currentNode).length === 0 ? (
          <div className="text-os-dark-gray text-xs italic p-4 text-center">
            This folder is empty.
          </div>
        ) : (
          <div className="flex flex-col">
            {Object.entries(currentNode).map(([name, item]) => {
              // Extract authentic icon if the item maps to a system app
              let iconToUse = item.type === 'dir' ? folderIcon : notepadIcon;
              if (item.type === 'file' && item.appId) {
                const appObj = systemApps.find(a => a.id === item.appId);
                if (appObj && appObj.icon) iconToUse = appObj.icon;
              }

              return (
                <div 
                  key={name}
                  onClick={() => handleItemClick(name, item)}
                  className="flex items-center gap-3 p-2 border border-transparent hover:bg-os-navy hover:text-white hover:border-dotted hover:border-white cursor-pointer active:bg-os-navy active:text-white"
                >
                  <img src={iconToUse} alt={item.type} className="w-8 h-8 object-contain shrink-0" style={{ imageRendering: 'pixelated' }} />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm truncate">{name}</span>
                    <span className="text-[10px] opacity-80">{item.type === 'dir' ? 'File Folder' : 'Application'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Classic Status Bar */}
      <div className="bg-os-gray border-t border-os-dark-gray p-1 px-2 text-[10px] shrink-0 flex justify-between shadow-retro-inset">
        <span>{Object.keys(currentNode).length} object(s)</span>
        <span>{currentPath === "C:\\" ? 'Local Disk' : ''}</span>
      </div>
    </div>
  );
};

export default MobileFileExplorer;