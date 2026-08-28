import React, { useState, useEffect } from 'react';

const StartMenu = ({ systemApps, onOpenApp, closeMenu }) => {
  const [aboutData, setAboutData] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

  // Fetch the real user data for the Start Menu profile header
  useEffect(() => {
    fetch(`${apiUrl}/about-us/`)
      .then((res) => {
        if (!res.ok) throw new Error('API Endpoint not found');
        return res.json();
      })
      .then((data) => {
        const profile = Array.isArray(data) ? data[0] : data;
        setAboutData(profile);
      })
      .catch((err) => {
        console.error("Start Menu API Error:", err);
      });
  }, [apiUrl]);

  // --- FILTER OUT INDIVIDUAL PROJECTS ---
  // Only keep core apps (System OS, About Us, File Explorer, Resume, Projects Folder)
  const coreApps = systemApps.filter(app => !app.project_type);

  return (
    <div className="absolute bottom-16 left-4 w-80 bg-space-dark border border-space-gray rounded-lg shadow-[0_0_30px_rgba(0,82,136,0.3)] flex flex-col overflow-hidden z-50 backdrop-blur-md bg-opacity-95 p-4 animate-fade-in-up">
      
      {/* User Profile Section */}
      <div className="flex items-center space-x-3 mb-6 border-b border-space-gray pb-4">
        <div className="h-12 w-12 rounded-full bg-[#1a1a1a] flex items-center justify-center text-2xl shadow-inner border border-gray-700 overflow-hidden shrink-0">
          {aboutData && aboutData.profile_image ? (
            <img src={aboutData.profile_image} alt={aboutData.name} className="w-full h-full object-cover" />
          ) : (
            // Fallback SVG if no profile image is loaded yet
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-gray-500">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          )}
        </div>
        <div className="overflow-hidden">
          <h3 className="text-space-white font-bold tracking-wide truncate">
            {aboutData && aboutData.name ? aboutData.name : 'System Admin'}
          </h3>
          <p className="text-xs text-thruster-glow font-mono truncate">System Administrator</p>
        </div>
      </div>
      
      {/* Applications List */}
      <div className="space-y-1">
        <h4 className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-3">System Modules</h4>
        
        {/* Map over coreApps instead of systemApps */}
        {coreApps.map(app => (
          <button 
            key={app.id}
            onClick={() => { 
              onOpenApp(app.id); 
              closeMenu(); 
            }}
            className="w-full flex items-center space-x-3 p-2.5 rounded-md hover:bg-space-gray transition-colors text-left group"
          >
            <img src={app.icon} alt={app.name} className="w-6 h-6 object-contain group-hover:scale-110 transition-transform" />            
            <span className="text-space-white text-sm font-sans">{app.name}</span>
          </button>
        ))}
      </div>

      {/* Power Options & Settings */}
      <div className="mt-6 pt-4 border-t border-space-gray flex justify-between items-center">
        
        {/* New Preferences Button with exact Settings SVG */}
        <button 
          onClick={() => { 
            onOpenApp('settings'); 
            closeMenu(); 
          }}
          className="text-gray-400 hover:text-thruster-glow transition-colors flex items-center gap-2 text-sm font-mono"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          Preferences
        </button>

        {/* Power / Shutdown Button */}
        <button className="text-gray-400 hover:text-red-500 transition-colors" title="Power Options">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StartMenu;