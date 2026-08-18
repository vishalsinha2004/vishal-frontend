import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Desktop = ({ systemApps, onOpenApp }) => {
  const desktopRef = useRef(null);

  useEffect(() => {
    // GSAP staggered animation for icons loading in
    if (desktopRef.current) {
      gsap.fromTo(
        desktopRef.current.children,
        { y: 50, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.5)" }
      );
    }
  }, []);

  return (
    <div ref={desktopRef} className="flex-1 h-full w-full p-6 flex flex-col flex-wrap gap-6 content-start z-10">
      {systemApps.map((app) => (
        <button 
          key={app.id} 
          onClick={() => onOpenApp(app.id)}
          className="w-24 h-24 flex flex-col items-center justify-center rounded-lg hover:bg-space-gray hover:bg-opacity-50 transition-all duration-200 group"
        >
          <div className="w-12 h-12 mb-2 group-hover:scale-110 group-hover:-translate-y-1 transition-transform">
  <img 
    src={app.icon} 
    alt={`${app.name} icon`} 
    className="w-full h-full object-contain drop-shadow-md pointer-events-none"
  />
</div>
          <span className="text-space-white text-sm font-sans drop-shadow-md bg-black bg-opacity-40 px-2 py-1 rounded">
            {app.name}
          </span>
        </button>
      ))}
    </div>
  );
};

export default Desktop;