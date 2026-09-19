import React from 'react';

const Desktop = ({ systemApps, onOpenApp }) => {
  return (
    // Classic tight padding and column-based wrap layout
    <div className="flex-1 h-full w-full p-2 flex flex-col flex-wrap gap-4 content-start z-10">
      {systemApps.map((app) => (
        <button 
          key={app.id} 
          // Note: In a true 90s OS this would be onDoubleClick, but onClick is better for web UX.
          // We style the hover state to look exactly like a 90s single-click selection.
          onClick={() => onOpenApp(app.id)}
          className="w-20 flex flex-col items-center justify-start focus:outline-none group mt-2"
          title={app.name}
        >
          {/* Classic 32x32 size icon container, absolutely NO scale or translate animations */}
          <div className="w-8 h-8 mb-1">
            <img 
              src={app.icon} 
              alt={`${app.name} icon`} 
              className="w-full h-full object-contain pointer-events-none"
              style={{ imageRendering: 'pixelated' }} // Forces a crisp, non-blurry look
            />
          </div>
          
          {/* Retro text highlight effect: navy background with a dotted border on hover */}
          <span className="text-os-white text-[11px] font-sans px-1 text-center leading-tight border border-transparent group-hover:bg-os-navy group-hover:border-os-white border-dotted line-clamp-2 shadow-sm">
            {app.name}
          </span>
        </button>
      ))}
    </div>
  );
};

export default Desktop;