import React, { useState, useEffect } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import StartMenu from './components/StartMenu';
import TopSearch from './components/TopSearch';
import VoiceAssistant from './components/VoiceAssistant';
import SystemDialog from './components/SystemDialog';
import SplashScreen from './components/SplashScreen'; // <-- NEW IMPORT
import { useWindowManager } from './hooks/useWindowManager';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSound } from './hooks/useSound';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';


const svgIcon = (svg) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
// --- RETRO PIXEL ICONS ---
// ------------------------------------------------------------
// MY COMPUTER
// ------------------------------------------------------------
const systemOsIcon = svgIcon(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <rect x="5" y="4" width="22" height="17" fill="#c0c0c0" stroke="#000" stroke-width="2"/>
    <rect x="8" y="7" width="16" height="11" fill="#000080"/>
    <rect x="10" y="9" width="12" height="7" fill="#008080"/>
    <rect x="14" y="21" width="4" height="3" fill="#808080"/>
    <rect x="10" y="24" width="12" height="3" fill="#c0c0c0" stroke="#000" stroke-width="1"/>
    <rect x="8" y="27" width="16" height="2" fill="#000"/>
  </svg>
`);

// ------------------------------------------------------------
// ABOUT VISHAL
// ------------------------------------------------------------
const aboutUsIcon = svgIcon(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <rect x="6" y="3" width="20" height="26" fill="#fff" stroke="#000" stroke-width="2"/>
    <rect x="9" y="6" width="14" height="8" fill="#000080"/>
    <rect x="13" y="8" width="6" height="4" fill="#c0c0c0"/>
    <rect x="10" y="17" width="12" height="2" fill="#000080"/>
    <rect x="10" y="21" width="9" height="2" fill="#808080"/>
    <rect x="10" y="25" width="12" height="2" fill="#808080"/>
  </svg>
`);

// ------------------------------------------------------------
// CONTROL PANEL
// ------------------------------------------------------------
const settingsIcon = svgIcon(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <rect x="4" y="4" width="24" height="24" fill="#c0c0c0" stroke="#000" stroke-width="2"/>
    <rect x="8" y="8" width="16" height="4" fill="#000080"/>
    <rect x="8" y="14" width="16" height="4" fill="#fff" stroke="#808080" stroke-width="1"/>
    <rect x="8" y="20" width="16" height="4" fill="#fff" stroke="#808080" stroke-width="1"/>
    <rect x="10" y="15" width="4" height="2" fill="#000080"/>
    <rect x="18" y="21" width="4" height="2" fill="#000080"/>
  </svg>
`);

// ------------------------------------------------------------
// CLOSED FOLDER
// ------------------------------------------------------------
const folderIcon = svgIcon(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <path d="M3 8h10l3 3h13v15H3z" fill="#000" />
    <path d="M4 7h9l3 3h12v14H4z" fill="#ffff00"/>
    <rect x="4" y="11" width="24" height="2" fill="#c0c000"/>
    <rect x="5" y="23" width="22" height="2" fill="#808000"/>
  </svg>
`);

// ------------------------------------------------------------
// FILE EXPLORER — OPEN FOLDER
// ------------------------------------------------------------
const fileExplorerIcon = svgIcon(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <path d="M3 8h9l3 3h14v15H3z" fill="#000"/>
    <path d="M4 7h8l3 3h13v14H4z" fill="#ffff00"/>
    <path d="M5 12h23l-4 12H5z" fill="#ffd700"/>
    <rect x="5" y="22" width="18" height="2" fill="#808000"/>
    <rect x="15" y="10" width="12" height="2" fill="#c0c000"/>
  </svg>
`);

// ------------------------------------------------------------
// RESUME / DOCUMENT
// ------------------------------------------------------------
const resumeIcon = svgIcon(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <path d="M7 3h14l5 5v21H7z" fill="#000"/>
    <path d="M8 4h12l5 5v19H8z" fill="#fff"/>
    <path d="M20 4v6h6" fill="#c0c0c0"/>
    <rect x="11" y="13" width="12" height="2" fill="#000080"/>
    <rect x="11" y="17" width="10" height="2" fill="#808080"/>
    <rect x="11" y="21" width="12" height="2" fill="#808080"/>
    <rect x="11" y="25" width="7" height="2" fill="#808080"/>
  </svg>
`);

// ------------------------------------------------------------
// GAMES FOLDER
// ------------------------------------------------------------
const gamesFolderIcon = svgIcon(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <path d="M3 8h10l3 3h13v15H3z" fill="#000"/>
    <path d="M4 7h9l3 3h12v14H4z" fill="#ffff00"/>
    <rect x="5" y="13" width="22" height="9" fill="#000080"/>
    <rect x="9" y="16" width="6" height="2" fill="#fff"/>
    <rect x="11" y="14" width="2" height="6" fill="#fff"/>
    <rect x="19" y="15" width="2" height="2" fill="#fff"/>
    <rect x="22" y="18" width="2" height="2" fill="#fff"/>
  </svg>
`);

// ------------------------------------------------------------
// TIC TAC TOE
// ------------------------------------------------------------
const ticTacToeIcon = svgIcon(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <rect x="4" y="4" width="24" height="24" fill="#c0c0c0" stroke="#000" stroke-width="2"/>
    <rect x="8" y="8" width="16" height="16" fill="#fff"/>
    <rect x="13" y="8" width="2" height="16" fill="#000080"/>
    <rect x="19" y="8" width="2" height="16" fill="#000080"/>
    <rect x="8" y="13" width="16" height="2" fill="#000080"/>
    <rect x="8" y="19" width="16" height="2" fill="#000080"/>
    <rect x="9" y="9" width="3" height="3" fill="#ff0000"/>
    <rect x="21" y="21" width="3" height="3" fill="#0000ff"/>
  </svg>
`);

// ------------------------------------------------------------
// MS-DOS PROMPT
// ------------------------------------------------------------
const problemSolverIcon = svgIcon(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <rect x="3" y="4" width="26" height="24" fill="#000" stroke="#fff" stroke-width="1"/>
    <rect x="5" y="6" width="22" height="19" fill="#000080"/>
    <rect x="7" y="9" width="4" height="2" fill="#fff"/>
    <rect x="9" y="11" width="4" height="2" fill="#fff"/>
    <rect x="7" y="15" width="2" height="2" fill="#00ff00"/>
    <rect x="10" y="15" width="12" height="2" fill="#00ff00"/>
    <rect x="7" y="20" width="2" height="2" fill="#fff"/>
    <rect x="10" y="20" width="8" height="2" fill="#fff"/>
    <rect x="5" y="25" width="22" height="1" fill="#c0c0c0"/>
  </svg>
`);

// ------------------------------------------------------------
// RECYCLE BIN
// ------------------------------------------------------------
const recycleBinIcon = svgIcon(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <rect x="9" y="6" width="14" height="3" fill="#808080" stroke="#000" stroke-width="1"/>
    <rect x="7" y="9" width="18" height="3" fill="#c0c0c0" stroke="#000" stroke-width="1"/>
    <path d="M10 12h12l-2 16H12z" fill="#c0c0c0" stroke="#000" stroke-width="2"/>
    <rect x="13" y="15" width="2" height="10" fill="#808080"/>
    <rect x="17" y="15" width="2" height="10" fill="#808080"/>
    <rect x="12" y="28" width="9" height="2" fill="#000"/>
  </svg>
`);

// ------------------------------------------------------------
// NETWORK NEIGHBORHOOD
// ------------------------------------------------------------
const networkIcon = svgIcon(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <rect x="3" y="7" width="11" height="9" fill="#c0c0c0" stroke="#000" stroke-width="2"/>
    <rect x="18" y="7" width="11" height="9" fill="#c0c0c0" stroke="#000" stroke-width="2"/>
    <rect x="6" y="10" width="5" height="3" fill="#000080"/>
    <rect x="21" y="10" width="5" height="3" fill="#000080"/>
    <rect x="8" y="16" width="2" height="5" fill="#000"/>
    <rect x="23" y="16" width="2" height="5" fill="#000"/>
    <rect x="8" y="20" width="17" height="2" fill="#000"/>
    <rect x="15" y="20" width="2" height="7" fill="#000"/>
    <rect x="11" y="26" width="10" height="2" fill="#c0c0c0"/>
  </svg>
`);

// ------------------------------------------------------------
// INTERNET EXPLORER
// ------------------------------------------------------------
const ieIcon = svgIcon(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <circle cx="16" cy="16" r="13" fill="#000080" stroke="#000" stroke-width="1"/>
    <path d="M5 14h20l-2 3H7z" fill="#ffff00"/>
    <path d="M8 12c3-5 10-7 15-3l-2 3c-4-3-8-2-11 2z" fill="#00ffff"/>
    <path d="M8 20c4 4 10 4 14 0l2 2c-5 6-14 6-19 0z" fill="#fff"/>
    <rect x="13" y="12" width="7" height="2" fill="#ff0000"/>
  </svg>
`);

// ------------------------------------------------------------
// LUMA.EXE
// ------------------------------------------------------------
const lumaAiIcon = svgIcon(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <rect x="7" y="7" width="18" height="18" fill="#c0c0c0" stroke="#000" stroke-width="2"/>
    <rect x="10" y="10" width="12" height="10" fill="#000080"/>
    <rect x="12" y="12" width="3" height="3" fill="#00ffff"/>
    <rect x="17" y="12" width="3" height="3" fill="#00ffff"/>
    <rect x="13" y="17" width="6" height="2" fill="#fff"/>
    <rect x="14" y="4" width="4" height="3" fill="#c0c0c0" stroke="#000" stroke-width="1"/>
    <rect x="4" y="12" width="3" height="5" fill="#c0c0c0" stroke="#000" stroke-width="1"/>
    <rect x="25" y="12" width="3" height="5" fill="#c0c0c0" stroke="#000" stroke-width="1"/>
    <rect x="11" y="25" width="3" height="3" fill="#000"/>
    <rect x="18" y="25" width="3" height="3" fill="#000"/>
  </svg>
`);

// ------------------------------------------------------------
// SYSTEM MONITOR
// ------------------------------------------------------------
const sysMonitorIcon = svgIcon(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <rect x="4" y="4" width="24" height="19" fill="#c0c0c0" stroke="#000" stroke-width="2"/>
    <rect x="7" y="7" width="18" height="13" fill="#000"/>
    <rect x="9" y="17" width="2" height="2" fill="#00ff00"/>
    <rect x="11" y="14" width="2" height="5" fill="#00ff00"/>
    <rect x="13" y="16" width="2" height="3" fill="#00ff00"/>
    <rect x="15" y="11" width="2" height="8" fill="#00ff00"/>
    <rect x="17" y="13" width="2" height="6" fill="#00ff00"/>
    <rect x="19" y="9" width="2" height="10" fill="#00ff00"/>
    <rect x="21" y="12" width="2" height="7" fill="#00ff00"/>
    <rect x="14" y="23" width="4" height="3" fill="#808080"/>
    <rect x="10" y="26" width="12" height="2" fill="#c0c0c0" stroke="#000" stroke-width="1"/>
  </svg>
`);

// ------------------------------------------------------------
// NOTEPAD
// ------------------------------------------------------------
const notepadIcon = svgIcon(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <path d="M6 2h15l5 5v23H6z" fill="#000"/>
    <path d="M7 3h13l5 5v21H7z" fill="#fff"/>
    <path d="M20 3v6h5" fill="#c0c0c0"/>
    <rect x="10" y="13" width="12" height="2" fill="#000080"/>
    <rect x="10" y="17" width="13" height="2" fill="#808080"/>
    <rect x="10" y="21" width="11" height="2" fill="#808080"/>
    <rect x="10" y="25" width="7" height="2" fill="#808080"/>
  </svg>
`);

// ------------------------------------------------------------
// PAINT
// ------------------------------------------------------------
const paintIcon = svgIcon(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <path d="M6 5h19v18H6z" fill="#000"/>
    <path d="M7 6h17v16H7z" fill="#fff"/>
    <rect x="9" y="8" width="4" height="4" fill="#ff0000"/>
    <rect x="14" y="8" width="4" height="4" fill="#00aa00"/>
    <rect x="19" y="8" width="3" height="4" fill="#0000ff"/>
    <rect x="9" y="13" width="4" height="4" fill="#ffff00"/>
    <rect x="14" y="13" width="4" height="4" fill="#ff00ff"/>
    <rect x="19" y="13" width="3" height="4" fill="#00ffff"/>
    <rect x="10" y="19" width="10" height="2" fill="#808080"/>
    <path d="M20 22l7 7-3 1-7-7z" fill="#ffff00" stroke="#000" stroke-width="1"/>
  </svg>
`);

// ------------------------------------------------------------
// MINESWEEPER
// ------------------------------------------------------------
const minesweeperIcon = svgIcon(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <rect x="4" y="4" width="24" height="24" fill="#c0c0c0" stroke="#000" stroke-width="2"/>
    <rect x="7" y="7" width="18" height="18" fill="#fff"/>
    <rect x="10" y="10" width="4" height="4" fill="#808080"/>
    <rect x="15" y="10" width="4" height="4" fill="#c0c0c0" stroke="#000" stroke-width="1"/>
    <rect x="20" y="10" width="4" height="4" fill="#808080"/>
    <rect x="10" y="15" width="4" height="4" fill="#c0c0c0" stroke="#000" stroke-width="1"/>
    <circle cx="20" cy="19" r="4" fill="#000"/>
    <rect x="18" y="13" width="4" height="3" fill="#000"/>
    <rect x="18" y="23" width="4" height="3" fill="#000"/>
    <rect x="13" y="17" width="3" height="4" fill="#000"/>
    <rect x="24" y="17" width="3" height="4" fill="#000"/>
    <rect x="19" y="17" width="2" height="2" fill="#fff"/>
  </svg>
`);

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
    // Instantly skip to Desktop if session storage is already set
    if (sessionStorage.getItem('vishal_os_splash_seen') === 'true') {
      setBootState(3);
      return;
    }

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
          setTimeout(() => setBootState(1), 800);
        }
      }, 80);
      return () => clearInterval(interval);
    }
  }, [bootState]);

  // Handle BIOS Skip
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if (e.key === 'Enter' && bootState === 0) {
        setBootState(1);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [bootState]);

  // Handle System Reboot/Logoff events
  useEffect(() => {
    const handleSysShutdown = (e) => {
      if (e.detail === 'restart') {
        playSound('shutdown');
        sessionStorage.removeItem('vishal_os_splash_seen');
        setBootText([]);
        setBootState(0);
      } else if (e.detail === 'shutdown') {
        playSound('shutdown');
        setBootState(4);
      } else if (e.detail === 'logoff') {
        sessionStorage.removeItem('vishal_os_splash_seen');
        setBootState(1);
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

  const confirmShutdown = () => {
    setShowShutdown(false);
    if (shutdownChoice === 'logoff') {
      sessionStorage.removeItem('vishal_os_splash_seen');
      setBootState(1); 
    } else if (shutdownChoice === 'restart') {
      playSound('shutdown');
      sessionStorage.removeItem('vishal_os_splash_seen');
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

      {/* --- STATE 0: BIOS SCREEN --- */}
      {bootState === 0 && (
        <div className="absolute inset-0 bg-black text-[#c0c0c0] font-mono text-sm md:text-lg p-4 md:p-6 z-[9999] overflow-hidden" onClick={() => setBootState(1)}>
          <div className="absolute top-4 right-4 md:top-6 md:right-6 border border-yellow-500 text-yellow-500 px-2 py-1 flex items-center gap-2">
            <span className="text-lg md:text-xl font-bold italic">EPA</span>
            <span className="text-[10px] md:text-xs uppercase leading-tight">Pollution<br />Preventer</span>
          </div>
          {bootText.map((line, index) => <div key={index} className="break-words">{line}</div>)}
          <div className="mt-4 animate-pulse">_</div>
          <div className="absolute bottom-4 left-4 text-xs md:text-sm text-gray-600">Press ENTER or Click to skip</div>
        </div>
      )}

      {/* --- STATE 1: SMART 90s SPLASH SCREEN --- */}
      {bootState === 1 && (
        <SplashScreen 
          apiUrl={API_BASE_URL} 
          onComplete={() => setBootState(3)} 
        />
      )}

      {/* --- STATE 3: OS DESKTOP ENVIRONMENT --- */}
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