import React from 'react';
import { useSound } from '../hooks/useSound';

const MobileTaskbar = ({
  openApps,
  isStartMenuOpen,
  toggleStartMenu,
  onToggleWindowSwitcher,
  onOpenSearch
}) => {
  const { playSound } = useSound();

  return (
    <div className="h-10 bg-os-gray border-t border-white shadow-[0_-1px_0_#dfdfdf] flex items-center px-1.5 gap-1.5 z-[9999] shrink-0 font-sans select-none w-full relative">
      
      {/* Start Button */}
      <button
        onClick={(e) => {
          if (e && e.stopPropagation) e.stopPropagation();
          if (!isStartMenuOpen) playSound('click');
          toggleStartMenu(e);
        }}
        className={`flex items-center justify-center gap-1 px-3 h-[28px] font-bold text-black border focus:outline-none
          ${isStartMenuOpen ? 'bg-[#d0d0d0] shadow-retro-inset outline-dotted outline-1 outline-black outline-offset-[-3px]' : 'bg-os-gray shadow-retro-outset active:shadow-retro-inset hover:bg-[#e0e0e0]'}`}
      >
        <span className="text-blue-900 italic text-sm">VISHAL</span>
      </button>

      {/* Windows / Task Switcher Button */}
      <button
        onClick={() => { 
          playSound('click'); 
          onToggleWindowSwitcher(); 
        }}
        disabled={openApps.length === 0}
        className={`flex-1 flex items-center justify-center gap-1 px-2 h-[28px] text-xs font-bold font-dialog border
          ${openApps.length === 0 ? 'opacity-60 shadow-retro-outset text-os-dark-gray' : 'shadow-retro-outset active:shadow-retro-inset text-black'}`}
      >
        {openApps.length > 0 ? `WINDOWS (${openApps.length})` : 'DESKTOP'}
      </button>

      {/* Search / Find Button */}
      <button
        onClick={() => { 
          playSound('click'); 
          onOpenSearch(); 
        }}
        className="flex items-center justify-center px-4 h-[28px] text-xs font-bold font-dialog border shadow-retro-outset active:shadow-retro-inset text-black"
      >
        FIND
      </button>
      
    </div>
  );
};

export default MobileTaskbar;