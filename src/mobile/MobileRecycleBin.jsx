import React from 'react';
import { useSound } from '../hooks/useSound';
import { showSystemDialog } from '../components/SystemDialog';

const MobileRecycleBin = ({ fsApi, onOpenApp }) => {
  const { playSound } = useSound();
  
  // Portfolios rarely feature actual file deletion, so we default to a safe empty state 
  // or read from the fsApi if a recycle path exists.
  const recycledItems = []; 

  const handleEmptyBin = () => {
    playSound('error');
    showSystemDialog({
      type: 'info',
      title: 'Recycle Bin',
      message: 'The Recycle Bin is already empty.',
      buttons: ['OK']
    });
  };

  return (
    <div className="flex flex-col h-full bg-white text-black font-sans text-sm">
      {/* Mobile Toolbar */}
      <div className="flex items-center p-1.5 bg-os-gray border-b border-os-dark-gray gap-2 shrink-0">
        <button 
          disabled
          className="retro-btn px-4 py-1 text-xs font-bold opacity-50 text-os-dark-gray active:shadow-retro-outset"
        >
          Up
        </button>
        <button 
          onClick={handleEmptyBin}
          className="retro-btn px-3 py-1 text-xs text-black shadow-retro-outset active:shadow-retro-inset"
        >
          Empty Bin
        </button>
        <div className="flex-1 shadow-retro-inset bg-white px-2 py-1.5 truncate text-xs border border-os-dark-gray text-right">
          Recycle Bin
        </div>
      </div>

      {/* Directory Contents List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-1 bg-white">
        {recycledItems.length === 0 ? (
          <div className="text-os-dark-gray text-xs italic p-4 text-center mt-4">
            The Recycle Bin is empty.
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Map logic for actual deleted files if added later */}
          </div>
        )}
      </div>
      
      {/* Classic Status Bar */}
      <div className="bg-os-gray border-t border-os-dark-gray p-1 px-2 text-[10px] shrink-0 flex justify-between shadow-retro-inset">
        <span>{recycledItems.length} object(s)</span>
        <span>0 bytes</span>
      </div>
    </div>
  );
};

export default MobileRecycleBin;