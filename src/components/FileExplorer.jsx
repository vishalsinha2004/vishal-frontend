import React, { useState } from 'react';

// --- Helper component to handle individual image loading states ---
const ProjectIcon = ({ src, alt }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-space-gray border-t-thruster-glow rounded-full animate-spin"></div>
        </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        className={`w-full h-full object-contain drop-shadow-lg transition-all duration-300 ${isLoading ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </div>
  );
};

const FileExplorer = ({ systemApps = [], onOpenApp }) => {
  // Navigation State
  const [path, setPath] = useState(['Home']);
  const currentFolder = path[path.length - 1];

  const navigate = (folder) => setPath([...path, folder]);
  const goBack = () => setPath(path.slice(0, -1));
  const goHome = () => setPath(['Home']);

  // Pre-filter system files vs project files 
  const sysOsApp = systemApps.find(a => a.id === 'system-os');
  const aboutApp = systemApps.find(a => a.id === 'about-us');
  const projectsApp = systemApps.find(a => a.id === 'projects-folder');
  const resumeApp = systemApps.find(a => a.id === 'resume'); 

  // FIXED: Filter out games, games-folder, and settings from showing up in Personal Projects
  const projectApps = systemApps.filter(a => 
    !['system-os', 'about-us', 'file-explorer', 'projects-folder', 'resume', 'games-folder', 'settings'].includes(a.id) && !a.isGame
  );
  
  const startups = projectApps.filter(a => a.project_type === 'Startup');
  const clients = projectApps.filter(a => a.project_type === 'Client Project');
  const personal = projectApps.filter(a => !a.project_type || a.project_type === 'Personal Project');

  // ==========================================
  // VIEW 1: HOME (REDESIGNED)
  // ==========================================
  const renderHome = () => (
    <div className="animate-fade-in-up p-4 sm:p-6 md:p-10 max-w-7xl mx-auto">
      
      {/* Redesigned Quick Access Cards */}
      <h3 className="text-gray-400 text-xs font-mono font-bold mb-4 md:mb-6 tracking-widest uppercase flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-thruster-glow animate-pulse"></span>
        Pinned Directories
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-16">
        
        {/* Projects */}
        <button onClick={() => navigate('Projects')} className="relative overflow-hidden flex items-start gap-4 md:gap-5 p-4 md:p-6 rounded-2xl bg-black bg-opacity-40 border border-gray-800 hover:border-thruster-glow transition-all group focus:outline-none shadow-2xl backdrop-blur-md text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-thruster-glow opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity"></div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg bg-gradient-to-br from-gray-800 to-black border border-gray-700 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="#FCD34D" className="w-6 h-6 md:w-7 md:h-7 drop-shadow-md"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
          </div>
          <div className="flex flex-col z-10">
            <span className="text-base md:text-lg font-bold text-white group-hover:text-thruster-glow transition-colors">Projects</span>
            <span className="text-[10px] md:text-xs text-gray-500 font-mono mt-1 line-clamp-2">Compiled repository containing all localized startup and client modules.</span>
          </div>
        </button>

        {/* Experience */}
        <button onClick={() => navigate('Experience')} className="relative overflow-hidden flex items-start gap-4 md:gap-5 p-4 md:p-6 rounded-2xl bg-black bg-opacity-40 border border-gray-800 hover:border-yellow-400 transition-all group focus:outline-none shadow-2xl backdrop-blur-md text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500 opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity"></div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg bg-gradient-to-br from-gray-800 to-black border border-gray-700 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 md:w-7 md:h-7 drop-shadow-md"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          </div>
          <div className="flex flex-col z-10">
            <span className="text-base md:text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">Experience</span>
            <span className="text-[10px] md:text-xs text-gray-500 font-mono mt-1 line-clamp-2">Internships, roles, and professional milestones.</span>
          </div>
        </button>

        {/* GitHub */}
        <button onClick={() => window.open('https://github.com/vishalsinha2004', '_blank')} className="relative overflow-hidden flex items-start gap-4 md:gap-5 p-4 md:p-6 rounded-2xl bg-black bg-opacity-40 border border-gray-800 hover:border-gray-300 transition-all group focus:outline-none shadow-2xl backdrop-blur-md text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-500 opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity"></div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg bg-gradient-to-br from-gray-800 to-black border border-gray-700 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7 drop-shadow-md text-gray-200"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </div>
          <div className="flex flex-col z-10">
            <span className="text-base md:text-lg font-bold text-white group-hover:text-gray-300 transition-colors">GitHub</span>
            <span className="text-[10px] md:text-xs text-gray-500 font-mono mt-1 line-clamp-2">Code repositories and development history.</span>
          </div>
        </button>

        {/* LinkedIn */}
        <button onClick={() => window.open('https://www.linkedin.com/in/vishal-sinha2004/', '_blank')} className="relative overflow-hidden flex items-start gap-4 md:gap-5 p-4 md:p-6 rounded-2xl bg-black bg-opacity-40 border border-gray-800 hover:border-blue-500 transition-all group focus:outline-none shadow-2xl backdrop-blur-md text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity"></div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg bg-gradient-to-br from-gray-800 to-black border border-gray-700 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7 drop-shadow-md text-[#0A66C2]"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </div>
          <div className="flex flex-col z-10">
            <span className="text-base md:text-lg font-bold text-white group-hover:text-blue-500 transition-colors">LinkedIn</span>
            <span className="text-[10px] md:text-xs text-gray-500 font-mono mt-1 line-clamp-2">Professional networking and career updates.</span>
          </div>
        </button>

        {/* X (Twitter) */}
        <button onClick={() => window.open('https://x.com/vishalsinha369', '_blank')} className="relative overflow-hidden flex items-start gap-4 md:gap-5 p-4 md:p-6 rounded-2xl bg-black bg-opacity-40 border border-gray-800 hover:border-gray-400 transition-all group focus:outline-none shadow-2xl backdrop-blur-md text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-500 opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity"></div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg bg-gradient-to-br from-gray-800 to-black border border-gray-700 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7 drop-shadow-md text-gray-300"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 4.15H5.078z"/></svg>
          </div>
          <div className="flex flex-col z-10">
            <span className="text-base md:text-lg font-bold text-white group-hover:text-gray-300 transition-colors">X (Twitter)</span>
            <span className="text-[10px] md:text-xs text-gray-500 font-mono mt-1 line-clamp-2">Tech insights, thoughts, and fast updates.</span>
          </div>
        </button>

        {/* Instagram */}
        <button onClick={() => window.open('https://www.instagram.com/vishalvyn?igsi=MWttM2hvOGRmcHRqbg==', '_blank')} className="relative overflow-hidden flex items-start gap-4 md:gap-5 p-4 md:p-6 rounded-2xl bg-black bg-opacity-40 border border-gray-800 hover:border-pink-500 transition-all group focus:outline-none shadow-2xl backdrop-blur-md text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500 opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity"></div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg bg-gradient-to-br from-gray-800 to-black border border-gray-700 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7 drop-shadow-md text-[#E1306C]"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </div>
          <div className="flex flex-col z-10">
            <span className="text-base md:text-lg font-bold text-white group-hover:text-pink-500 transition-colors">Instagram</span>
            <span className="text-[10px] md:text-xs text-gray-500 font-mono mt-1 line-clamp-2">Visual portfolio and personal updates.</span>
          </div>
        </button>

      </div>

      {/* Redesigned Modern List View */}
      <h3 className="text-gray-400 text-xs font-mono font-bold mb-4 md:mb-6 tracking-widest uppercase">System Activity Log</h3>
      <div className="w-full flex flex-col gap-2 md:gap-3">
        
        {/* Header Row */}
        <div className="flex px-4 md:px-6 py-2 text-[10px] text-gray-500 font-mono tracking-widest uppercase">
          <div className="flex-1">File Name</div>
          <div className="w-48 hidden md:block">Last Modified</div>
          <div className="w-40 hidden sm:block">Classification</div>
          <div className="w-24 text-right hidden sm:block">Data Size</div>
        </div>

        {sysOsApp && (
          <div onClick={() => navigate(sysOsApp.name)} className="flex items-center px-4 md:px-6 py-3 md:py-4 bg-black bg-opacity-30 border border-transparent hover:border-gray-700 hover:bg-[#1a1a1a] rounded-xl cursor-pointer transition-all group shadow-sm">
            <div className="flex-1 flex items-center gap-3 md:gap-4 overflow-hidden">
              <div className="w-8 h-8 md:w-10 md:h-10 p-1.5 md:p-2 bg-[#121212] rounded border border-gray-800 group-hover:border-thruster-glow flex-shrink-0 shadow-inner">
                <ProjectIcon src={sysOsApp.icon} alt={sysOsApp.name} />
              </div>
              <span className="font-bold text-sm md:text-base text-gray-200 group-hover:text-white transition-colors truncate">{sysOsApp.name}</span>
            </div>
            <div className="w-48 hidden md:block font-mono text-xs text-gray-500">Today, 09:41 AM</div>
            <div className="w-40 hidden sm:block font-mono text-xs text-thruster-glow truncate">System Executable</div>
            <div className="w-24 text-right hidden sm:block font-mono text-xs text-gray-500">2.4 MB</div>
          </div>
        )}

        {aboutApp && (
          <div onClick={() => navigate(aboutApp.name)} className="flex items-center px-4 md:px-6 py-3 md:py-4 bg-black bg-opacity-30 border border-transparent hover:border-gray-700 hover:bg-[#1a1a1a] rounded-xl cursor-pointer transition-all group shadow-sm">
            <div className="flex-1 flex items-center gap-3 md:gap-4 overflow-hidden">
              <div className="w-8 h-8 md:w-10 md:h-10 p-1.5 md:p-2 bg-[#121212] rounded border border-gray-800 group-hover:border-green-400 flex-shrink-0 shadow-inner">
                <ProjectIcon src={aboutApp.icon} alt={aboutApp.name} />
              </div>
              <span className="font-bold text-sm md:text-base text-gray-200 group-hover:text-white transition-colors truncate">{aboutApp.name}</span>
            </div>
            <div className="w-48 hidden md:block font-mono text-xs text-gray-500">Yesterday, 14:22 PM</div>
            <div className="w-40 hidden sm:block font-mono text-xs text-green-400 truncate">Profile Data</div>
            <div className="w-24 text-right hidden sm:block font-mono text-xs text-gray-500">1.1 MB</div>
          </div>
        )}

        {resumeApp && (
          <div onClick={() => navigate(resumeApp.name)} className="flex items-center px-4 md:px-6 py-3 md:py-4 bg-black bg-opacity-30 border border-transparent hover:border-gray-700 hover:bg-[#1a1a1a] rounded-xl cursor-pointer transition-all group shadow-sm">
            <div className="flex-1 flex items-center gap-3 md:gap-4 overflow-hidden">
              <div className="w-8 h-8 md:w-10 md:h-10 p-1.5 md:p-2 bg-[#121212] rounded border border-gray-800 group-hover:border-purple-400 flex-shrink-0 shadow-inner">
                <ProjectIcon src={resumeApp.icon} alt={resumeApp.name} />
              </div>
              <span className="font-bold text-sm md:text-base text-gray-200 group-hover:text-white transition-colors truncate">{resumeApp.name}</span>
            </div>
            <div className="w-48 hidden md:block font-mono text-xs text-gray-500">Yesterday, 18:30 PM</div>
            <div className="w-40 hidden sm:block font-mono text-xs text-purple-400 truncate">Document</div>
            <div className="w-24 text-right hidden sm:block font-mono text-xs text-gray-500">4.2 MB</div>
          </div>
        )}
        
        {projectApps.slice(0, 3).map(app => (
          <div key={app.id} onClick={() => navigate(app.name)} className="flex items-center px-4 md:px-6 py-3 md:py-4 bg-black bg-opacity-30 border border-transparent hover:border-gray-700 hover:bg-[#1a1a1a] rounded-xl cursor-pointer transition-all group shadow-sm">
            <div className="flex-1 flex items-center gap-3 md:gap-4 overflow-hidden">
              <div className="w-8 h-8 md:w-10 md:h-10 p-1.5 md:p-2 bg-[#121212] rounded border border-gray-800 group-hover:border-[#FCD34D] flex-shrink-0 shadow-inner">
                <ProjectIcon src={app.icon} alt={app.name} />
              </div>
              <span className="font-bold text-sm md:text-base text-gray-200 group-hover:text-white transition-colors truncate">{app.name}</span>
            </div>
            <div className="w-48 hidden md:block font-mono text-xs text-gray-500">Last Week</div>
            <div className="w-40 hidden sm:block font-mono text-xs text-gray-400 truncate">{app.project_type || 'Project File'}</div>
            <div className="w-24 text-right hidden sm:block font-mono text-xs text-gray-500">14.8 MB</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ==========================================
  // VIEW 2: PROJECTS FOLDER
  // ==========================================
  const renderProjects = () => {
    const renderGrid = (title, icon, categoryApps) => {
      if (categoryApps.length === 0) return null;
      return (
        <div className="mb-10 md:mb-12 animate-fade-in-up">
          <h3 className="text-xs md:text-sm font-bold text-gray-300 mb-4 md:mb-6 border-b border-gray-800 pb-3 tracking-wide flex items-center gap-3">
            {icon}
            {title}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {categoryApps.map(app => (
              <button
                key={app.id}
                onClick={() => navigate(app.name)}
                className="flex flex-col items-center gap-3 md:gap-4 p-4 md:p-5 rounded-2xl bg-black bg-opacity-20 border border-transparent hover:bg-black hover:bg-opacity-60 hover:border-gray-700 transition-all group focus:outline-none shadow-sm hover:shadow-xl"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#121212] p-3 md:p-4 rounded-full shadow-inner border border-gray-800 group-hover:border-thruster-glow group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
                  <ProjectIcon src={app.icon} alt={app.name} />
                </div>
                <span className="text-[10px] md:text-xs font-sans font-bold text-gray-400 group-hover:text-white text-center line-clamp-2 leading-snug">
                  {app.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto animate-fade-in-up">
        {renderGrid(
          'Startup Ventures', 
          <svg viewBox="0 0 24 24" fill="none" stroke="#4FC3F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 3.82-5.46 2 2 0 0 1 1.33-.54L18 6l-3.35 3.35a2 2 0 0 1-1.33.53A22 22 0 0 1 12 15z"></path></svg>, 
          startups
        )}
        {renderGrid(
          'Client Projects', 
          <svg viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>, 
          clients
        )}
        {renderGrid(
          'Personal Projects', 
          <svg viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>, 
          personal
        )}
      </div>
    );
  };

  // ==========================================
  // VIEW 3: EXPERIENCE (PROFESSIONAL LAYOUT)
  // ==========================================
  const renderExperience = () => (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto animate-fade-in-up">
      <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-thruster-glow to-transparent opacity-50"></div>
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          
          {/* Left Column: Text & Skills */}
          <div className="flex-1">
            <div className="mb-6 md:mb-8 border-b border-gray-800 pb-4 md:pb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">AI/ML Data Science Intern</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 md:gap-6">
                <h3 className="text-lg md:text-xl text-thruster-glow font-mono">Techmicra IT Solutions</h3>
                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                <span className="text-xs md:text-sm text-gray-400 font-mono flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  May 2025 — June 2025
                </span>
              </div>
            </div>

            <p className="text-sm md:text-lg text-gray-300 font-sans leading-relaxed mb-6 md:mb-8">
              Completed an intensive academic internship focusing on Python-based Artificial Intelligence and Machine Learning. Engineered and deployed machine learning models while mastering data processing pipelines, algorithmic classification, and deep learning architectures.
            </p>

            <div className="bg-[#121212] border border-gray-700 rounded-xl p-4 md:p-6 mb-6 md:mb-8 shadow-inner">
              <h3 className="text-xs md:text-sm font-mono text-gray-400 uppercase tracking-widest mb-4 md:mb-5">Technical Curriculum & Implementations</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                {[
                  "Python, Pandas & NumPy",
                  "Data Cleaning & Analysis",
                  "Linear Regression & Classification",
                  "Decision Trees & Clustering",
                  "Deep Learning & Keras",
                  "Neural Networks & CNNs",
                  "Natural Language Processing (NLP)",
                  "AI/ML Model Deployment"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-300 font-sans bg-[#1a1a1a] px-3 py-2 md:py-2.5 rounded-lg border border-gray-800 hover:border-thruster-glow transition-colors">
                    <span className="text-thruster-glow font-bold flex-shrink-0">▹</span> 
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2">
              {['Python', 'Machine Learning', 'Data Science', 'Pandas', 'NumPy', 'Deep Learning', 'NLP', 'Keras', 'CNN'].map(tag => (
                <span key={tag} className="text-[10px] md:text-xs font-mono text-blue-400 bg-blue-900/20 px-2 md:px-3 py-1 md:py-1.5 rounded-md border border-blue-800/50 cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Certificate Image */}
          <div className="w-full lg:w-5/12 flex-shrink-0 flex flex-col items-center">
            <div className="bg-[#121212] border border-gray-700 p-2 md:p-3 rounded-2xl shadow-[0_0_20px_rgba(79,195,247,0.1)] hover:shadow-[0_0_30px_rgba(79,195,247,0.2)] transition-all duration-300">
              <img 
                src="/image_ba3a02.jpg" 
                alt="Techmicra IT Solutions Certificate" 
                className="w-full h-auto rounded-lg border border-gray-800"
              />
            </div>
            <span className="text-[9px] md:text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-3 md:mt-4 text-center">Verified Academic Credential</span>
          </div>

        </div>
      </div>
    </div>
  );

  // ==========================================
  // VIEW 4: FILE PREVIEWER
  // ==========================================
  const renderAppPreview = (app) => {
    return (
      <div className="p-4 sm:p-6 md:p-10 max-w-4xl mx-auto animate-fade-in-up">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start bg-black bg-opacity-40 border border-gray-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          
          <div className="absolute -top-32 -right-32 w-64 h-64 md:w-96 md:h-96 bg-thruster-blue opacity-10 blur-[80px] md:blur-[100px] rounded-full pointer-events-none"></div>

          <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-[#0a0a0a] rounded-full p-5 md:p-8 border border-gray-700 shadow-inner flex items-center justify-center shrink-0 z-10 self-center md:self-start">
            <ProjectIcon src={app.icon} alt={app.name} />
          </div>
          
          <div className="flex-1 z-10 w-full text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">{app.name}</h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 mb-6 md:mb-8">
              <span className="bg-[#1a1a1a] text-thruster-glow border border-gray-700 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold tracking-widest uppercase shadow-sm">
                {app.project_type || 'System Module'}
              </span>
              <span className="text-gray-500 text-[10px] md:text-xs font-mono">{app.tech_stack || 'Compiled Executable'}</span>
            </div>
            
            <p className="text-sm md:text-lg text-gray-400 font-sans leading-relaxed mb-8 md:mb-10">
              {app.description || "This is a core system executable file. Click 'Initialize Module' below to launch this application in a native window context."}
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap justify-center md:justify-start gap-3 md:gap-4">
              <button onClick={() => onOpenApp(app.id)} className="w-full sm:w-auto justify-center bg-white text-black font-bold px-6 py-2.5 md:px-8 md:py-3 rounded-xl hover:bg-thruster-glow transition-colors shadow-lg flex items-center gap-2 text-sm md:text-base">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 md:w-5 md:h-5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Initialize Module
              </button>
              
              {app.live_link && (
                <a href={app.live_link} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto justify-center bg-[#1a1a1a] border border-gray-700 text-white font-bold px-6 py-2.5 md:px-8 md:py-3 rounded-xl hover:bg-space-gray transition-colors flex items-center gap-2 shadow-md text-sm md:text-base">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  Live Deployment
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Determine what view to render based on breadcrumb path
  const renderContent = () => {
    if (currentFolder === 'Home') return renderHome();
    if (currentFolder === 'Projects') return renderProjects();
    if (currentFolder === 'Experience') return renderExperience();
    const selectedApp = systemApps.find(a => a.name === currentFolder); 
    if (selectedApp) return renderAppPreview(selectedApp);
    return <div className="p-4 sm:p-10 text-gray-500 font-mono text-center text-sm md:text-base">Directory is empty.</div>;
  };

  return (
    <div className="h-full w-full bg-[#050505] flex overflow-hidden font-sans">
      
      {/* File Explorer Sidebar - Powerful Mac/Modern Design */}
      <div className="w-60 bg-[#141414]/80 backdrop-blur-3xl border-r border-white/5 flex flex-col pt-6 pb-4 px-3 shrink-0 hidden md:flex z-20 shadow-[5px_0_30px_rgba(0,0,0,0.8)]">
        
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">Favorites</div>
        <div className="flex flex-col gap-0.5 mb-6">
          <button onClick={goHome} className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all text-left ${currentFolder === 'Home' ? 'bg-thruster-blue/20 text-thruster-glow shadow-sm' : 'text-gray-300 hover:bg-white/5'}`}>
            <svg className={`w-4 h-4 flex-shrink-0 ${currentFolder === 'Home' ? 'text-thruster-glow' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Home
          </button>

          {projectsApp && (
            <button onClick={() => navigate('Projects')} className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all text-left ${currentFolder === 'Projects' ? 'bg-thruster-blue/20 text-thruster-glow shadow-sm' : 'text-gray-300 hover:bg-white/5'}`}>
              <img src={projectsApp.icon} alt={projectsApp.name} className="w-4 h-4 object-contain flex-shrink-0" />
              <span className="truncate">{projectsApp.name}</span>
            </button>
          )}
        </div>

        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">System Modules</div>
        <div className="flex flex-col gap-0.5 mb-6">
          {sysOsApp && (
            <button onClick={() => navigate(sysOsApp.name)} className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all text-left ${currentFolder === sysOsApp.name ? 'bg-thruster-blue/20 text-thruster-glow shadow-sm' : 'text-gray-300 hover:bg-white/5'}`}>
              <img src={sysOsApp.icon} alt={sysOsApp.name} className="w-4 h-4 object-contain flex-shrink-0" />
              <span className="truncate">{sysOsApp.name}</span>
            </button>
          )}

          {aboutApp && (
            <button onClick={() => navigate(aboutApp.name)} className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all text-left ${currentFolder === aboutApp.name ? 'bg-thruster-blue/20 text-thruster-glow shadow-sm' : 'text-gray-300 hover:bg-white/5'}`}>
              <img src={aboutApp.icon} alt={aboutApp.name} className="w-4 h-4 object-contain flex-shrink-0" />
              <span className="truncate">{aboutApp.name}</span>
            </button>
          )}

          {resumeApp && (
            <button onClick={() => navigate(resumeApp.name)} className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all text-left ${currentFolder === resumeApp.name ? 'bg-purple-500/20 text-purple-400 shadow-sm' : 'text-gray-300 hover:bg-white/5'}`}>
              <img src={resumeApp.icon} alt={resumeApp.name} className="w-4 h-4 object-contain flex-shrink-0" />
              <span className="truncate">{resumeApp.name}</span>
            </button>
          )}

          <button onClick={() => navigate('Experience')} className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all text-left ${currentFolder === 'Experience' ? 'bg-thruster-blue/20 text-thruster-glow shadow-sm' : 'text-gray-300 hover:bg-white/5'}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 flex-shrink-0 ${currentFolder === 'Experience' ? 'text-thruster-glow' : 'text-gray-400'}`}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            <span className="truncate">Experience</span>
          </button>
        </div>

        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">Locations</div>
        <div className="flex flex-col gap-0.5">
          <button className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-600 w-full text-left cursor-not-allowed">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Documents
          </button>
          <button className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-600 w-full text-left cursor-not-allowed">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Downloads
          </button>
        </div>
      </div>

      {/* Main Area with Advanced Gradient */}
      <div className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#111111] via-[#050505] to-[#000000] relative">
        
        {/* Subtle geometric background overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        {/* Topbar Navigation & Breadcrumbs */}
        <div className="h-14 sm:h-16 bg-[#0a0a0a] bg-opacity-80 border-b border-space-gray flex items-center px-3 sm:px-6 gap-3 sm:gap-6 shrink-0 shadow-md backdrop-blur-md z-10">
          <div className="flex gap-2 shrink-0">
            <button onClick={goBack} disabled={path.length === 1} className={`p-1.5 sm:p-2 rounded-lg transition-colors ${path.length > 1 ? 'hover:bg-space-gray text-white border border-gray-700' : 'text-gray-600 border border-transparent cursor-not-allowed'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button onClick={goHome} className="p-1.5 sm:p-2 rounded-lg hover:bg-space-gray text-gray-400 hover:text-white transition-colors border border-transparent hover:border-gray-700" title="Go to Root">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            </button>
          </div>
          
          <div className="flex-1 bg-black bg-opacity-50 border border-gray-800 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-mono flex items-center gap-2 sm:gap-3 shadow-inner overflow-x-auto custom-scrollbar whitespace-nowrap">
            {path.map((segment, index) => (
              <React.Fragment key={index}>
                <span className="text-gray-400 hover:text-white cursor-pointer transition-colors" onClick={() => setPath(path.slice(0, index + 1))}>
                  {segment}
                </span>
                {index < path.length - 1 && <span className="text-gray-700">/</span>}
              </React.Fragment>
            ))}
          </div>
          
          <div className="w-72 bg-black bg-opacity-50 border border-gray-800 rounded-lg px-4 py-2.5 text-sm font-sans items-center shadow-inner hidden xl:flex focus-within:border-gray-600 transition-colors">
            <svg className="w-4 h-4 text-gray-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder={`Search ${currentFolder}...`} className="bg-transparent outline-none w-full text-white placeholder-gray-600 font-mono text-xs" />
          </div>
        </div>

        {/* Dynamic Content View Router */}
        <div className="flex-1 overflow-y-auto custom-scrollbar z-10 relative">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;