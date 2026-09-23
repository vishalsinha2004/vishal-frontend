import React from 'react';
import { useSound } from '../hooks/useSound';

const StartMenu = ({ systemApps, onOpenApp, closeMenu, onShutDown, onLogOff }) => {
  const { playSound } = useSound();

  const handleMenuClick = (action) => {
    playSound('click');
    action();
    closeMenu();
  };

  return (
    <div className="absolute bottom-[30px] left-1 w-48 bg-os-gray shadow-retro-outset border border-os-white z-[10000] flex font-sans text-sm select-none">
      {/* Left branding bar */}
      <div className="w-7 bg-blue-900 flex items-end justify-start pb-2 text-os-white">
        <span className="transform -rotate-90 origin-bottom-left whitespace-nowrap font-bold text-lg tracking-widest pl-2">
          <span className="text-os-gray">Vishal</span> OS 98
        </span>
      </div>
      
      {/* Menu items */}
<div className="flex-1 py-1 flex flex-col">
        {systemApps.map(app => (
          <div 
            key={app.id}
            className="px-3 py-2 hover:bg-os-navy hover:text-white flex items-center gap-3 cursor-default"
            onClick={() => handleMenuClick(() => onOpenApp(app.id))}
          >
            <img src={app.icon} alt="" className="w-6 h-6 object-contain" style={{ imageRendering: 'pixelated' }} />
            <span className="truncate">{app.name}</span>
          </div>
        ))}
        
        <div className="border-t border-os-dark-gray border-b border-os-white my-1 mx-1"></div>
        
        {/* --- ADD THIS FIND BLOCK HERE --- */}
        <div 
          className="px-3 py-2 hover:bg-os-navy hover:text-white flex items-center gap-3 cursor-default"
          onClick={() => handleMenuClick(() => window.dispatchEvent(new CustomEvent('sys-search')))}
        >
          <div className="w-6 h-6 flex items-center justify-center font-bold text-lg leading-none bg-transparent">
            🔍
          </div>
          <span>Find...</span>
        </div>
        
        <div className="border-t border-os-dark-gray border-b border-os-white my-1 mx-1"></div>
        
        <div 
          className="px-3 py-2 hover:bg-os-navy hover:text-white flex items-center gap-3 cursor-default"
          onClick={() => handleMenuClick(onLogOff)}
        >
          <div className="w-6 h-6 flex items-center justify-center font-bold text-sm bg-yellow-500 text-black rounded-full border border-black shadow-sm">!</div>
          <span>Log Off Vishal...</span>
        </div>
        
        <div 
          className="px-3 py-2 hover:bg-os-navy hover:text-white flex items-center gap-3 cursor-default"
          onClick={() => handleMenuClick(onShutDown)}
        >
          <div className="w-6 h-6 flex items-center justify-center bg-red-600 border border-black rounded-sm shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full border-[3px] border-white border-t-transparent"></div>
          </div>
          <span>Shut Down...</span>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;