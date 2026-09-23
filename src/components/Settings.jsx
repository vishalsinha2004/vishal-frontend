import React, { useState, useEffect } from 'react';
import { useSound } from '../hooks/useSound';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const THEME_COLORS = [
  { name: 'Windows Teal', value: '#008080' },
  { name: 'Navy Blue', value: '#000080' },
  { name: 'Forest Green', value: '#004000' },
  { name: 'Slate Gray', value: '#808080' },
  { name: 'Midnight Black', value: '#000000' },
  { name: 'Royal Purple', value: '#800080' }
];

const Settings = ({ bgTheme, setBgTheme, isCrtMode, setIsCrtMode }) => {
  const [activeTab, setActiveTab] = useState('Display');
  const [sysInfo, setSysInfo] = useState(null);
  const [sysLoading, setSysLoading] = useState(false);
  const [sysError, setSysError] = useState(null);
  const { playSound } = useSound();

  const tabs = ['Display', 'System', 'Sound'];

  // Fetch system info when System tab is active
  useEffect(() => {
    if (activeTab === 'System' && !sysInfo) {
      setSysLoading(true);
      fetch(`${API_BASE_URL}/system-os/`)
        .then((res) => {
          if (!res.ok) throw new Error('API Endpoint not found');
          return res.json();
        })
        .then((data) => {
          setSysInfo(Array.isArray(data) ? data[0] : data);
          setSysLoading(false);
        })
        .catch((err) => {
          console.error("System OS API Error:", err);
          setSysError(err.message);
          setSysLoading(false);
        });
    }
  }, [activeTab, sysInfo]);

  return (
    <div className="flex flex-col h-full bg-os-gray font-sans p-2 select-none overflow-hidden">
      {/* Settings Tabs */}
      <div className="flex gap-1 mb-2 border-b border-os-white relative top-[1px] shrink-0">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => { playSound('click'); setActiveTab(tab); }}
            className={`px-3 py-1 text-xs font-bold rounded-t-sm border border-os-dark-gray border-b-0 outline-none
              ${activeTab === tab 
                ? 'bg-os-gray shadow-retro-outset z-10 translate-y-[1px]' 
                : 'bg-os-gray shadow-retro-outset mt-[2px]'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content Panel */}
      <div className="flex-1 bg-os-gray shadow-retro-outset border border-os-dark-gray p-4 overflow-y-auto custom-scrollbar">
        
        {/* --- DISPLAY TAB --- */}
        {activeTab === 'Display' && (
          <div className="flex flex-col gap-6">
            <fieldset className="border border-os-dark-gray p-3 shadow-retro-outset">
              <legend className="text-xs font-bold px-1">Appearance & Colors</legend>
              <div className="flex items-start gap-4 mt-2">
                {/* Preview Monitor */}
                <div className="w-24 h-20 bg-os-gray border-2 border-os-white shadow-retro-outset p-1 flex flex-col items-center justify-center relative">
                   <div className="w-full flex-1 border border-black shadow-retro-inset relative overflow-hidden" style={{ backgroundColor: bgTheme }}>
                      {/* Fake inner window */}
                      <div className="absolute top-2 left-2 w-12 h-10 bg-os-gray border border-black shadow-retro-outset flex flex-col">
                         <div className="h-2 bg-blue-900 w-full"></div>
                      </div>
                   </div>
                   <div className="w-8 h-2 bg-os-white mt-1 border border-os-dark-gray"></div>
                </div>
                
                {/* Color Selection */}
                <div className="flex-1">
                  <p className="text-xs mb-2">Desktop Background:</p>
                  <div className="flex flex-wrap gap-2">
                    {THEME_COLORS.map(theme => (
                      <div 
                        key={theme.name}
                        onClick={() => { playSound('click'); setBgTheme(theme.value); }}
                        className={`w-6 h-6 cursor-pointer shadow-retro-inset border-2 ${bgTheme === theme.value ? 'border-black ring-1 ring-dotted ring-black' : 'border-transparent'}`}
                        style={{ backgroundColor: theme.value }}
                        title={theme.name}
                      ></div>
                    ))}
                  </div>
                  <div className="mt-3 text-[11px] text-os-dark-gray">
                    Selected: {THEME_COLORS.find(t => t.value === bgTheme)?.name || 'Custom'}
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset className="border border-os-dark-gray p-3 shadow-retro-outset">
              <legend className="text-xs font-bold px-1">Screen Effects</legend>
              <label className="flex items-center gap-2 text-xs mt-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isCrtMode} 
                  onChange={(e) => { playSound('click'); setIsCrtMode(e.target.checked); }}
                  className="w-3 h-3 shadow-retro-inset focus:ring-1 focus:ring-black outline-none cursor-pointer"
                />
                Enable CRT Scanlines & Flicker
              </label>
              <p className="text-[10px] text-os-dark-gray mt-2 ml-5">
                * Flicker effects respect OS-level reduced motion preferences.
              </p>
            </fieldset>
          </div>
        )}

        {/* --- SYSTEM TAB --- */}
        {activeTab === 'System' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 border-b border-os-dark-gray pb-4">
              <img src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='4' y='4' width='24' height='24' fill='%23c0c0c0' stroke='%23000' stroke-width='2'/%3E%3Crect x='8' y='8' width='16' height='12' fill='%23000080' stroke='%23000' stroke-width='2'/%3E%3Crect x='6' y='22' width='20' height='4' fill='%23808080'/%3E%3C/svg%3E" alt="Computer" className="w-12 h-12" />
              <div>
                <h3 className="font-bold text-sm">System Properties</h3>
                <p className="text-xs text-os-dark-gray">Vishal OS 98 System Information</p>
              </div>
            </div>

            {sysLoading ? (
               <div className="text-xs font-mono">Loading System Information...</div>
            ) : sysError || !sysInfo ? (
               <div className="text-xs text-red-600 bg-white p-2 border border-os-dark-gray shadow-retro-inset">
                 Cannot connect to the local server to retrieve properties.
               </div>
            ) : (
              <div className="bg-white p-2 shadow-retro-inset border border-os-dark-gray grid grid-cols-1 gap-2">
                {Object.entries(sysInfo).map(([key, value]) => {
                  const hiddenKeys = ['id', 'icon', 'image', 'created_at', 'updated_at'];
                  if (hiddenKeys.includes(key.toLowerCase())) return null; 
                  return (
                    <div key={key} className="flex gap-2 items-start text-xs">
                      <span className="font-bold min-w-[120px] whitespace-nowrap">{key.replace(/_/g, ' ')}:</span>
                      <span className="font-sans whitespace-pre-wrap">{value}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- SOUND TAB --- */}
        {activeTab === 'Sound' && (
          <fieldset className="border border-os-dark-gray p-3 shadow-retro-outset">
            <legend className="text-xs font-bold px-1">Audio Properties</legend>
            <div className="flex items-center gap-4 mt-2">
               <div className="text-4xl">🔊</div>
               <div>
                  <p className="text-xs mb-1 font-bold">System Sounds</p>
                  <p className="text-[11px] text-os-dark-gray mb-3">Sound is managed globally via the system tray.</p>
                  <button className="retro-btn px-4 py-1 text-xs" onClick={() => playSound('startup')}>Test Audio Device</button>
               </div>
            </div>
          </fieldset>
        )}

      </div>
    </div>
  );
};

export default Settings;