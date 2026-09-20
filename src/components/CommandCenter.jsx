import React from 'react';

// --- Classic Retro Pixel Icons (Base64) ---
const folderIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M4 8h8l2 4h14v12H4z' fill='%23ffff00' stroke='%23000' stroke-width='2' stroke-linejoin='miter'/%3E%3Cpath d='M4 12h24' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E";
const settingsIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='4' y='4' width='24' height='24' fill='%23c0c0c0' stroke='%23000' stroke-width='2'/%3E%3Ccircle cx='16' cy='16' r='6' fill='%23808080' stroke='%23000' stroke-width='2'/%3E%3Crect x='14' y='8' width='4' height='16' fill='%23000'/%3E%3Crect x='8' y='14' width='16' height='4' fill='%23000'/%3E%3C/svg%3E";
const terminalIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='4' y='4' width='24' height='24' fill='%23000' stroke='%23000' stroke-width='2'/%3E%3Ctext x='8' y='20' font-family='monospace' font-size='16' fill='%2300ff00'\>C:\\\</text\>%3C/svg%3E";

const CommandCenter = ({ systemApps, onOpenApp, onClose }) => {
  return (
    // Replaced transparent blur with solid gray retro window
    <div className="retro-window w-full bg-os-gray font-sans text-os-text shadow-retro-outset z-50">
      
      {/* Classic Title Bar */}
      <div className="retro-title-bar mb-2 select-none">
        <span>Program Manager</span>
        <button onClick={onClose} className="retro-btn px-2 py-0 h-[18px] text-xs leading-none font-bold">
          X
        </button>
      </div>

      {/* Inner Inset Content Area */}
      <div className="bg-os-white shadow-retro-inset p-4 m-1 border border-os-dark-gray flex flex-col gap-6">

        {/* --- INSTALLED PROGRAMS --- */}
        <div>
          <h3 className="font-bold text-sm mb-3 border-b border-os-dark-gray pb-1 select-none">Installed Programs</h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-y-6 gap-x-2">
            
            {/* Dynamic System Apps */}
            {systemApps.filter(app => app.id !== 'settings').map(app => (
              <button 
                key={app.id}
                onClick={() => {
                  onOpenApp(app.id);
                  onClose();
                }}
                className="flex flex-col items-center gap-1 group focus:outline-none"
              >
                <img src={app.icon} alt={app.name} className="w-8 h-8 object-contain" style={{ imageRendering: 'pixelated' }} />
                <span className="text-xs px-1 text-center truncate w-full border border-transparent group-hover:bg-os-navy group-hover:text-os-white group-hover:border-dotted group-hover:border-os-white cursor-default">
                  {app.name}
                </span>
              </button>
            ))}

            {/* Hardcoded Control Panel */}
            <button 
              onClick={() => {
                onOpenApp('settings');
                onClose();
              }} 
              className="flex flex-col items-center gap-1 group focus:outline-none"
            >
              <img src={settingsIcon} alt="Control Panel" className="w-8 h-8 object-contain" style={{ imageRendering: 'pixelated' }} />
              <span className="text-xs px-1 text-center truncate w-full border border-transparent group-hover:bg-os-navy group-hover:text-os-white group-hover:border-dotted group-hover:border-os-white cursor-default">
                Control Panel
              </span>
            </button>

            {/* Hardcoded Command Prompt */}
            <button 
              onClick={() => {
                onOpenApp('problem-solver'); // Routed to the Problem Solver which acts as MS-DOS
                onClose();
              }} 
              className="flex flex-col items-center gap-1 group focus:outline-none"
            >
              <img src={terminalIcon} alt="Terminal" className="w-8 h-8 object-contain" style={{ imageRendering: 'pixelated' }} />
              <span className="text-xs px-1 text-center truncate w-full border border-transparent group-hover:bg-os-navy group-hover:text-os-white group-hover:border-dotted group-hover:border-os-white cursor-default">
                MS-DOS Prompt
              </span>
            </button>

          </div>
        </div>

        {/* --- PROGRAM GROUPS --- */}
        <div>
          <h3 className="font-bold text-sm mb-3 border-b border-os-dark-gray pb-1 select-none">Program Groups</h3>
          <div className="grid grid-cols-3 gap-6">
            
            <button className="flex flex-col items-center gap-1 group focus:outline-none">
              <img src={folderIcon} alt="Productivity" className="w-10 h-10 object-contain" style={{ imageRendering: 'pixelated' }} />
              <span className="text-xs px-1 border border-transparent group-hover:bg-os-navy group-hover:text-os-white group-hover:border-dotted group-hover:border-os-white cursor-default">
                Productivity
              </span>
            </button>

            <button className="flex flex-col items-center gap-1 group focus:outline-none">
              <img src={folderIcon} alt="Developer Tools" className="w-10 h-10 object-contain" style={{ imageRendering: 'pixelated' }} />
              <span className="text-xs px-1 border border-transparent group-hover:bg-os-navy group-hover:text-os-white group-hover:border-dotted group-hover:border-os-white cursor-default">
                Dev Tools
              </span>
            </button>

            <button className="flex flex-col items-center gap-1 group focus:outline-none">
              <img src={folderIcon} alt="Design & UI" className="w-10 h-10 object-contain" style={{ imageRendering: 'pixelated' }} />
              <span className="text-xs px-1 border border-transparent group-hover:bg-os-navy group-hover:text-os-white group-hover:border-dotted group-hover:border-os-white cursor-default">
                Design & UI
              </span>
            </button>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default CommandCenter;