import React, { useState } from 'react';
import { useSound } from '../hooks/useSound';
import { systemOsIcon, hardDriveIcon, folderIcon, fileIcon } from '../utils/icons';
import { showSystemDialog } from './SystemDialog';

const FileExplorer = ({ fsApi, onOpenApp }) => {
  const [currentPath, setCurrentPath] = useState("C:\\");
  const { playSound } = useSound();
  const { fileSystem, resolvePath } = fsApi;

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
    parts.pop();
    setCurrentPath(parts.join('\\') || "C:\\");
  };

const handleFileExecute = (file) => {
    if (file.appId) {
      playSound('window-open');
      onOpenApp(file.appId);
    } else {
      playSound('error');
      showSystemDialog({
        type: 'error',
        title: 'Unsupported Format',
        message: 'Cannot open this file format natively yet.',
        buttons: ['OK']
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-os-gray font-sans">
      <div className="flex items-center gap-2 p-1 border-b border-os-dark-gray bg-os-gray shrink-0">
        <button className="retro-btn text-xs px-2 py-0.5" onClick={handleUp} disabled={currentPath === "C:\\"}>
           Up
        </button>
        <div className="flex-1 flex items-center bg-os-white shadow-retro-inset border border-os-dark-gray px-1 py-0.5 text-xs">
          <span className="text-os-dark-gray mr-1">Address:</span>
          <span className="truncate">{currentPath}</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 border-r border-os-dark-gray bg-os-white p-2 overflow-y-auto shadow-retro-inset min-w-[140px]">
          <ul className="text-xs">
            <li className="flex items-center gap-1.5 cursor-pointer font-bold mb-1" onClick={() => { playSound('click'); setCurrentPath("C:\\")}}>
              <img src={systemOsIcon} alt="PC" className="w-3.5 h-3.5 object-contain" style={{ imageRendering: 'pixelated' }} /> My Computer
            </li>
            <ul className="pl-4">
              <li className="flex items-center gap-1.5 cursor-pointer font-bold mb-1" onClick={() => { playSound('click'); setCurrentPath("C:\\")}}>
                <img src={hardDriveIcon} alt="Drive" className="w-3.5 h-3.5 object-contain" style={{ imageRendering: 'pixelated' }} /> Local Disk (C:)
              </li>
              <ul className="pl-4 border-l border-dotted border-gray-400 ml-1.5">
                {Object.keys(fileSystem["C:"].contents).map(folder => (
                  <li 
                    key={folder} 
                    className="flex items-center gap-1.5 cursor-pointer hover:bg-os-navy hover:text-white py-[2px] px-1"
                    onClick={() => handleNavigate(folder)}
                  >
                    <img src={folderIcon} alt="Folder" className="w-3.5 h-3.5 object-contain" style={{ imageRendering: 'pixelated' }} /> {folder}
                  </li>
                ))}
              </ul>
            </ul>
          </ul>
        </div>

        <div className="flex-1 bg-os-white p-2 overflow-y-auto shadow-retro-inset">
          {currentNode && Object.keys(currentNode).length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 content-start">
              {Object.keys(currentNode).map(key => {
                const item = currentNode[key];
                const isDir = item.type === 'dir';
                const nodeIcon = isDir ? folderIcon : (item.icon || fileIcon);
                
                return (
                  <div 
                    key={key} 
                    className="flex flex-col items-center justify-start p-1 cursor-pointer focus:bg-os-navy focus:text-white outline-none group"
                    tabIndex="0"
                    onDoubleClick={() => isDir ? handleNavigate(key) : handleFileExecute(item)}
                    onClick={() => playSound('click')}
                  >
                    <div className="h-10 mb-1 flex items-center justify-center">
                      <img src={nodeIcon} alt="" className="w-8 h-8 object-contain" style={{ imageRendering: 'pixelated' }} />
                    </div>
                    <span className="text-xs text-center break-all px-1 leading-tight group-focus:bg-os-navy group-focus:border-dotted group-focus:border-white border border-transparent">
                      {key}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-xs text-os-dark-gray">0 objects</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;