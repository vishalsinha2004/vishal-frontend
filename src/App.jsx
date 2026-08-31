import React, { useState, useEffect } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import StartMenu from './components/StartMenu';
import TopSearch from './components/TopSearch';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// --- UPGRADED PROFESSIONAL SVG ICONS ---

// System OS: High-tech CPU/Microchip
const systemOsIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234FC3F7' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='4' y='4' width='16' height='16' rx='2' ry='2'/%3E%3Crect x='9' y='9' width='6' height='6'/%3E%3Cline x1='9' y1='1' x2='9' y2='4'/%3E%3Cline x1='15' y1='1' x2='15' y2='4'/%3E%3Cline x1='9' y1='20' x2='9' y2='23'/%3E%3Cline x1='15' y1='20' x2='15' y2='23'/%3E%3Cline x1='20' y1='9' x2='23' y2='9'/%3E%3Cline x1='20' y1='14' x2='23' y2='14'/%3E%3Cline x1='1' y1='9' x2='4' y2='9'/%3E%3Cline x1='1' y1='14' x2='4' y2='14'/%3E%3C/svg%3E";

// About Vishal: Modern ID Badge / Access Card
const aboutUsIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234ade80' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='12' cy='10' r='3'/%3E%3Cpath d='M7 22v-2a5 5 0 0 1 10 0v2'/%3E%3C/svg%3E";

// Settings: Professional Control Sliders
const settingsIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='4' y1='21' x2='4' y2='14'/%3E%3Cline x1='4' y1='10' x2='4' y2='3'/%3E%3Cline x1='12' y1='21' x2='12' y2='12'/%3E%3Cline x1='12' y1='8' x2='12' y2='3'/%3E%3Cline x1='20' y1='21' x2='20' y2='16'/%3E%3Cline x1='20' y1='12' x2='20' y2='3'/%3E%3Cline x1='1' y1='14' x2='7' y2='14'/%3E%3Cline x1='9' y1='8' x2='15' y2='8'/%3E%3Cline x1='17' y1='16' x2='23' y2='16'/%3E%3C/svg%3E";

// Projects Folder: Folder with Code Brackets
const folderIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FCD34D' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'/%3E%3Cpolyline points='9 14 7 12 9 10'/%3E%3Cpolyline points='15 14 17 12 15 10'/%3E%3C/svg%3E";

// File Explorer: Directory Grid / Server Rack
// File Explorer: Professional Filing Cabinet / Archive
const fileExplorerIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2360A5FA' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='4' y='2' width='16' height='20' rx='2' ry='2'/%3E%3Cline x1='4' y1='12' x2='20' y2='12'/%3E%3Cline x1='10' y1='7' x2='14' y2='7'/%3E%3Cline x1='10' y1='17' x2='14' y2='17'/%3E%3C/svg%3E";

// Resume: Smart Profile Document
const resumeIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23C084FC' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/%3E%3Cpolyline points='14 2 14 8 20 8'/%3E%3Ccircle cx='10' cy='13' r='2'/%3E%3Cpath d='M7 19v-1a3 3 0 0 1 6 0v1'/%3E%3C/svg%3E";

// Games Folder: Folder with Gamepad / D-Pad
const gamesFolderIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23A78BFA' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'/%3E%3Cline x1='6' y1='12' x2='10' y2='12'/%3E%3Cline x1='8' y1='10' x2='8' y2='14'/%3E%3Cline x1='15' y1='13' x2='15.01' y2='13'/%3E%3Cline x1='18' y1='11' x2='18.01' y2='11'/%3E%3C/svg%3E";

// Tic Tac Toe: Exact Custom Wooden Match 
const ticTacToeIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect x='1' y='1' width='22' height='22' rx='2' fill='%23e6c28f'/%3E%3Cpath d='M8.5 2v20M15.5 2v20M2 8.5h20M2 15.5h20' stroke='%235a3a22' stroke-width='1.5' stroke-linecap='round'/%3E%3Cg stroke='%23f25c05' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M3 3l4 4M7 3l-4 4'/%3E%3Cpath d='M17 3l4 4M21 3l-4 4'/%3E%3Cpath d='M10 10l4 4M14 10l-4 4'/%3E%3Cpath d='M3 17l4 4M7 17l-4 4'/%3E%3Cpath d='M17 17l4 4M21 17l-4 4'/%3E%3C/g%3E%3Cg stroke='%231a1a1a' stroke-width='2' fill='none'%3E%3Ccircle cx='12' cy='5' r='2'/%3E%3Ccircle cx='5' cy='12' r='2'/%3E%3Ccircle cx='19' cy='12' r='2'/%3E%3Ccircle cx='12' cy='19' r='2'/%3E%3C/g%3E%3C/svg%3E";

// Problem Solver: Cyber Radar / Target Crosshair
const problemSolverIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2334D399' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ccircle cx='12' cy='12' r='6'/%3E%3Ccircle cx='12' cy='12' r='2'/%3E%3Cline x1='12' y1='2' x2='12' y2='6'/%3E%3Cline x1='12' y1='18' x2='12' y2='22'/%3E%3Cline x1='2' y1='12' x2='6' y2='12'/%3E%3Cline x1='18' y1='12' x2='22' y2='12'/%3E%3C/svg%3E";


function App() {
  const [systemApps, setSystemApps] = useState([]);
  const [openApps, setOpenApps] = useState([]);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [bgTheme, setBgTheme] = useState('space');
  const [accentColor, setAccentColor] = useState('#4FC3F7');

  useEffect(() => {
    document.documentElement.style.setProperty('--color-thruster-glow', accentColor);
  }, [accentColor]);

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
        
        // Added Problem Solver App (tagged with isGame: true)
        setSystemApps([
          { id: 'system-os', name: 'System OS', icon: systemOsIcon },
          { id: 'about-us', name: 'About Vishal', icon: aboutUsIcon },
          { id: 'resume', name: 'Resume', icon: resumeIcon },
          { id: 'file-explorer', name: 'File Explorer', icon: fileExplorerIcon },
          { id: 'projects-folder', name: 'All Projects', icon: folderIcon },
          { id: 'games-folder', name: 'Games', icon: gamesFolderIcon }, 
          { id: 'tic-tac-toe', name: 'Tic Tac Toe', icon: ticTacToeIcon, isGame: true }, 
          { id: 'problem-solver', name: 'Problem Solver', icon: problemSolverIcon, isGame: true }, 
          ...formattedApps, 
          { id: 'settings', name: 'Settings', icon: settingsIcon }
        ]);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load apps from backend:', err);
        setLoading(false);
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

  const renderBackground = () => {
    if (bgTheme === 'matrix') {
      return <div className="absolute inset-0 bg-[#000000] opacity-90 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMTEyMjExIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')]"></div>;
    }
    if (bgTheme === 'solid') {
      return <div className="absolute inset-0 bg-space-black pointer-events-none"></div>;
    }
    return <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a2e] via-space-black to-black opacity-80 pointer-events-none animate-pulse duration-[10000ms]"></div>;
  };

  return (
    <div
      className="relative h-screen w-screen bg-space-black text-space-white overflow-hidden flex flex-col"
      onClick={() => isStartMenuOpen && setIsStartMenuOpen(false)}
    >
      {renderBackground()}

      <TopSearch 
        systemApps={systemApps} 
        onOpenApp={openApp} 
      />

      {loading ? (
        <div className="flex-1 flex items-center justify-center font-mono text-thruster-glow animate-pulse">
          &gt; Loading System Modules from Database...
        </div>
      ) : (
        <Desktop 
          systemApps={systemApps.filter(app => ['system-os', 'about-us', 'resume', 'file-explorer', 'projects-folder', 'games-folder'].includes(app.id))} 
          onOpenApp={openApp} 
        />
      )}

      {openApps.map((app) => (
        <Window 
          key={app.id} 
          app={app} 
          onClose={closeApp} 
          onOpenApp={openApp}       
          systemApps={systemApps}   
          bgTheme={bgTheme} 
          setBgTheme={setBgTheme}
          accentColor={accentColor}
          setAccentColor={setAccentColor}
        />
      ))}

      {isStartMenuOpen && (
        <div onClick={(e) => e.stopPropagation()}>
          <StartMenu
            systemApps={systemApps.filter(app => !['settings'].includes(app.id))}
            onOpenApp={openApp}
            closeMenu={() => setIsStartMenuOpen(false)}
          />
        </div>
      )}

      <Taskbar
        openApps={openApps}
        onCloseApp={closeApp}       
        onOpenApp={openApp}
        toggleStartMenu={(e) => {
          e.stopPropagation();
          setIsStartMenuOpen(!isStartMenuOpen);
        }}
      />
    </div>
  );
}

export default App;