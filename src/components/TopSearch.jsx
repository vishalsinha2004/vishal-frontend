import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { useSound } from '../hooks/useSound';
import { virtualFileSystem } from '../services/virtualFileSystem';

const findIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='12' cy='12' r='8' fill='none' stroke='%23000' stroke-width='3'/%3E%3Cline x1='18' y1='18' x2='28' y2='28' stroke='%23000' stroke-width='4'/%3E%3C/svg%3E";

const TopSearch = ({ systemApps, onOpenApp }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  
  const { playSound } = useSound();
  const nodeRef = useRef(null);

  // Global Keyboard & Event Listeners
  useEffect(() => {
    const handleOpen = () => setIsVisible(true);
    
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        setIsVisible(true);
      }
    };
    
    window.addEventListener('sys-search', handleOpen);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('sys-search', handleOpen);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Debounced Search Execution
  useEffect(() => {
    if (!query.trim()) { 
      setResults([]);
      setIsSearching(false);
      return; 
    }

    setIsSearching(true);
    
    const timer = setTimeout(() => {
      const lowerQ = query.toLowerCase();
      const matches = [];

      // 1. Search OS Apps & Projects
      systemApps.forEach(app => {
        if (
          app.name.toLowerCase().includes(lowerQ) ||
          (app.description && app.description.toLowerCase().includes(lowerQ)) ||
          (app.tech_stack && app.tech_stack.toLowerCase().includes(lowerQ))
        ) {
          matches.push({ type: 'Application', name: app.name, id: app.id, icon: app.icon });
        }
      });

      // 2. Search Virtual Filesystem recursively
      const searchFS = (node, path) => {
        Object.keys(node).forEach(key => {
          const item = node[key];
          if (key.toLowerCase().includes(lowerQ)) {
            matches.push({ 
              type: item.type === 'dir' ? 'Folder' : 'File', 
              name: key, 
              path: path + '\\' + key, 
              appId: item.appId || 'file-explorer' 
            });
          }
          if (item.type === 'dir' && item.contents) {
            searchFS(item.contents, path + '\\' + key);
          }
        });
      };
      
      if (virtualFileSystem["C:"] && virtualFileSystem["C:"].contents) {
        searchFS(virtualFileSystem["C:"].contents, "C:");
      }

      setResults(matches);
      setIsSearching(false);
    }, 300); // 300ms delay to prevent excessive recursive re-renders

    return () => clearTimeout(timer);
  }, [query, systemApps]);

  const handleResultClick = (res) => {
    playSound('window-open');
    if (res.id) onOpenApp(res.id); 
    else if (res.appId) onOpenApp(res.appId); 
    setIsVisible(false);
    setQuery('');
  };

  const handleAskLuma = () => {
    playSound('click');
    onOpenApp('luma-ai');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Draggable nodeRef={nodeRef} handle=".retro-title-bar" bounds="parent">
      <div ref={nodeRef} className="absolute z-[10000] top-20 left-20 w-[450px] bg-os-gray shadow-retro-outset border border-os-dark-gray flex flex-col font-sans select-none">
        
        {/* Title Bar */}
        <div className="retro-title-bar bg-blue-900 text-white font-dialog font-bold px-1 flex justify-between items-center cursor-move">
          <div className="flex items-center gap-1">
            <img src={findIcon} alt="Find" className="w-3.5 h-3.5 invert" />
            <span>Find: All Files</span>
          </div>
          <button 
            className="retro-btn px-2 py-0 h-[18px] text-xs leading-none text-black bg-os-gray font-bold" 
            onClick={() => setIsVisible(false)}
          >
            X
          </button>
        </div>
        
        {/* Menu Bar */}
        <div className="border-b border-os-dark-gray flex gap-2 px-1 text-sm bg-os-gray">
          <span className="cursor-pointer hover:bg-blue-900 hover:text-white px-1"><span className="underline">F</span>ile</span>
          <span className="cursor-pointer hover:bg-blue-900 hover:text-white px-1"><span className="underline">E</span>dit</span>
          <span className="cursor-pointer hover:bg-blue-900 hover:text-white px-1"><span className="underline">V</span>iew</span>
          <span className="cursor-pointer hover:bg-blue-900 hover:text-white px-1"><span className="underline">H</span>elp</span>
        </div>
        
        {/* Search Controls Area */}
        <div className="p-2 flex gap-4 bg-os-gray">
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-2">
              <label className="text-xs w-16 text-right">Named:</label>
              <input 
                autoFocus
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 retro-input px-1 py-[2px] text-xs shadow-retro-inset border border-os-dark-gray outline-none focus:bg-white text-black"
                spellCheck="false"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs w-16 text-right">Look in:</label>
              <select className="flex-1 retro-input px-1 py-[2px] text-xs shadow-retro-inset border border-os-dark-gray outline-none bg-white">
                <option>Local Disk (C:)</option>
                <option>Vishal OS</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col gap-1 w-24">
            <button className="retro-btn text-xs py-1 font-bold shadow-retro-outset active:shadow-retro-inset">Find Now</button>
            <button className="retro-btn text-xs py-1 shadow-retro-outset active:shadow-retro-inset" onClick={() => { setQuery(''); setResults([]); }}>New Search</button>
          </div>
        </div>

        {/* Results Area */}
        <div className="border-t border-os-dark-gray border-b bg-os-white flex-1 min-h-[150px] max-h-[250px] overflow-y-auto shadow-retro-inset m-2 p-1">
          {isSearching ? (
             <div className="text-xs text-os-dark-gray p-2 italic">Searching...</div>
          ) : query && results.length === 0 ? (
            <div className="text-xs text-os-dark-gray p-2 italic">
              0 file(s) found. <br/><br/>
              <span className="text-black not-italic">Can't find what you're looking for?</span><br/>
              <button 
                onClick={handleAskLuma} 
                className="text-blue-800 underline font-bold cursor-pointer outline-none hover:text-blue-600 mt-1"
              >
                Ask Luma AI instead.
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-[2px]">
              {results.map((res, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-2 px-1 hover:bg-os-navy hover:text-white cursor-pointer text-xs group py-[2px]"
                  onClick={() => handleResultClick(res)}
                >
                  {res.icon ? (
                    <img src={res.icon} className="w-3.5 h-3.5" style={{imageRendering: 'pixelated'}} alt=""/>
                  ) : (
                    <span className="text-sm leading-none">{res.type === 'Folder' ? '📁' : '📄'}</span>
                  )}
                  <span className="flex-1 truncate">{res.name}</span>
                  <span className="text-os-dark-gray group-hover:text-gray-300 w-24 truncate text-right pr-2">
                    {res.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Status Bar */}
        <div className="bg-os-gray shadow-retro-inset px-2 py-0.5 text-xs border border-os-dark-gray flex text-os-text">
          <span>{isSearching ? 'Searching...' : `${results.length} file(s) found`}</span>
        </div>
      </div>
    </Draggable>
  );
};

export default TopSearch;