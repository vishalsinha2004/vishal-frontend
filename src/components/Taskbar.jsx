import React from 'react';

const Taskbar = ({ openApps = [], toggleStartMenu }) => {
  return (
    <div className="absolute bottom-0 w-full h-14 bg-space-dark border-t border-space-gray flex items-center px-4 backdrop-blur-md bg-opacity-80 z-50">
      
      {/* Start/Launch Button - Now clickable! */}
      <button 
        onClick={toggleStartMenu}
        className="h-10 w-10 rounded-full bg-thruster-blue hover:bg-thruster-glow transition-all duration-300 flex justify-center items-center shadow-[0_0_15px_rgba(79,195,247,0.5)] mr-4"
      >
        🚀
      </button>

      {/* Open Apps Area */}
      <div className="flex-1 flex items-center space-x-2">
        {openApps.map((app) => (
          <div 
            key={app.id} 
            className="flex items-center space-x-2 bg-space-gray px-3 py-1.5 rounded border border-gray-600 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] cursor-pointer hover:bg-opacity-80 transition-all"
          >
            <span>{app.icon}</span>
            <span className="text-sm font-sans text-space-white">{app.name}</span>
          </div>
        ))}
      </div>

      {/* System Tray */}
      <div className="text-space-white text-sm font-mono flex items-center space-x-4">
        <span>🛰️ Online</span>
        <span>{new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default Taskbar;