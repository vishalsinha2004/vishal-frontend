import React, { useState, useEffect } from 'react';
import { useSound } from '../hooks/useSound';

// Global trigger function to avoid prop drilling and context overhead
export const showSystemDialog = (options) => {
  window.dispatchEvent(new CustomEvent('sys-dialog', { detail: options }));
};

const SystemDialog = () => {
  const [dialogs, setDialogs] = useState([]);
  const { playSound } = useSound();

  useEffect(() => {
    const handleDialog = (e) => {
      const newDialog = { id: Date.now(), ...e.detail };
      setDialogs((prev) => [...prev, newDialog]);

      // Play appropriate sound based on dialog type
      if (newDialog.type === 'error') playSound('error');
      else if (newDialog.type === 'warning') playSound('warning');
      else playSound('notification'); 
    };

    window.addEventListener('sys-dialog', handleDialog);
    return () => window.removeEventListener('sys-dialog', handleDialog);
  }, [playSound]);

  const closeDialog = (id) => {
    setDialogs((prev) => prev.filter((d) => d.id !== id));
  };

  const handleBackdropClick = (e) => {
    e.stopPropagation();
    // Play the classic "Default Beep/Asterisk" when clicking outside a modal
    playSound('error');
  };

  if (dialogs.length === 0) return null;

  return (
    <>
      {dialogs.map((dialog) => (
        <div key={dialog.id} className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-auto">
          {/* Modal Backdrop - Captures clicks to prevent background interaction */}
          <div className="absolute inset-0 bg-transparent" onClick={handleBackdropClick}></div>
          
          {/* Dialog Window */}
          <div className="retro-window min-w-[300px] max-w-[400px] shadow-retro-outset bg-os-gray border border-os-white relative z-10">
            {/* Title Bar */}
            <div className="retro-title-bar bg-blue-900 text-white font-dialog font-bold px-1 flex justify-between items-center select-none cursor-default">
              <span>{dialog.title || 'Vishal OS'}</span>
              <button 
                className="retro-btn px-2 py-0 h-[18px] text-xs leading-none text-black bg-os-gray" 
                onClick={() => closeDialog(dialog.id)}
              >
                X
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 flex items-start gap-4">
              {/* Retro Icon Generators */}
              {dialog.type === 'error' && (
                <div className="w-8 h-8 shrink-0 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white font-bold text-xl select-none shadow-retro-outset leading-none">X</div>
              )}
              {dialog.type === 'warning' && (
                <div className="w-8 h-8 shrink-0 bg-transparent border-[16px] border-transparent border-b-yellow-400 relative top-[-8px] shadow-retro-outset">
                  <span className="absolute top-[2px] left-[-4px] font-bold text-black text-sm">!</span>
                </div>
              )}
              {(dialog.type === 'info' || dialog.type === 'success' || !dialog.type) && (
                <div className="w-8 h-8 shrink-0 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white font-bold text-xl select-none shadow-retro-outset leading-none">i</div>
              )}
              {dialog.type === 'question' && (
                <div className="w-8 h-8 shrink-0 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white font-bold text-xl select-none shadow-retro-outset leading-none">?</div>
              )}

              {/* Message */}
              <div className="flex-1 font-sans text-sm text-os-text mt-1 whitespace-pre-wrap">
                {dialog.message}
              </div>
            </div>

            {/* Actions */}
            <div className="p-3 flex justify-center gap-4 mt-2">
              {(dialog.buttons || ['OK']).map((btnText, i) => (
                <button 
                  key={i} 
                  className="retro-btn w-20 py-1 font-sans text-sm focus:ring-1 focus:ring-black focus:outline-none"
                  onClick={() => {
                    playSound('click');
                    if (dialog.onConfirm && btnText !== 'Cancel' && btnText !== 'No') {
                      dialog.onConfirm();
                    }
                    closeDialog(dialog.id);
                  }}
                >
                  {btnText}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SystemDialog;