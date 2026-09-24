import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '../hooks/useSound';

const CommandPrompt = ({ onOpenApp, onCloseApp, systemApps, isCrtMode, setIsCrtMode, fsApi }) => {
  const [history, setHistory] = useState([
    "Microsoft(R) Windows 98",
    "   (C)Copyright Microsoft Corp 1981-1998.",
    "Vishal OS 98 [Version 1.0.0]",
    "Type 'help' for a list of available commands.",
    ""
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [path, setPath] = useState("C:\\");
  
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const { playSound } = useSound();
  const { resolvePath } = fsApi;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [history]);

  const print = (lines) => {
    setHistory(prev => [...prev, ...lines]);
  };

  const executeCommand = (cmdStr) => {
    const args = cmdStr.trim().split(/\s+/);
    const cmd = args[0].toLowerCase();
    playSound('typing');
    
    const currentDirNode = resolvePath(path);
    if (currentDirNode && currentDirNode[args[0].toUpperCase()] && currentDirNode[args[0].toUpperCase()].type === 'file') {
       const fileNode = currentDirNode[args[0].toUpperCase()];
       if (fileNode.appId) {
         print([`Executing ${args[0].toUpperCase()}...`]);
         onOpenApp(fileNode.appId);
         return;
       } else {
         print(["Cannot execute this file format."]);
         return;
       }
    }

    switch (cmd) {
      case 'help':
        print([
          "Available commands:",
          "  ABOUT      - Display information about Vishal",
          "  CD         - Displays the name of or changes the current directory.",
          "  CLEAR/CLS  - Clears the screen.",
          "  CLOSE      - Closes a running application (e.g. close resume).",
          "  CONTACT    - Display contact information.",
          "  CRT        - Toggles CRT display effects (crt on/off).",
          "  DATE       - Displays the current date.",
          "  DIR        - Displays a list of files and subdirectories.",
          "  GITHUB     - Opens Vishal's GitHub profile.",
          "  HELP       - Provides Help information for Windows commands.",
          "  HISTORY    - Displays command history.",
          "  LINKEDIN   - Opens Vishal's LinkedIn profile.",
          "  NETWORK    - Displays network status.",
          "  OPEN       - Opens an application (e.g. open resume).",
          "  PING       - Sends ICMP ECHO_REQUEST to network hosts.",
          "  PROJECTS   - Opens the projects folder.",
          "  RESTART    - Restarts the computer.",
          "  RESUME     - Opens the resume.",
          "  SHUTDOWN   - Shuts down the computer.",
          "  SOUND      - Sound configuration info.",
          "  SYSTEM     - Displays system OS properties.",
          "  THEME      - Opens Control Panel.",
          "  TIME       - Displays the current time.",
          "  VER        - Displays the OS version.",
          "  WHOAMI     - Displays current user."
        ]);
        break;
      case 'dir':
        const dirNode = resolvePath(path);
        if (!dirNode) {
          print(["Invalid directory."]);
          break;
        }

        let dirOutput = [
          " Volume in drive C is VISHAL_OS",
          " Volume Serial Number is 1337-98",
          ` Directory of ${path}`,
          "",
          "10-23-98  11:38 PM    <DIR>          .",
          "10-23-98  11:38 PM    <DIR>          .."
        ];

        let fileCount = 0;
        let dirCount = 2; 
        let totalBytes = 0;

        Object.keys(dirNode).forEach(key => {
          const item = dirNode[key];
          if (item.type === 'dir') {
            dirCount++;
            dirOutput.push(`10-23-98  11:38 PM    <DIR>          ${key}`);
          } else {
            fileCount++;
            dirOutput.push(`10-23-98  11:38 PM               1kb ${key}`);
          }
        });

        dirOutput.push(`               ${fileCount} File(s)      ${totalBytes.toLocaleString()} bytes`);
        dirOutput.push(`               ${dirCount} Dir(s)   2,147,483,648 bytes free`);
        print(dirOutput);
        break;
      case 'cls':
      case 'clear':
        setHistory([]);
        break;
      case 'cd':
        if (!args[1]) {
          print([path]);
          break;
        }
        
        let target = args[1].toUpperCase();
        if (target === '..') {
          const parts = path.split('\\');
          if (parts.length > 1) {
            parts.pop();
            setPath(parts.join('\\') || "C:\\");
          }
          print([]);
        } else if (target === '\\') {
          setPath("C:\\");
          print([]);
        } else {
          // Check if directory exists relative to current path
          const checkNode = resolvePath(path);
          // Look dynamically for matching key regardless of strict case
          const foundKey = Object.keys(checkNode).find(k => k.toUpperCase() === target);
          if (foundKey && checkNode[foundKey].type === 'dir') {
            setPath(`${path === 'C:\\' ? 'C:' : path}\\${foundKey}`);
            print([]);
          } else {
            print(["Invalid directory."]);
          }
        }
        break;
      case 'ver':
        print(["Vishal OS 98 [Version 1.0.0]"]);
        break;
      case 'whoami':
        print(["vishal-pc\\guest"]);
        break;
      case 'about':
        onOpenApp('about-us');
        print(["Opening About Vishal..."]);
        break;
      case 'projects':
        onOpenApp('projects-folder');
        print(["Opening Projects..."]);
        break;
      case 'resume':
        onOpenApp('resume');
        print(["Opening Resume..."]);
        break;
      case 'contact':
        print([
          "Contact Information:",
          "Email: vishalsinha@example.com",
          "GitHub: github.com/vishalsinha2004",
          "Type 'github' to launch browser."
        ]);
        break;
      case 'github':
        window.open('https://github.com/vishalsinha2004', '_blank');
        print(["Opening GitHub..."]);
        break;
      case 'linkedin':
        print(["Opening LinkedIn..."]);
        break;
      case 'date':
        print(["The current date is: " + new Date().toLocaleDateString()]);
        break;
      case 'time':
        print(["The current time is: " + new Date().toLocaleTimeString()]);
        break;
      case 'system':
        onOpenApp('system-os');
        print(["Opening System OS details..."]);
        break;
      case 'network':
        print([
           navigator.onLine ? "Status: Connected to Internet" : "Status: Disconnected",
           "IP Address: 192.168.1.100",
           "Subnet Mask: 255.255.255.0"
        ]);
        break;
      case 'ping':
        const targetHost = args[1] || "8.8.8.8";
        print([
          `Pinging ${targetHost} with 32 bytes of data:`,
          `Reply from ${targetHost}: bytes=32 time=14ms TTL=117`,
          `Reply from ${targetHost}: bytes=32 time=15ms TTL=117`,
          `Reply from ${targetHost}: bytes=32 time=13ms TTL=117`,
          `Reply from ${targetHost}: bytes=32 time=16ms TTL=117`,
          "",
          `Ping statistics for ${targetHost}:`,
          `    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),`
        ]);
        break;
      case 'history':
        print(cmdHistory.map((h, i) => `${i + 1}  ${h}`));
        break;
      case 'theme':
        onOpenApp('settings');
        print(["Opening Control Panel..."]);
        break;
      case 'sound':
        print(["Please use the system tray icon to manage sound."]);
        break;
      case 'crt':
        if (args[1] === 'on') { setIsCrtMode(true); print(["CRT mode enabled."]); }
        else if (args[1] === 'off') { setIsCrtMode(false); print(["CRT mode disabled."]); }
        else { print([`CRT mode is currently ${isCrtMode ? 'ON' : 'OFF'}. Use 'crt on' or 'crt off'.`]); }
        break;
      case 'open':
        if (!args[1]) {
          print(["Usage: open [application]"]);
        } else {
          const targetApp = systemApps.find(a => a.id.includes(args[1]) || a.name.toLowerCase().includes(args[1]));
          if (targetApp) {
            onOpenApp(targetApp.id);
            print([`Opening ${targetApp.name}...`]);
          } else {
            print([`Application '${args[1]}' not found.`]);
          }
        }
        break;
      case 'close':
         if (!args[1]) {
           print(["Usage: close [application]"]);
         } else {
           const targetApp = systemApps.find(a => a.id.includes(args[1]) || a.name.toLowerCase().includes(args[1]));
           if (targetApp) {
             onCloseApp(targetApp.id);
             print([`Closing ${targetApp.name}...`]);
           } else {
             print([`Application '${args[1]}' not found.`]);
           }
         }
         break;
      case 'restart':
         print(["Restarting system..."]);
         window.dispatchEvent(new CustomEvent('sys-shutdown', { detail: 'restart' }));
         break;
      case 'shutdown':
         print(["Shutting down..."]);
         window.dispatchEvent(new CustomEvent('sys-shutdown', { detail: 'shutdown' }));
         break;
      default:
        if (cmd) print([`'${cmd}' is not recognized as an internal or external command,`, "operable program or batch file."]);
        break;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const val = input;
      setHistory(prev => [...prev, `${path}>${val}`]);
      if (val.trim()) {
        setCmdHistory(prev => [...prev, val]);
        executeCommand(val);
      }
      setInput('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIndex = historyIndex + 1 < cmdHistory.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIndex);
        setInput(cmdHistory[cmdHistory.length - 1 - nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(cmdHistory[cmdHistory.length - 1 - nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div 
      className="h-full w-full bg-black text-[#c0c0c0] font-terminal text-sm p-2 overflow-y-auto cursor-text shadow-retro-inset border border-os-dark-gray flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap leading-tight min-h-[1em]">{line}</div>
        ))}
        <div className="flex mt-1">
          <span className="mr-1">{path}&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-[#c0c0c0] outline-none border-none font-terminal leading-tight"
            autoFocus
            spellCheck="false"
            autoComplete="off"
          />
        </div>
      </div>
      <div ref={bottomRef}></div>
    </div>
  );
};

export default CommandPrompt;