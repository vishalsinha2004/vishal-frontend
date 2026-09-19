import React, { useState } from 'react';

const StartMenu = ({ systemApps, onOpenApp, closeMenu }) => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  // Group apps logically for the classic 90s menu structure
  const programs = systemApps.filter(app => !['settings', 'tic-tac-toe', 'problem-solver'].includes(app.id));
  const games = systemApps.filter(app => ['tic-tac-toe', 'problem-solver'].includes(app.id));

  const handleOpen = (id) => {
    onOpenApp(id);
    closeMenu();
  };

  return (
    <div className="absolute bottom-[30px] left-0 bg-os-gray shadow-retro-outset flex flex-row z-[9999] font-sans select-none border border-os-dark-gray min-w-[200px]">
      
      {/* --- VERTICAL OS BANNER (Left Side) --- */}
      <div className="bg-os-navy w-8 flex flex-col justify-end items-center pb-2 relative overflow-hidden">
        <div className="absolute bottom-16 -left-12 -rotate-90 origin-bottom-right text-os-gray font-bold text-lg tracking-widest whitespace-nowrap opacity-80">
          VISHAL OS <span className="text-os-white">98</span>
        </div>
      </div>

      {/* --- MENU ITEMS (Right Side) --- */}
      <div className="flex-1 py-1 flex flex-col">
        
        {/* Programs Submenu Trigger */}
        <div 
          className={`relative flex items-center justify-between px-3 py-1 cursor-default hover:bg-os-navy hover:text-os-white ${activeSubmenu === 'programs' ? 'bg-os-navy text-os-white' : 'text-os-text'}`}
          onMouseEnter={() => setActiveSubmenu('programs')}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs">📁</span>
            <span className="text-xs font-bold"><span className="underline">P</span>rograms</span>
          </div>
          <span className="text-[10px]">▶</span>

          {/* Programs Submenu Content */}
          {activeSubmenu === 'programs' && (
            <div className="absolute left-[100%] bottom-0 min-w-[150px] bg-os-gray shadow-retro-outset py-1 border border-os-dark-gray z-50">
              {programs.map(app => (
                <div 
                  key={app.id}
                  onClick={() => handleOpen(app.id)}
                  className="flex items-center gap-2 px-3 py-1 text-os-text text-xs hover:bg-os-navy hover:text-os-white cursor-default"
                >
                  <img src={app.icon} alt="" className="w-4 h-4 object-contain" style={{ imageRendering: 'pixelated' }} />
                  <span className="truncate">{app.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Games Submenu Trigger */}
        <div 
          className={`relative flex items-center justify-between px-3 py-1 cursor-default hover:bg-os-navy hover:text-os-white ${activeSubmenu === 'games' ? 'bg-os-navy text-os-white' : 'text-os-text'}`}
          onMouseEnter={() => setActiveSubmenu('games')}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs">🕹️</span>
            <span className="text-xs"><span className="underline">G</span>ames</span>
          </div>
          <span className="text-[10px]">▶</span>

          {/* Games Submenu Content */}
          {activeSubmenu === 'games' && (
            <div className="absolute left-[100%] bottom-0 min-w-[150px] bg-os-gray shadow-retro-outset py-1 border border-os-dark-gray z-50">
              {games.map(app => (
                <div 
                  key={app.id}
                  onClick={() => handleOpen(app.id)}
                  className="flex items-center gap-2 px-3 py-1 text-os-text text-xs hover:bg-os-navy hover:text-os-white cursor-default"
                >
                  <img src={app.icon} alt="" className="w-4 h-4 object-contain" style={{ imageRendering: 'pixelated' }} />
                  <span className="truncate">{app.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full h-[1px] bg-os-dark-gray my-1 border-b border-os-white"></div>

        {/* Direct Links */}
        <div 
          onClick={() => handleOpen('settings')}
          onMouseEnter={() => setActiveSubmenu(null)}
          className="flex items-center gap-2 px-3 py-1 text-os-text hover:bg-os-navy hover:text-os-white cursor-default"
        >
          <span className="text-xs">⚙️</span>
          <span className="text-xs"><span className="underline">S</span>ettings</span>
        </div>

        <div 
          onClick={() => handleOpen('system-os')}
          onMouseEnter={() => setActiveSubmenu(null)}
          className="flex items-center gap-2 px-3 py-1 text-os-text hover:bg-os-navy hover:text-os-white cursor-default"
        >
          <span className="text-xs">🔍</span>
          <span className="text-xs"><span className="underline">F</span>ind...</span>
        </div>

        <div className="w-full h-[1px] bg-os-dark-gray my-1 border-b border-os-white"></div>

        {/* Shut Down Action */}
        <div 
          onClick={() => {
            // Note: In a full implementation, this opens a shutdown dialog
            alert("Shut Down logic to be implemented in SystemDialog.jsx");
            closeMenu();
          }}
          onMouseEnter={() => setActiveSubmenu(null)}
          className="flex items-center gap-2 px-3 py-1 text-os-text hover:bg-os-navy hover:text-os-white cursor-default"
        >
          <span className="text-xs">⏻</span>
          <span className="text-xs">Sh<span className="underline">u</span>t Down...</span>
        </div>

      </div>
    </div>
  );
};

export default StartMenu;