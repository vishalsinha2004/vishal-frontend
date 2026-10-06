import React from 'react';
import { useSound } from '../hooks/useSound';
import { showSystemDialog } from '../components/SystemDialog';

const MobileNetworkNeighborhood = ({ onOpenApp }) => {
  const { playSound } = useSound();

  const items = [
    { 
      id: 'entire-network', 
      name: 'Entire Network', 
      icon: 'https://cdn.jsdelivr.net/gh/trapd00r/win95-winxp_icons@master/icons/w2k_network_neighborhood.ico', 
      action: () => { 
        playSound('error'); 
        showSystemDialog({ 
          type: 'error', 
          title: 'Network Neighborhood', 
          message: 'Unable to browse the network.\n\nThe network is not present or not started.', 
          buttons: ['OK'] 
        }); 
      } 
    },
    { 
      id: 'vishal-pc', 
      name: 'VISHAL-PC', 
      icon: 'https://cdn.jsdelivr.net/gh/trapd00r/win95-winxp_icons@master/icons/w98_computer_musical_keyboard.ico', 
      action: () => { 
        playSound('click'); 
        // Route to the My Computer view to simulate local machine browsing
        onOpenApp('system-os'); 
      } 
    }
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full h-full bg-white text-black font-sans text-sm">
      {/* Mobile Toolbar */}
      <div className="flex items-center p-1.5 bg-os-gray border-b border-os-dark-gray gap-2 shrink-0">
        <button 
          disabled
          className="retro-btn px-4 py-1 text-xs font-bold opacity-50 text-os-dark-gray active:shadow-retro-outset"
        >
          Up
        </button>
        <div className="flex-1 min-w-0 shadow-retro-inset bg-white px-2 py-1.5 truncate text-xs border border-os-dark-gray">
          Network Neighborhood
        </div>
      </div>

      {/* Chunky Grid Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-wrap gap-6 content-start bg-white custom-scrollbar">
        {items.map(item => (
          <div 
            key={item.id} 
            className="flex flex-col items-center justify-start w-[72px] cursor-pointer group"
            onClick={item.action}
          >
            <div className="w-10 h-10 mb-1 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-os-navy opacity-0 group-active:opacity-40 mix-blend-multiply pointer-events-none"></div>
              <img src={item.icon} alt={item.name} className="w-8 h-8 object-contain pointer-events-none" style={{ imageRendering: 'pixelated' }} />
            </div>
            <span className="text-xs text-center leading-tight font-sans text-black px-1 group-active:bg-os-navy group-active:text-white border border-transparent group-active:border-dotted group-active:border-white">
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* Classic Status Bar */}
      <div className="bg-os-gray border-t border-os-dark-gray p-1 px-2 text-[10px] shrink-0 flex justify-between shadow-retro-inset">
        <span>{items.length} object(s)</span>
        <span>Network Neighborhood</span>
      </div>
    </div>
  );
};

export default MobileNetworkNeighborhood;