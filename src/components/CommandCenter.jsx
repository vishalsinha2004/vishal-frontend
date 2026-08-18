import React from 'react';

const CommandCenter = ({ systemApps, onOpenApp, onClose }) => {
  return (
    <div className="w-full bg-[#121212] bg-opacity-95 backdrop-blur-2xl border border-space-gray rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden p-6 animate-fade-in-up">
      
      {/* Header: Pinned */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-space-white font-bold text-sm tracking-wide">Pinned</h3>
        <button 
          onClick={onClose} 
          className="text-xs font-bold text-gray-400 hover:text-thruster-glow flex items-center gap-1 transition-colors px-2 py-1 rounded bg-[#1a1a1a] border border-gray-700 hover:border-thruster-glow"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Dock View
        </button>
      </div>

      {/* Grid: Pinned Apps */}
      <div className="grid grid-cols-6 gap-y-6 gap-x-2 mb-8">
        {systemApps.filter(app => app.id !== 'settings').map(app => (
          <button 
            key={app.id}
            onClick={() => onOpenApp(app.id)}
            className="flex flex-col items-center gap-2 group hover:bg-[#1a1a1a] p-2 rounded-xl transition-colors focus:outline-none"
          >
            <img src={app.icon} alt={app.name} className="w-8 h-8 object-contain transition-transform duration-200 group-hover:-translate-y-1 drop-shadow-lg" />
            <span className="text-[11px] text-gray-300 font-sans text-center truncate w-full group-hover:text-white">{app.name}</span>
          </button>
        ))}

        {/* Hardcoded Settings in Grid */}
        <button onClick={() => onOpenApp('settings')} className="flex flex-col items-center gap-2 group hover:bg-[#1a1a1a] p-2 rounded-xl transition-colors focus:outline-none">
          <div className="w-8 h-8 flex items-center justify-center bg-[#1a1a1a] border border-gray-700 rounded-lg drop-shadow-lg text-gray-400 transition-transform duration-200 group-hover:-translate-y-1 group-hover:border-white group-hover:text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          </div>
          <span className="text-[11px] text-gray-300 font-sans text-center truncate w-full group-hover:text-white">Settings</span>
        </button>

        {/* Hardcoded Terminal in Grid */}
        <button onClick={() => onOpenApp('terminal')} className="flex flex-col items-center gap-2 group hover:bg-[#1a1a1a] p-2 rounded-xl transition-colors focus:outline-none">
          <div className="w-8 h-8 flex items-center justify-center bg-[#1a1a1a] border border-gray-700 rounded-lg drop-shadow-lg text-thruster-glow transition-transform duration-200 group-hover:-translate-y-1 group-hover:border-thruster-glow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
          </div>
          <span className="text-[11px] text-gray-300 font-sans text-center truncate w-full group-hover:text-white">Terminal</span>
        </button>
      </div>

      {/* Header: All Categories */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-space-white font-bold text-sm tracking-wide">Categories</h3>
      </div>

      {/* Grid: Category Folders */}
      <div className="grid grid-cols-3 gap-5">
        {/* Category 1: Productivity */}
        <div className="flex flex-col items-center gap-3">
          <button className="w-full aspect-video bg-[#1a1a1a] rounded-xl p-3 border border-gray-800 hover:border-gray-500 transition-colors shadow-inner grid grid-cols-2 grid-rows-2 gap-2 place-items-center group">
            <div className="w-6 h-6 bg-blue-500 rounded-md opacity-80 group-hover:opacity-100 flex items-center justify-center"><span className="text-[10px]">🌐</span></div>
            <div className="w-6 h-6 bg-yellow-500 rounded-md opacity-80 group-hover:opacity-100 flex items-center justify-center"><span className="text-[10px]">📁</span></div>
            <div className="w-6 h-6 bg-green-500 rounded-md opacity-80 group-hover:opacity-100 flex items-center justify-center"><span className="text-[10px]">📝</span></div>
            <div className="w-6 h-6 bg-transparent"></div>
          </button>
          <span className="text-xs text-gray-400 font-sans">Productivity</span>
        </div>

        {/* Category 2: Developer Tools */}
        <div className="flex flex-col items-center gap-3">
          <button className="w-full aspect-video bg-[#1a1a1a] rounded-xl p-3 border border-gray-800 hover:border-thruster-glow transition-colors shadow-inner grid grid-cols-2 grid-rows-2 gap-2 place-items-center group">
            <div className="w-6 h-6 bg-transparent text-thruster-glow flex items-center justify-center border border-gray-600 rounded-md group-hover:border-thruster-glow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg></div>
            <div className="w-6 h-6 bg-transparent text-gray-300 flex items-center justify-center border border-gray-600 rounded-md group-hover:border-white"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></div>
            <div className="w-6 h-6 bg-purple-600 rounded-md opacity-80 group-hover:opacity-100 flex items-center justify-center"><span className="text-[10px]">⚙️</span></div>
            <div className="w-6 h-6 bg-orange-600 rounded-md opacity-80 group-hover:opacity-100 flex items-center justify-center"><span className="text-[10px]">📦</span></div>
          </button>
          <span className="text-xs text-gray-400 font-sans">Developer Tools</span>
        </div>

        {/* Category 3: Design & UI */}
        <div className="flex flex-col items-center gap-3">
          <button className="w-full aspect-video bg-[#1a1a1a] rounded-xl p-3 border border-gray-800 hover:border-gray-500 transition-colors shadow-inner grid grid-cols-2 grid-rows-2 gap-2 place-items-center group">
            <div className="w-6 h-6 bg-pink-500 rounded-md opacity-80 group-hover:opacity-100 flex items-center justify-center"><span className="text-[10px]">🎨</span></div>
            <div className="w-6 h-6 bg-cyan-500 rounded-md opacity-80 group-hover:opacity-100 flex items-center justify-center"><span className="text-[10px]">📐</span></div>
            <div className="w-6 h-6 bg-transparent"></div>
            <div className="w-6 h-6 bg-transparent"></div>
          </button>
          <span className="text-xs text-gray-400 font-sans">Design & UI</span>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;