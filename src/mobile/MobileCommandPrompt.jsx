import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '../hooks/useSound';

const MobileCommandPrompt = ({ systemApps, onOpenApp, onClose, fsApi }) => {
  const [history, setHistory] = useState([
    "Microsoft(R) Windows 98",
    "   (C)Copyright Microsoft Corp 1981-1999.",
    " ",
    "Type 'help' for a list of commands."
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const { playSound } = useSound();

  // Auto-scroll to keep the active prompt visible above the mobile keyboard
  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    if (!trimmedCmd) {
      setHistory(prev => [...prev, `C:\\>${cmd}`]);
      setInput("");
      return;
    }

    playSound('click');
    const newHistory = [...history, `C:\\>${cmd}`];

    const args = trimmedCmd.split(' ');
    const baseCmd = args[0];

    switch (baseCmd) {
      case 'help':
        newHistory.push("Available commands:");
        newHistory.push("  HELP  - Provide Help information for Windows commands.");
        newHistory.push("  DIR   - Displays a list of files and subdirectories.");
        newHistory.push("  CLS   - Clears the screen.");
        newHistory.push("  VER   - Displays the OS version.");
        newHistory.push("  EXIT  - Quits the CMD.EXE program.");
        newHistory.push("  OPEN  - Opens an application (e.g., 'open notepad').");
        break;
      case 'dir':
        newHistory.push(" Volume in drive C is VISHAL-OS");
        newHistory.push(" Directory of C:\\");
        newHistory.push(" ");
        systemApps.forEach(app => {
          newHistory.push(`  <DIR>          ${app.id.toUpperCase()}`);
        });
        newHistory.push(`        ${systemApps.length} File(s)`);
        break;
      case 'cls':
        setHistory([]);
        setInput("");
        return;
      case 'ver':
        newHistory.push("Vishal OS Mobile Edition [Version 98.10.2222]");
        break;
      case 'exit':
        onClose();
        return;
      case 'open':
        if (args.length > 1) {
          const target = args.slice(1).join(' ');
          const app = systemApps.find(a => a.name.toLowerCase().includes(target) || a.id.toLowerCase().includes(target));
          if (app) {
            newHistory.push(`Opening ${app.name}...`);
            onOpenApp(app.id);
          } else {
            newHistory.push(`'${target}' is not recognized as an internal or external command.`);
          }
        } else {
          newHistory.push("Usage: open <application name>");
        }
        break;
      default:
        newHistory.push(`'${baseCmd}' is not recognized as an internal or external command,`);
        newHistory.push("operable program or batch file.");
    }

    newHistory.push(" ");
    setHistory(newHistory);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    }
  };

  return (
    <div 
      className="flex-1 bg-black text-[#c0c0c0] font-mono text-xs sm:text-sm p-2 overflow-y-auto custom-scrollbar"
      onClick={() => inputRef.current && inputRef.current.focus()}
    >
      {history.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap break-words">{line}</div>
      ))}
      <div className="flex items-center">
        <span className="mr-1">C:\&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-[#c0c0c0] outline-none font-mono"
          autoComplete="off"
          spellCheck="false"
          autoCapitalize="none"
          autoCorrect="off"
        />
      </div>
      <div ref={endRef} className="h-4" /> {/* Padding to ensure scrolling clears keyboard */}
    </div>
  );
};

export default MobileCommandPrompt;