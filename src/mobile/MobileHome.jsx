import React, { useState } from 'react';

const MobileHome = ({ systemApps, onOpenApp, playSound }) => {
  const [touchedId, setTouchedId] = useState(null);

  const handleOpen = (appId) => {
    playSound('click');
    onOpenApp(appId);
  };

  return (
    <div className="flex-1 w-full p-4 overflow-y-auto content-start grid grid-cols-3 sm:grid-cols-4 gap-y-6 gap-x-2">
      {systemApps.map((app) => (
        <div
          key={app.id}
          className="flex flex-col items-center justify-start p-1 cursor-pointer select-none"
          onTouchStart={() => setTouchedId(app.id)}
          onTouchEnd={() => setTouchedId(null)}
          onTouchCancel={() => setTouchedId(null)}
          onClick={() => handleOpen(app.id)}
          onContextMenu={(e) => e.preventDefault()} // <-- PREVENTS NATIVE MOBILE BROWSER POPUPS ON LONG-PRESS
          title={app.name}
        >
          <div className="w-10 h-10 mb-1 relative flex items-center justify-center">
            {touchedId === app.id && (
              <div className="absolute inset-0 bg-os-navy opacity-40 mix-blend-multiply pointer-events-none"></div>
            )}
            <img
              src={app.icon}
              alt={`${app.name} icon`}
              className="w-8 h-8 object-contain pointer-events-none"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          <span
            className={`text-[11px] font-sans px-1 text-center leading-tight line-clamp-2 shadow-sm
            ${touchedId === app.id
                ? 'bg-os-navy text-white border border-dotted border-white'
                : 'text-os-white border border-transparent'
              }`}
          >
            {app.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MobileHome;