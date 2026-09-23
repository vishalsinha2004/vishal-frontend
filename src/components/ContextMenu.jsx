import React from 'react';
import { useSound } from '../hooks/useSound';

const ContextMenu = ({ visible, x, y, items, onClose }) => {
  const { playSound } = useSound();

  if (!visible) return null;

  // Keep the menu inside the viewport boundaries
  const safeX = Math.min(x, window.innerWidth - 160);
  const safeY = Math.min(y, window.innerHeight - (items.length * 24));

  return (
    <div 
      className="absolute z-[9999] bg-os-gray shadow-retro-outset border border-os-white font-sans text-xs text-os-text py-1 min-w-[150px]"
      style={{ top: safeY, left: safeX }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item, index) => {
        if (item.type === 'separator') {
          return <div key={index} className="border-b border-os-dark-gray my-1 mx-1"></div>;
        }

        return (
          <div 
            key={index} 
            className={`px-3 py-1 cursor-default ${item.disabled ? 'text-os-dark-gray' : 'hover:bg-os-navy hover:text-white'}`}
            onClick={(e) => {
              if (item.disabled) return;
              playSound('click');
              if (item.action) item.action();
              onClose();
            }}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
};

export default ContextMenu;