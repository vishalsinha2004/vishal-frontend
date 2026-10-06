import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '../hooks/useSound';
import { fileExplorerIcon } from '../utils/icons';

const MobileSearch = ({ systemApps, onOpenApp, closeSearch }) => {
  const { playSound } = useSound();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-focus the input so the mobile keyboard pops up immediately
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // Filter apps based on name, description, or tech stack
  const filteredApps = query.trim() === '' 
    ? [] 
    : systemApps.filter(app => 
        app.name.toLowerCase().includes(query.toLowerCase()) || 
        (app.description && app.description.toLowerCase().includes(query.toLowerCase())) ||
        (app.tech_stack && app.tech_stack.toLowerCase().includes(query.toLowerCase()))
      );

  const handleOpen = (id) => {
    playSound('click');
    onOpenApp(id);
    closeSearch();
  };

  return (
    <div 
      className="absolute inset-0 bg-os-teal/60 z-[9998] flex flex-col items-center justify-start pt-12 px-2"
      onClick={closeSearch}
    >
      <div 
        className="bg-os-gray border border-os-white shadow-[2px_-2px_5px_rgba(0,0,0,0.5)] w-full max-w-[340px] max-h-[85dvh] min-h-0 p-1 flex flex-col text-black font-sans shadow-retro-outset"
        onClick={(e) => e.stopPropagation()} // Prevent clicking the dialog from closing the search overlay
      >
        {/* Title Bar */}
        <div className="flex justify-between items-center bg-[#000080] text-white font-dialog font-bold text-xs px-1 py-0.5 mb-2 shrink-0">
          <div className="flex items-center gap-1">
            <img src={fileExplorerIcon} alt="Find" className="w-4 h-4 object-contain" style={{ imageRendering: 'pixelated' }}/>
            <span>Find: All Files</span>
          </div>
          <button 
            onClick={() => { playSound('click'); closeSearch(); }} 
            className="retro-btn text-black h-4 w-4 flex items-center justify-center text-[10px]"
          >
            X
          </button>
        </div>
        
        {/* Search Input Area */}
        <div className="flex gap-2 px-1 mb-2 shrink-0">
          <span className="text-xs self-center font-bold">Named:</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 shadow-retro-inset bg-white px-1 py-1 text-xs outline-none font-sans min-w-0"
            placeholder="Search apps, projects..."
          />
        </div>

        {/* Results Area */}
        <div className="flex-1 min-h-0 bg-os-white shadow-retro-inset border border-os-dark-gray overflow-y-auto m-1 p-1 custom-scrollbar">
          {query.trim() === '' ? (
            <div className="text-os-dark-gray text-xs h-full flex items-center justify-center italic">
              Type to start searching...
            </div>
          ) : filteredApps.length > 0 ? (
            filteredApps.map(app => (
              <div 
                key={app.id}
                className="flex items-center p-1 cursor-pointer hover:bg-os-navy hover:text-white border border-transparent hover:border-dotted hover:border-white"
                onClick={() => handleOpen(app.id)}
              >
                <img src={app.icon} alt="" className="w-6 h-6 mr-2 object-contain shrink-0" style={{ imageRendering: 'pixelated' }} />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs truncate">{app.name}</span>
                  <span className="text-[10px] opacity-80 truncate">{app.project_type || 'Application'}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-os-dark-gray text-xs h-full flex flex-col items-center justify-center italic">
              <span>No items found.</span>
              <span className="text-[10px] mt-1">Try another keyword.</span>
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="flex justify-end gap-2 p-1 border-t border-os-dark-gray mt-1 shrink-0">
          <button 
            className="retro-btn text-xs px-4 py-1"
            onClick={() => { playSound('click'); closeSearch(); }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileSearch;