import React, { useState } from 'react';

// --- Classic 90s Pixel Icons (Base64) ---
const folderIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M4 8h8l2 4h14v12H4z' fill='%23ffff00' stroke='%23000' stroke-width='2' stroke-linejoin='miter'/%3E%3Cpath d='M4 12h24' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E";
const driveIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='4' y='8' width='24' height='16' fill='%23c0c0c0' stroke='%23000' stroke-width='2'/%3E%3Crect x='6' y='10' width='20' height='4' fill='%23808080'/%3E%3Ccircle cx='8' cy='20' r='1.5' fill='%2300ff00'/%3E%3C/svg%3E";
const exeIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='6' y='6' width='20' height='20' fill='%23fff' stroke='%23000' stroke-width='2'/%3E%3Crect x='6' y='6' width='20' height='6' fill='%23000080' stroke='%23000' stroke-width='2'/%3E%3Crect x='10' y='16' width='12' height='6' fill='%23c0c0c0' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E";
const linkIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='6' y='6' width='20' height='20' fill='%23fff' stroke='%23000' stroke-width='2'/%3E%3Cpath d='M10 22l6-10 6 10' fill='%230000ff'/%3E%3Cpath d='M8 26l4-4h8l4 4' fill='%23000'/%3E%3C/svg%3E";
const docIcon = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect x='6' y='4' width='20' height='24' fill='%23fff' stroke='%23000' stroke-width='2'/%3E%3Cline x1='10' y1='10' x2='22' y2='10' stroke='%23000' stroke-width='2'/%3E%3Cline x1='10' y1='14' x2='22' y2='14' stroke='%23000' stroke-width='2'/%3E%3Cline x1='10' y1='18' x2='18' y2='18' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E";

const ProjectIcon = ({ src, alt }) => {
  return (
    <img 
      src={src || exeIcon} 
      alt={alt} 
      className="w-8 h-8 object-contain"
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

const FileExplorer = ({ systemApps = [], onOpenApp }) => {
  // Navigation State
  const [path, setPath] = useState(['My Computer']);
  const currentFolder = path[path.length - 1];

  const navigate = (folder) => setPath([...path, folder]);
  const goBack = () => setPath(path.slice(0, -1));
  const goHome = () => setPath(['My Computer']);

  // Pre-filter system files vs project files 
  const sysOsApp = systemApps.find(a => a.id === 'system-os');
  const aboutApp = systemApps.find(a => a.id === 'about-us');
  const resumeApp = systemApps.find(a => a.id === 'resume'); 

  const projectApps = systemApps.filter(a => 
    !['system-os', 'about-us', 'file-explorer', 'projects-folder', 'resume', 'games-folder', 'settings'].includes(a.id) && !a.isGame
  );
  
  const startups = projectApps.filter(a => a.project_type === 'Startup');
  const clients = projectApps.filter(a => a.project_type === 'Client Project');
  const personal = projectApps.filter(a => !a.project_type || a.project_type === 'Personal Project');

  // ==========================================
  // VIEW 1: MY COMPUTER (HOME)
  // ==========================================
  const renderHome = () => (
    <div className="p-4 bg-os-white h-full w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
        
        {/* Drives */}
        <button onDoubleClick={() => navigate('Local Disk (C:)')} className="flex flex-col items-center gap-1 focus:outline-none group">
          <img src={driveIcon} alt="Drive C:" className="w-10 h-10 pointer-events-none" style={{ imageRendering: 'pixelated' }} />
          <span className="text-xs px-1 border border-transparent group-focus:bg-os-navy group-focus:text-os-white group-focus:border-dotted group-focus:border-os-white">Local Disk (C:)</span>
        </button>

        <button onDoubleClick={() => navigate('Projects (D:)')} className="flex flex-col items-center gap-1 focus:outline-none group">
          <img src={driveIcon} alt="Drive D:" className="w-10 h-10 pointer-events-none" style={{ imageRendering: 'pixelated' }} />
          <span className="text-xs px-1 border border-transparent group-focus:bg-os-navy group-focus:text-os-white group-focus:border-dotted group-focus:border-os-white">Projects (D:)</span>
        </button>

        {/* System Folders */}
        <button onDoubleClick={() => navigate('Experience')} className="flex flex-col items-center gap-1 focus:outline-none group">
          <img src={folderIcon} alt="Experience" className="w-10 h-10 pointer-events-none" style={{ imageRendering: 'pixelated' }} />
          <span className="text-xs px-1 border border-transparent group-focus:bg-os-navy group-focus:text-os-white group-focus:border-dotted group-focus:border-os-white">Experience</span>
        </button>

        {sysOsApp && (
          <button onDoubleClick={() => navigate(sysOsApp.name)} className="flex flex-col items-center gap-1 focus:outline-none group">
            <ProjectIcon src={sysOsApp.icon} alt={sysOsApp.name} />
            <span className="text-xs px-1 border border-transparent group-focus:bg-os-navy group-focus:text-os-white group-focus:border-dotted group-focus:border-os-white">{sysOsApp.name}.exe</span>
          </button>
        )}

        {aboutApp && (
          <button onDoubleClick={() => navigate(aboutApp.name)} className="flex flex-col items-center gap-1 focus:outline-none group">
            <ProjectIcon src={aboutApp.icon} alt={aboutApp.name} />
            <span className="text-xs px-1 border border-transparent group-focus:bg-os-navy group-focus:text-os-white group-focus:border-dotted group-focus:border-os-white">{aboutApp.name}.exe</span>
          </button>
        )}

        {resumeApp && (
          <button onDoubleClick={() => navigate(resumeApp.name)} className="flex flex-col items-center gap-1 focus:outline-none group">
            <img src={docIcon} alt="Resume" className="w-10 h-10 pointer-events-none" style={{ imageRendering: 'pixelated' }} />
            <span className="text-xs px-1 border border-transparent group-focus:bg-os-navy group-focus:text-os-white group-focus:border-dotted group-focus:border-os-white">{resumeApp.name}.rtf</span>
          </button>
        )}

        {/* Shortcuts */}
        <button onDoubleClick={() => window.open('https://github.com/vishalsinha2004', '_blank')} className="flex flex-col items-center gap-1 focus:outline-none group">
          <img src={linkIcon} alt="GitHub" className="w-10 h-10 pointer-events-none" style={{ imageRendering: 'pixelated' }} />
          <span className="text-xs px-1 border border-transparent group-focus:bg-os-navy group-focus:text-os-white group-focus:border-dotted group-focus:border-os-white">GitHub.url</span>
        </button>

        <button onDoubleClick={() => window.open('https://www.linkedin.com/in/vishal-sinha2004/', '_blank')} className="flex flex-col items-center gap-1 focus:outline-none group">
          <img src={linkIcon} alt="LinkedIn" className="w-10 h-10 pointer-events-none" style={{ imageRendering: 'pixelated' }} />
          <span className="text-xs px-1 border border-transparent group-focus:bg-os-navy group-focus:text-os-white group-focus:border-dotted group-focus:border-os-white">LinkedIn.url</span>
        </button>

      </div>
    </div>
  );

  // ==========================================
  // VIEW 2: PROJECTS DRIVE (D:)
  // ==========================================
  const renderProjects = () => {
    const renderSection = (title, categoryApps) => {
      if (categoryApps.length === 0) return null;
      return (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-os-text mb-2 border-b border-os-dark-gray pb-1">{title}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {categoryApps.map(app => (
              <button
                key={app.id}
                onDoubleClick={() => navigate(app.name)}
                className="flex flex-col items-center gap-1 focus:outline-none group"
              >
                <div className="w-10 h-10">
                  <ProjectIcon src={app.icon} alt={app.name} />
                </div>
                <span className="text-xs px-1 text-center line-clamp-2 leading-tight border border-transparent group-focus:bg-os-navy group-focus:text-os-white group-focus:border-dotted group-focus:border-os-white">
                  {app.name}.exe
                </span>
              </button>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="p-4 bg-os-white h-full w-full overflow-y-auto">
        {renderSection('Startup Ventures', startups)}
        {renderSection('Client Projects', clients)}
        {renderSection('Personal Projects', personal)}
      </div>
    );
  };

  // ==========================================
  // VIEW 3: EXPERIENCE (CLASSIC DOCUMENT)
  // ==========================================
  const renderExperience = () => (
    <div className="p-4 bg-os-white h-full w-full overflow-y-auto font-serif text-sm leading-relaxed text-black">
      <h2 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">Professional Experience</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-bold">AI/ML Data Science Intern</h3>
        <p className="font-bold italic">Techmicra IT Solutions | May 2025 — June 2025</p>
        <p className="mt-2">
          Completed an intensive academic internship focusing on Python-based Artificial Intelligence and Machine Learning. 
          Engineered and deployed machine learning models while mastering data processing pipelines, algorithmic classification, 
          and deep learning architectures.
        </p>
        <p className="font-bold mt-3">Technical Curriculum & Implementations:</p>
        <ul className="list-disc pl-6 mt-1">
          <li>Python, Pandas & NumPy</li>
          <li>Data Cleaning & Analysis</li>
          <li>Linear Regression & Classification</li>
          <li>Decision Trees & Clustering</li>
          <li>Deep Learning & Keras</li>
          <li>Neural Networks & CNNs</li>
          <li>Natural Language Processing (NLP)</li>
          <li>AI/ML Model Deployment</li>
        </ul>
      </div>

      <div className="mt-8 border border-os-dark-gray p-2 max-w-sm bg-os-gray shadow-retro-outset text-center font-sans">
        <p className="font-bold text-xs mb-2">Certificate of Completion</p>
        <img src="/image_ba3a02.jpg" alt="Certificate" className="w-full border border-os-dark-gray shadow-retro-inset mb-1" />
        <span className="text-[10px] text-os-dark-gray uppercase tracking-widest">Verified Credential</span>
      </div>
    </div>
  );

  // ==========================================
  // VIEW 4: APP PREVIEW (PROPERTIES DIALOG)
  // ==========================================
  const renderAppPreview = (app) => {
    return (
      <div className="h-full w-full bg-os-gray p-4 flex justify-center items-start pt-10">
        <div className="retro-window w-full max-w-md shadow-retro-outset">
          <div className="retro-title-bar">
            <span>{app.name} Properties</span>
            <button className="retro-btn px-2 py-0 h-5" onClick={goBack}>X</button>
          </div>
          
          <div className="p-4 flex flex-col gap-4 bg-os-gray">
            
            {/* Top row with icon and name */}
            <div className="flex items-center gap-4 border-b border-os-dark-gray pb-4">
              <img src={app.icon} alt="" className="w-12 h-12 object-contain" style={{ imageRendering: 'pixelated' }} />
              <div>
                <input type="text" value={app.name} readOnly className="retro-input w-full font-bold mb-1" />
                <span className="text-xs">Type: Application (.exe)</span>
              </div>
            </div>

            {/* Properties */}
            <div className="text-xs flex flex-col gap-2">
              <div className="grid grid-cols-[100px_1fr] items-center">
                <span>Location:</span>
                <span>C:\VISHAL\Projects\{app.name}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center">
                <span>Size:</span>
                <span>14.8 MB (15,518,920 bytes)</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-start">
                <span>Architecture:</span>
                <span>{app.tech_stack || 'Compiled Executable'}</span>
              </div>
            </div>

            <div className="w-full h-px bg-os-dark-gray border-b border-os-white my-2"></div>

            <p className="text-xs text-os-text h-16 overflow-y-auto custom-scrollbar bg-os-white shadow-retro-inset p-2 border border-os-dark-gray">
              {app.description || "System executable file ready for initialization."}
            </p>

            <div className="flex justify-end gap-2 mt-2">
              {app.live_link && (
                <button onClick={() => window.open(app.live_link, '_blank')} className="retro-btn text-xs font-bold">
                  Deploy Web
                </button>
              )}
              <button onClick={() => onOpenApp(app.id)} className="retro-btn text-xs font-bold w-24">
                Open
              </button>
              <button onClick={goBack} className="retro-btn text-xs w-24">
                Cancel
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (currentFolder === 'My Computer') return renderHome();
    if (currentFolder === 'Local Disk (C:)') return renderHome(); // Map C: to Home for simplicity
    if (currentFolder === 'Projects (D:)') return renderProjects();
    if (currentFolder === 'Experience') return renderExperience();
    
    const selectedApp = systemApps.find(a => a.name === currentFolder); 
    if (selectedApp) return renderAppPreview(selectedApp);
    
    return <div className="p-4 bg-os-white h-full text-os-text font-sans text-sm">This folder is empty.</div>;
  };

  return (
    <div className="h-full w-full bg-os-gray flex flex-col font-sans text-os-text select-none">
      
    

      {/* 2. Classic Toolbar */}
      <div className="flex items-center gap-1 p-1 border-b border-os-dark-gray shadow-[0_1px_0_#ffffff]">
        <button onClick={goBack} disabled={path.length === 1} className={`retro-btn px-2 py-1 flex items-center gap-1 ${path.length === 1 ? 'opacity-50 cursor-default' : ''}`}>
          <span className="text-lg leading-none mt-[-2px]">⇦</span> Back
        </button>
        <button className="retro-btn px-2 py-1 opacity-50 cursor-default flex items-center gap-1">
          <span className="text-lg leading-none mt-[-2px]">⇨</span> Forward
        </button>
        <button onClick={goBack} disabled={path.length === 1} className={`retro-btn px-2 py-1 flex items-center gap-1 ${path.length === 1 ? 'opacity-50 cursor-default' : ''}`}>
          <span className="text-lg leading-none mt-[-2px]">⇧</span> Up
        </button>
        <div className="w-px h-6 bg-os-dark-gray border-r border-os-white mx-1"></div>
        <button onClick={goHome} className="retro-btn px-2 py-1">Home</button>
      </div>

      {/* 3. Address Bar */}
      <div className="flex items-center gap-2 p-1 border-b border-os-dark-gray shadow-[0_1px_0_#ffffff]">
        <span className="text-xs px-2">Address</span>
        <div className="flex-1 bg-os-white shadow-retro-inset px-2 py-1 text-xs border border-os-dark-gray flex items-center gap-2">
          <img src={folderIcon} alt="" className="w-3 h-3" />
          C:\VISHAL\{path.join('\\')}
        </div>
      </div>

      {/* 4. Main Explorer Window */}
      <div className="flex flex-1 overflow-hidden border-t border-os-dark-gray shadow-retro-inset bg-os-white m-1">
        
        {/* Left Sidebar (Classic Web View Panel) */}
        <div className="w-48 bg-os-gray border-r border-os-dark-gray hidden md:flex flex-col">
          <div className="h-32 bg-os-teal w-full shadow-retro-inset mb-4 relative overflow-hidden flex flex-col items-center justify-center p-4 text-center">
             <img src={currentFolder === 'My Computer' ? driveIcon : folderIcon} alt="" className="w-12 h-12 mb-2" style={{ imageRendering: 'pixelated' }} />
             <h2 className="text-os-white font-bold text-sm z-10">{currentFolder}</h2>
          </div>
          <div className="px-4 text-xs">
            <p className="font-bold mb-2">Select an item to view its description.</p>
            <p className="mb-4">Use this explorer to navigate Vishal's file system, containing projects, system modules, and experience documents.</p>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-os-white overflow-hidden relative">
          {renderContent()}
        </div>

      </div>
    </div>
  );
};

export default FileExplorer;