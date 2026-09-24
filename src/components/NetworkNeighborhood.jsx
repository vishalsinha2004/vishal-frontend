import React, { useState } from 'react';
import { useSound } from '../hooks/useSound';
import { showSystemDialog } from './SystemDialog';
import ContextMenu from './ContextMenu';
import { networkIcon, systemOsIcon, serverIcon, processorIcon } from '../utils/icons';

const NetworkNeighborhood = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, targetNode: null });
  const { playSound } = useSound();

  const networkNodes = [
    { id: 'internet', name: 'Entire Network', icon: networkIcon, type: 'global' },
    { id: 'portfolio', name: 'Vishal-PC', icon: systemOsIcon, type: 'local' },
    { id: 'backend', name: 'Backend-Server', icon: serverIcon, type: 'server' },
    { id: 'ai', name: 'Luma-AI-Node', icon: processorIcon, type: 'server' },
    { id: 'github', name: 'GitHub.com', icon: serverIcon, type: 'external', url: 'https://github.com/vishalsinha2004' },
    { id: 'linkedin', name: 'LinkedIn', icon: serverIcon, type: 'external', url: 'https://linkedin.com/in/vishalsinha' }
  ];

  const handlePing = (node) => {
    const isOnline = navigator.onLine;
    const latency = Math.floor(Math.random() * 60) + 12; 
    
    showSystemDialog({
      type: isOnline ? 'info' : 'error',
      title: `Ping ${node.name}`,
      message: isOnline 
        ? `Pinging ${node.id} with 32 bytes of data:\n\nReply from ${node.id}: bytes=32 time=${latency}ms TTL=117\nStatus: Connected` 
        : `Pinging ${node.id} with 32 bytes of data:\n\nRequest timed out.\nStatus: Disconnected`,
      buttons: ['OK']
    });
  };

  const handleDoubleClick = (node) => {
    playSound('window-open');
    if (node.type === 'external' && node.url) {
      window.open(node.url, '_blank', 'noopener,noreferrer');
    } else {
      handlePing(node);
    }
  };

  const handleNodeContextMenu = (e, node) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(node.id);
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, targetNode: node });
  };

  return (
    <div 
      className="flex flex-col h-full bg-os-gray font-sans select-none"
      onClick={() => {
        setSelectedId(null);
        if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false });
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({ visible: true, x: e.clientX, y: e.clientY, targetNode: null });
      }}
    >
      <div className="flex items-center gap-2 p-1 border-b border-os-dark-gray bg-os-gray shrink-0">
        <div className="flex-1 flex items-center bg-os-white shadow-retro-inset border border-os-dark-gray px-1 py-0.5 text-xs">
          <span className="text-os-dark-gray mr-1">Address:</span>
          <span className="truncate">Network Neighborhood</span>
        </div>
      </div>

      <div className="flex-1 bg-os-white p-2 overflow-y-auto shadow-retro-inset grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 content-start">
        {networkNodes.map(node => (
          <div 
            key={node.id}
            onClick={(e) => { 
              e.stopPropagation(); 
              playSound('click'); 
              setSelectedId(node.id); 
            }}
            onDoubleClick={(e) => { 
              e.stopPropagation(); 
              handleDoubleClick(node); 
            }}
            onContextMenu={(e) => handleNodeContextMenu(e, node)}
            className="flex flex-col items-center justify-start p-2 cursor-default outline-none group"
          >
            <div className="w-10 h-10 mb-1 relative flex items-center justify-center">
              {selectedId === node.id && (
                <div className="absolute inset-0 bg-os-navy opacity-40 mix-blend-multiply pointer-events-none"></div>
              )}
              <img src={node.icon} alt="" className="w-8 h-8 object-contain" style={{ imageRendering: 'pixelated' }} />
            </div>
            <span className={`text-xs text-center leading-tight px-1 line-clamp-2 shadow-sm
              ${selectedId === node.id 
                ? 'bg-os-navy text-white border-dotted border border-white' 
                : 'text-os-text border border-transparent'
              }`}
            >
              {node.name}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-os-gray shadow-retro-inset px-2 py-1 text-xs border border-os-dark-gray flex justify-between text-os-text shrink-0">
        <span>{networkNodes.length} object(s)</span>
        <span className="border-l border-os-dark-gray pl-2">
          {navigator.onLine ? 'Online' : 'Offline'}
        </span>
      </div>

      <ContextMenu 
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={() => setContextMenu({ ...contextMenu, visible: false })}
        items={
          contextMenu.targetNode 
            ? [
                { label: 'Open', action: () => handleDoubleClick(contextMenu.targetNode) },
                { label: 'Ping', action: () => handlePing(contextMenu.targetNode) },
                { type: 'separator' },
                { label: 'Properties', action: () => showSystemDialog({ type: 'info', title: `${contextMenu.targetNode.name} Properties`, message: `Device Type: ${contextMenu.targetNode.type.toUpperCase()}\nStatus: ${navigator.onLine ? 'Active' : 'Unreachable'}`, buttons: ['OK'] }) }
              ]
            : [
                { label: 'Refresh', action: () => playSound('click') },
                { type: 'separator' },
                { label: 'Properties', action: () => showSystemDialog({ type: 'info', title: 'Network Properties', message: `Current Network Status: ${navigator.onLine ? 'Connected to Internet' : 'Disconnected'}`, buttons: ['OK'] }) }
              ]
        }
      />
    </div>
  );
};

export default NetworkNeighborhood;