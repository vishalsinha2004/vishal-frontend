import React, { useState, useEffect } from 'react';

const Taskbar = ({ openApps = [], onCloseApp, onOpenApp, toggleStartMenu }) => {
  // 1. Dynamic Time & Date State
  const [time, setTime] = useState(new Date());
  
  // 2. Dynamic Network State
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // 3. Dynamic Battery State (Using Web Battery API if supported)
  const [battery, setBattery] = useState({ level: 1, charging: false, supported: false });
  
  // 4. Mock Volume State (Since browsers can't directly read system volume easily)
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

    // Cleanup listeners on unmount
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
    <div className="absolute bottom-0 w-full h-14 bg-space-dark border-t border-space-gray flex items-center px-4 backdrop-blur-md bg-opacity-80 z-50 select-none">
      
     {/* OS Start Button: Tactical Cyber-Core (Ultra-Minimal Animation) */}
      <button 
        onClick={toggleStartMenu}
        className="h-10 w-10 rounded-xl bg-[#0a0a0a] border-2 border-thruster-blue hover:border-thruster-glow hover:bg-thruster-blue/10 transition-all duration-300 flex justify-center items-center shadow-[0_0_15px_rgba(79,195,247,0.3)] hover:shadow-[0_0_25px_rgba(79,195,247,0.6)] mr-3 text-thruster-blue hover:text-thruster-glow group"
        title="Tactical OS Core"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:scale-105 transition-transform duration-300 ease-out">
          {/* Top Layer - Only fills with color, ZERO movement */}
          <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" className="opacity-20 group-hover:opacity-100 transition-all duration-300 ease-out"></path>
          
          {/* Middle Layer - ZERO movement */}
          <path d="M2 12l10 5 10-5"></path>
          
          {/* Bottom Layer - Shifts down by exactly 1 pixel for a subtle tactile feel */}
          <path d="M2 17l10 5 10-5" className="group-hover:translate-y-[1px] transition-all duration-300 ease-out"></path>
        </svg>
      </button>

      {/* Quick Launch: File Explorer (Filing Cabinet) */}
      <button 
        onClick={() => onOpenApp('file-explorer')}
        className="h-10 w-10 rounded-lg bg-[#1a1a1a] hover:bg-space-gray border border-gray-700 hover:border-blue-400 transition-all duration-300 flex justify-center items-center text-blue-400 mr-2 shadow-sm"
        title="File Explorer"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
          <line x1="4" y1="12" x2="20" y2="12"></line>
          <line x1="10" y1="7" x2="14" y2="7"></line>
          <line x1="10" y1="17" x2="14" y2="17"></line>
        </svg>
      </button>

      {/* Quick Launch: Terminal */}
      <button 
        onClick={() => console.log("Terminal Quick Launch Clicked - Awaiting Custom Implementation")}
        className="h-10 w-10 rounded-lg bg-[#1a1a1a] hover:bg-space-gray border border-gray-700 hover:border-green-400 transition-all duration-300 flex justify-center items-center text-green-400 mr-2 shadow-sm"
        title="Terminal"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <polyline points="4 17 10 11 4 5"></polyline>
          <line x1="12" y1="19" x2="20" y2="19"></line>
        </svg>
      </button>

      {/* Quick Launch: Settings */}
      <button 
        onClick={() => onOpenApp('settings')}
        className="h-10 w-10 rounded-lg bg-[#1a1a1a] hover:bg-space-gray border border-gray-700 hover:border-gray-300 transition-all duration-300 flex justify-center items-center text-gray-400 hover:text-white mr-4 shadow-sm"
        title="System Preferences"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <line x1="4" y1="21" x2="4" y2="14"></line>
          <line x1="4" y1="10" x2="4" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="3"></line>
          <line x1="20" y1="21" x2="20" y2="16"></line>
          <line x1="20" y1="12" x2="20" y2="3"></line>
          <line x1="1" y1="14" x2="7" y2="14"></line>
          <line x1="9" y1="8" x2="15" y2="8"></line>
          <line x1="17" y1="16" x2="23" y2="16"></line>
        </svg>
      </button>

      {/* Open Apps Area (Running Apps) */}
      <div className="flex-1 flex items-center space-x-2 overflow-x-auto custom-scrollbar">
        {openApps.map((app) => (
          <div 
            key={app.id} 
            className="group flex items-center space-x-2 px-3 py-1.5 rounded border border-gray-600 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] bg-space-gray border-b-thruster-glow border-b-2 transition-all cursor-default"
          >
            <img src={app.icon} alt={app.name} className="w-4 h-4 object-contain" />
            <span className="text-xs font-sans text-space-white truncate max-w-[120px]">{app.name}</span>
            
            {/* Close Button on Taskbar Tab */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseApp(app.id);
              }}
              className="ml-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity w-5 h-5 flex items-center justify-center rounded"
              title="Close App"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Dynamic System Tray (Right Side) */}
      <div className="flex items-center space-x-4 text-gray-300 ml-4 shrink-0">
        
        {/* Dynamic Battery Icon */}
        {battery.supported && (
          <div className="flex items-center space-x-1" title={`Battery: ${Math.round(battery.level * 100)}% ${battery.charging ? '(Charging)' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect>
              <line x1="22" y1="11" x2="22" y2="13"></line>
              {/* Battery Level Fill */}
              {battery.level > 0.1 && <rect x="4" y="9" width={12 * battery.level} height="6" fill="currentColor" stroke="none"></rect>}
              {/* Charging Bolt Overlay */}
              {battery.charging && <polygon points="11 6 7 12 10 12 9 18 13 12 10 12 11 6" fill="#4FC3F7" stroke="none"></polygon>}
            </svg>
            <span className="text-[10px] font-mono">{Math.round(battery.level * 100)}%</span>
          </div>
        )}

        {/* Dynamic Network / Wi-Fi Icon */}
        <div className="flex items-center" title={isOnline ? "Network Connected" : "No Internet Connection"}>
          {isOnline ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-300">
              <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
              <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
              <line x1="12" y1="20" x2="12.01" y2="20"></line>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-red-500">
              <line x1="2" y1="2" x2="22" y2="22"></line>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
              <line x1="12" y1="20" x2="12.01" y2="20"></line>
            </svg>
          )}
        </div>

        {/* Volume Toggle Icon */}
        <button onClick={toggleMute} className="flex items-center hover:text-white transition-colors focus:outline-none" title={`Volume: ${volume}%`}>
          {volume > 0 ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-500">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          )}
        </button>

        {/* Dynamic Clock and Date */}
        <div className="flex flex-col items-end justify-center font-sans text-xs tracking-wide border-l border-gray-600 pl-4 py-1">
          <span className="text-space-white font-medium">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-[10px] text-gray-400 mt-0.5">
            {time.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Taskbar;