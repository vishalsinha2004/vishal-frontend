import React, { useState, useEffect } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import StartMenu from './components/StartMenu';
import TopSearch from './components/TopSearch';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// --- NEW: Perfect SVG Data URIs so the Native Apps never have broken icons ---
const systemOsIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234FC3F7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='2' y='3' width='20' height='14' rx='2' ry='2'/%3E%3Cline x1='8' y1='21' x2='16' y2='21'/%3E%3Cline x1='12' y1='17' x2='12' y2='21'/%3E%3C/svg%3E";
const settingsIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3Cpath d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'/%3E%3C/svg%3E";

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
          live_link: item.live_link
        }));
        
        // Native OS Apps are appended here automatically!
        setSystemApps([
          { id: 'system-os', name: 'System OS', icon: systemOsIcon },
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
          &gt; Loading System Modules from Supabase...
        </div>
      ) : (
        <Desktop systemApps={systemApps.filter(app => app.id !== 'settings')} onOpenApp={openApp} />
      )}

      {openApps.map((app) => (
        <Window 
          key={app.id} 
          app={app} 
          onClose={closeApp} 
          bgTheme={bgTheme} 
          setBgTheme={setBgTheme}
          accentColor={accentColor}
          setAccentColor={setAccentColor}
        />
      ))}

      {isStartMenuOpen && (
        <div onClick={(e) => e.stopPropagation()}>
          <StartMenu
            systemApps={systemApps.filter(app => app.id !== 'settings')}
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