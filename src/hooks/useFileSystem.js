import { useState, useMemo, useCallback, useEffect } from 'react';
import { fileIcon } from '../utils/icons';

export function useFileSystem(systemApps) {
  const [deletedItems, setDeletedItems] = useState([]);
  const [notepadFiles, setNotepadFiles] = useState({});

  // Sync with Notepad LocalStorage
  useEffect(() => {
    const fetchFiles = () => {
      try {
        const files = JSON.parse(localStorage.getItem('vishal_os_notepad_files') || '{}');
        setNotepadFiles(files);
      } catch (e) {
        setNotepadFiles({});
      }
    };
    
    // Initial fetch
    fetchFiles();
    
    // Listen for cross-component saves
    window.addEventListener('notepad-saved', fetchFiles);
    return () => window.removeEventListener('notepad-saved', fetchFiles);
  }, []);

  const fileSystem = useMemo(() => {
    const fs = {
      "C:": {
        type: 'dir',
        contents: {
          "Projects": { type: 'dir', contents: {} },
          "Games": { type: 'dir', contents: {} },
          "Windows": { type: 'dir', contents: {} },
          "Documents": { type: 'dir', contents: {
            "Resume.pdf": { type: 'file', appId: 'resume', icon: fileIcon },
            "About_Vishal.txt": { type: 'file', appId: 'about-us', icon: fileIcon }
          }}
        }
      },
      "Recycle Bin": {
        type: 'dir',
        contents: {}
      }
    };

    // Dynamically inject user-saved Notepad files
    Object.keys(notepadFiles).forEach(fileName => {
      // Don't show empty untitled files
      if (fileName === 'Untitled.txt' && !notepadFiles[fileName]) return;
      
      fs["C:"].contents["Documents"].contents[fileName] = {
        type: 'file',
        appId: 'notepad',
        icon: fileIcon
      };
    });

    systemApps.forEach(app => {
      if (app.id.includes('-folder') || app.id === 'system-os' || app.id === 'file-explorer' || app.id === 'recycle-bin') return;

      const fileNode = { type: 'file', appId: app.id, icon: app.icon };
      const safeName = app.name.replace(/\s+/g, '_');
      let fileName = `${safeName}.exe`;
      
      if (app.id === 'ie') fileName = 'Internet.url';
      if (app.id === 'notepad') fileName = 'Notepad.exe';
      if (app.id === 'paint') fileName = 'Mspaint.exe';
      if (app.id === 'settings') fileName = 'Control.cpl';
      if (app.id === 'resume' || app.id === 'about-us') return;

      if (deletedItems.includes(app.id)) {
        fs["Recycle Bin"].contents[fileName] = fileNode;
        return;
      }

      if (app.isProject) {
        fs["C:"].contents["Projects"].contents[fileName] = fileNode;
      } else if (app.isGame) {
        fs["C:"].contents["Games"].contents[fileName] = fileNode;
      } else if (app.isSystemTool || ['ie', 'network', 'settings', 'system-monitor', 'notepad', 'paint', 'luma-ai', 'tic-tac-toe', 'problem-solver'].includes(app.id)) {
        fs["C:"].contents["Windows"].contents[fileName] = fileNode;
      }
    });

    return fs;
  }, [systemApps, deletedItems, notepadFiles]);

  const resolvePath = useCallback((pathStr) => {
    const parts = pathStr.split('\\').filter(Boolean);
    let current = fileSystem;
    for (const part of parts) {
      if (current[part] && current[part].type === 'dir') {
        current = current[part].contents;
      } else if (current.contents && current.contents[part]) {
        current = current.contents[part];
      } else {
        return null;
      }
    }
    return current;
  }, [fileSystem]);

  const deleteFile = useCallback((appId) => setDeletedItems(prev => [...prev, appId]), []);
  const restoreFile = useCallback((appId) => setDeletedItems(prev => prev.filter(id => id !== appId)), []);
  const emptyRecycleBin = useCallback(() => setDeletedItems([]), []);

  return { fileSystem, resolvePath, deleteFile, restoreFile, emptyRecycleBin, deletedItems };
}