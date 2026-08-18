import React, { useState, useEffect, useRef } from 'react';
import CommandCenter from './CommandCenter';

const TopSearch = ({ systemApps, onOpenApp }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showExpanded, setShowExpanded] = useState(false); 
  const searchRef = useRef(null);

  // Close the search dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
        setShowExpanded(false); 
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset expanded view if user starts typing
  useEffect(() => {
    if (query) setShowExpanded(false);
  }, [query]);

  const filteredApps = systemApps.filter(app => 
    app.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleOpen = (appId) => {
    if (appId === 'terminal') {
      console.log("Terminal Quick Launch Clicked");
    } else {
      onOpenApp(appId);
    }
    setQuery('');
    setIsFocused(false);
    setShowExpanded(false);
  };

  return (
    <div ref={searchRef} className="absolute top-6 left-1/2 transform -translate-x-1/2 z-[60] w-[750px] max-w-[95vw] transition-all duration-300">
      
      {/* Search Input Bar */}
      <div className={`relative flex items-center bg-space-dark bg-opacity-80 backdrop-blur-xl border rounded-full shadow-2xl px-5 py-3 transition-all z-20
        ${isFocused ? 'border-thruster-glow shadow-[0_0_30px_rgba(79,195,247,0.2)]' : 'border-space-gray hover:border-gray-500'}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400 mr-3">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text" 
          placeholder="Search system modules, commands, or telemetry..." 
          className="bg-transparent border-none outline-none text-space-white text-sm w-full font-sans placeholder-gray-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-gray-500 hover:text-white ml-2 transition-colors bg-[#1a1a1a] p-1 rounded-full">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      {/* Expanded Search Dashboard / Results Menu */}
      {isFocused && (
        <div className="absolute top-full left-0 w-full mt-4 animate-fade-in-up z-10 flex justify-center">
            
          {/* STATE 1: ACTIVE TYPING (List View) */}
          {query ? (
            <div className="w-full bg-[#121212] bg-opacity-95 backdrop-blur-2xl border border-space-gray rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="p-2">
                <h4 className="text-[10px] text-gray-500 font-mono uppercase tracking-widest px-3 py-2">Search Results</h4>
                {filteredApps.length > 0 ? (
                  <ul className="max-h-80 overflow-y-auto custom-scrollbar">
                    {filteredApps.map(app => (
                      <li key={app.id}>
                        <button 
                          onClick={() => handleOpen(app.id)}
                          className="w-full flex items-center gap-4 px-4 py-3 hover:bg-space-gray rounded-xl transition-colors text-left group"
                        >
                          <div className="bg-[#1a1a1a] p-2 rounded-lg group-hover:bg-black transition-colors">
                            <img src={app.icon} alt={app.name} className="w-6 h-6 object-contain group-hover:scale-110 transition-transform" />
                          </div>
                          <div>
                            <div className="text-sm text-space-white font-bold">{app.name}</div>
                            {app.tech_stack && <div className="text-xs text-gray-500 font-mono mt-0.5 truncate">{app.tech_stack}</div>}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-8 text-center flex flex-col items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12 text-gray-600 mb-3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <span className="text-sm text-gray-400 font-mono">No matching modules found for "{query}"</span>
                  </div>
                )}
              </div>
            </div>
          ) : showExpanded ? (
            
            /* STATE 3: FULL APPS GRID (Loaded from new Component file) */
            <CommandCenter 
              systemApps={systemApps} 
              onOpenApp={handleOpen} 
              onClose={() => setShowExpanded(false)} 
            />

          ) : (
            
            /* STATE 2: EMPTY SEARCH DASHBOARD (Macbook Dock Row View) */
            <div className="flex flex-row items-end gap-4 px-6 py-4 bg-[#1a1a1a] bg-opacity-60 rounded-2xl border border-gray-700 backdrop-blur-md shadow-inner overflow-x-auto custom-scrollbar">
              
              {/* Render dynamic apps */}
              {systemApps.filter(app => app.id !== 'settings').map(app => (
                <div key={app.id} className="relative group flex flex-col items-center">
                  <span className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#0a0a0a] border border-gray-600 text-space-white text-[11px] px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg pointer-events-none z-50 font-sans tracking-wide">
                    {app.name}
                  </span>
                  <button 
                    onClick={() => handleOpen(app.id)}
                    className="w-12 h-12 transition-all duration-300 ease-out origin-bottom hover:scale-[1.5] hover:-translate-y-2 focus:outline-none"
                  >
                    <img src={app.icon} alt={app.name} className="w-full h-full object-contain drop-shadow-xl" />
                  </button>
                </div>
              ))}

              {/* Hardcoded Terminal Icon */}
              <div className="relative group flex flex-col items-center">
                <span className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#0a0a0a] border border-gray-600 text-space-white text-[11px] px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg pointer-events-none z-50 font-sans tracking-wide">
                  Terminal
                </span>
                <button 
                  onClick={() => handleOpen('terminal')}
                  className="w-12 h-12 transition-all duration-300 ease-out origin-bottom hover:scale-[1.5] hover:-translate-y-2 focus:outline-none"
                >
                  <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a] border border-gray-700 rounded-xl drop-shadow-xl text-thruster-glow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
                  </div>
                </button>
              </div>

              {/* Hardcoded Settings Icon */}
              <div className="relative group flex flex-col items-center">
                <span className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#0a0a0a] border border-gray-600 text-space-white text-[11px] px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg pointer-events-none z-50 font-sans tracking-wide">
                  Settings
                </span>
                <button 
                  onClick={() => handleOpen('settings')}
                  className="w-12 h-12 transition-all duration-300 ease-out origin-bottom hover:scale-[1.5] hover:-translate-y-2 focus:outline-none"
                >
                  <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a] border border-gray-700 rounded-xl drop-shadow-xl text-gray-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                  </div>
                </button>
              </div>

              {/* Vertical Divider */}
              <div className="w-px h-10 bg-gray-700 mx-2 self-center"></div>

              {/* ALL APPS / MORE BUTTON - Updated to Professional Grid SVG */}
              <div className="relative group flex flex-col items-center">
                <span className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#0a0a0a] border border-gray-600 text-space-white text-[11px] px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg pointer-events-none z-50 font-sans tracking-wide">
                  All Apps
                </span>
                <button 
                  onClick={() => setShowExpanded(true)}
                  className="w-12 h-12 transition-all duration-300 ease-out origin-bottom hover:scale-[1.5] hover:-translate-y-2 focus:outline-none"
                >
                  <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a] border border-gray-700 rounded-xl drop-shadow-xl group-hover:border-thruster-glow transition-colors">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400 group-hover:text-thruster-glow transition-colors">
                      <rect x="3" y="3" width="4" height="4" rx="1" />
                      <rect x="10" y="3" width="4" height="4" rx="1" />
                      <rect x="17" y="3" width="4" height="4" rx="1" />
                      <rect x="3" y="10" width="4" height="4" rx="1" />
                      <rect x="10" y="10" width="4" height="4" rx="1" />
                      <rect x="17" y="10" width="4" height="4" rx="1" />
                      <rect x="3" y="17" width="4" height="4" rx="1" />
                      <rect x="10" y="17" width="4" height="4" rx="1" />
                      <rect x="17" y="17" width="4" height="4" rx="1" />
                    </svg>
                  </div>
                </button>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TopSearch;