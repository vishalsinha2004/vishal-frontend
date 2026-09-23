import React, { useState } from 'react';
import { useSound } from '../hooks/useSound';
import { showSystemDialog } from './SystemDialog';
import ContextMenu from './ContextMenu';

const initialRecycledItems = [
  { id: '1', name: 'OLD_RESUME_1997.DOC', originalLocation: 'C:\\VISHAL', dateDeleted: '10/20/98 09:14 AM', size: '28 KB', type: 'WordPad Document' },
  { id: '2', name: 'DRAFT_PORTFOLIO.BAK', originalLocation: 'C:\\PROJECTS', dateDeleted: '10/22/98 04:30 PM', size: '142 KB', type: 'Backup File' },
  { id: '3', name: 'OLD_AVATAR.BMP', originalLocation: 'C:\\VISHAL', dateDeleted: '10/23/98 01:12 PM', size: '308 KB', type: 'Bitmap Image' },
  { id: '4', name: 'TEST_BUILD.LOG', originalLocation: 'C:\\WINDOWS\\TEMP', dateDeleted: '10/23/98 10:45 PM', size: '4 KB', type: 'Text Document' }
];

const RecycleBin = () => {
  const [items, setItems] = useState(initialRecycledItems);
  const [selectedId, setSelectedId] = useState(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, targetItem: null });
  const { playSound } = useSound();

  const selectedItem = items.find(item => item.id === selectedId);

  const handleEmptyBin = () => {
    if (items.length === 0) return;
    playSound('warning');
    showSystemDialog({
      type: 'question',
      title: 'Confirm File Delete',
      message: `Are you sure you want to permanently delete these ${items.length} item(s)?`,
      buttons: ['Yes', 'No'],
      onConfirm: () => {
        playSound('button');
        setItems([]);
        setSelectedId(null);
      }
    });
  };

  const handleRestoreItem = (item) => {
    playSound('click');
    setItems(prev => prev.filter(i => i.id !== item.id));
    setSelectedId(null);
    showSystemDialog({
      type: 'info',
      title: 'Recycle Bin',
      message: `${item.name} has been restored to ${item.originalLocation}.`,
      buttons: ['OK']
    });
  };

  const handleRestoreAll = () => {
    if (items.length === 0) return;
    playSound('click');
    setItems([]);
    setSelectedId(null);
    showSystemDialog({
      type: 'info',
      title: 'Recycle Bin',
      message: 'All items have been restored to their original locations.',
      buttons: ['OK']
    });
  };

  const handleDeleteSingle = (item) => {
    playSound('warning');
    showSystemDialog({
      type: 'question',
      title: 'Confirm File Delete',
      message: `Are you sure you want to permanently delete '${item.name}'?`,
      buttons: ['Yes', 'No'],
      onConfirm: () => {
        playSound('button');
        setItems(prev => prev.filter(i => i.id !== item.id));
        setSelectedId(null);
      }
    });
  };

  const handleItemProperties = (item) => {
    showSystemDialog({
      type: 'info',
      title: `${item.name} Properties`,
      message: `File: ${item.name}\nType: ${item.type}\nOriginal Location: ${item.originalLocation}\nDate Deleted: ${item.dateDeleted}\nSize: ${item.size}`,
      buttons: ['OK']
    });
  };

  const handleItemContextMenu = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(item.id);
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      targetItem: item
    });
  };

  const handleBackgroundContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      targetItem: null
    });
  };

  return (
    <div 
      className="flex flex-col h-full bg-os-gray font-sans select-none"
      onClick={() => {
        setSelectedId(null);
        if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false });
      }}
      onContextMenu={handleBackgroundContextMenu}
    >
      {/* Explorer Action Toolbar */}
      <div className="flex items-center gap-1 p-1 bg-os-gray border-b border-os-dark-gray shadow-retro-outset text-xs">
        <button 
          className="retro-btn px-2 py-0.5" 
          onClick={handleEmptyBin} 
          disabled={items.length === 0}
        >
          Empty Recycle Bin
        </button>
        <button 
          className="retro-btn px-2 py-0.5" 
          onClick={handleRestoreAll} 
          disabled={items.length === 0}
        >
          Restore All Items
        </button>
        {selectedItem && (
          <button 
            className="retro-btn px-2 py-0.5" 
            onClick={() => handleRestoreItem(selectedItem)}
          >
            Restore Item
          </button>
        )}
      </div>

      {/* Details View Header */}
      <div className="grid grid-cols-12 gap-2 px-2 py-1 bg-os-gray border-b border-os-dark-gray text-[11px] font-bold text-os-text shadow-sm">
        <div className="col-span-5 border-r border-os-dark-gray pr-1">Name</div>
        <div className="col-span-3 border-r border-os-dark-gray pr-1">Original Location</div>
        <div className="col-span-2 border-r border-os-dark-gray pr-1">Date Deleted</div>
        <div className="col-span-2 text-right pr-2">Size</div>
      </div>

      {/* File List Area */}
      <div className="flex-1 bg-os-white p-1 overflow-y-auto shadow-retro-inset custom-scrollbar">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-os-dark-gray italic">
            Recycle Bin is empty.
          </div>
        ) : (
          <div className="flex flex-col">
            {items.map(item => {
              const isSelected = selectedId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    playSound('click');
                    setSelectedId(item.id);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleItemProperties(item);
                  }}
                  onContextMenu={(e) => handleItemContextMenu(e, item)}
                  className={`grid grid-cols-12 gap-2 px-1.5 py-0.5 text-xs cursor-default items-center
                    ${isSelected ? 'bg-os-navy text-white' : 'text-os-text hover:bg-gray-100'}`}
                >
                  <div className="col-span-5 flex items-center gap-1.5 truncate">
                    <span>📄</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                  <div className="col-span-3 truncate text-[11px] opacity-90">{item.originalLocation}</div>
                  <div className="col-span-2 truncate text-[11px] opacity-90">{item.dateDeleted}</div>
                  <div className="col-span-2 text-right text-[11px] pr-2 opacity-90">{item.size}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-os-gray shadow-retro-inset px-2 py-0.5 text-xs border border-os-dark-gray flex justify-between text-os-text">
        <span>{items.length} object(s)</span>
        <span className="border-l border-os-dark-gray pl-2">
          {items.reduce((acc, curr) => acc + parseInt(curr.size, 10), 0)} KB
        </span>
      </div>

      {/* Context Menu */}
      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={() => setContextMenu({ ...contextMenu, visible: false })}
        items={
          contextMenu.targetItem
            ? [
                { label: 'Restore', action: () => handleRestoreItem(contextMenu.targetItem) },
                { type: 'separator' },
                { label: 'Delete', action: () => handleDeleteSingle(contextMenu.targetItem) },
                { type: 'separator' },
                { label: 'Properties', action: () => handleItemProperties(contextMenu.targetItem) }
              ]
            : [
                { label: 'Empty Recycle Bin', disabled: items.length === 0, action: handleEmptyBin },
                { label: 'Restore All', disabled: items.length === 0, action: handleRestoreAll },
                { type: 'separator' },
                {
                  label: 'Properties',
                  action: () =>
                    showSystemDialog({
                      type: 'info',
                      title: 'Recycle Bin Properties',
                      message: `Recycle Bin Drive C:\nMaximum size: 10% of drive\nSpace used: ${items.reduce((acc, curr) => acc + parseInt(curr.size, 10), 0)} KB`,
                      buttons: ['OK']
                    })
                }
              ]
        }
      />
    </div>
  );
};

export default RecycleBin;