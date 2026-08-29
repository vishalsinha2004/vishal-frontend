import React, { useState, useEffect } from 'react';

const StartMenu = ({ systemApps, onOpenApp, closeMenu }) => {
  const [aboutData, setAboutData] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

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

  // --- FILTER OUT INDIVIDUAL PROJECTS & GAMES ---
  const coreApps = systemApps.filter(app => !app.project_type && !app.isGame);

  return (
    <div className="absolute bottom-16 left-4 w-80 bg-space-dark border border-space-gray rounded-lg shadow-[0_0_30px_rgba(0,82,136,0.3)] flex flex-col overflow-hidden z-50 backdrop-blur-md bg-opacity-95 p-4 animate-fade-in-up">
      
      <div className="flex items-center space-x-3 mb-6 border-b border-space-gray pb-4">
        <div className="h-12 w-12 rounded-full bg-[#1a1a1a] flex items-center justify-center text-2xl shadow-inner border border-gray-700 overflow-hidden shrink-0">
          {aboutData && aboutData.profile_image ? (
            <img src={aboutData.profile_image} alt={aboutData.name} className="w-full h-full object-cover" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-gray-500">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          )}
        </div>
        <div className="overflow-hidden">
          <h3 className="text-space-white font-bold tracking-wide truncate">
            {aboutData && aboutData.name ? aboutData.name : 'Commander Vishal'}
          </h3>
        </div>
      </div>
      
      <div className="space-y-1">
        <h4 className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-3">System Modules</h4>
        
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

      <div className="mt-6 pt-4 border-t border-space-gray flex justify-between items-center">
        
        <button 
          onClick={() => { 
            onOpenApp('settings'); 
            closeMenu(); 
          }}
          className="text-gray-400 hover:text-thruster-glow transition-colors flex items-center gap-2 text-sm font-mono"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.528.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
          Preferences
        </button>

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