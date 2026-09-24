import React, { useState, useEffect } from 'react';
import { useSound } from '../hooks/useSound';
import { volumeIcon, muteIcon } from '../utils/icons';

const Taskbar = ({
  openApps, activeWindowId, onCloseApp, onOpenApp,
  onMinimizeApp, onFocusApp, isStartMenuOpen, toggleStartMenu
}) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const { playSound, isMuted, toggleMute, volume, changeVolume } = useSound();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-8 bg-os-gray border-t border-white shadow-[0_-1px_0_#dfdfdf] flex items-center px-1 gap-1 z-[9999] shrink-0 font-sans select-none w-full relative">
      
      {/* Start Button */}
      <button
        onClick={(e) => {
          if (e && e.stopPropagation) e.stopPropagation();
          if (!isStartMenuOpen) playSound('click');
          toggleStartMenu(e);
        }}
        className={`flex items-center gap-1 px-2 h-[22px] font-bold text-black border focus:outline-none
          ${isStartMenuOpen ? 'bg-[#d0d0d0] shadow-retro-inset outline-dotted outline-1 outline-black outline-offset-[-3px]' : 'bg-os-gray shadow-retro-outset active:shadow-retro-inset hover:bg-[#e0e0e0]'}`}
      >
        <span className="text-blue-900 italic">VISHAL</span>
      </button>

      {/* Divider */}
      <div className="w-[2px] h-5 border-l border-os-dark-gray border-r border-white mx-1"></div>

      {/* Window Buttons */}
      <div className="flex flex-1 gap-1 overflow-x-auto custom-scrollbar items-center h-full">
        {openApps.map(app => {
          const isAppActive = activeWindowId === app.id && !app.isMinimized;
          return (
            <button
              key={app.id}
              onClick={() => {
                playSound('click');
                isAppActive ? onMinimizeApp(app.id) : onFocusApp(app.id);
              }}
              className={`flex items-center gap-1 px-1 min-w-[100px] max-w-[150px] h-[22px] truncate text-xs font-dialog border
                ${isAppActive 
                   ? 'shadow-retro-inset bg-os-gray font-bold outline outline-1 outline-dotted outline-black outline-offset-[-3px]' 
                   : 'shadow-retro-outset bg-os-gray hover:bg-[#d0d0d0]'}`}
            >
              <img src={app.icon} alt="" className="w-3.5 h-3.5 object-contain shrink-0" style={{ imageRendering: 'pixelated' }} />
              <span className="truncate">{app.name}</span>
            </button>
          )
        })}
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-2 px-2 h-[22px] shadow-retro-inset border border-os-dark-gray bg-os-gray relative">
        <button 
          onClick={() => { playSound('click'); setShowVolumeSlider(!showVolumeSlider); }}
          onDoubleClick={toggleMute}
          className="w-4 h-4 outline-none focus:outline-dotted focus:outline-1 focus:outline-black"
          title="Volume"
        >
          <img src={isMuted ? muteIcon : volumeIcon} alt="Volume" className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }} />
        </button>

        {/* Volume Slider Popup */}
        {showVolumeSlider && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowVolumeSlider(false)}></div>
            <div className="absolute bottom-[24px] right-0 w-28 bg-os-gray shadow-retro-outset border border-os-white p-2 z-50 flex flex-col items-center gap-3">
              <div className="w-full bg-[#000080] text-white font-dialog font-bold px-1 text-xs mb-1 text-center">Volume</div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05" 
                value={isMuted ? 0 : volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                onMouseUp={() => playSound('click')}
                className="w-full cursor-pointer"
                style={{ accentColor: '#008080' }}
              />
              <div className="flex items-center gap-1 w-full justify-start border-t border-os-dark-gray pt-2">
                <input type="checkbox" id="mute-check" checked={isMuted} onChange={toggleMute} className="cursor-pointer" />
                <label htmlFor="mute-check" className="text-xs cursor-pointer select-none">Mute</label>
              </div>
            </div>
          </>
        )}

        <span className="text-xs font-dialog">{time}</span>
      </div>
    </div>
  );
};

export default Taskbar;