import React, { useState, useEffect } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import StartMenu from './components/StartMenu';
import TopSearch from './components/TopSearch';
import VoiceAssistant from './components/VoiceAssistant';
import SystemDialog from './components/SystemDialog';
import { useWindowManager } from './hooks/useWindowManager';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSound } from './hooks/useSound';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// --- RETRO PIXEL ICONS ---
const systemOsIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='4' y='4' width='24' height='24' fill='%23c0c0c0' stroke='%23000' stroke-width='2'/%3E%3Crect x='8' y='8' width='16' height='12' fill='%23000080' stroke='%23000' stroke-width='2'/%3E%3Crect x='6' y='22' width='20' height='4' fill='%23808080'/%3E%3C/svg%3E";
const aboutUsIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='6' y='4' width='20' height='24' fill='%23fff' stroke='%23000' stroke-width='2'/%3E%3Ccircle cx='16' cy='12' r='4' fill='%23000080'/%3E%3Cpath d='M10 24v-2c0-3 3-4 6-4s6 1 6 4v2' fill='%23000080'/%3E%3C/svg%3E";
const settingsIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='4' y='4' width='24' height='24' fill='%23c0c0c0' stroke='%23000' stroke-width='2'/%3E%3Ccircle cx='16' cy='16' r='6' fill='%23808080' stroke='%23000' stroke-width='2'/%3E%3Crect x='14' y='8' width='4' height='16' fill='%23000'/%3E%3Crect x='8' y='14' width='16' height='4' fill='%23000'/%3E%3C/svg%3E";
const folderIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M4 8h8l2 4h14v12H4z' fill='%23ffff00' stroke='%23000' stroke-width='2' stroke-linejoin='miter'/%3E%3Cpath d='M4 12h24' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E";
const fileExplorerIcon = folderIcon;
const resumeIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='6' y='4' width='20' height='24' fill='%23fff' stroke='%23000' stroke-width='2'/%3E%3Cline x1='10' y1='10' x2='22' y2='10' stroke='%23000' stroke-width='2'/%3E%3Cline x1='10' y1='14' x2='22' y2='14' stroke='%23000' stroke-width='2'/%3E%3Cline x1='10' y1='18' x2='18' y2='18' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E";
const gamesFolderIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M4 8h8l2 4h14v12H4z' fill='%23ff00ff' stroke='%23000' stroke-width='2' stroke-linejoin='miter'/%3E%3Ccircle cx='16' cy='18' r='4' fill='%23fff' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E";
const ticTacToeIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='4' y='4' width='24' height='24' fill='%23fff' stroke='%23000' stroke-width='2'/%3E%3Cline x1='12' y1='6' x2='12' y2='26' stroke='%23000' stroke-width='2'/%3E%3Cline x1='20' y1='6' x2='20' y2='26' stroke='%23000' stroke-width='2'/%3E%3Cline x1='6' y1='12' x2='26' y2='12' stroke='%23000' stroke-width='2'/%3E%3Cline x1='6' y1='20' x2='26' y2='20' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E";
const problemSolverIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='4' y='4' width='24' height='24' fill='%23000' stroke='%23000' stroke-width='2'/%3E%3Ctext x='8' y='20' font-family='monospace' font-size='16' fill='%2300ff00'\>C:\\\</text\>%3C/svg%3E";
const recycleBinIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M8 6h16v2H8z' fill='%23808080' stroke='%23000' stroke-width='2'/%3E%3Cpath d='M10 8h12l-2 18H12z' fill='%23c0c0c0' stroke='%23000' stroke-width='2'/%3E%3Cpath d='M14 11v12M18 11v12' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E";
const networkIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='4' y='12' width='10' height='8' fill='%23c0c0c0' stroke='%23000' stroke-width='2'/%3E%3Crect x='18' y='12' width='10' height='8' fill='%23c0c0c0' stroke='%23000' stroke-width='2'/%3E%3Cpath d='M9 20v4h14v-4' fill='none' stroke='%23000' stroke-width='2'/%3E%3Cpath d='M16 24v4' fill='none' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E";
const ieIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M16 2a14 14 0 100 28 14 14 0 000-28zm5.5 21A11.5 11.5 0 0116 26a12 12 0 01-10-8c2-3 6-4 10-4h4v-3h-4a8 8 0 106 10v2z' fill='%23000080' stroke='%23000080' stroke-width='1'/%3E%3Cpath d='M4 14a12 12 0 0118-8v3a9 9 0 00-13 6h-5z' fill='%23ffff00'/%3E%3C/svg%3E";
const lumaAiIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M16 2C9 2 4 7 4 14c0 3 1 6 3 8v6h18v-6c2-2 3-5 3-8 0-7-5-12-12-12zm0 4c5 0 8 4 8 8 0 4-3 7-5 8v2H13v-2c-2-1-5-4-5-8 0-4 3-8 8-8z' fill='%23000080' stroke='%23000' stroke-width='1'/%3E%3Ccircle cx='11' cy='12' r='2' fill='%23ff0000'/%3E%3Ccircle cx='21' cy='12' r='2' fill='%23ff0000'/%3E%3Cpath d='M11 20h10v2H11z' fill='%23000080'/%3E%3C/svg%3E";
const sysMonitorIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='4' y='6' width='24' height='20' fill='%23fff' stroke='%23000' stroke-width='2'/%3E%3Cpath d='M8 22v-6m4 6v-10m4 10v-4m4 4v-12m4 12v-8' stroke='%2300ff00' stroke-width='2' stroke-linecap='square'/%3E%3C/svg%3E";
const notepadIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M6 2h14l6 6v22H6V2z' fill='%23fff' stroke='%23000' stroke-width='2'/%3E%3Cpath d='M20 2v6h6' fill='none' stroke='%23000' stroke-width='2'/%3E%3Cline x1='10' y1='12' x2='22' y2='12' stroke='%23000' stroke-width='2'/%3E%3Cline x1='10' y1='16' x2='22' y2='16' stroke='%23000' stroke-width='2'/%3E%3Cline x1='10' y1='20' x2='22' y2='20' stroke='%23000' stroke-width='2'/%3E%3Cline x1='10' y1='24' x2='16' y2='24' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E";
const paintIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M6 10c0-6 20-6 20 0 0 4-4 6-6 10s-2 10-4 10-2-6-4-10-6-6-6-10z' fill='%23c0c0c0' stroke='%23000' stroke-width='2'/%3E%3Ccircle cx='10' cy='8' r='2' fill='%23ff0000'/%3E%3Ccircle cx='16' cy='6' r='2' fill='%2300ff00'/%3E%3Ccircle cx='22' cy='8' r='2' fill='%230000ff'/%3E%3Ccircle cx='16' cy='12' r='2' fill='%23ffff00'/%3E%3Cpath d='M10 24l-6 6M8 24l-4 4' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E";
const minesweeperIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='4' y='4' width='24' height='24' fill='%23c0c0c0' stroke='%23000' stroke-width='2'/%3E%3Ccircle cx='16' cy='16' r='8' fill='%23000'/%3E%3Cpath d='M16 4v4M16 24v4M4 16h4M24 16h4M8 8l3 3M21 21l3 3M24 8l-3 3M11 21l-3 3' stroke='%23000' stroke-width='2'/%3E%3Ccircle cx='14' cy='14' r='2' fill='%23fff'/%3E%3C/svg%3E";

function App() {
  const [systemApps, setSystemApps] = useState([]);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [bootState, setBootState] = useState(0);
  const [bootText, setBootText] = useState([]);

  // -- SHUTDOWN MODAL STATES --
  const [showShutdown, setShowShutdown] = useState(false);
  const [shutdownChoice, setShutdownChoice] = useState('shutdown');

  const [isCrtMode, setIsCrtMode] = useLocalStorage('vishal_os_crt_mode', true);
  const [bgTheme, setBgTheme] = useLocalStorage('vishal_os_bg', '#008080');
  const { playSound } = useSound();

  const {
    windows: openApps,
    openWindow: openApp,
    closeWindow: closeApp,
    focusWindow,
    minimizeWindow,
    toggleMaximize,
    updateWindowPosition,
    activeWindowId
  } = useWindowManager();

  // --- BOOT SEQUENCE LOGIC ---
  useEffect(() => {
    const biosLines = [
      "Award Modular BIOS v4.51PG, An Energy Star Ally",
      "Copyright (C) 1984-1998, Award Software, Inc.",
      "",
      "VISHAL-OS-98 SYSTEM BIOS V1.0",
      "",
      "Pentium(R) II Processor - 300MHz",
      "Memory Test :  65536K OK",
      "",
      "Award Plug and Play BIOS Extension v1.0A",
      "Initialize Plug and Play Cards...",
      "PNP Init Completed",
      "",
      "Detecting Primary Master   ... WDC WD3200AAJS",
      "Detecting Primary Slave    ... None",
      "Detecting Secondary Master ... HL-DT-ST CD-ROM",
      "Detecting Secondary Slave  ... None",
      "",
      "Starting Vishal OS 98...",
    ];

    let currentLine = 0;

    if (bootState === 0) {
      const interval = setInterval(() => {
        if (currentLine < biosLines.length) {
          setBootText(prev => [...prev, biosLines[currentLine]]);
          currentLine++;
        } else {
          clearInterval(interval);
          setTimeout(() => setBootState(1), 1000);
        }
      }, 80);
      return () => clearInterval(interval);
    }

    if (bootState === 1) {
      playSound('boot');
      const timer = setTimeout(() => {
        setBootState(2);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [bootState, playSound]);

  // --- GLOBAL KEYBOARD HANDLERS FOR BOOT ---
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if (e.key === 'Enter') {
        if (bootState < 2) {
          setBootState(2);
        } else if (bootState === 2) {
          handleLogin();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [bootState]);

  useEffect(() => {
    const handleSysShutdown = (e) => {
      if (e.detail === 'restart') {
        playSound('shutdown');
        setBootText([]);
        setBootState(0);
      } else if (e.detail === 'shutdown') {
        playSound('shutdown');
        setBootState(4);
      } else if (e.detail === 'logoff') {
        setBootState(2);
      }
    };
    window.addEventListener('sys-shutdown', handleSysShutdown);
    return () => window.removeEventListener('sys-shutdown', handleSysShutdown);
  }, [playSound]);

  // --- FETCH APPS ---
  useEffect(() => {
    fetch(`${API_BASE_URL}/system-apps/`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        const formattedApps = data.map((item) => ({
          id: item.app_id,
          name: item.name,
          icon: item.icon,
          description: item.description,
          tech_stack: item.tech_stack,
          frontend_repo: item.frontend_repo,
          backend_repo: item.backend_repo,
          live_link: item.live_link,
          project_type: item.project_type,
          isProject: true // Tag to identify database items
        }));

        setSystemApps([
          { id: 'system-os', name: 'My Computer', icon: systemOsIcon },
          { id: 'network', name: 'Network Neighborhood', icon: networkIcon },
          { id: 'recycle-bin', name: 'Recycle Bin', icon: recycleBinIcon },
          { id: 'ie', name: 'Internet Explorer', icon: ieIcon },
          { id: 'notepad', name: 'Notepad', icon: notepadIcon, isSystemTool: true },
          { id: 'paint', name: 'Paint', icon: paintIcon, isSystemTool: true },
          { id: 'minesweeper', name: 'Minesweeper', icon: minesweeperIcon, isGame: true },
          { id: 'luma-ai', name: 'LUMA.EXE', icon: lumaAiIcon },
          { id: 'system-monitor', name: 'System Monitor', icon: sysMonitorIcon, isSystemTool: true },
          { id: 'about-us', name: 'About Vishal', icon: aboutUsIcon },
          { id: 'resume', name: 'Resume', icon: resumeIcon },
          { id: 'file-explorer', name: 'File Explorer', icon: fileExplorerIcon },
          { id: 'projects-folder', name: 'Projects', icon: folderIcon },
          { id: 'games-folder', name: 'Games', icon: gamesFolderIcon },
          { id: 'tic-tac-toe', name: 'Tic Tac Toe', icon: ticTacToeIcon, isGame: true },
          { id: 'problem-solver', name: 'MS-DOS Prompt', icon: problemSolverIcon, isGame: true },
          ...formattedApps,
          { id: 'settings', name: 'Control Panel', icon: settingsIcon }
        ]);
      })
      .catch((err) => {
        console.error('Failed to load apps from backend:', err);
        setSystemApps([
          { id: 'system-os', name: 'My Computer', icon: systemOsIcon },
          { id: 'settings', name: 'Control Panel', icon: settingsIcon }
        ]);
      });
  }, []);

  const handleLogin = () => {
    playSound('startup');
    setBootState(3);
  };

  const handleSkipBoot = () => {
    if (bootState < 2) setBootState(2);
  };

  const confirmShutdown = () => {
    setShowShutdown(false);
    if (shutdownChoice === 'logoff') {
      setBootState(2); // Go to login
    } else if (shutdownChoice === 'restart') {
      playSound('shutdown');
      setTimeout(() => {
        setBootText([]);
        setBootState(0);
      }, 2000);
    } else if (shutdownChoice === 'shutdown') {
      playSound('shutdown');
      setTimeout(() => setBootState(4), 1000); // Go to safe to turn off screen
    }
  };

  return (
    <div
      className="relative h-screen w-screen text-os-text overflow-hidden flex flex-col font-sans select-none"
      style={{ backgroundColor: bgTheme }}
      onClick={() => isStartMenuOpen && setIsStartMenuOpen(false)}
    >
      {isCrtMode && <div className="crt-overlay pointer-events-none z-[10001]"></div>}

      {bootState === 0 && (
        <div className="absolute inset-0 bg-black text-[#c0c0c0] font-mono text-sm md:text-lg p-4 md:p-6 z-[9999] overflow-hidden" onClick={handleSkipBoot}>
          <div className="absolute top-4 right-4 md:top-6 md:right-6 border border-yellow-500 text-yellow-500 px-2 py-1 flex items-center gap-2">
            <span className="text-lg md:text-xl font-bold italic">EPA</span>
            <span className="text-[10px] md:text-xs uppercase leading-tight">Pollution<br />Preventer</span>
          </div>
          {bootText.map((line, index) => <div key={index} className="break-words">{line}</div>)}
          <div className="mt-4 animate-pulse">_</div>
          <div className="absolute bottom-4 left-4 text-xs md:text-sm text-gray-600">Press ENTER or Click to skip</div>
        </div>
      )}

      {bootState === 1 && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-[9999]" onClick={handleSkipBoot}>
          <div className="text-3xl md:text-4xl font-sans font-bold text-os-white mb-8 tracking-widest italic">
            VISHAL OS <span className="text-os-teal">98</span>
          </div>
          <div className="w-48 md:w-64 h-6 border-2 border-os-gray p-1">
            <div className="h-full bg-os-navy w-1/2 animate-[slide_1.5s_infinite_linear]"></div>
          </div>
          <div className="absolute bottom-4 left-4 text-xs md:text-sm text-gray-600">Press ENTER or Click to skip</div>
          <style>{`@keyframes slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }`}</style>
        </div>
      )}

      {bootState === 2 && (
        <div className="absolute inset-0 flex items-center justify-center z-[9998]" style={{ backgroundColor: bgTheme }}>
          <div className="retro-window w-11/12 max-w-md shadow-retro-outset bg-os-gray border border-os-white mx-2">
            <div className="retro-title-bar bg-blue-900 text-white font-dialog font-bold px-1 flex justify-between items-center">
              <span>Welcome to Vishal OS</span>
              <button className="retro-btn px-2 py-0 h-[18px] text-xs leading-none" onClick={handleLogin}>X</button>
            </div>
            <div className="p-3 md:p-4 flex flex-col sm:flex-row gap-4">
              <div className="w-12 h-12 bg-os-navy flex items-center justify-center text-os-white font-bold text-xl shadow-retro-inset border border-os-dark-gray mx-auto sm:mx-0 shrink-0">
                V
              </div>
              <div className="flex-1 w-full">
                <p className="text-xs md:text-sm mb-4">Type a user name and password to log on to Windows.</p>
                <div className="flex items-center mb-2">
                  <label className="w-20 text-xs md:text-sm">User name:</label>
                  <input type="text" className="retro-input flex-1 shadow-retro-inset border border-os-dark-gray px-1 focus:outline-none focus:bg-blue-900 focus:text-white min-w-0" defaultValue="GUEST" />
                </div>
                <div className="flex items-center">
                  <label className="w-20 text-xs md:text-sm">Password:</label>
                  <input type="password" autoFocus className="retro-input flex-1 shadow-retro-inset border border-os-dark-gray px-1 focus:outline-none focus:bg-blue-900 focus:text-white min-w-0" />
                </div>
              </div>
            </div>
            <div className="bg-os-gray p-2 border-t border-os-dark-gray flex justify-end gap-2 shadow-retro-inset">
              <button className="retro-btn focus:ring-1 focus:ring-black outline-none w-20 text-xs py-1" onClick={handleLogin}>OK</button>
              <button className="retro-btn focus:ring-1 focus:ring-black outline-none w-20 text-xs py-1" onClick={handleLogin}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {bootState === 3 && (
        <>
          <SystemDialog />

          <Desktop
            systemApps={systemApps.filter(app => [
              'system-os', 'network', 'recycle-bin', 'ie', 'notepad', 'paint', 'minesweeper', 'luma-ai', 'about-us', 'resume', 'file-explorer',
              'projects-folder', 'games-folder', 'tic-tac-toe',
              'problem-solver', 'settings'
            ].includes(app.id))}
            onOpenApp={(id) => openApp(systemApps.find(a => a.id === id))}
          />

          {openApps.map((app) => (
            <Window
              key={app.id}
              app={app}
              onClose={() => closeApp(app.id)}
              onCloseApp={closeApp}
              onOpenApp={(id) => openApp(systemApps.find(a => a.id === id))}
              systemApps={systemApps}
              onFocus={() => focusWindow(app.id)}
              onMinimize={() => minimizeWindow(app.id)}
              onToggleMaximize={() => toggleMaximize(app.id)}
              onUpdatePosition={(pos) => updateWindowPosition(app.id, pos)}
              isCrtMode={isCrtMode}
              setIsCrtMode={setIsCrtMode}
              bgTheme={bgTheme}
              setBgTheme={setBgTheme}
              openWindowCount={openApps.length}
            />
          ))}

          {/* Custom Shutdown Modal */}
          {showShutdown && (
            <div className="absolute inset-0 z-[10000] flex items-center justify-center pointer-events-auto px-2">
              <div className="absolute inset-0 bg-transparent" onClick={(e) => { e.stopPropagation(); playSound('error'); }}></div>
              <div className="retro-window w-full max-w-sm shadow-retro-outset bg-os-gray border border-os-white relative z-10">
                <div className="retro-title-bar bg-blue-900 text-white font-dialog font-bold px-1 flex justify-between items-center cursor-default">
                  <span>Shut Down Windows</span>
                  <button className="retro-btn px-2 py-0 h-[18px] text-xs leading-none text-black bg-os-gray" onClick={() => setShowShutdown(false)}>X</button>
                </div>
                <div className="p-4 flex gap-4">
                  <div className="w-8 h-8 shrink-0 hidden sm:block">
                    <img src={systemOsIcon} alt="Computer" className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }} />
                  </div>
                  <div className="flex-1 font-sans text-sm text-os-text">
                    <p className="mb-2">What do you want the computer to do?</p>
                    <label className="flex items-center gap-2 mb-1 cursor-pointer">
                      <input type="radio" name="shutdown" value="shutdown" checked={shutdownChoice === 'shutdown'} onChange={(e) => { playSound('click'); setShutdownChoice(e.target.value); }} className="w-3 h-3 cursor-pointer shrink-0" />
                      Shut down
                    </label>
                    <label className="flex items-center gap-2 mb-1 cursor-pointer">
                      <input type="radio" name="shutdown" value="restart" checked={shutdownChoice === 'restart'} onChange={(e) => { playSound('click'); setShutdownChoice(e.target.value); }} className="w-3 h-3 cursor-pointer shrink-0" />
                      Restart
                    </label>
                    <label className="flex items-center gap-2 mb-1 cursor-pointer">
                      <input type="radio" name="shutdown" value="logoff" checked={shutdownChoice === 'logoff'} onChange={(e) => { playSound('click'); setShutdownChoice(e.target.value); }} className="w-3 h-3 cursor-pointer shrink-0" />
                      Log off Vishal
                    </label>
                  </div>
                </div>
                <div className="bg-os-gray p-2 border-t border-os-dark-gray flex justify-center gap-2 shadow-retro-inset mt-2 flex-wrap">
                  <button className="retro-btn w-20 py-1" onClick={() => { playSound('click'); confirmShutdown(); }}>OK</button>
                  <button className="retro-btn w-20 py-1" onClick={() => { playSound('click'); setShowShutdown(false); }}>Cancel</button>
                  <button className="retro-btn w-20 py-1" onClick={() => { playSound('click'); showSystemDialog({ type: 'info', message: 'Help not available.', buttons: ['OK'] }) }}>Help</button>
                </div>
              </div>
            </div>
          )}

          {isStartMenuOpen && (
            <div onClick={(e) => e.stopPropagation()}>
              <StartMenu
                systemApps={systemApps.filter(app => !['settings'].includes(app.id))}
                onOpenApp={(id) => { openApp(systemApps.find(a => a.id === id)); setIsStartMenuOpen(false); }}
                closeMenu={() => setIsStartMenuOpen(false)}
                onShutDown={() => { setShutdownChoice('shutdown'); setShowShutdown(true); }}
                onLogOff={() => { setShutdownChoice('logoff'); setShowShutdown(true); }}
              />
            </div>
          )}

          <TopSearch systemApps={systemApps} onOpenApp={(id) => openApp(systemApps.find(a => a.id === id))} />

          <Taskbar
            openApps={openApps}
            activeWindowId={activeWindowId}
            onCloseApp={closeApp}
            onOpenApp={(id) => openApp(systemApps.find(a => a.id === id))}
            onMinimizeApp={minimizeWindow}
            onFocusApp={focusWindow}
            isStartMenuOpen={isStartMenuOpen}
            toggleStartMenu={(e) => {
              if (e && e.stopPropagation) e.stopPropagation();
              setIsStartMenuOpen(!isStartMenuOpen);
            }}
          />
        </>
      )}

      {/* --- STATE 4: SAFE TO SHUTDOWN SCREEN --- */}
      {bootState === 4 && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-[9999]">
          <div className="text-[#ff8c00] font-sans text-2xl font-bold text-center tracking-wide">
            It is now safe to turn off your computer.
          </div>
          <button
            onClick={() => {
              setBootText([]);
              setBootState(0);
            }}
            className="mt-12 px-6 py-2 border-2 border-os-dark-gray bg-os-gray text-black font-bold font-sans active:shadow-retro-inset shadow-retro-outset"
          >
            Press Power Button
          </button>
        </div>
      )}
    </div>
  );
}

export default App;