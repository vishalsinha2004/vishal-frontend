import React from 'react';

const StartMenu = ({ systemApps, onOpenApp, closeMenu }) => {
  return (
    <div className="absolute bottom-16 left-4 w-80 bg-space-dark border border-space-gray rounded-lg shadow-[0_0_30px_rgba(0,82,136,0.3)] flex flex-col overflow-hidden z-50 backdrop-blur-md bg-opacity-95 p-4 animate-fade-in-up">
      
      {/* User Profile Section */}
      <div className="flex items-center space-x-3 mb-6 border-b border-space-gray pb-4">
        <div className="h-12 w-12 rounded-full bg-space-gray flex items-center justify-center text-2xl shadow-inner">
          👨‍🚀
        </div>
        <div>
          <h3 className="text-space-white font-bold tracking-wide">Commander Vishal</h3>
          <p className="text-xs text-thruster-glow font-mono">System Administrator</p>
        </div>
      </div>
      
      {/* Applications List */}
      <div className="space-y-1">
        <h4 className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-3">System Modules</h4>
        
        {systemApps.map(app => (
          <button 
            key={app.id}
            onClick={() => { 
              onOpenApp(app.id); 
              closeMenu(); 
            }}
            className="w-full flex items-center space-x-3 p-2.5 rounded-md hover:bg-space-gray transition-colors text-left group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">{app.icon}</span>
            <span className="text-space-white text-sm font-sans">{app.name}</span>
          </button>
        ))}
      </div>

      {/* Power Options & Settings */}
      <div className="mt-6 pt-4 border-t border-space-gray flex justify-between items-center">
        
        {/* New Preferences Button */}
        <button 
          onClick={() => { 
            onOpenApp('settings'); 
            closeMenu(); 
          }}
          className="text-gray-400 hover:text-thruster-glow transition-colors flex items-center gap-2 text-sm font-mono"
        >
          <span>⚙️</span> Preferences
        </button>

        <button className="text-gray-400 hover:text-red-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StartMenu;