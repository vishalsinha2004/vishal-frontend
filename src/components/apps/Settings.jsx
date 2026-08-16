import React from 'react';

const Settings = ({ bgTheme, setBgTheme, accentColor, setAccentColor }) => {
  const wallpapers = [
    { id: 'space', name: 'Deep Space', icon: '🌌' },
    { id: 'matrix', name: 'Digital Matrix', icon: '💻' },
    { id: 'solid', name: 'Vantablack', icon: '⬛' }
  ];

  const colors = [
    { id: '#4FC3F7', name: 'SpaceX Blue' },
    { id: '#4ade80', name: 'Matrix Green' },
    { id: '#c084fc', name: 'Nebula Purple' },
    { id: '#f87171', name: 'Alert Red' }
  ];

  return (
    <div className="flex flex-col h-full bg-[#121212] text-space-white rounded p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span>⚙️</span> System Preferences
      </h2>

      {/* Wallpaper Section */}
      <div className="mb-8">
        <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-3 font-mono">Desktop Environment</h3>
        <div className="grid grid-cols-3 gap-4">
          {wallpapers.map((wp) => (
            <button
              key={wp.id}
              onClick={() => setBgTheme(wp.id)}
              className={`p-4 rounded border flex flex-col items-center gap-2 transition-all ${
                bgTheme === wp.id 
                  ? 'border-thruster-glow bg-[#1a1a1a] shadow-[0_0_10px_rgba(0,0,0,0.5)]' 
                  : 'border-space-gray hover:bg-space-gray'
              }`}
            >
              <span className="text-3xl">{wp.icon}</span>
              <span className="text-xs">{wp.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accent Color Section */}
      <div>
        <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-3 font-mono">Accent Color</h3>
        <div className="flex gap-4">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => setAccentColor(color.id)}
              className="group relative flex flex-col items-center gap-2"
            >
              <div 
                className={`w-10 h-10 rounded-full border-2 transition-transform ${accentColor === color.id ? 'scale-110 border-white' : 'border-transparent'}`}
                style={{ backgroundColor: color.id }}
              ></div>
              <span className="text-[10px] text-gray-500 group-hover:text-gray-300 absolute -bottom-5 w-20 text-center">
                {color.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;