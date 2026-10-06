import React from 'react';
import { useSound } from '../hooks/useSound';

const MobileSettings = ({ bgTheme, setBgTheme, isCrtMode, setIsCrtMode }) => {
  const { playSound } = useSound();

  const presetColors = [
    { name: 'Teal', hex: '#008080' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Black', hex: '#000000' },
    { name: 'Gray', hex: '#c0c0c0' },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full h-full bg-os-gray text-black font-sans p-2 overflow-y-auto custom-scrollbar">
      
      {/* Display Properties Section */}
      <div className="bg-white shadow-retro-inset border border-os-dark-gray p-3 mb-3 shrink-0">
        <h3 className="font-bold text-sm mb-2 border-b border-os-gray pb-1">Display Properties</h3>
        <p className="text-xs text-os-dark-gray mb-3">Select a background color for your mobile desktop.</p>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          {presetColors.map(color => (
            <button
              key={color.hex}
              onClick={() => { playSound('click'); setBgTheme(color.hex); }}
              className={`flex items-center gap-2 border bg-os-gray p-1 shadow-retro-outset active:shadow-retro-inset ${bgTheme === color.hex ? 'outline-dotted outline-1 outline-black outline-offset-[-3px]' : ''}`}
            >
              <div className="w-5 h-5 border border-os-dark-gray shadow-retro-inset shrink-0" style={{ backgroundColor: color.hex }}></div>
              <span className="text-xs font-bold truncate">{color.name}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-2 bg-os-gray p-2 shadow-retro-outset">
          <span className="text-xs font-bold shrink-0">Custom Hex:</span>
          <input 
            type="text" 
            value={bgTheme}
            onChange={(e) => setBgTheme(e.target.value)}
            className="shadow-retro-inset bg-white border border-os-dark-gray px-1 py-1 text-xs flex-1 min-w-0 outline-none uppercase font-mono"
            maxLength={7}
          />
        </div>
      </div>

      {/* Visual Effects Section */}
      <div className="bg-white shadow-retro-inset border border-os-dark-gray p-3 mb-3 shrink-0">
        <h3 className="font-bold text-sm mb-2 border-b border-os-gray pb-1">Visual Effects</h3>
        <p className="text-xs text-os-dark-gray mb-3">Toggle authentic 90s CRT monitor effects.</p>
        
        <div className="bg-os-gray p-2 shadow-retro-outset">
          <label className="flex items-start gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isCrtMode}
              onChange={(e) => { playSound('click'); setIsCrtMode(e.target.checked); }}
              className="w-4 h-4 mt-0.5 shadow-retro-inset cursor-pointer shrink-0"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold leading-tight">Enable CRT Mode</span>
              <span className="text-[10px] text-os-dark-gray mt-0.5">Applies scanlines and screen curvature.</span>
            </div>
          </label>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white shadow-retro-inset border border-os-dark-gray p-3 mb-1 shrink-0">
        <h3 className="font-bold text-sm mb-2 border-b border-os-gray pb-1">System</h3>
        <p className="text-xs text-os-dark-gray mb-2">Vishal OS 98 Mobile Edition</p>
        <p className="text-[10px] text-os-dark-gray">User: guest</p>
      </div>

    </div>
  );
};

export default MobileSettings;