import React, { useState, useEffect, useRef } from 'react';
import CommandCenter from './CommandCenter';

const TopSearch = ({ systemApps, onOpenApp }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showExpanded, setShowExpanded] = useState(false); 
  const searchRef = useRef(null);

  // --- FILTER OUT INDIVIDUAL PROJECTS ---
  // Only keep core apps (System OS, About Us, File Explorer, Resume, Settings, etc.)
  // We identify individual projects because they usually have a 'project_type' from Django.
  const coreApps = systemApps.filter(app => !app.project_type);

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

  // Search only against the core apps
  const filteredApps = coreApps.filter(app => 
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
              systemApps={coreApps} // Only pass core apps to CommandCenter 
              onOpenApp={handleOpen} 
              onClose={() => setShowExpanded(false)} 
            />

          ) : (
            
            /* STATE 2: EMPTY SEARCH DASHBOARD (Macbook Dock Row View) */
            <div className="flex flex-row items-end gap-4 px-6 py-4 bg-[#1a1a1a] bg-opacity-60 rounded-2xl border border-gray-700 backdrop-blur-md shadow-inner overflow-x-auto custom-scrollbar">
              
              {/* Render dynamic core apps (excluding settings) */}
              {coreApps.filter(app => app.id !== 'settings').map(app => (
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

              {/* Hardcoded Settings Icon - FIXED MANGLED SVG */}
              <div className="relative group flex flex-col items-center">
                <span className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#0a0a0a] border border-gray-600 text-space-white text-[11px] px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg pointer-events-none z-50 font-sans tracking-wide">
                  Settings
                </span>
                <button 
                  onClick={() => handleOpen('settings')}
                  className="w-12 h-12 transition-all duration-300 ease-out origin-bottom hover:scale-[1.5] hover:-translate-y-2 focus:outline-none"
                >
                  <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a] border border-gray-700 rounded-xl drop-shadow-xl text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.528.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
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