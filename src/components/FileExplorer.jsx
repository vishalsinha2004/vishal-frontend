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
        className={`w-full h-full object-contain drop-shadow-md transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
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

  // Pre-filter system files vs project files (Using systemApps now)
  const sysOsApp = systemApps.find(a => a.id === 'system-os');
  const aboutApp = systemApps.find(a => a.id === 'about-us');
  const projectsApp = systemApps.find(a => a.id === 'projects-folder');

  const projectApps = systemApps.filter(a => !['system-os', 'about-us', 'file-explorer', 'projects-folder'].includes(a.id));
  const startups = projectApps.filter(a => a.project_type === 'Startup');
  const clients = projectApps.filter(a => a.project_type === 'Client Project');
  const personal = projectApps.filter(a => !a.project_type || a.project_type === 'Personal Project');

  // ==========================================
  // VIEW 1: HOME (DEFAULT)
  // ==========================================
  const renderHome = () => (
    <div className="animate-fade-in-up p-8">
      
      {/* Quick Access Folders */}
      <h3 className="text-space-white text-lg font-bold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-thruster-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
        Quick Access
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
        <button onClick={() => navigate('Projects')} className="flex items-center gap-4 p-4 rounded-xl bg-[#121212] border border-space-gray hover:border-thruster-glow hover:bg-[#1a1a1a] transition-all group focus:outline-none">
          <svg viewBox="0 0 24 24" fill="#FCD34D" className="w-12 h-12 drop-shadow-md group-hover:scale-105 transition-transform shrink-0"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
          <div className="text-left">
            <div className="text-sm font-bold text-gray-200 group-hover:text-white">Projects</div>
            <div className="text-[10px] text-gray-500 font-mono mt-0.5">Stored locally</div>
          </div>
        </button>
        {/* Mock OS Folders */}
        <button className="flex items-center gap-4 p-4 rounded-xl bg-[#121212] border border-space-gray hover:border-gray-500 hover:bg-[#1a1a1a] transition-all group focus:outline-none">
          <svg viewBox="0 0 24 24" fill="#60A5FA" className="w-12 h-12 drop-shadow-md group-hover:scale-105 transition-transform shrink-0"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
          <div className="text-left">
            <div className="text-sm font-bold text-gray-200 group-hover:text-white">Downloads</div>
            <div className="text-[10px] text-gray-500 font-mono mt-0.5">Empty Directory</div>
          </div>
        </button>
        <button className="flex items-center gap-4 p-4 rounded-xl bg-[#121212] border border-space-gray hover:border-gray-500 hover:bg-[#1a1a1a] transition-all group focus:outline-none">
          <svg viewBox="0 0 24 24" fill="#34D399" className="w-12 h-12 drop-shadow-md group-hover:scale-105 transition-transform shrink-0"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
          <div className="text-left">
            <div className="text-sm font-bold text-gray-200 group-hover:text-white">Documents</div>
            <div className="text-[10px] text-gray-500 font-mono mt-0.5">Empty Directory</div>
          </div>
        </button>
      </div>

      {/* Recent Files Table */}
      <h3 className="text-space-white text-lg font-bold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-thruster-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Recent Files
      </h3>
      <div className="w-full bg-[#121212] border border-space-gray rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1a1a1a] border-b border-space-gray text-xs text-gray-400 font-mono tracking-widest uppercase">
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium hidden md:table-cell">Date Modified</th>
              <th className="px-6 py-4 font-medium hidden sm:table-cell">Type</th>
              <th className="px-6 py-4 font-medium text-right">Size</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-300">
            {/* Native OS Files listed in "Recent" */}
            {sysOsApp && (
              <tr onClick={() => navigate(sysOsApp.name)} className="border-b border-gray-800 hover:bg-[#1a1a1a] cursor-pointer transition-colors group">
                <td className="px-6 py-3 flex items-center gap-4">
                  <div className="w-10 h-10 p-2 bg-black rounded-lg border border-gray-700 group-hover:border-thruster-glow flex-shrink-0">
                    <ProjectIcon src={sysOsApp.icon} alt={sysOsApp.name} />
                  </div>
                  <span className="font-bold text-white group-hover:text-thruster-glow transition-colors">{sysOsApp.name}</span>
                </td>
                <td className="px-6 py-3 hidden md:table-cell font-mono text-xs">Today, 09:41 AM</td>
                <td className="px-6 py-3 hidden sm:table-cell font-mono text-xs">System Executable</td>
                <td className="px-6 py-3 text-right font-mono text-xs text-gray-500">2.4 MB</td>
              </tr>
            )}
            {aboutApp && (
              <tr onClick={() => navigate(aboutApp.name)} className="border-b border-gray-800 hover:bg-[#1a1a1a] cursor-pointer transition-colors group">
                <td className="px-6 py-3 flex items-center gap-4">
                  <div className="w-10 h-10 p-2 bg-black rounded-lg border border-gray-700 group-hover:border-green-400 flex-shrink-0">
                    <ProjectIcon src={aboutApp.icon} alt={aboutApp.name} />
                  </div>
                  <span className="font-bold text-white group-hover:text-green-400 transition-colors">{aboutApp.name}</span>
                </td>
                <td className="px-6 py-3 hidden md:table-cell font-mono text-xs">Yesterday, 14:22 PM</td>
                <td className="px-6 py-3 hidden sm:table-cell font-mono text-xs">Profile Data</td>
                <td className="px-6 py-3 text-right font-mono text-xs text-gray-500">1.1 MB</td>
              </tr>
            )}
            
            {/* Top 3 Real Projects listed in "Recent" */}
            {projectApps.slice(0, 3).map(app => (
              <tr key={app.id} onClick={() => navigate(app.name)} className="border-b border-gray-800 hover:bg-[#1a1a1a] cursor-pointer transition-colors group">
                <td className="px-6 py-3 flex items-center gap-4">
                  <div className="w-10 h-10 p-2 bg-black rounded-lg border border-gray-700 group-hover:border-thruster-glow flex-shrink-0">
                    <ProjectIcon src={app.icon} alt={app.name} />
                  </div>
                  <span className="font-bold text-white group-hover:text-thruster-glow transition-colors">{app.name}</span>
                </td>
                <td className="px-6 py-3 hidden md:table-cell font-mono text-xs">Last Week</td>
                <td className="px-6 py-3 hidden sm:table-cell font-mono text-xs">{app.project_type || 'Project File'}</td>
                <td className="px-6 py-3 text-right font-mono text-xs text-gray-500">14.8 MB</td>
              </tr>
            ))}
          </tbody>
        </table>
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
        <div className="mb-10 animate-fade-in-up">
          <h3 className="text-lg font-bold text-white mb-5 border-b border-space-gray pb-2 tracking-wide flex items-center gap-3">
            {icon}
            {title}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categoryApps.map(app => (
              <button
                key={app.id}
                onClick={() => navigate(app.name)}
                className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-[#1a1a1a] border border-transparent hover:border-gray-600 transition-all group focus:outline-none"
              >
                <div className="w-16 h-16 bg-[#121212] p-3 rounded-2xl shadow-lg border border-gray-700 group-hover:border-thruster-glow group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                  <ProjectIcon src={app.icon} alt={app.name} />
                </div>
                <span className="text-xs font-sans font-bold text-gray-300 group-hover:text-white text-center line-clamp-2 leading-tight">
                  {app.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="p-8 animate-fade-in-up">
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
  // VIEW 3: FILE PREVIEWER (When a file/app is clicked inside Explorer)
  // ==========================================
  const renderAppPreview = (app) => {
    return (
      <div className="p-10 max-w-4xl mx-auto animate-fade-in-up">
        <div className="flex flex-col md:flex-row gap-8 items-start bg-[#121212] border border-space-gray rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          
          {/* Glassmorphism gradient background splash */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-thruster-blue opacity-5 blur-3xl rounded-full pointer-events-none"></div>

          <div className="w-32 h-32 bg-[#0a0a0a] rounded-3xl p-6 border border-gray-700 shadow-inner flex items-center justify-center shrink-0 z-10">
            <ProjectIcon src={app.icon} alt={app.name} />
          </div>
          <div className="flex-1 z-10">
            <h2 className="text-3xl font-bold text-white mb-2">{app.name}</h2>
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#1a1a1a] text-thruster-glow border border-gray-700 px-3 py-1 rounded text-xs font-mono tracking-widest uppercase shadow-inner">
                {app.project_type || 'System Module'}
              </span>
              <span className="text-gray-500 text-sm font-mono">{app.tech_stack || 'Compiled Executable'}</span>
            </div>
            <p className="text-gray-300 font-sans leading-relaxed mb-8">
              {app.description || "This is a core system executable file. Click 'Execute Module' below to launch this application in a native window context."}
            </p>
            <div className="flex flex-wrap gap-4 border-t border-gray-800 pt-6">
              
              {/* This Executes the App using your App.jsx global opener */}
              <button onClick={() => onOpenApp(app.id)} className="bg-thruster-blue text-space-black font-bold px-6 py-2.5 rounded-lg hover:bg-thruster-glow transition-colors shadow-[0_0_15px_rgba(79,195,247,0.4)] flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Execute Module
              </button>
              
              {app.live_link && (
                <a href={app.live_link} target="_blank" rel="noopener noreferrer" className="bg-[#1a1a1a] border border-gray-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-space-gray transition-colors flex items-center gap-2 shadow-md">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  Open Live URL
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
    return <div className="p-6 text-gray-500 font-mono">Directory is empty.</div>;
  };

  return (
    <div className="h-full w-full bg-[#050505] flex overflow-hidden font-sans">
      
      {/* File Explorer Sidebar - REAL DATA FETCHED HERE */}
      <div className="w-56 bg-[#0a0a0a] border-r border-space-gray flex flex-col p-3 shrink-0 hidden md:flex z-10 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
        <div className="text-[10px] font-bold text-thruster-glow uppercase tracking-widest px-3 mb-4 mt-2">OS Navigation</div>
        
        <button onClick={goHome} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors w-full text-left shadow-inner ${currentFolder === 'Home' ? 'bg-space-gray text-white font-bold border border-gray-700' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white border border-transparent'}`}>
          <svg className={`w-4 h-4 flex-shrink-0 ${currentFolder === 'Home' ? 'text-thruster-glow' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          Home Access
        </button>

        {sysOsApp && (
          <button onClick={() => navigate(sysOsApp.name)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors w-full text-left mt-1 ${currentFolder === sysOsApp.name ? 'bg-space-gray text-white font-bold border border-gray-700 shadow-inner' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white border border-transparent'}`}>
            <img src={sysOsApp.icon} alt={sysOsApp.name} className="w-5 h-5 object-contain flex-shrink-0" />
            <span className="truncate">{sysOsApp.name}</span>
          </button>
        )}

        {aboutApp && (
          <button onClick={() => navigate(aboutApp.name)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors w-full text-left mt-1 ${currentFolder === aboutApp.name ? 'bg-space-gray text-white font-bold border border-gray-700 shadow-inner' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white border border-transparent'}`}>
            <img src={aboutApp.icon} alt={aboutApp.name} className="w-5 h-5 object-contain flex-shrink-0" />
            <span className="truncate">{aboutApp.name}</span>
          </button>
        )}

        {projectsApp && (
          <button onClick={() => navigate('Projects')} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors w-full text-left mt-1 ${currentFolder === 'Projects' ? 'bg-space-gray text-white font-bold border border-gray-700 shadow-inner' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white border border-transparent'}`}>
            <img src={projectsApp.icon} alt={projectsApp.name} className="w-5 h-5 object-contain flex-shrink-0" />
            <span className="truncate">{projectsApp.name}</span>
          </button>
        )}

        
        <div className="my-4 border-t border-gray-800"></div>
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-3">Local Disk</div>

        {/* Dummy Folders for Realism */}
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 w-full text-left cursor-not-allowed opacity-50">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Documents
        </button>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 w-full text-left cursor-not-allowed opacity-50">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Downloads
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0d0d0d] via-[#050505] to-black">
        
        {/* Topbar Navigation & Breadcrumbs */}
        <div className="h-14 bg-[#121212] border-b border-space-gray flex items-center px-4 gap-4 shrink-0 shadow-sm">
          <div className="flex gap-1">
            <button onClick={goBack} disabled={path.length === 1} className={`p-1.5 rounded transition-colors ${path.length > 1 ? 'hover:bg-space-gray text-white' : 'text-gray-600 cursor-not-allowed'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button disabled className="p-1.5 rounded text-gray-600 cursor-not-allowed">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
            <button onClick={goHome} className="p-1.5 rounded hover:bg-space-gray text-gray-400 hover:text-white transition-colors" title="Go to Root">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            </button>
          </div>
          
          <div className="flex-1 bg-[#0a0a0a] border border-gray-700 rounded-md px-3 py-1.5 text-sm font-sans flex items-center gap-2 shadow-inner overflow-hidden whitespace-nowrap">
            {path.map((segment, index) => (
              <React.Fragment key={index}>
                <span className="text-gray-300 hover:text-white cursor-pointer transition-colors" onClick={() => setPath(path.slice(0, index + 1))}>
                  {segment}
                </span>
                {index < path.length - 1 && <span className="text-gray-600">{'>'}</span>}
              </React.Fragment>
            ))}
          </div>
          
          <div className="w-64 bg-[#0a0a0a] border border-gray-700 rounded-md px-3 py-1.5 text-sm font-sans items-center shadow-inner hidden lg:flex focus-within:border-thruster-glow transition-colors">
            <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder={`Search ${currentFolder}...`} className="bg-transparent outline-none w-full text-white placeholder-gray-500" />
          </div>
        </div>

        {/* Dynamic Content View Router */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;