import React, { useState, useEffect } from 'react';
import { useSound } from '../hooks/useSound';

const startLogo = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M0 2h7v6H0z' fill='%23ff0000'/%3E%3Cpath d='M9 2h7v6H9z' fill='%2300ff00'/%3E%3Cpath d='M0 9h7v6H0z' fill='%230000ff'/%3E%3Cpath d='M9 9h7v6H9z' fill='%23ffff00'/%3E%3C/svg%3E";

const Taskbar = ({ openApps = [], activeWindowId, onCloseApp, onOpenApp, onMinimizeApp, toggleStartMenu, isStartMenuOpen }) => {
  const [time, setTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [battery, setBattery] = useState({ level: 1, charging: false, supported: false });
  const [volume, setVolume] = useState(100);
  
  const { playSound } = useSound();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if ('getBattery' in navigator) {
      navigator.getBattery().then((batt) => {
        const updateBattery = () => {
          setBattery({ level: batt.level, charging: batt.charging, supported: true });
        };
        updateBattery();
        batt.addEventListener('levelchange', updateBattery);
        batt.addEventListener('chargingchange', updateBattery);
      });
    }

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleMute = () => {
    setVolume(volume === 0 ? 100 : 0);
  };

  const handleStartClick = (e) => { // <-- Add (e) here
    playSound('menu-open');
    toggleStartMenu(e);             // <-- Pass (e) here
 
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-[30px] bg-os-gray border-t border-os-white shadow-[0_-1px_0_#dfdfdf] flex items-center px-1 z-[9999] select-none font-sans">
      
      <button 
        onClick={handleStartClick}
        className={`flex items-center gap-1.5 h-[22px] px-1.5 font-bold text-xs text-os-text outline-none focus:outline-none focus:ring-1 focus:ring-black focus:ring-offset-0 shrink-0
          ${isStartMenuOpen ? 'shadow-retro-inset pt-[2px] pl-[6px] pr-1 pb-0 bg-os-gray' : 'shadow-retro-outset bg-os-gray active:shadow-retro-inset active:pt-[2px] active:pl-[6px] active:pr-1 active:pb-0'}`}
        title="Click here to begin"
      >
        <img src={startLogo} alt="Start" className="w-[14px] h-[14px] opacity-90" style={{ imageRendering: 'pixelated' }} />
        <span className="mb-[1px]">Start</span>
      </button>

      <div className="w-[2px] h-[22px] bg-os-gray border-l border-os-dark-gray border-r border-os-white mx-1.5 shrink-0"></div>

      {/* --- RUNNING APPLICATIONS AREA --- */}
      {/* Added touch-pan-x and specific scrollbar hiding for smooth mobile swiping */}
      <div className="flex-1 flex items-center space-x-1 overflow-x-auto h-[22px] no-scrollbar px-1 touch-pan-x">
        {openApps.map((app) => {
          const isActive = activeWindowId === app.id && !app.isMinimized;
          
          return (
            <button 
              key={app.id} 
              onClick={() => {
                playSound('button');
                if (isActive) {
                  onMinimizeApp(app.id); 
                } else {
                  onOpenApp(app.id);
                }
              }}
              className={`flex items-center gap-1.5 h-full min-w-[100px] sm:min-w-[120px] max-w-[160px] text-os-text text-xs font-bold outline-none border border-transparent transition-none shrink-0
                ${isActive 
                  ? 'shadow-retro-inset pt-[2px] pl-[6px] pr-1 pb-0 bg-os-gray/90' 
                  : 'shadow-retro-outset px-1.5 bg-os-gray hover:bg-os-gray active:shadow-retro-inset active:pt-[2px] active:pl-[6px] active:pr-1 active:pb-0' 
                }`}
            >
              <img src={app.icon} alt={app.name} className="w-3.5 h-3.5 object-contain" style={{ imageRendering: 'pixelated' }} />
              <span className="truncate flex-1 text-left mb-[1px]">{app.name}</span>
            </button>
          );
        })}
      </div>

      <div className="w-[2px] h-[22px] bg-os-gray border-l border-os-dark-gray border-r border-os-white mx-1.5 shrink-0 hidden sm:block"></div>

      <div className="shadow-retro-inset bg-os-gray h-[22px] px-2 flex items-center gap-2 sm:gap-3 shrink-0 border border-transparent">
        
        {battery.supported && (
          <div className="flex items-center" title={`Battery: ${Math.round(battery.level * 100)}% ${battery.charging ? '(Charging)' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" className="w-3.5 h-3.5">
              <rect x="2" y="7" width="16" height="10" rx="1" ry="1"></rect>
              <line x1="21" y1="10" x2="21" y2="14"></line>
              {battery.level > 0.1 && <rect x="4" y="9" width={12 * battery.level} height="6" fill={battery.charging ? "#008000" : "#000"} stroke="none"></rect>}
            </svg>
          </div>
        )}

        <div className="flex items-center cursor-help" title={isOnline ? "Network Connected" : "No Internet Connection"}>
          {isOnline ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="square" className="w-3.5 h-3.5">
              <rect x="14" y="14" width="6" height="6" fill="#000"></rect>
              <rect x="4" y="4" width="6" height="6" fill="#000"></rect>
              <polyline points="10 7 17 7 17 14"></polyline>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="#808080" strokeWidth="2" strokeLinecap="square" className="w-3.5 h-3.5">
              <line x1="2" y1="2" x2="22" y2="22"></line>
              <rect x="14" y="14" width="6" height="6"></rect>
              <rect x="4" y="4" width="6" height="6"></rect>
            </svg>
          )}
        </div>

        <button onClick={toggleMute} className="flex items-center focus:outline-none" title={`Volume: ${volume}%`}>
          {volume > 0 ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="w-3.5 h-3.5">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#000"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="#808080" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="w-3.5 h-3.5">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#808080"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          )}
        </button>

        {/* Hidden on extra small mobile screens to save space */}
        <div className="hidden sm:block font-sans text-xs text-os-text tracking-wide cursor-default" title={time.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}>
          {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default Taskbar;