import React, { useState, useEffect, useRef } from 'react';

// --- Retro Pixel Icons ---
const findIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M20 20l8 8' stroke='%23000' stroke-width='4' stroke-linecap='square'/%3E%3Ccircle cx='14' cy='14' r='8' fill='%23fff' stroke='%23000' stroke-width='2'/%3E%3Cpath d='M12 16l4-4' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E";
const aiIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='4' y='8' width='24' height='16' fill='%23000' stroke='%23000' stroke-width='2'/%3E%3Ccircle cx='10' cy='16' r='2' fill='%23ff0000'/%3E%3Ccircle cx='22' cy='16' r='2' fill='%23ff0000'/%3E%3Cpath d='M14 20h4' stroke='%2300ff00' stroke-width='2'/%3E%3C/svg%3E";

const TopSearch = ({ systemApps, onOpenApp }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false); // Controls if the dialog is open
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const searchRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

  // --- FILTER OUT INDIVIDUAL PROJECTS & GAMES ---
  const coreApps = systemApps.filter(app => !app.project_type && !app.isGame);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Allow closing the Find dialog if clicking outside of it
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setAiResponse('');
  };

  const handleAskAI = async () => {
    if (!query.trim()) return;
    
    setIsAiLoading(true);
    setAiResponse('');
    
    try {
      const res = await fetch(`${API_BASE_URL}/ai-search/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      const data = await res.json();
      if (res.ok) {
        setAiResponse(data.reply);
      } else {
        setAiResponse(`Error: ${data.error || 'Connection Failed.'}`);
      }
    } catch (error) {
      setAiResponse("Error: Local subsystem unreachable.");
    }
    setIsAiLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (filteredApps.length > 0 && query.trim() !== '') {
        handleOpen(filteredApps[0].id);
      } else if (query.trim() !== '') {
        handleAskAI();
      }
    }
  };

  return (
    <>
      {/* 
        In a 90s OS, the search isn't a persistent top bar. 
        For UX convenience, we'll keep a small trigger button top-right on the desktop,
        which opens the classic "Find" dialog.
      */}
      {!isFocused && (
        <button 
          onClick={() => setIsFocused(true)}
          className="absolute top-4 right-4 retro-btn flex items-center gap-2 z-40 text-xs font-bold px-2 py-1"
          title="Find: All Files"
        >
          <img src={findIcon} alt="" className="w-4 h-4" style={{ imageRendering: 'pixelated' }} />
          Find...
        </button>
      )}

      {/* --- CLASSIC "FIND" DIALOG --- */}
      {isFocused && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <div 
            ref={searchRef} 
            className="retro-window w-[450px] shadow-retro-outset bg-os-gray font-sans text-os-text pointer-events-auto"
          >
            {/* Title Bar */}
            <div className="retro-title-bar select-none">
              <div className="flex items-center gap-1">
                <img src={findIcon} alt="" className="w-4 h-4" style={{ imageRendering: 'pixelated' }} />
                <span>Find: All Files and Neural Nets</span>
              </div>
              <button onClick={() => { setIsFocused(false); setQuery(''); setAiResponse(''); }} className="retro-btn px-2 py-0 h-[18px] text-xs leading-none font-bold">
                X
              </button>
            </div>

            {/* Menu Bar */}
            <div className="retro-menu-bar border-b border-os-dark-gray select-none">
              <span className="retro-menu-item"><span className="underline">F</span>ile</span>
              <span className="retro-menu-item"><span className="underline">E</span>dit</span>
              <span className="retro-menu-item"><span className="underline">V</span>iew</span>
              <span className="retro-menu-item"><span className="underline">O</span>ptions</span>
              <span className="retro-menu-item"><span className="underline">H</span>elp</span>
            </div>

            <div className="p-3 flex flex-col gap-3">
              
              {/* Tabs */}
              <div className="flex gap-1 border-b border-os-white relative z-10 pl-2">
                 <div className="bg-os-gray border border-os-white border-b-os-gray px-3 py-1 text-xs -mb-[1px] z-20">Name & Location</div>
                 <div className="bg-os-gray border border-os-dark-gray px-3 py-1 text-xs -mb-[1px] opacity-70">Advanced</div>
              </div>

              {/* Search Inputs Area */}
              <div className="bg-os-gray border border-os-white shadow-retro-outset p-3">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-xs w-16">Named:</span>
                  <input 
                    type="text" 
                    className="retro-input flex-1" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs w-16">Look in:</span>
                  <select className="retro-input flex-1 py-[1px]">
                    <option>C:\VISHAL\System</option>
                    <option>D:\Projects</option>
                    <option>Neural Net (Luma AI)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <button 
                  onClick={handleAskAI}
                  disabled={isAiLoading || !query.trim()}
                  className="retro-btn text-xs w-24 flex items-center justify-center gap-1 font-bold"
                >
                  <img src={aiIcon} alt="" className="w-3 h-3" style={{ imageRendering: 'pixelated' }} />
                  Ask AI
                </button>
                <button onClick={() => { setQuery(''); setAiResponse(''); }} className="retro-btn text-xs w-24">
                  New Search
                </button>
              </div>

              {/* Results Area */}
              {query && (
                <div className="mt-2 flex flex-col gap-1">
                  <span className="text-xs">Search Results:</span>
                  <div className="bg-os-white shadow-retro-inset border border-os-dark-gray h-40 overflow-y-auto p-1 custom-scrollbar">
                    
                    {/* 1. Local Module Results */}
                    {filteredApps.length > 0 && !aiResponse && !isAiLoading && (
                      <ul className="flex flex-col">
                        {filteredApps.map(app => (
                          <li key={app.id}>
                            <button 
                              onClick={() => handleOpen(app.id)}
                              className="w-full flex items-center gap-2 px-2 py-1 hover:bg-os-navy hover:text-os-white text-xs text-left outline-none"
                            >
                              <img src={app.icon} alt="" className="w-4 h-4 object-contain" style={{ imageRendering: 'pixelated' }} />
                              <div className="flex flex-col">
                                <span>{app.name}.exe</span>
                                {app.tech_stack && <span className="text-[10px] opacity-70 truncate">{app.tech_stack}</span>}
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* 2. No Local Results Prompt */}
                    {filteredApps.length === 0 && !aiResponse && !isAiLoading && (
                      <div className="p-4 text-center flex flex-col items-center justify-center opacity-70">
                        <span className="text-xs mb-1">0 file(s) found.</span>
                        <span className="text-[10px]">Click 'Ask AI' to search the remote neural net.</span>
                      </div>
                    )}

                    {/* 3. AI Terminal Area (Replaces skeleton loader with classic text loading) */}
                    {(aiResponse || isAiLoading) && (
                      <div className="p-2 h-full flex flex-col font-sans">
                        <div className="flex items-center gap-2 mb-2 pb-1 border-b border-os-gray border-dotted">
                          <img src={aiIcon} alt="" className="w-3 h-3" style={{ imageRendering: 'pixelated' }} />
                          <span className="text-[10px] font-bold">LUMA AI LINK ESTABLISHED</span>
                        </div>
                        
                        <div className="text-xs leading-relaxed">
                          {isAiLoading ? (
                            <span className="animate-pulse">Processing query...</span>
                          ) : (
                            <div className="whitespace-pre-wrap">{aiResponse}</div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}

            </div>
            
            {/* Status Bar */}
            <div className="retro-status-bar mt-0 border-t border-os-dark-gray shadow-none">
              <span>{filteredApps.length} object(s) found</span>
              <div className="flex gap-4">
                <span className="border-l border-os-dark-gray pl-2">{isAiLoading ? 'Connecting...' : 'Ready'}</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default TopSearch;