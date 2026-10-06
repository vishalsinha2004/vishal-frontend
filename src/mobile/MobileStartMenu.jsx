import React, { useState } from 'react';
import { useSound } from '../hooks/useSound';
import { 
  folderIcon, 
  settingsIcon, 
  fileExplorerIcon, 
  aboutUsIcon, 
  sysMonitorIcon 
} from '../utils/icons';

const MobileStartMenu = ({ 
  systemApps, 
  onOpenApp, 
  closeMenu, 
  onOpenSearch, 
  onShutDown, 
  onLogOff 
}) => {
  const { playSound } = useSound();
  const [showPrograms, setShowPrograms] = useState(false);

  const handleAppClick = (id) => {
    playSound('click');
    onOpenApp(id);
    closeMenu();
  };

  // Exclude Settings from the generic programs list as it has its own dedicated button
  const programs = systemApps.filter(app => app.id !== 'settings');

  return (
    <div 
      className="absolute bottom-10 left-0 w-[260px] max-h-[75dvh] min-h-0 bg-os-gray border-t border-r border-os-white shadow-[2px_-2px_5px_rgba(0,0,0,0.5)] flex z-[9998] font-sans text-black select-none flex-col"
      onClick={(e) => e.stopPropagation()} // Prevent clicks inside menu from bubbling to the OS desktop and closing it
    >
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left Brand Stripe */}
        <div className="w-8 bg-os-dark-gray flex items-end justify-center py-2 shrink-0">
          <span className="transform -rotate-90 text-os-gray font-bold tracking-widest whitespace-nowrap text-sm mb-16">
            VISHAL <span className="text-white">OS 98</span>
          </span>
        </div>

        {/* Menu Items */}
        <div className="flex-1 flex flex-col py-1 min-h-0 overflow-y-auto custom-scrollbar bg-os-gray">
          
          {/* Programs Accordion */}
          <div 
            className={`flex items-center px-2 py-2 shrink-0 cursor-pointer ${showPrograms ? 'bg-os-navy text-white' : 'hover:bg-os-navy hover:text-white active:bg-os-navy active:text-white'}`}
            onClick={() => { playSound('click'); setShowPrograms(!showPrograms); }}
          >
            <img src={folderIcon} className="w-6 h-6 mr-2 object-contain shrink-0" style={{ imageRendering: 'pixelated' }} alt="Programs" />
            <span className="flex-1 text-sm">Programs</span>
            <span className="text-xs">{showPrograms ? '▼' : '▶'}</span>
          </div>

          {showPrograms && (
            <div className="bg-os-white border-y border-os-dark-gray flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col shadow-retro-inset shrink-0 max-h-[35dvh]">
              {programs.map(app => (
                <div 
                  key={app.id}
                  className="flex items-center px-4 py-2 hover:bg-os-navy hover:text-white active:bg-os-navy active:text-white cursor-pointer"
                  onClick={() => handleAppClick(app.id)}
                >
                  <img src={app.icon} className="w-5 h-5 mr-3 object-contain shrink-0" style={{ imageRendering: 'pixelated' }} alt="" />
                  <span className="text-sm truncate">{app.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Settings */}
          <div 
            className="flex items-center px-2 py-2 shrink-0 hover:bg-os-navy hover:text-white active:bg-os-navy active:text-white cursor-pointer"
            onClick={() => handleAppClick('settings')}
          >
            <img src={settingsIcon} className="w-6 h-6 mr-2 object-contain shrink-0" style={{ imageRendering: 'pixelated' }} alt="Settings" />
            <span className="flex-1 text-sm">Settings</span>
          </div>

          {/* Find */}
          <div 
            className="flex items-center px-2 py-2 shrink-0 hover:bg-os-navy hover:text-white active:bg-os-navy active:text-white cursor-pointer"
            onClick={() => { playSound('click'); onOpenSearch(); }}
          >
            <img src={fileExplorerIcon} className="w-6 h-6 mr-2 object-contain shrink-0" style={{ imageRendering: 'pixelated' }} alt="Find" />
            <span className="flex-1 text-sm">Find</span>
          </div>

          <div className="my-1 border-t border-os-dark-gray border-b border-os-white mx-1 shrink-0"></div>

          {/* Log Off */}
          <div 
            className="flex items-center px-2 py-2 shrink-0 hover:bg-os-navy hover:text-white active:bg-os-navy active:text-white cursor-pointer"
            onClick={() => { playSound('click'); onLogOff(); closeMenu(); }}
          >
            <img src={aboutUsIcon} className="w-6 h-6 mr-2 object-contain shrink-0" style={{ imageRendering: 'pixelated' }} alt="Log Off" />
            <span className="flex-1 text-sm">Log Off Vishal...</span>
          </div>

          {/* Shut Down */}
          <div 
            className="flex items-center px-2 py-2 shrink-0 hover:bg-os-navy hover:text-white active:bg-os-navy active:text-white cursor-pointer"
            onClick={() => { playSound('click'); onShutDown(); closeMenu(); }}
          >
            <img src={sysMonitorIcon} className="w-6 h-6 mr-2 object-contain shrink-0" style={{ imageRendering: 'pixelated' }} alt="Shut Down" />
            <span className="flex-1 text-sm">Shut Down...</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MobileStartMenu;