import React, { useState, useRef } from 'react';
import { useSound } from '../hooks/useSound';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { showSystemDialog } from './SystemDialog';

const Notepad = () => {
  const { playSound } = useSound();
  const [savedFiles, setSavedFiles] = useLocalStorage('vishal_os_notepad_files', { 'Untitled.txt': '' });
  const [currentFileName, setCurrentFileName] = useState('Untitled.txt');
  const [text, setText] = useState(savedFiles['Untitled.txt'] || '');
  
  const textAreaRef = useRef(null);

  const handleNew = () => {
    playSound('click');
    setCurrentFileName('Untitled.txt');
    setText('');
  };

  const handleOpen = () => {
    playSound('click');
    const fileNames = Object.keys(savedFiles).join('\n');
    const fileName = window.prompt(`Enter file name to open:\n\nAvailable files:\n${fileNames}`, 'Untitled.txt');
    
    if (fileName && savedFiles[fileName] !== undefined) {
      setCurrentFileName(fileName);
      setText(savedFiles[fileName]);
    } else if (fileName) {
       showSystemDialog({ type: 'error', title: 'Notepad', message: `Cannot find the ${fileName} file.`, buttons: ['OK'] });
    }
  };

  const handleSave = () => {
    playSound('click');
    setSavedFiles(prev => ({ ...prev, [currentFileName]: text }));
  };

  const handleSaveAs = () => {
    playSound('click');
    let newName = window.prompt("Save As...", currentFileName);
    if (newName) {
      if (!newName.toLowerCase().endsWith('.txt')) {
        newName += '.txt';
      }
      setCurrentFileName(newName);
      setSavedFiles(prev => ({ ...prev, [newName]: text }));
    }
  };

  const handleFind = () => {
     playSound('click');
     const term = window.prompt("Find what:");
     if (term && textAreaRef.current) {
        const startIndex = text.toLowerCase().indexOf(term.toLowerCase(), textAreaRef.current.selectionEnd);
        if (startIndex !== -1) {
           textAreaRef.current.focus();
           textAreaRef.current.setSelectionRange(startIndex, startIndex + term.length);
        } else {
           showSystemDialog({ type: 'info', title: 'Notepad', message: `Cannot find "${term}"`, buttons: ['OK'] });
        }
     }
  };

  const handleReplace = () => {
     playSound('click');
     const term = window.prompt("Find what:");
     if (!term) return;
     const replacement = window.prompt("Replace with:");
     if (replacement !== null) {
        const newText = text.replace(new RegExp(term, 'g'), replacement);
        setText(newText);
     }
  };

  return (
    <div className="flex flex-col h-full bg-os-white font-sans border border-os-dark-gray shadow-retro-inset select-none">
      
      {/* Menu Bar (CSS Hover based for simplicity) */}
      <div className="bg-os-gray border-b border-os-dark-gray flex gap-2 px-1 text-sm shadow-[0_1px_0_#dfdfdf] relative z-10">
        
        <div className="relative group">
           <span className="cursor-pointer hover:bg-blue-900 hover:text-white px-2 py-[1px] inline-block"><span className="underline">F</span>ile</span>
           <div className="absolute top-full left-0 bg-os-gray shadow-retro-outset border border-os-white hidden group-hover:flex flex-col min-w-[150px] text-black">
              <div className="px-3 py-1 hover:bg-os-navy hover:text-white cursor-pointer" onClick={handleNew}>New</div>
              <div className="px-3 py-1 hover:bg-os-navy hover:text-white cursor-pointer" onClick={handleOpen}>Open...</div>
              <div className="px-3 py-1 hover:bg-os-navy hover:text-white cursor-pointer" onClick={handleSave}>Save</div>
              <div className="px-3 py-1 hover:bg-os-navy hover:text-white cursor-pointer" onClick={handleSaveAs}>Save As...</div>
           </div>
        </div>

        <div className="relative group">
           <span className="cursor-pointer hover:bg-blue-900 hover:text-white px-2 py-[1px] inline-block"><span className="underline">E</span>dit</span>
           <div className="absolute top-full left-0 bg-os-gray shadow-retro-outset border border-os-white hidden group-hover:flex flex-col min-w-[150px] text-black">
              <div className="px-3 py-1 hover:bg-os-navy hover:text-white cursor-pointer" onClick={handleFind}>Find...</div>
              <div className="px-3 py-1 hover:bg-os-navy hover:text-white cursor-pointer" onClick={handleReplace}>Replace...</div>
           </div>
        </div>

        <div className="flex-1 flex justify-end px-2 items-center text-xs text-os-dark-gray">
          {currentFileName}
        </div>
      </div>

      {/* Main Text Area */}
      <textarea
        ref={textAreaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 w-full p-1 resize-none outline-none font-terminal text-sm leading-tight text-black"
        spellCheck="false"
      />
    </div>
  );
};

export default Notepad;