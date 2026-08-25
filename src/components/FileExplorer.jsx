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

// FIX: Changed `apps` to `systemApps` to match what Window.jsx is passing
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
  const resumeApp = systemApps.find(a => a.id === 'resume'); // <-- Added Resume Finder

  const projectApps = systemApps.filter(a => !['system-os', 'about-us', 'file-explorer', 'projects-folder', 'resume'].includes(a.id));
  const startups = projectApps.filter(a => a.project_type === 'Startup');
  const clients = projectApps.filter(a => a.project_type === 'Client Project');
  const personal = projectApps.filter(a => !a.project_type || a.project_type === 'Personal Project');

  // ==========================================
  // VIEW 1: HOME (REDESIGNED)
  // ==========================================
  const renderHome = () => (
    <div className="animate-fade-in-up p-10 max-w-7xl mx-auto">
      
      {/* Redesigned Quick Access Cards */}
      <h3 className="text-gray-400 text-xs font-mono font-bold mb-6 tracking-widest uppercase flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-thruster-glow animate-pulse"></span>
        Pinned Directories
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <button onClick={() => navigate('Projects')} className="relative overflow-hidden flex items-start gap-5 p-6 rounded-2xl bg-black bg-opacity-40 border border-gray-800 hover:border-thruster-glow transition-all group focus:outline-none shadow-2xl backdrop-blur-md text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-thruster-glow opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity"></div>
          <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg bg-gradient-to-br from-gray-800 to-black border border-gray-700 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="#FCD34D" className="w-7 h-7 drop-shadow-md"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
          </div>
          <div className="flex flex-col z-10">
            <span className="text-lg font-bold text-white group-hover:text-thruster-glow transition-colors">Projects</span>
            <span className="text-xs text-gray-500 font-mono mt-1 line-clamp-2">Compiled repository containing all localized startup and client modules.</span>
          </div>
        </button>

        <button className="relative overflow-hidden flex items-start gap-5 p-6 rounded-2xl bg-black bg-opacity-40 border border-gray-800 hover:border-gray-600 transition-all group focus:outline-none shadow-2xl backdrop-blur-md text-left opacity-50 cursor-not-allowed">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg bg-gradient-to-br from-gray-800 to-black border border-gray-700">
            <svg viewBox="0 0 24 24" fill="#60A5FA" className="w-7 h-7 drop-shadow-md"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
          </div>
          <div className="flex flex-col z-10">
            <span className="text-lg font-bold text-gray-300">Downloads</span>
            <span className="text-xs text-gray-600 font-mono mt-1">Directory currently empty.</span>
          </div>
        </button>

        <button className="relative overflow-hidden flex items-start gap-5 p-6 rounded-2xl bg-black bg-opacity-40 border border-gray-800 hover:border-gray-600 transition-all group focus:outline-none shadow-2xl backdrop-blur-md text-left opacity-50 cursor-not-allowed">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg bg-gradient-to-br from-gray-800 to-black border border-gray-700">
            <svg viewBox="0 0 24 24" fill="#34D399" className="w-7 h-7 drop-shadow-md"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
          </div>
          <div className="flex flex-col z-10">
            <span className="text-lg font-bold text-gray-300">Documents</span>
            <span className="text-xs text-gray-600 font-mono mt-1">Directory currently empty.</span>
          </div>
        </button>
      </div>

      {/* Redesigned Modern List View */}
      <h3 className="text-gray-400 text-xs font-mono font-bold mb-6 tracking-widest uppercase">System Activity Log</h3>
      <div className="w-full flex flex-col gap-3">
        
        {/* Header Row */}
        <div className="flex px-6 py-2 text-[10px] text-gray-500 font-mono tracking-widest uppercase">
          <div className="flex-1">File Name</div>
          <div className="w-48 hidden md:block">Last Modified</div>
          <div className="w-40 hidden sm:block">Classification</div>
          <div className="w-24 text-right">Data Size</div>
        </div>

        {sysOsApp && (
          <div onClick={() => navigate(sysOsApp.name)} className="flex items-center px-6 py-4 bg-black bg-opacity-30 border border-transparent hover:border-gray-700 hover:bg-[#1a1a1a] rounded-xl cursor-pointer transition-all group shadow-sm">
            <div className="flex-1 flex items-center gap-4">
              <div className="w-10 h-10 p-2 bg-[#121212] rounded border border-gray-800 group-hover:border-thruster-glow flex-shrink-0 shadow-inner">
                <ProjectIcon src={sysOsApp.icon} alt={sysOsApp.name} />
              </div>
              <span className="font-bold text-gray-200 group-hover:text-white transition-colors">{sysOsApp.name}</span>
            </div>
            <div className="w-48 hidden md:block font-mono text-xs text-gray-500">Today, 09:41 AM</div>
            <div className="w-40 hidden sm:block font-mono text-xs text-thruster-glow">System Executable</div>
            <div className="w-24 text-right font-mono text-xs text-gray-500">2.4 MB</div>
          </div>
        )}

        {aboutApp && (
          <div onClick={() => navigate(aboutApp.name)} className="flex items-center px-6 py-4 bg-black bg-opacity-30 border border-transparent hover:border-gray-700 hover:bg-[#1a1a1a] rounded-xl cursor-pointer transition-all group shadow-sm">
            <div className="flex-1 flex items-center gap-4">
              <div className="w-10 h-10 p-2 bg-[#121212] rounded border border-gray-800 group-hover:border-green-400 flex-shrink-0 shadow-inner">
                <ProjectIcon src={aboutApp.icon} alt={aboutApp.name} />
              </div>
              <span className="font-bold text-gray-200 group-hover:text-white transition-colors">{aboutApp.name}</span>
            </div>
            <div className="w-48 hidden md:block font-mono text-xs text-gray-500">Yesterday, 14:22 PM</div>
            <div className="w-40 hidden sm:block font-mono text-xs text-green-400">Profile Data</div>
            <div className="w-24 text-right font-mono text-xs text-gray-500">1.1 MB</div>
          </div>
        )}

        {resumeApp && (
          <div onClick={() => navigate(resumeApp.name)} className="flex items-center px-6 py-4 bg-black bg-opacity-30 border border-transparent hover:border-gray-700 hover:bg-[#1a1a1a] rounded-xl cursor-pointer transition-all group shadow-sm">
            <div className="flex-1 flex items-center gap-4">
              <div className="w-10 h-10 p-2 bg-[#121212] rounded border border-gray-800 group-hover:border-purple-400 flex-shrink-0 shadow-inner">
                <ProjectIcon src={resumeApp.icon} alt={resumeApp.name} />
              </div>
              <span className="font-bold text-gray-200 group-hover:text-white transition-colors">{resumeApp.name}</span>
            </div>
            <div className="w-48 hidden md:block font-mono text-xs text-gray-500">Yesterday, 18:30 PM</div>
            <div className="w-40 hidden sm:block font-mono text-xs text-purple-400">Document</div>
            <div className="w-24 text-right font-mono text-xs text-gray-500">4.2 MB</div>
          </div>
        )}
        
        {projectApps.slice(0, 3).map(app => (
          <div key={app.id} onClick={() => navigate(app.name)} className="flex items-center px-6 py-4 bg-black bg-opacity-30 border border-transparent hover:border-gray-700 hover:bg-[#1a1a1a] rounded-xl cursor-pointer transition-all group shadow-sm">
            <div className="flex-1 flex items-center gap-4">
              <div className="w-10 h-10 p-2 bg-[#121212] rounded border border-gray-800 group-hover:border-[#FCD34D] flex-shrink-0 shadow-inner">
                <ProjectIcon src={app.icon} alt={app.name} />
              </div>
              <span className="font-bold text-gray-200 group-hover:text-white transition-colors">{app.name}</span>
            </div>
            <div className="w-48 hidden md:block font-mono text-xs text-gray-500">Last Week</div>
            <div className="w-40 hidden sm:block font-mono text-xs text-gray-400">{app.project_type || 'Project File'}</div>
            <div className="w-24 text-right font-mono text-xs text-gray-500">14.8 MB</div>
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
        <div className="mb-12 animate-fade-in-up">
          <h3 className="text-sm font-bold text-gray-300 mb-6 border-b border-gray-800 pb-3 tracking-wide flex items-center gap-3">
            {icon}
            {title}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {categoryApps.map(app => (
              <button
                key={app.id}
                onClick={() => navigate(app.name)}
                className="flex flex-col items-center gap-4 p-5 rounded-2xl bg-black bg-opacity-20 border border-transparent hover:bg-black hover:bg-opacity-60 hover:border-gray-700 transition-all group focus:outline-none shadow-sm hover:shadow-xl"
              >
                <div className="w-20 h-20 bg-[#121212] p-4 rounded-full shadow-inner border border-gray-800 group-hover:border-thruster-glow group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
                  <ProjectIcon src={app.icon} alt={app.name} />
                </div>
                <span className="text-xs font-sans font-bold text-gray-400 group-hover:text-white text-center line-clamp-2 leading-snug">
                  {app.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="p-10 max-w-7xl mx-auto animate-fade-in-up">
        {renderGrid(
          'Startup Ventures', 
          <svg viewBox="0 0 24 24" fill="none" stroke="#4FC3F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 3.82-5.46 2 2 0 0 1 1.33-.54L18 6l-3.35 3.35a2 2 0 0 1-1.33.53A22 22 0 0 1 12 15z"></path></svg>, 
          startups
        )}
        {renderGrid(
          'Client Projects', 
          <svg viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>, 
          clients
        )}
        {renderGrid(
          'Personal Projects', 
          <svg viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>, 
          personal
        )}
      </div>
    );
  };

  // ==========================================
  // VIEW 3: FILE PREVIEWER
  // ==========================================
  const renderAppPreview = (app) => {
    return (
      <div className="p-10 max-w-4xl mx-auto animate-fade-in-up">
        <div className="flex flex-col md:flex-row gap-10 items-start bg-black bg-opacity-40 border border-gray-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-thruster-blue opacity-10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="w-40 h-40 bg-[#0a0a0a] rounded-full p-8 border border-gray-700 shadow-inner flex items-center justify-center shrink-0 z-10">
            <ProjectIcon src={app.icon} alt={app.name} />
          </div>
          <div className="flex-1 z-10">
            <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">{app.name}</h2>
            <div className="flex items-center gap-3 mb-8">
              <span className="bg-[#1a1a1a] text-thruster-glow border border-gray-700 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
                {app.project_type || 'System Module'}
              </span>
              <span className="text-gray-500 text-xs font-mono">{app.tech_stack || 'Compiled Executable'}</span>
            </div>
            <p className="text-gray-400 font-sans leading-relaxed mb-10 text-lg">
              {app.description || "This is a core system executable file. Click 'Initialize Module' below to launch this application in a native window context."}
            </p>
            <div className="flex flex-wrap gap-4">
              
              <button onClick={() => onOpenApp(app.id)} className="bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-thruster-glow transition-colors shadow-lg flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Initialize Module
              </button>
              
              {app.live_link && (
                <a href={app.live_link} target="_blank" rel="noopener noreferrer" className="bg-[#1a1a1a] border border-gray-700 text-white font-bold px-8 py-3 rounded-xl hover:bg-space-gray transition-colors flex items-center gap-2 shadow-md">
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
    const selectedApp = systemApps.find(a => a.name === currentFolder); 
    if (selectedApp) return renderAppPreview(selectedApp);
    return <div className="p-10 text-gray-500 font-mono text-center">Directory is empty.</div>;
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

          {/* NEW: Resume Directory Link Added */}
          {resumeApp && (
            <button onClick={() => navigate(resumeApp.name)} className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all text-left ${currentFolder === resumeApp.name ? 'bg-purple-500/20 text-purple-400 shadow-sm' : 'text-gray-300 hover:bg-white/5'}`}>
              <img src={resumeApp.icon} alt={resumeApp.name} className="w-4 h-4 object-contain flex-shrink-0" />
              <span className="truncate">{resumeApp.name}</span>
            </button>
          )}

          
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
        <div className="h-16 bg-[#0a0a0a] bg-opacity-80 border-b border-space-gray flex items-center px-6 gap-6 shrink-0 shadow-md backdrop-blur-md z-10">
          <div className="flex gap-2">
            <button onClick={goBack} disabled={path.length === 1} className={`p-2 rounded-lg transition-colors ${path.length > 1 ? 'hover:bg-space-gray text-white border border-gray-700' : 'text-gray-600 border border-transparent cursor-not-allowed'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button onClick={goHome} className="p-2 rounded-lg hover:bg-space-gray text-gray-400 hover:text-white transition-colors border border-transparent hover:border-gray-700" title="Go to Root">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            </button>
          </div>
          
          <div className="flex-1 bg-black bg-opacity-50 border border-gray-800 rounded-lg px-4 py-2.5 text-sm font-mono flex items-center gap-3 shadow-inner overflow-hidden whitespace-nowrap">
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
            <svg className="w-4 h-4 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
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