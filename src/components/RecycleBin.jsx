import React from 'react';
import { useSound } from '../hooks/useSound';
import { fileIcon } from '../utils/icons';
import { showSystemDialog } from './SystemDialog';

const RecycleBin = ({ fsApi, onOpenApp }) => {
  const { playSound } = useSound();
  const { fileSystem, emptyRecycleBin } = fsApi;
  const binContents = fileSystem["Recycle Bin"]?.contents || {};

  const handleEmpty = () => {
    if (Object.keys(binContents).length === 0) return;
    playSound('warning');
    
    showSystemDialog({
      type: 'warning',
      title: 'Confirm File Delete',
      message: 'Are you sure you want to permanently delete these items?',
      buttons: ['Yes', 'No'],
      onAction: (button) => {
        if (button === 'Yes') {
          emptyRecycleBin();
          playSound('error'); // Act as a trash empty sound
        }
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-os-gray font-sans">
      <div className="flex items-center gap-2 p-1 border-b border-os-dark-gray bg-os-gray shrink-0">
        <button 
          className="retro-btn text-xs px-2 py-0.5" 
          onClick={handleEmpty} 
          disabled={Object.keys(binContents).length === 0}
        >
          Empty Recycle Bin
        </button>
      </div>

      <div className="flex-1 bg-os-white p-2 overflow-y-auto shadow-retro-inset">
        {Object.keys(binContents).length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 content-start">
            {Object.keys(binContents).map(key => {
              const item = binContents[key];
              return (
                <div 
                  key={key} 
                  className="flex flex-col items-center justify-start p-1 cursor-pointer focus:bg-os-navy focus:text-white outline-none group"
                  tabIndex="0"
                  onDoubleClick={() => { playSound('window-open'); onOpenApp(item.appId); }}
                  onClick={() => playSound('click')}
                >
                  <div className="h-10 mb-1 flex items-center justify-center">
                    <img src={item.icon || fileIcon} alt="" className="w-8 h-8 object-contain" style={{ imageRendering: 'pixelated' }} />
                  </div>
                  <span className="text-xs text-center break-all px-1 leading-tight group-focus:bg-os-navy group-focus:border-dotted group-focus:border-white border border-transparent">
                    {key}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-xs text-os-dark-gray text-center mt-4">The Recycle Bin is empty.</div>
        )}
      </div>
    </div>
  );
};

export default RecycleBin;