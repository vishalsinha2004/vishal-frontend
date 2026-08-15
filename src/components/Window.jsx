import React, { useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import gsap from 'gsap';
import MarkAI from './apps/MarkAI';
import Notesroom from './apps/Notesroom';
import Finder from './apps/Finder';

const Window = ({ app, onClose }) => {
  const nodeRef = useRef(null);

  useEffect(() => {
    // GSAP animation for window spawn
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
            <span>{app.icon}</span>
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