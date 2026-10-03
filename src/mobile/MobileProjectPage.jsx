import React from 'react';
import { useSound } from '../hooks/useSound';

const MobileProjectPage = ({ apps, onOpenApp }) => {
  const { playSound } = useSound();

  return (
    <div className="flex flex-col h-full bg-white text-black font-sans text-sm">
      <div className="flex items-center p-1.5 bg-os-gray border-b border-os-dark-gray gap-2 shrink-0">
        <div className="flex-1 shadow-retro-inset bg-white px-2 py-1.5 truncate text-xs border border-os-dark-gray">
          Found {apps.length} items
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 bg-os-white custom-scrollbar flex flex-col gap-2">
        {apps.map(app => (
          <div 
            key={app.id}
            className="bg-os-gray border border-os-dark-gray shadow-retro-outset p-2 flex flex-col gap-2 cursor-pointer active:shadow-retro-inset"
            onClick={() => { playSound('click'); onOpenApp(app.id); }}
          >
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-white shadow-retro-inset border border-os-dark-gray p-1 shrink-0">
                 <img src={app.icon} alt="" className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }} />
               </div>
               <div className="flex-1 min-w-0">
                 <h3 className="font-bold text-sm truncate">{app.name}</h3>
                 <p className="text-[10px] text-[#000080] truncate font-bold">{app.project_type || 'Executable'}</p>
               </div>
            </div>
            {app.description && (
              <p className="text-xs line-clamp-2 bg-white shadow-retro-inset p-1.5 border border-os-dark-gray leading-tight">
                {app.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileProjectPage;