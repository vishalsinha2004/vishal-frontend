import React from 'react';
import { useSound } from '../hooks/useSound';

const MobileWindowSwitcher = ({
  openApps,
  activeWindowId,
  focusWindow,
  closeWindow,
  closeSwitcher
}) => {
  const { playSound } = useSound();

  if (openApps.length === 0) return null;

  return (
    <div 
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[320px] max-h-[75dvh] min-h-0 bg-os-gray border border-os-white shadow-[2px_-2px_5px_rgba(0,0,0,0.5)] z-[9998] font-sans text-black select-none p-1 flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Task Manager Title Bar */}
      <div className="bg-[#000080] text-white font-dialog font-bold text-xs px-1 py-0.5 mb-1 flex justify-between items-center cursor-default shrink-0">
        <span>Running Tasks ({openApps.length})</span>
        <button 
          onClick={() => { playSound('click'); closeSwitcher(); }} 
          className="retro-btn text-black h-4 w-4 flex items-center justify-center text-[10px]"
        >
          X
        </button>
      </div>
      
      {/* Open Applications List */}
      <div className="bg-os-white shadow-retro-inset border border-os-dark-gray flex-1 min-h-0 overflow-y-auto p-1 flex flex-col gap-1 custom-scrollbar">
        {openApps.map(app => (
          <div 
            key={app.id}
            className={`flex items-center p-1 border cursor-pointer ${activeWindowId === app.id ? 'bg-os-navy text-white border-dotted border-white' : 'hover:bg-os-gray border-transparent'}`}
            onClick={() => {
              playSound('click');
              focusWindow(app.id);
              closeSwitcher();
            }}
          >
            <img src={app.icon} alt="" className="w-5 h-5 mr-2 object-contain shrink-0" style={{ imageRendering: 'pixelated' }} />
            <span className="text-xs truncate flex-1">{app.name}</span>
            
            {/* Direct Close Button inside Switcher */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                playSound('click');
                closeWindow(app.id);
                if (openApps.length === 1) closeSwitcher(); // Auto-close switcher if the last app is closed
              }}
              className="retro-btn w-6 h-5 flex items-center justify-center text-[10px] text-black bg-os-gray ml-2 font-bold shrink-0"
              title="Close App"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileWindowSwitcher;