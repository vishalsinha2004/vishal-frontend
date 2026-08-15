import React, { useState, useEffect } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import StartMenu from './components/StartMenu';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function App() {
  const [systemApps, setSystemApps] = useState([]);
  const [openApps, setOpenApps] = useState([]);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch installed apps from Django backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/system-apps/`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        // Map backend schema to frontend expectations
        const formattedApps = data.map((item) => ({
          id: item.app_id,
          name: item.name,
          icon: item.icon,
        }));
        setSystemApps(formattedApps);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load apps from backend:', err);
        // Fallback default apps if backend is unreachable
        setSystemApps([
          { id: 'finder', name: 'Finder', icon: '🔍' },
          { id: 'markai', name: 'MarkAI', icon: '🤖' },
          { id: 'notesroom', name: 'Notesroom', icon: '📝' },
          { id: 'terminal', name: 'Terminal', icon: '💻' },
        ]);
        setLoading(false);
      });
  }, []);

  const openApp = (appId) => {
    if (!openApps.find((app) => app.id === appId)) {
      const appToOpen = systemApps.find((app) => app.id === appId);
      if (appToOpen) {
        setOpenApps([...openApps, appToOpen]);
      }
    }
  };

  const closeApp = (appId) => {
    setOpenApps(openApps.filter((app) => app.id !== appId));
  };

  return (
    <div
      className="relative h-screen w-screen bg-space-black text-space-white overflow-hidden flex flex-col"
      onClick={() => isStartMenuOpen && setIsStartMenuOpen(false)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a2e] via-space-black to-black opacity-80 pointer-events-none"></div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center font-mono text-thruster-glow animate-pulse">
          &gt; Loading System Modules from Supabase...
        </div>
      ) : (
        <Desktop systemApps={systemApps} onOpenApp={openApp} />
      )}

      {openApps.map((app) => (
        <Window key={app.id} app={app} onClose={closeApp} />
      ))}

      {isStartMenuOpen && (
        <div onClick={(e) => e.stopPropagation()}>
          <StartMenu
            systemApps={systemApps}
            onOpenApp={openApp}
            closeMenu={() => setIsStartMenuOpen(false)}
          />
        </div>
      )}

      <Taskbar
        openApps={openApps}
        toggleStartMenu={(e) => {
          e.stopPropagation();
          setIsStartMenuOpen(!isStartMenuOpen);
        }}
      />
    </div>
  );
}

export default App;