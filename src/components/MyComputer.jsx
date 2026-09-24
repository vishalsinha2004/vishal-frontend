import React, { useState } from 'react';
import { useSound } from '../hooks/useSound';
import { showSystemDialog } from './SystemDialog';
import { floppyIcon, hardDriveIcon, cdIcon, settingsIcon, networkIcon, recycleBinIcon } from '../utils/icons';

const MyComputer = ({ onOpenApp }) => {
  const [selectedId, setSelectedId] = useState(null);
  const { playSound } = useSound();

  const drives = [
    { id: 'drive-a', name: '3½ Floppy (A:)', icon: floppyIcon, type: 'drive' },
    { id: 'drive-c', name: 'Local Disk (C:)', icon: hardDriveIcon, type: 'drive', target: 'file-explorer' },
    { id: 'drive-d', name: 'CD-ROM (D:)', icon: cdIcon, type: 'drive' },
    { id: 'settings', name: 'Control Panel', icon: settingsIcon, type: 'system', target: 'settings' },
    { id: 'network', name: 'Network Neighborhood', icon: networkIcon, type: 'system', target: 'network' }, 
    { id: 'recycle', name: 'Recycle Bin', icon: recycleBinIcon, type: 'system', target: 'recycle-bin' }
  ];

  const handleDoubleClick = (item) => {
    playSound('window-open');
    if (item.target) {
      onOpenApp(item.target);
    } else if (item.id === 'network') {
      showSystemDialog({ 
        type: 'info', 
        title: 'Network Neighborhood', 
        message: 'Network Neighborhood will be available in Step 17.', 
        buttons: ['OK'] 
      });
    } else {
      showSystemDialog({ 
        type: 'error', 
        title: item.name, 
        message: `${item.name} is not accessible.\n\nThe device is not ready.`, 
        buttons: ['OK'] 
      });
    }
  };

  return (
    <div 
      className="flex-1 bg-os-white h-full p-2 overflow-y-auto shadow-retro-inset font-sans" 
      onClick={() => setSelectedId(null)}
    >
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 content-start">
        {drives.map(item => (
          <div 
            key={item.id}
            onClick={(e) => { 
              e.stopPropagation(); 
              playSound('click'); 
              setSelectedId(item.id); 
            }}
            onDoubleClick={(e) => { 
              e.stopPropagation(); 
              handleDoubleClick(item); 
            }}
            className="flex flex-col items-center justify-start p-2 cursor-default outline-none group"
          >
            <div className="w-10 h-10 mb-1 relative flex items-center justify-center">
              {selectedId === item.id && (
                <div className="absolute inset-0 bg-os-navy opacity-40 mix-blend-multiply pointer-events-none"></div>
              )}
              <img src={item.icon} alt="" className="w-8 h-8 object-contain" style={{ imageRendering: 'pixelated' }} />
            </div>
            <span className={`text-xs text-center leading-tight px-1 line-clamp-2 shadow-sm
              ${selectedId === item.id 
                ? 'bg-os-navy text-white border-dotted border border-white' 
                : 'text-os-text border border-transparent'
              }`}
            >
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyComputer;