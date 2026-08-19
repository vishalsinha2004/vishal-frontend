import React, { useState } from 'react';

const Settings = ({ bgTheme, setBgTheme, accentColor, setAccentColor }) => {
  const [activeTab, setActiveTab] = useState('personalization');

  const wallpapers = [
    { 
      id: 'space', 
      name: 'Deep Space', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 flex-shrink-0">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      ) 
    },
    { 
      id: 'matrix', 
      name: 'Digital Matrix', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 flex-shrink-0">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      ) 
    },
    { 
      id: 'solid', 
      name: 'Vantablack', 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 flex-shrink-0">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        </svg>
      ) 
    }
  ];

  const colors = [
    { id: '#4FC3F7', name: 'SpaceX Blue' },
    { id: '#4ade80', name: 'Matrix Green' },
    { id: '#c084fc', name: 'Nebula Purple' },
    { id: '#f87171', name: 'Alert Red' }
  ];

  // Removed 'logs' tab from this array
  const tabs = [
    { 
      id: 'personalization', 
      name: 'Personalization', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
        </svg>
      ) 
    },
    { 
      id: 'system', 
      name: 'System Info', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      ) 
    },
    { 
      id: 'network', 
      name: 'Network', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
          <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
          <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
          <line x1="12" y1="20" x2="12.01" y2="20"></line>
        </svg>
      ) 
    }
  ];

  return (
    <div className="flex h-full bg-[#121212] text-space-white rounded overflow-hidden">
      
      {/* Settings Sidebar */}
      <div className="w-56 bg-[#0a0a0a] border-r border-space-gray p-4 flex flex-col gap-2">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 pl-2 flex items-center gap-2">
          {/* Added a Settings Gear icon here for extra polish */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          Settings
        </h2>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-sans transition-all ${
              activeTab === tab.id 
                ? 'bg-space-gray text-thruster-glow border border-gray-700' 
                : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white border border-transparent'
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative">
        
        {/* TAB 1: PERSONALIZATION */}
        {activeTab === 'personalization' && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-6 text-thruster-glow flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 flex-shrink-0"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
              Appearance & Personalization
            </h2>

            {/* Wallpaper Section */}
            <div className="mb-10">
              <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-4 font-mono">Desktop Environment</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {wallpapers.map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => setBgTheme(wp.id)}
                    className={`p-5 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all ${
                      bgTheme === wp.id 
                        ? 'border-thruster-glow bg-[#1a1a1a] shadow-[0_0_15px_rgba(0,0,0,0.4)] text-thruster-glow' 
                        : 'border-space-gray bg-[#0a0a0a] hover:bg-space-gray text-gray-400 hover:text-space-white'
                    }`}
                  >
                    {wp.icon}
                    <span className="text-xs font-bold font-sans">{wp.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color Section (FIXED LAYOUT) */}
            <div>
              <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-4 font-mono">System Accent Color</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setAccentColor(color.id)}
                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
                      accentColor === color.id
                        ? 'border-white bg-[#1a1a1a] shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                        : 'border-space-gray bg-[#0a0a0a] hover:bg-space-gray'
                    }`}
                  >
                    <div 
                      className="w-10 h-10 rounded-full border border-gray-600 shadow-inner"
                      style={{ backgroundColor: color.id }}
                    ></div>
                    <span className={`text-[11px] font-mono text-center ${accentColor === color.id ? 'text-white font-bold' : 'text-gray-400'}`}>
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SYSTEM INFO */}
        {activeTab === 'system' && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-6 text-thruster-glow flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 flex-shrink-0"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
              System Specifications
            </h2>

            <div className="bg-[#0a0a0a] border border-space-gray rounded-xl p-6 mb-6 flex items-start gap-6 shadow-lg">
              <div className="w-20 h-20 bg-[#1a1a1a] rounded-full border border-gray-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-10 h-10 text-thruster-glow flex-shrink-0"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">Vishal Sinha</h3>
                <p className="text-sm text-gray-400 font-mono mb-1">BCA Student, Shreyarth University</p>
                <p className="text-sm text-gray-400 font-mono">Data Science Intern</p>
                <div className="mt-3 flex gap-2">
                  <span className="inline-block bg-thruster-blue text-black font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">System Administrator</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0a0a0a] border border-space-gray rounded-xl p-5 shadow-lg">
                <div className="text-[10px] text-gray-500 uppercase font-mono mb-1">Region & Locale</div>
                <div className="text-sm text-white font-sans">Ahmedabad, Gujarat, India</div>
              </div>
              <div className="bg-[#0a0a0a] border border-space-gray rounded-xl p-5 shadow-lg">
                <div className="text-[10px] text-gray-500 uppercase font-mono mb-1">Frontend Engine</div>
                <div className="text-sm text-white font-sans">React 18.x + Vite Environment</div>
              </div>
              <div className="bg-[#0a0a0a] border border-space-gray rounded-xl p-5 shadow-lg">
                <div className="text-[10px] text-gray-500 uppercase font-mono mb-1">Core Tech Stack</div>
                <div className="text-sm text-white font-sans truncate">React, Node.js, Python, Django</div>
              </div>
              <div className="bg-[#0a0a0a] border border-space-gray rounded-xl p-5 shadow-lg">
                <div className="text-[10px] text-gray-500 uppercase font-mono mb-1">Uptime Status</div>
                <div className="text-sm text-white font-sans text-thruster-glow flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-thruster-glow animate-pulse flex-shrink-0"></span> System Active
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NETWORK */}
        {activeTab === 'network' && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-6 text-thruster-glow flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 flex-shrink-0"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
              Network & Connections
            </h2>

            <div className="bg-[#0a0a0a] border border-space-gray rounded-xl p-5 mb-4 flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center text-green-500 flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Main_Network_5G</h4>
                  <p className="text-xs text-green-500 font-mono mt-0.5">Connected, Secured</p>
                </div>
              </div>
              <button className="bg-[#1a1a1a] hover:bg-space-gray border border-gray-600 px-4 py-2 rounded text-xs text-white transition-colors">Disconnect</button>
            </div>

            <div className="bg-[#0a0a0a] border border-space-gray rounded-xl p-5 flex justify-between items-center opacity-50 cursor-not-allowed shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-400 flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M12 20h.01"></path><path d="M8.5 16.429a5 5 0 0 1 7 0"></path><path d="M5 12.859a10 10 0 0 1 14 0"></path><path d="M1.5 9.288a15 15 0 0 1 21 0"></path></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Local_Guest</h4>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">Saved, Out of Range</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Settings;