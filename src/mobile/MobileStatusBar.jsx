import React, { useState, useEffect } from 'react';
import { useSound } from '../hooks/useSound';
import { volumeIcon, muteIcon } from '../utils/icons';

const MobileStatusBar = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { playSound, isMuted, toggleMute } = useSound();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="h-6 bg-os-gray border-b border-os-dark-gray shadow-[0_1px_0_#ffffff] flex items-center justify-between px-1 text-[11px] font-dialog text-black select-none shrink-0 w-full z-50">
      
      {/* OS Branding / Carrier Space */}
      <div className="flex items-center gap-1 font-bold pl-1 text-os-navy truncate">
        VISHAL OS 98
      </div>
      
      {/* System Status Indicators */}
      <div className="flex items-center h-full py-[2px] gap-1 shrink-0">
        
        {/* Network Indicator */}
        <div className="h-full px-1 flex items-center shadow-retro-inset bg-os-gray" title={isOnline ? 'Online' : 'Offline'}>
          <span className="text-[10px] leading-none mt-[1px]">{isOnline ? 'ONL' : 'OFF'}</span>
        </div>
        
        {/* Sound Toggle */}
        <button 
          onClick={() => { playSound('click'); toggleMute(); }}
          className="h-full px-1.5 flex items-center shadow-retro-inset bg-os-gray active:pt-[1px]"
          title="Volume"
        >
          <img src={isMuted ? muteIcon : volumeIcon} alt="Volume" className="w-3 h-3 object-contain" style={{ imageRendering: 'pixelated' }} />
        </button>
        
        {/* Clock */}
        <div className="h-full px-2 flex items-center shadow-retro-inset bg-os-gray">
          <span className="mt-[1px]">{time}</span>
        </div>
        
      </div>
    </div>
  );
};

export default MobileStatusBar;