import React, { useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import gsap from 'gsap';
import MarkAI from './apps/MarkAI';
import Notesroom from './apps/Notesroom';
import Finder from './apps/Finder';
import Terminal from './apps/Terminal';
import Settings from './apps/Settings';

// Notice the new props added here (bgTheme, setBgTheme, accentColor, setAccentColor)
const Window = ({ app, onClose, bgTheme, setBgTheme, accentColor, setAccentColor }) => {
  const nodeRef = useRef(null);

  useEffect(() => {
    if (nodeRef.current) {
      gsap.fromTo(
        nodeRef.current,
        { scale: 0.85, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }
      );
    }
  }, []);

  const renderAppContent = () => {
    switch (app.id) {
      case 'markai':
        return <MarkAI />;
      case 'notesroom':
        return <Notesroom />;
      case 'finder':
        return <Finder />;
      case 'terminal':
        return <Terminal />;
      case 'settings':
        // Now it can successfully pass these props down to Settings
        return (
          <Settings 
            bgTheme={bgTheme} 
            setBgTheme={setBgTheme} 
            accentColor={accentColor} 
            setAccentColor={setAccentColor} 
          />
        );
      default:
        return (
          <div className="font-mono text-sm text-gray-400">
            <p>&gt; Initializing {app.name} environment...</p>
            <p className="animate-pulse">_</p>
          </div>
        );
    }
  };

  return (
    <Draggable nodeRef={nodeRef} handle=".window-header" bounds="parent">
      <div ref={nodeRef} className="absolute top-20 left-20 w-[700px] h-[450px] bg-space-dark border border-space-gray rounded-lg shadow-2xl flex flex-col overflow-hidden z-40 backdrop-blur-md bg-opacity-95">
        
        {/* Title Bar */}
        <div className="window-header cursor-move h-10 bg-[#0a0a0a] flex justify-between items-center px-4 border-b border-space-gray select-none">
          <div className="flex items-center space-x-2">
            <img src={app.icon} alt={app.name} className="w-4 h-4 object-contain" />
            <span className="text-space-white font-mono text-sm tracking-wider">{app.name}</span>
          </div>
          <button 
            onClick={() => onClose(app.id)} 
            className="text-gray-400 hover:text-red-500 transition-colors text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Dynamic App Content Area */}
        <div className="flex-1 p-4 overflow-hidden">
          {renderAppContent()}
        </div>
      </div>
    </Draggable>
  );
};

export default Window;