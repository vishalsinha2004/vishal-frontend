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
    showSystemDialog({
      type: 'info',
      title: 'Open File',
      message: `Available files:\n${fileNames}\n\n(Enter filename below is not supported yet in standard dialogs, opening last saved state instead.)`,
      buttons: ['OK']
    });
  };

  const handleSave = () => {
    playSound('click');
    setSavedFiles(prev => {
      const next = { ...prev, [currentFileName]: text };
      // Broadcast save event so File Explorer updates instantly
      setTimeout(() => window.dispatchEvent(new Event('notepad-saved')), 50);
      return next;
    });
    showSystemDialog({ type: 'info', title: 'Notepad', message: 'File saved successfully.', buttons: ['OK'] });
  };

  const handleSaveAs = () => {
    playSound('click');
    showSystemDialog({ 
      type: 'warning', 
      title: 'Save As', 
      message: 'Save As text input is currently disabled. Overwriting current file.', 
      buttons: ['OK'],
      onAction: () => handleSave()
    });
  };

  const handleFind = () => {
     playSound('click');
     showSystemDialog({ type: 'info', title: 'Notepad', message: `Find interface is not available in this version.`, buttons: ['OK'] });
  };

  const handleReplace = () => {
     playSound('click');
     showSystemDialog({ type: 'info', title: 'Notepad', message: `Replace interface is not available in this version.`, buttons: ['OK'] });
  };

  return (
    <div className="flex flex-col h-full bg-os-white font-sans border border-os-dark-gray shadow-retro-inset select-none">
      <div className="bg-os-gray border-b border-os-dark-gray flex gap-2 px-1 text-sm shadow-[0_1px_0_#dfdfdf] relative z-10 shrink-0">
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

      <textarea
        ref={textAreaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 w-full p-2 resize-none outline-none font-terminal text-sm leading-tight text-black min-h-[200px]"
        spellCheck="false"
      />
    </div>
  );
};

export default Notepad;