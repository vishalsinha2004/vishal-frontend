import React, { useState, useEffect } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import StartMenu from './components/StartMenu';
import TopSearch from './components/TopSearch';
import VoiceAssistant from './components/VoiceAssistant';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// --- RETRO PIXEL ICONS (Base64 or external links for 90s aesthetic) ---
// Note: We use simple placeholder geometric representations of classic icons until pixel art is swapped in.

const systemOsIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='4' y='4' width='24' height='24' fill='%23c0c0c0' stroke='%23000' stroke-width='2'/%3E%3Crect x='8' y='8' width='16' height='12' fill='%23000080' stroke='%23000' stroke-width='2'/%3E%3Crect x='6' y='22' width='20' height='4' fill='%23808080'/%3E%3C/svg%3E";

const aboutUsIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='6' y='4' width='20' height='24' fill='%23fff' stroke='%23000' stroke-width='2'/%3E%3Ccircle cx='16' cy='12' r='4' fill='%23000080'/%3E%3Cpath d='M10 24v-2c0-3 3-4 6-4s6 1 6 4v2' fill='%23000080'/%3E%3C/svg%3E";

const settingsIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='4' y='4' width='24' height='24' fill='%23c0c0c0' stroke='%23000' stroke-width='2'/%3E%3Ccircle cx='16' cy='16' r='6' fill='%23808080' stroke='%23000' stroke-width='2'/%3E%3Crect x='14' y='8' width='4' height='16' fill='%23000'/%3E%3Crect x='8' y='14' width='16' height='4' fill='%23000'/%3E%3C/svg%3E";

const folderIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M4 8h8l2 4h14v12H4z' fill='%23ffff00' stroke='%23000' stroke-width='2' stroke-linejoin='miter'/%3E%3Cpath d='M4 12h24' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E";

const fileExplorerIcon = folderIcon;

const resumeIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='6' y='4' width='20' height='24' fill='%23fff' stroke='%23000' stroke-width='2'/%3E%3Cline x1='10' y1='10' x2='22' y2='10' stroke='%23000' stroke-width='2'/%3E%3Cline x1='10' y1='14' x2='22' y2='14' stroke='%23000' stroke-width='2'/%3E%3Cline x1='10' y1='18' x2='18' y2='18' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E";

const gamesFolderIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M4 8h8l2 4h14v12H4z' fill='%23ff00ff' stroke='%23000' stroke-width='2' stroke-linejoin='miter'/%3E%3Ccircle cx='16' cy='18' r='4' fill='%23fff' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E";

const ticTacToeIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='4' y='4' width='24' height='24' fill='%23fff' stroke='%23000' stroke-width='2'/%3E%3Cline x1='12' y1='6' x2='12' y2='26' stroke='%23000' stroke-width='2'/%3E%3Cline x1='20' y1='6' x2='20' y2='26' stroke='%23000' stroke-width='2'/%3E%3Cline x1='6' y1='12' x2='26' y2='12' stroke='%23000' stroke-width='2'/%3E%3Cline x1='6' y1='20' x2='26' y2='20' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E";

const problemSolverIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='4' y='4' width='24' height='24' fill='%23000' stroke='%23000' stroke-width='2'/%3E%3Ctext x='8' y='20' font-family='monospace' font-size='16' fill='%2300ff00'\>C:\\\</text\>%3C/svg%3E";


function App() {
  const [systemApps, setSystemApps] = useState([]);
  const [openApps, setOpenApps] = useState([]);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  
  // Retro Boot Sequence States
  const [bootState, setBootState] = useState(0); // 0: BIOS, 1: Loading OS, 2: Login, 3: Desktop
  const [bootText, setBootText] = useState([]);

  // Theme configuration (Persisted)
  const [isCrtMode, setIsCrtMode] = useState(true);

  // BIOS Boot Sequence Logic
  useEffect(() => {
    const biosLines = [
      "VISHAL OS 98 System BIOS v1.0",
      "Copyright (C) 1998 Vishal Sinha",
      "",
      "Main Processor: Pentium(R) II 300 MHz",
      "Memory Test:  65536K OK",
      "",
      "Detecting Primary Master ... HARD DISK",
      "Detecting Primary Slave  ... NONE",
      "Detecting Keyboard       ... OK",
      "Detecting Mouse          ... OK",
      "",
      "Loading system files...",
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
      }, 150); // Speed of BIOS text appearing
      return () => clearInterval(interval);
    }

    if (bootState === 1) {
      const timer = setTimeout(() => {
        setBootState(2); // Move to Login screen
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [bootState]);

  // Fetch Apps from Backend
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
          project_type: item.project_type
        }));
        
        setSystemApps([
          { id: 'system-os', name: 'My Computer', icon: systemOsIcon },
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
        // Fallback so development doesn't break
        setSystemApps([
           { id: 'system-os', name: 'My Computer', icon: systemOsIcon },
           { id: 'settings', name: 'Control Panel', icon: settingsIcon }
        ]);
      });
  }, []);

  const openApp = (appId) => {
    if (!openApps.find((app) => app.id === appId)) {
      const appToOpen = systemApps.find((app) => app.id === appId);
      if (appToOpen) setOpenApps([...openApps, appToOpen]);
    }
  };

  const closeApp = (appId) => {
    setOpenApps(openApps.filter((app) => app.id !== appId));
  };

  const handleLogin = () => {
    // Play startup sound here eventually
    setBootState(3);
  };

  // Skip boot sequence on click
  const handleSkipBoot = () => {
    if (bootState < 3) setBootState(3);
  };

  return (
    <div
      className="relative h-screen w-screen bg-os-teal text-os-text overflow-hidden flex flex-col font-sans select-none"
      onClick={() => isStartMenuOpen && setIsStartMenuOpen(false)}
    >
      {/* Optional CRT Overlay Effect */}
      {isCrtMode && <div className="crt-overlay pointer-events-none"></div>}

      {/* --- STATE 0: BIOS BOOT SCREEN --- */}
      {bootState === 0 && (
        <div className="absolute inset-0 bg-black text-[#c0c0c0] font-mono text-lg p-6 z-[9999]" onClick={handleSkipBoot}>
          {bootText.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
          <div className="mt-4 animate-pulse">_</div>
          <div className="absolute bottom-4 left-4 text-sm text-gray-600">Click anywhere to skip boot sequence</div>
        </div>
      )}

      {/* --- STATE 1: WINDOWS LOADING LOGO --- */}
      {bootState === 1 && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-[9999]" onClick={handleSkipBoot}>
          <div className="text-4xl font-sans font-bold text-os-white mb-8 tracking-widest italic">
            VISHAL OS <span className="text-os-teal">98</span>
          </div>
          <div className="w-64 h-6 border-2 border-os-gray p-1">
             <div className="h-full bg-os-navy w-1/2 animate-[slide_1.5s_infinite_linear]"></div>
          </div>
          <style>{`
            @keyframes slide {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(200%); }
            }
          `}</style>
        </div>
      )}

      {/* --- STATE 2: LOGIN SCREEN --- */}
      {bootState === 2 && (
        <div className="absolute inset-0 bg-os-teal flex items-center justify-center z-[9998]">
           <div className="retro-window w-96">
              <div className="retro-title-bar">
                 <span>Welcome to Vishal OS</span>
                 <button className="retro-btn px-2 py-0 h-5" onClick={handleLogin}>X</button>
              </div>
              <div className="p-4 flex gap-4">
                 <div className="w-12 h-12 bg-os-navy flex items-center justify-center text-os-white font-bold text-xl border-2 border-os-gray">
                   V
                 </div>
                 <div className="flex-1">
                    <p className="text-sm mb-4">Type a user name and password to log on to Windows.</p>
                    <div className="flex items-center mb-2">
                       <label className="w-20 text-sm">User name:</label>
                       <input type="text" className="retro-input flex-1" defaultValue="GUEST" />
                    </div>
                    <div className="flex items-center">
                       <label className="w-20 text-sm">Password:</label>
                       <input type="password" className="retro-input flex-1" />
                    </div>
                 </div>
              </div>
              <div className="bg-os-gray p-2 border-t border-os-dark-gray flex justify-end gap-2 shadow-retro-inset">
                 <button className="retro-btn" onClick={handleLogin}>OK</button>
                 <button className="retro-btn" onClick={handleLogin}>Cancel</button>
              </div>
           </div>
        </div>
      )}

      {/* --- STATE 3: MAIN DESKTOP ENVIRONMENT --- */}
      {/* --- STATE 3: MAIN DESKTOP ENVIRONMENT --- */}
      {bootState === 3 && (
        <>
          <Desktop 
            systemApps={systemApps.filter(app => [
              'system-os', 
              'about-us', 
              'resume', 
              'file-explorer', 
              'projects-folder', 
              'games-folder',
              'tic-tac-toe',        
              'problem-solver',     
              'settings'
            ].includes(app.id))} 
            onOpenApp={openApp} 
          />

          {openApps.map((app) => (
            <Window 
              key={app.id} 
              app={app} 
              onClose={closeApp} 
              onOpenApp={openApp}       
              systemApps={systemApps}   
            />
          ))}

          {/* Retro Start Menu Overlay */}
          {isStartMenuOpen && (
            <div onClick={(e) => e.stopPropagation()}>
              <StartMenu
                systemApps={systemApps.filter(app => !['settings'].includes(app.id))}
                onOpenApp={openApp}
                closeMenu={() => setIsStartMenuOpen(false)}
              />
            </div>
          )}

          {/* --- ADD THIS LINE HERE --- */}
          <TopSearch systemApps={systemApps} onOpenApp={openApp} />

          {/* Voice Assistant */}
          {/* <VoiceAssistant /> */}

          <Taskbar
            openApps={openApps}
            onCloseApp={closeApp}       
            onOpenApp={openApp}
            isStartMenuOpen={isStartMenuOpen}
            toggleStartMenu={(e) => {
              e.stopPropagation();
              setIsStartMenuOpen(!isStartMenuOpen);
            }}
          />
        </>
      )}
    </div>
  );
}

export default App;