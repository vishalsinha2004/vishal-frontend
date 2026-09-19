import React, { useState, useEffect } from 'react';

// A tiny, pixelated retro logo for the Start button
const startLogo = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M0 2h7v6H0z' fill='%23ff0000'/%3E%3Cpath d='M9 2h7v6H9z' fill='%2300ff00'/%3E%3Cpath d='M0 9h7v6H0z' fill='%230000ff'/%3E%3Cpath d='M9 9h7v6H9z' fill='%23ffff00'/%3E%3C/svg%3E";

const Taskbar = ({ openApps = [], onCloseApp, onOpenApp, toggleStartMenu, isStartMenuOpen }) => {
  // 1. Dynamic Time & Date State
  const [time, setTime] = useState(new Date());
  
  // 2. Dynamic Network State
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // 3. Dynamic Battery State
  const [battery, setBattery] = useState({ level: 1, charging: false, supported: false });
  
  // 4. Mock Volume State
  const [volume, setVolume] = useState(100);

  useEffect(() => {
    // --- Clock Logic ---
    const timer = setInterval(() => setTime(new Date()), 1000);

    // --- Network Logic ---
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // --- Battery Logic ---
    if ('getBattery' in navigator) {
      navigator.getBattery().then((batt) => {
        const updateBattery = () => {
          setBattery({ level: batt.level, charging: batt.charging, supported: true });
        };
        updateBattery(); // Initial call
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

  return (
    <div className="fixed bottom-0 left-0 w-full h-[30px] bg-os-gray border-t border-os-white shadow-[0_-1px_0_#dfdfdf] flex items-center px-1 z-[9999] select-none font-sans">
      
      {/* --- CLASSIC START BUTTON --- */}
      <button 
        onClick={toggleStartMenu}
        className={`flex items-center gap-1.5 h-[22px] px-1.5 font-bold text-xs text-os-text outline-none focus:outline-none focus:ring-1 focus:ring-black focus:ring-offset-0 
          ${isStartMenuOpen ? 'shadow-retro-inset pt-[2px] pl-[6px] pr-1 pb-0 bg-os-gray' : 'shadow-retro-outset bg-os-gray active:shadow-retro-inset active:pt-[2px] active:pl-[6px] active:pr-1 active:pb-0'}`}
        title="Click here to begin"
      >
        <img src={startLogo} alt="Start" className="w-[14px] h-[14px] opacity-90" style={{ imageRendering: 'pixelated' }} />
        <span className="mb-[1px]">Start</span>
      </button>

      {/* Vertical Separator Ridge */}
      <div className="w-[2px] h-[22px] bg-os-gray border-l border-os-dark-gray border-r border-os-white mx-1.5"></div>

      {/* --- RUNNING APPLICATIONS AREA --- */}
      <div className="flex-1 flex items-center space-x-1 overflow-x-auto h-[22px] no-scrollbar">
        {openApps.map((app) => (
          <button 
            key={app.id} 
            // In a real OS this toggles minimize/restore. For now, it represents the active window.
            className="flex items-center gap-1.5 h-full min-w-[120px] max-w-[160px] px-1.5 shadow-retro-inset bg-os-gray text-os-text text-xs font-bold outline-none border border-transparent"
          >
            <img src={app.icon} alt={app.name} className="w-3.5 h-3.5 object-contain" style={{ imageRendering: 'pixelated' }} />
            <span className="truncate flex-1 text-left">{app.name}</span>
          </button>
        ))}
      </div>

      {/* Vertical Separator Ridge */}
      <div className="w-[2px] h-[22px] bg-os-gray border-l border-os-dark-gray border-r border-os-white mx-1.5 shrink-0"></div>

      {/* --- SYSTEM TRAY --- */}
      <div className="shadow-retro-inset bg-os-gray h-[22px] px-2 flex items-center gap-3 shrink-0 border border-transparent">
        
        {/* Dynamic Battery Icon */}
        {battery.supported && (
          <div className="flex items-center" title={`Battery: ${Math.round(battery.level * 100)}% ${battery.charging ? '(Charging)' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" className="w-3.5 h-3.5">
              <rect x="2" y="7" width="16" height="10" rx="1" ry="1"></rect>
              <line x1="21" y1="10" x2="21" y2="14"></line>
              {battery.level > 0.1 && <rect x="4" y="9" width={12 * battery.level} height="6" fill={battery.charging ? "#008000" : "#000"} stroke="none"></rect>}
            </svg>
          </div>
        )}

        {/* Dynamic Network / Wi-Fi Icon */}
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

        {/* Volume Toggle Icon */}
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

        {/* Dynamic Clock */}
        <div className="font-sans text-xs text-os-text tracking-wide cursor-default" title={time.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}>
          {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        </div>
      </div>

    </div>
  );
};

export default Taskbar;