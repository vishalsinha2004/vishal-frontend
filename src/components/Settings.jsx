import React, { useState } from 'react';

const Settings = ({ bgTheme, setBgTheme, accentColor, setAccentColor, isCrtMode, setIsCrtMode }) => {
  const [activeModule, setActiveModule] = useState(null);

  // --- Retro Icons (Base64 SVG or placeholder representations) ---
  const displayIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='4' y='6' width='24' height='18' fill='%23008080' stroke='%23000' stroke-width='2'/%3E%3Crect x='12' y='24' width='8' height='4' fill='%23c0c0c0' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E";
  
  const systemIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='8' y='4' width='16' height='24' fill='%23c0c0c0' stroke='%23000' stroke-width='2'/%3E%3Crect x='10' y='6' width='12' height='6' fill='%23000'/%3E%3Ccircle cx='16' cy='22' r='2' fill='%23ff0000'/%3E%3C/svg%3E";
  
  const networkIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M8 12h16v8H8z' fill='%23c0c0c0' stroke='%23000' stroke-width='2'/%3E%3Cline x1='16' y1='20' x2='16' y2='28' stroke='%23000' stroke-width='2'/%3E%3Cline x1='8' y1='28' x2='24' y2='28' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E";

  const wallpapers = [
    { id: 'solid', name: 'Solid Teal' },
    { id: 'space', name: 'Classic Blue' },
    { id: 'matrix', name: 'Dark Mode' }
  ];

  return (
    <div className="h-full bg-os-white flex flex-col font-sans text-os-text">
      
      {/* Top Address Bar (Windows 98 Style) */}
      <div className="bg-os-gray border-b border-os-dark-gray p-1 flex items-center gap-2 text-xs">
        <span className="text-os-dark-gray px-1">Address</span>
        <div className="flex-1 bg-os-white shadow-retro-inset px-2 py-[2px] flex items-center">
          <img src={settingsIcon} alt="" className="w-3 h-3 mr-1" />
          Control Panel
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-os-white shadow-retro-inset m-1">
        
        {/* MODULE: MAIN GRID */}
        {!activeModule && (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            
            <button onDoubleClick={() => setActiveModule('display')} className="flex flex-col items-center gap-1 group focus:outline-none">
              <div className="w-10 h-10 mb-1">
                <img src={displayIcon} alt="Display" className="w-full h-full" style={{ imageRendering: 'pixelated' }} />
              </div>
              <span className="text-xs px-1 border border-transparent group-hover:bg-os-navy group-hover:text-os-white group-hover:border-dotted group-hover:border-os-white cursor-default">
                Display
              </span>
            </button>

            <button onDoubleClick={() => setActiveModule('system')} className="flex flex-col items-center gap-1 group focus:outline-none">
              <div className="w-10 h-10 mb-1">
                <img src={systemIcon} alt="System" className="w-full h-full" style={{ imageRendering: 'pixelated' }} />
              </div>
              <span className="text-xs px-1 border border-transparent group-hover:bg-os-navy group-hover:text-os-white group-hover:border-dotted group-hover:border-os-white cursor-default">
                System
              </span>
            </button>

            <button onDoubleClick={() => setActiveModule('network')} className="flex flex-col items-center gap-1 group focus:outline-none">
              <div className="w-10 h-10 mb-1">
                <img src={networkIcon} alt="Network" className="w-full h-full" style={{ imageRendering: 'pixelated' }} />
              </div>
              <span className="text-xs px-1 border border-transparent group-hover:bg-os-navy group-hover:text-os-white group-hover:border-dotted group-hover:border-os-white cursor-default">
                Network
              </span>
            </button>

          </div>
        )}

        {/* MODULE: DISPLAY PROPERTIES */}
        {activeModule === 'display' && (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4 border-b border-os-dark-gray pb-2">
              <button onClick={() => setActiveModule(null)} className="retro-btn text-xs px-2 py-0">← Back</button>
              <h3 className="font-bold text-sm">Display Properties</h3>
            </div>
            
            {/* Retro Tabs */}
            <div className="flex gap-1 border-b border-os-white relative z-10 pl-2">
               <div className="bg-os-gray border border-os-white border-b-os-gray px-3 py-1 text-xs -mb-[1px] z-20">Background</div>
               <div className="bg-os-gray border border-os-dark-gray px-3 py-1 text-xs -mb-[1px] opacity-70">Screen Saver</div>
            </div>

            <div className="bg-os-gray border border-os-white shadow-retro-outset p-4 flex-1 flex flex-col gap-4">
              
              {/* Mock Monitor Preview */}
              <div className="self-center w-40 h-32 bg-os-teal border-4 border-os-dark-gray shadow-retro-outset flex items-center justify-center relative overflow-hidden mb-4">
                <div className="absolute inset-0 bg-black/10"></div>
                <span className="text-os-white font-bold text-xl drop-shadow-md">VISHAL OS</span>
              </div>

              {/* Wallpaper List */}
              <div>
                 <p className="text-xs mb-1">Select an HTML Document or a picture:</p>
                 <div className="bg-os-white shadow-retro-inset h-24 overflow-y-auto border border-os-dark-gray">
                   {wallpapers.map(wp => (
                     <div 
                       key={wp.id} 
                       onClick={() => setBgTheme(wp.id)}
                       className={`px-2 py-1 text-xs cursor-default ${bgTheme === wp.id ? 'bg-os-navy text-os-white' : 'hover:bg-os-navy hover:text-os-white'}`}
                     >
                       {wp.name}
                     </div>
                   ))}
                 </div>
              </div>

              {/* CRT Mode Checkbox */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-os-dark-gray">
                 <input 
                   type="checkbox" 
                   id="crt-mode" 
                   checked={isCrtMode} 
                   onChange={(e) => setIsCrtMode(e.target.checked)}
                   className="shadow-retro-inset"
                 />
                 <label htmlFor="crt-mode" className="text-xs">Enable CRT Display Emulation (Requires Restart)</label>
              </div>

            </div>
          </div>
        )}

        {/* MODULE: SYSTEM PROPERTIES */}
        {activeModule === 'system' && (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4 border-b border-os-dark-gray pb-2">
              <button onClick={() => setActiveModule(null)} className="retro-btn text-xs px-2 py-0">← Back</button>
              <h3 className="font-bold text-sm">System Properties</h3>
            </div>
            
            <div className="flex gap-1 border-b border-os-white relative z-10 pl-2">
               <div className="bg-os-gray border border-os-white border-b-os-gray px-3 py-1 text-xs -mb-[1px] z-20">General</div>
               <div className="bg-os-gray border border-os-dark-gray px-3 py-1 text-xs -mb-[1px] opacity-70">Device Manager</div>
            </div>

            <div className="bg-os-gray border border-os-white shadow-retro-outset p-4 flex-1 flex gap-6">
               <div className="w-16 h-auto">
                 <img src={systemIcon} alt="" className="w-full" style={{ imageRendering: 'pixelated' }} />
               </div>
               <div className="flex-1 flex flex-col gap-3 text-xs">
                  <div>
                    <p className="font-bold">System:</p>
                    <p className="ml-4">Vishal OS 98</p>
                    <p className="ml-4">Second Edition</p>
                  </div>
                  <div>
                    <p className="font-bold">Registered to:</p>
                    <p className="ml-4">Vishal Sinha</p>
                    <p className="ml-4">Shreyarth University</p>
                  </div>
                  <div>
                    <p className="font-bold">Computer:</p>
                    <p className="ml-4">React 18.x</p>
                    <p className="ml-4">64.0MB RAM</p>
                    <p className="ml-4 text-os-teal">System Active</p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* MODULE: NETWORK PROPERTIES */}
        {activeModule === 'network' && (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4 border-b border-os-dark-gray pb-2">
              <button onClick={() => setActiveModule(null)} className="retro-btn text-xs px-2 py-0">← Back</button>
              <h3 className="font-bold text-sm">Network Neighborhood</h3>
            </div>
            
            <div className="bg-os-gray border border-os-white shadow-retro-outset p-4 flex-1">
               <p className="text-xs mb-2">The following network components are installed:</p>
               <div className="bg-os-white shadow-retro-inset h-32 border border-os-dark-gray p-2 text-xs mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span>🖥️</span> Client for Microsoft Networks
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span>🌐</span> TCP/IP - Dial-Up Adapter
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span>📡</span> Main_Network_5G (Connected)
                  </div>
               </div>
               <div className="flex justify-center gap-2">
                 <button className="retro-btn text-xs">Properties</button>
                 <button className="retro-btn text-xs">Remove</button>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Settings;