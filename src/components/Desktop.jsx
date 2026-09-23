import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ContextMenu from './ContextMenu';
import { showSystemDialog } from './SystemDialog';

// --- SUB-COMPONENT: Manages individual refs to prevent react-draggable crashes ---
const DesktopIcon = ({ app, isSelected, position, onSelect, onOpen, onDragStop, clearContextMenu }) => {
  const nodeRef = useRef(null); // Explicit ref for Draggable

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      defaultPosition={position || { x: 0, y: 0 }}
      onStart={() => onSelect(app.id)}
      onStop={(e, data) => onDragStop(app.id, data)}
    >
      <div
        ref={nodeRef} // Attach ref here
        onClick={(e) => {
          e.stopPropagation();
          onSelect(app.id);
          clearContextMenu();
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onOpen(app.id);
          onSelect(null);
        }}
        className="w-20 flex flex-col items-center justify-start focus:outline-none mt-2 cursor-default"
        title={app.name}
      >
        {/* Icon Container */}
        <div className="w-8 h-8 mb-1 relative">
          {isSelected && (
            <div className="absolute inset-0 bg-os-navy opacity-40 mix-blend-multiply pointer-events-none"></div>
          )}
          <img
            src={app.icon}
            alt={`${app.name} icon`}
            className="w-full h-full object-contain pointer-events-none"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Text Highlight */}
        <span
          className={`text-[11px] font-sans px-1 text-center leading-tight line-clamp-2 shadow-sm
          ${isSelected
              ? 'bg-os-navy text-white border border-dotted border-white'
              : 'text-os-white border border-transparent'
            }`}
        >
          {app.name}
        </span>
      </div>
    </Draggable>
  );
};

// --- MAIN DESKTOP COMPONENT ---
const Desktop = ({ systemApps, onOpenApp }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });

  // -- PERSISTED ICON POSITIONS --
  const [iconPositions, setIconPositions] = useLocalStorage('vishal_os_icon_positions', {});

  const handleDesktopClick = () => {
    setSelectedId(null);
    if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false });
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY });
    setSelectedId(null);
  };

  // Saves the position of the icon when the user stops dragging
  const handleDragStop = (id, data) => {
    setIconPositions(prev => ({ ...prev, [id]: { x: data.x, y: data.y } }));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && selectedId) {
        onOpenApp(selectedId);
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, onOpenApp]);

  return (
    <div
      className="flex-1 h-full w-full p-2 flex flex-col flex-wrap gap-4 content-start z-10 relative"
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
    >
      {systemApps.map((app) => (
        <DesktopIcon
          key={app.id}
          app={app}
          isSelected={selectedId === app.id}
          position={iconPositions[app.id]}
          onSelect={setSelectedId}
          onOpen={onOpenApp}
          onDragStop={handleDragStop}
          clearContextMenu={() => {
            if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false });
          }}
        />
      ))}

      {/* Reusable Context Menu */}
      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={() => setContextMenu({ ...contextMenu, visible: false })}
        items={[
          { label: 'Arrange Icons', action: () => console.log('Arrange') },
          { label: 'Auto Arrange', action: () => console.log('Auto') },
          { type: 'separator' },
          { label: 'New', disabled: true },
          { label: 'Refresh', action: () => window.location.reload() },
          { type: 'separator' },
          {
            label: 'Properties', action: () => showSystemDialog({
              type: 'info', title: 'Display Properties', message: 'Display properties are managed in Control Panel.', buttons: ['OK']
            })
          }
        ]}
      />
    </div>
  );
};

export default Desktop;