import React, { useState, useRef } from 'react';
import { useSound } from '../hooks/useSound';
import { navBackIcon, navForwardIcon, navStopIcon, navRefreshIcon, navHomeIcon, folderIcon } from '../utils/icons';

const InternetExplorer = ({ initialUrl = "https://www.google.com/webhp?igu=1" }) => {
  const [url, setUrl] = useState(initialUrl);
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [history, setHistory] = useState([initialUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const { playSound } = useSound();
  const iframeRef = useRef(null);

  const navigate = (newUrl) => {
    playSound('click');
    let finalUrl = newUrl.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(finalUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    setUrl(finalUrl);
    setInputUrl(finalUrl);
    setIsLoading(true);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      playSound('click');
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
      setIsLoading(true);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      playSound('click');
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
      setIsLoading(true);
    }
  };

  const handleRefresh = () => {
    playSound('click');
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  };

  const handleStop = () => {
    playSound('click');
    setIsLoading(false);
  };

  const handleHome = () => {
    navigate("https://www.google.com/webhp?igu=1");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate(inputUrl);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-os-gray font-sans select-none">
      
      {/* Top Standard Toolbar */}
      <div className="flex items-center gap-1 p-1 border-b border-os-dark-gray bg-os-gray shrink-0">
        <button className="retro-btn p-1 w-12 flex flex-col items-center justify-center text-[10px] leading-tight" onClick={goBack} disabled={historyIndex === 0}>
          <img src={navBackIcon} alt="Back" className={`w-5 h-5 mb-1 object-contain ${historyIndex === 0 ? 'opacity-50 grayscale' : ''}`} style={{ imageRendering: 'pixelated' }} />
          Back
        </button>
        <button className="retro-btn p-1 w-12 flex flex-col items-center justify-center text-[10px] leading-tight" onClick={goForward} disabled={historyIndex === history.length - 1}>
          <img src={navForwardIcon} alt="Forward" className={`w-5 h-5 mb-1 object-contain ${historyIndex === history.length - 1 ? 'opacity-50 grayscale' : ''}`} style={{ imageRendering: 'pixelated' }} />
          Forward
        </button>
        <button className="retro-btn p-1 w-12 flex flex-col items-center justify-center text-[10px] leading-tight" onClick={handleStop}>
          <img src={navStopIcon} alt="Stop" className="w-5 h-5 mb-1 object-contain" style={{ imageRendering: 'pixelated' }} />
          Stop
        </button>
        <button className="retro-btn p-1 w-12 flex flex-col items-center justify-center text-[10px] leading-tight" onClick={handleRefresh}>
          <img src={navRefreshIcon} alt="Refresh" className="w-5 h-5 mb-1 object-contain" style={{ imageRendering: 'pixelated' }} />
          Refresh
        </button>
        <button className="retro-btn p-1 w-12 flex flex-col items-center justify-center text-[10px] leading-tight" onClick={handleHome}>
          <img src={navHomeIcon} alt="Home" className="w-5 h-5 mb-1 object-contain" style={{ imageRendering: 'pixelated' }} />
          Home
        </button>
      </div>

      {/* Address Bar */}
      <div className="flex items-center p-1 border-b border-os-dark-gray gap-2 bg-os-gray shrink-0">
        <span className="text-os-dark-gray text-xs ml-1">Address</span>
        <div className="flex-1 flex items-center bg-white shadow-retro-inset border border-os-dark-gray px-1 h-6">
          <img src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8 0a8 8 0 100 16A8 8 0 008 0zm1 14.93V13a2 2 0 00-2-2H5V9a1 1 0 011-1h4a1 1 0 001-1V5.5A1.5 1.5 0 009.5 4H7V3.13A6.01 6.01 0 0113.84 8H11v2h2.5c.3 1 .43 2.05.28 3.07a5.98 5.98 0 01-4.78 1.86z' fill='%23000080'/%3E%3C/svg%3E" alt="IE" className="w-3.5 h-3.5 mr-1 opacity-70" style={{ imageRendering: 'pixelated' }} />
          <input 
            type="text" 
            value={inputUrl} 
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-xs outline-none cursor-text font-sans"
            spellCheck="false"
          />
        </div>
        <button className="retro-btn px-3 py-0.5 text-xs font-bold" onClick={() => navigate(inputUrl)}>Go</button>
      </div>

      {/* Links / Favorites Bar */}
      <div className="flex items-center p-1 border-b border-os-dark-gray text-xs bg-os-gray gap-3 shrink-0">
        <span className="font-bold text-os-dark-gray ml-1">Links</span>
        <button className="hover:underline text-black flex items-center gap-1" onClick={() => navigate('https://github.com/vishalsinha2004')}>
          <img src={folderIcon} alt="" className="w-3.5 h-3.5 object-contain" style={{ imageRendering: 'pixelated' }} /> GitHub
        </button>
        <button className="hover:underline text-black flex items-center gap-1" onClick={() => navigate('https://linkedin.com/in/vishalsinha')}>
          <img src={folderIcon} alt="" className="w-3.5 h-3.5 object-contain" style={{ imageRendering: 'pixelated' }} /> LinkedIn
        </button>
      </div>

      {/* Browser Canvas (Iframe) */}
      <div className="flex-1 bg-white border-t border-os-dark-gray shadow-retro-inset relative">
        <iframe 
          ref={iframeRef}
          src={url} 
          className="w-full h-full bg-white"
          title="Internet Explorer Browser"
          onLoad={() => setIsLoading(false)}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        ></iframe>
      </div>

      {/* Status Bar */}
      <div className="bg-os-gray shadow-retro-inset px-2 py-1 text-xs border border-os-dark-gray flex justify-between items-center text-os-text shrink-0">
        <span className="truncate">{isLoading ? `Opening page ${url}...` : "Done"}</span>
        <span className="border-l border-os-dark-gray pl-2 flex items-center gap-1 shrink-0">
          <img src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8 0a8 8 0 100 16A8 8 0 008 0z' fill='%23000080'/%3E%3Cpath d='M8 2a6 6 0 100 12A6 6 0 008 2z' fill='%2300ffff'/%3E%3Cpath d='M2 8h12M8 2v12' stroke='%23000080' stroke-width='1'/%3E%3C/svg%3E" alt="Internet" className="w-3.5 h-3.5" style={{ imageRendering: 'pixelated' }} />
          Internet
        </span>
      </div>
    </div>
  );
};

export default InternetExplorer;