import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { useSound } from '../hooks/useSound';
import { errorIcon, warningIcon, infoIcon } from '../utils/icons';

// Global Event Dispatcher
export const showSystemDialog = (options) => {
  const event = new CustomEvent('show-system-dialog', { detail: options });
  window.dispatchEvent(event);
};

const SystemDialog = () => {
  const [dialog, setDialog] = useState(null);
  const { playSound } = useSound();
  const nodeRef = useRef(null);

  useEffect(() => {
    const handleShow = (e) => {
      setDialog(e.detail);
      if (e.detail.type === 'error') playSound('error');
      else if (e.detail.type === 'warning') playSound('warning');
      else playSound('notification');
    };
    window.addEventListener('show-system-dialog', handleShow);
    return () => window.removeEventListener('show-system-dialog', handleShow);
  }, [playSound]);

  if (!dialog) return null;

  const handleAction = (btn) => {
    playSound('click');
    if (dialog.onAction) dialog.onAction(btn);
    setDialog(null);
  };

  const getIcon = () => {
    if (dialog.type === 'error') return errorIcon;
    if (dialog.type === 'warning') return warningIcon;
    return infoIcon;
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-auto">
      {/* Invisible backdrop to catch clicks outside the dialog */}
      <div className="absolute inset-0" onClick={() => playSound('error')}></div>
      
      <Draggable nodeRef={nodeRef} handle=".dialog-title-bar" bounds="parent">
        <div ref={nodeRef} className="retro-window w-[320px] shadow-retro-outset bg-os-gray border border-os-white relative z-10 font-sans">
          
          <div className="dialog-title-bar bg-[#000080] text-white font-dialog font-bold px-1 flex justify-between items-center cursor-move select-none text-sm">
            <span>{dialog.title || 'Vishal OS'}</span>
            <button className="retro-btn px-2 py-0 h-[18px] text-xs leading-none text-black bg-os-gray font-bold shadow-retro-outset" onClick={() => handleAction('Close')}>
              X
            </button>
          </div>
          
          <div className="p-4 flex gap-4 items-start">
            <div className="w-8 h-8 shrink-0">
              <img src={getIcon()} alt={dialog.type} className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }} />
            </div>
            <div className="flex-1 text-sm text-os-text mt-1 leading-snug break-words">
              {dialog.message}
            </div>
          </div>
          
          <div className="bg-os-gray p-2 flex justify-center gap-2 mt-2 border-t border-os-dark-gray shadow-retro-inset">
            {dialog.buttons?.map((btn) => (
              <button 
                key={btn} 
                className="retro-btn w-20 py-1 text-xs focus:ring-1 focus:ring-black outline-none font-bold active:shadow-retro-inset shadow-retro-outset" 
                onClick={() => handleAction(btn)}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default SystemDialog;