import React, { useState, useEffect, useRef, useCallback } from 'react';
import Draggable from 'react-draggable';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ContextMenu from './ContextMenu';
import { showSystemDialog } from './SystemDialog';
import { useSound } from '../hooks/useSound';

// --- SUB-COMPONENT: Manages individual refs to prevent react-draggable crashes ---
const DesktopIcon = ({ app, isSelected, position, onSelect, onOpen, onDragStop, clearContextMenu, autoArrange }) => {
  const nodeRef = useRef(null);

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      position={position || { x: 10, y: 10 }} 
      disabled={autoArrange}                  
      onStart={() => onSelect(app.id)}
      onStop={(e, data) => onDragStop(app.id, data)}
    >
      <div
        ref={nodeRef}
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
        className="absolute w-20 flex flex-col items-center justify-start focus:outline-none cursor-default z-10 group"
        style={{ top: 0, left: 0 }} 
        title={app.name}
      >
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
  const { playSound } = useSound();

  const [iconPositions, setIconPositions] = useLocalStorage('vishal_os_icon_positions', {});
  const [autoArrange, setAutoArrange] = useLocalStorage('vishal_os_auto_arrange', false);

  const handleDesktopClick = () => {
    setSelectedId(null);
    if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false });
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY });
    setSelectedId(null);
  };

  const handleDragStop = (id, data) => {
    if (autoArrange) return; 
    setIconPositions(prev => ({ ...prev, [id]: { x: data.x, y: data.y } }));
  };

  const calculateGrid = useCallback(() => {
    const freshPositions = {};
    let currentY = 10;
    let currentX = 10;
    const iconHeight = 85;
    const iconWidth = 85;
    // Safeguard: Ensure maxH is never zero during page load
    const maxH = Math.max(window.innerHeight - 60, 300); 

    systemApps.forEach((app) => {
      if (currentY + iconHeight > maxH) {
        currentY = 10;
        currentX += iconWidth;
      }
      freshPositions[app.id] = { x: currentX, y: currentY };
      currentY += iconHeight;
    });
    setIconPositions(freshPositions);
  }, [systemApps, setIconPositions]);

  const handleArrangeIcons = () => {
    playSound('click');
    calculateGrid();
  };

  const handleToggleAutoArrange = () => {
    playSound('click');
    setAutoArrange(!autoArrange);
  };

  // Run grid calculation on mount/changes
  useEffect(() => {
    let needsCalc = false;

    // 1. Missing positions check
    if (systemApps.some(app => !iconPositions[app.id])) {
      needsCalc = true;
    }

    // 2. Corrupted Cache Overlap Check
    // If ANY two icons have the exact same coordinates, force a recalculation
    if (!needsCalc && iconPositions && typeof iconPositions === 'object') {
      const vals = Object.values(iconPositions);
      for (let i = 0; i < vals.length; i++) {
        for (let j = i + 1; j < vals.length; j++) {
          if (vals[i].x === vals[j].x && vals[i].y === vals[j].y) {
            needsCalc = true;
            break;
          }
        }
        if (needsCalc) break;
      }
    }

    if (autoArrange || needsCalc) {
      calculateGrid();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemApps, autoArrange]);

  // Responsive logic: Recalculate grid automatically if window is resized
  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (autoArrange) calculateGrid();
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [autoArrange, calculateGrid]);

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
      className="flex-1 h-full w-full relative z-10 overflow-hidden"
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
    >
      {systemApps.map((app) => (
        <DesktopIcon
          key={app.id}
          app={app}
          isSelected={selectedId === app.id}
          position={iconPositions[app.id]}
          autoArrange={autoArrange}
          onSelect={setSelectedId}
          onOpen={onOpenApp}
          onDragStop={handleDragStop}
          clearContextMenu={() => {
            if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false });
          }}
        />
      ))}

      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={() => setContextMenu({ ...contextMenu, visible: false })}
        items={[
          { label: 'Arrange Icons', action: handleArrangeIcons },
          { label: autoArrange ? '✓ Auto Arrange' : 'Auto Arrange', action: handleToggleAutoArrange },
          { type: 'separator' },
          { label: 'Refresh', action: () => { playSound('click'); window.location.reload(); } },
          { type: 'separator' },
          {
            label: 'Properties', action: () => {
              playSound('click'); 
              showSystemDialog({
                type: 'info', title: 'Display Properties', message: 'Display properties are managed in Control Panel.', buttons: ['OK']
              });
            }
          }
        ]}
      />
    </div>
  );
};

export default Desktop;