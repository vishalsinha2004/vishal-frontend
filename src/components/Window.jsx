import React, { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import Settings from './Settings';
import AboutMe from './AboutMe'; 
import ProjectPage from './Project'; 
import FileExplorer from './FileExplorer'; 
import Resume from './Resume'; 
import TicTacToe from './TicTacToe'; 
import ProblemSolver from './ProblemSolver'; 

// --- Dynamic System OS ("About Project") View Component ---
const SystemOSView = ({ apiUrl }) => {
  const [sysInfo, setSysInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/system-os/`)
      .then((res) => {
        if (!res.ok) throw new Error('API Endpoint not found');
        return res.json();
      })
      .then((data) => {
        setSysInfo(Array.isArray(data) ? data : [data]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("System OS API Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) {
    return <div className="h-full flex items-center justify-center font-mono text-os-text">Loading System Information...</div>;
  }

  if (error || sysInfo.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center font-sans text-os-text p-8 text-center bg-os-white shadow-retro-inset m-2">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 mb-4"><rect x="2" y="3" width="20" height="14"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
        <p className="font-bold">System Information Unavailable</p>
        <p className="text-xs mt-2">Cannot connect to the local server.</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-os-white p-2 overflow-y-auto custom-scrollbar shadow-retro-inset m-1">
      <div className="flex flex-col gap-4">
        {sysInfo.map((item, index) => (
          <div key={index} className="bg-os-gray border border-os-dark-gray p-4 flex flex-col md:flex-row items-start gap-4">
            
            {(item.icon || item.image) && (
              <div className="w-16 h-16 flex-shrink-0 bg-os-white p-2 border border-os-dark-gray shadow-retro-inset">
                <img src={item.icon || item.image} alt="Icon" className="w-full h-full object-contain" />
              </div>
            )}
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
              {Object.entries(item).map(([key, value]) => {
                const hiddenKeys = ['id', 'icon', 'image', 'created_at', 'updated_at'];
                if (hiddenKeys.includes(key.toLowerCase())) return null; 
                
                return (
                  <div key={key} className="flex gap-2 bg-os-white p-2 border border-os-dark-gray shadow-retro-inset items-start">
                    <span className="text-xs font-bold whitespace-nowrap">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <span className="text-xs font-sans whitespace-pre-wrap">
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getRepoDetails = (url) => {
  if (!url) return null;
  const matches = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (matches && matches.length >= 3) {
    return { owner: matches[1], repo: matches[2].replace('.git', '') };
  }
  return null;
};

const parseTechStack = (stackStr) => {
  if (!stackStr) return [];
  const cleaned = stackStr.replace(/Frontend=/gi, '').replace(/Backend=/gi, ',').replace(/Database=/gi, ',');
  return cleaned.split(',').map(t => t.trim()).filter(t => t.length > 0);
};

const Window = ({ app, onClose, onOpenApp, systemApps, bgTheme, setBgTheme, accentColor, setAccentColor }) => {
  const nodeRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('frontend');
  const [repoFiles, setRepoFiles] = useState({ frontend: [], backend: [] });
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    // Replaced GSAP smooth animation with an instant/chunky 90s feel
    // A classic OS wouldn't slide smoothly, it just appears.
  }, []);

  useEffect(() => {
    const sysApps = ['settings', 'system-os', 'about-us', 'projects-folder', 'games-folder', 'file-explorer', 'resume', 'tic-tac-toe', 'problem-solver'];
    if (sysApps.includes(app.id) || app.name.toLowerCase() === 'about vishal') return;

    const fetchFiles = async () => {
      const frontDetails = getRepoDetails(app.frontend_repo);
      const backDetails = getRepoDetails(app.backend_repo);

      if (!frontDetails && !backDetails) return; 

      setGithubLoading(true);
      try {
        const fetchRepo = async (details) => {
          if (!details) return [];
          const res = await fetch(`https://api.github.com/repos/${details.owner}/${details.repo}/contents`);
          if (!res.ok) throw new Error('API Error');
          return await res.json();
        };

        const [frontData, backData] = await Promise.all([
          fetchRepo(frontDetails),
          fetchRepo(backDetails)
        ]);

        setRepoFiles({
          frontend: Array.isArray(frontData) ? frontData : [],
          backend: Array.isArray(backData) ? backData : []
        });

        if (frontDetails && !backDetails) setActiveTab('frontend');
        if (!frontDetails && backDetails) setActiveTab('backend');

      } catch (err) {
        setGithubError("Could not load repository files.");
      } finally {
        setGithubLoading(false);
      }
    };

    fetchFiles();
  }, [app]);

  const renderFileList = (files) => {
    if (githubLoading) return <div className="text-os-text text-xs p-2">Loading...</div>;
    if (githubError) return <div className="text-os-text text-xs p-2">{githubError}</div>;
    if (files.length === 0) return <div className="text-os-text text-xs p-2">No files.</div>;

    return (
      <ul className="bg-os-white shadow-retro-inset p-1 h-[150px] overflow-y-auto custom-scrollbar border border-os-dark-gray">
        {files.map((file) => (
          <li key={file.sha} className="flex items-center gap-2 text-xs font-sans text-os-text hover:bg-os-navy hover:text-os-white cursor-default px-1">
            <span>{file.type === 'dir' ? '📁' : '📄'}</span>
            <a href={file.html_url} target="_blank" rel="noopener noreferrer" className="truncate flex-1">
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  const renderAppContent = () => {
    if (app.id === 'settings') return <Settings bgTheme={bgTheme} setBgTheme={setBgTheme} accentColor={accentColor} setAccentColor={setAccentColor} />;
    
    if (app.id === 'system-os') {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
      return <SystemOSView apiUrl={apiUrl} />;
    }

    if (app.id === 'about-us' || app.name.toLowerCase() === 'about vishal') {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
      return <AboutMe apiUrl={apiUrl} onOpenApp={onOpenApp} />;
    }

    if (app.id === 'resume' || app.name.toLowerCase() === 'resume') return <Resume />;
    if (app.id === 'tic-tac-toe') return <TicTacToe />;
    if (app.id === 'problem-solver') return <ProblemSolver />;

    if (app.id === 'games-folder') {
      const gameApps = systemApps.filter(a => a.isGame);
      return <ProjectPage apps={gameApps} onOpenApp={onOpenApp} />;
    }

    if (app.id === 'projects-folder') {
      const projectApps = systemApps.filter(a => !['system-os', 'about-us', 'resume', 'settings', 'projects-folder', 'file-explorer', 'games-folder'].includes(a.id) && !a.isGame);
      return <ProjectPage apps={projectApps} onOpenApp={onOpenApp} />;
    }

    if (app.id === 'file-explorer') return <FileExplorer systemApps={systemApps} onOpenApp={onOpenApp} />;

    // --- RETRO PROJECT PREVIEW VIEW ---
    const techTags = parseTechStack(app.tech_stack);

    return (
      <div className="flex flex-col h-full bg-os-gray text-os-text p-2 overflow-y-auto font-sans">
        
        {/* Retro Header Panel */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 bg-os-gray shadow-retro-outset p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-os-white shadow-retro-inset p-1 flex items-center justify-center border border-os-dark-gray">
              <img src={app.icon} alt={app.name} className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{app.name}</h2>
              <span className="text-xs text-os-dark-gray">{app.project_type || 'Application'}</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {app.frontend_repo && (
              <a href={app.frontend_repo} target="_blank" rel="noopener noreferrer" className="retro-btn text-xs">
                Frontend
              </a>
            )}
            {app.backend_repo && (
              <a href={app.backend_repo} target="_blank" rel="noopener noreferrer" className="retro-btn text-xs">
                Backend
              </a>
            )}
            {app.live_link && (
              <a href={app.live_link} target="_blank" rel="noopener noreferrer" className="retro-btn font-bold text-xs">
                Run Program
              </a>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2 bg-os-white shadow-retro-inset p-4 border border-os-dark-gray">
            <h3 className="font-bold border-b border-os-dark-gray mb-2 pb-1">Description</h3>
            <p className="text-sm">
              {app.description || "No description provided."}
            </p>
          </div>

          <div className="lg:col-span-1 bg-os-white shadow-retro-inset p-4 border border-os-dark-gray">
            <h3 className="font-bold border-b border-os-dark-gray mb-2 pb-1">Properties</h3>
            <div className="flex flex-wrap gap-1">
              {techTags.length > 0 ? techTags.map((tag, idx) => (
                <span key={idx} className="bg-os-gray border border-os-dark-gray px-1 text-xs shadow-retro-outset">
                  {tag}
                </span>
              )) : (
                <span className="text-xs">N/A</span>
              )}
            </div>
          </div>
        </div>

        {/* File Explorer Style Area */}
        {(app.frontend_repo || app.backend_repo) && (
          <div className="mb-4 bg-os-gray shadow-retro-outset p-2">
            <div className="flex gap-1 mb-2">
              {app.frontend_repo && (
                <button 
                  onClick={() => setActiveTab('frontend')}
                  className={`retro-btn text-xs ${activeTab === 'frontend' ? 'shadow-retro-inset' : ''}`}
                >
                  Frontend Files
                </button>
              )}
              {app.backend_repo && (
                <button 
                  onClick={() => setActiveTab('backend')}
                  className={`retro-btn text-xs ${activeTab === 'backend' ? 'shadow-retro-inset' : ''}`}
                >
                  Backend Files
                </button>
              )}
            </div>
            {activeTab === 'frontend' && app.frontend_repo ? renderFileList(repoFiles.frontend) : null}
            {activeTab === 'backend' && app.backend_repo ? renderFileList(repoFiles.backend) : null}
          </div>
        )}

        {/* Internet Explorer Style Frame */}
        {app.live_link ? (
          <div className="flex-1 flex flex-col bg-os-gray shadow-retro-outset p-2 min-h-[400px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">Address:</span>
              <div className="bg-os-white shadow-retro-inset px-2 py-1 text-xs border border-os-dark-gray flex-1 truncate">
                {app.live_link}
              </div>
            </div>
            <iframe 
              src={app.live_link} 
              className="w-full flex-1 bg-white shadow-retro-inset border border-os-dark-gray"
              title={`${app.name} Live Preview`}
            ></iframe>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-os-white shadow-retro-inset border border-os-dark-gray min-h-[200px]">
             <span className="text-os-dark-gray text-sm">Cannot connect to remote server.</span>
          </div>
        )}

      </div>
    );
  };

  return (
    <Draggable 
      nodeRef={nodeRef} 
      handle=".retro-title-bar" 
      cancel=".window-controls" 
      bounds="parent" 
      disabled={isMaximized}
    >
      <div 
        ref={nodeRef} 
        className={`absolute z-[70] flex flex-col retro-window
        ${isMaximized 
          ? 'top-0 left-0 w-full h-[calc(100vh-2rem)] !transform-none' // Adjust height for retro taskbar
          : 'top-10 left-10 w-[800px] h-[600px] max-w-[90vw] max-h-[80vh]'
        }`}
        onMouseDown={(e) => {
          // Bring to front logic could be implemented here via state in App.jsx
        }}
      >
        {/* --- CLASSIC TITLE BAR --- */}
        <div className="retro-title-bar cursor-move select-none">
          <div className="flex items-center gap-1 overflow-hidden">
            <img src={app.icon} alt="" className="w-4 h-4 object-contain" />
            <span className="truncate pr-2">{app.name}</span>
          </div>
          
          <div className="flex items-center gap-[2px] window-controls">
            <button 
              onClick={() => setIsMaximized(false)} 
              className="retro-btn px-2 py-0 h-[18px] text-xs leading-none font-bold"
              title="Minimize"
            >
              _
            </button>
            <button 
              onClick={() => setIsMaximized(!isMaximized)} 
              className="retro-btn px-2 py-0 h-[18px] text-xs leading-none font-bold"
              title="Maximize"
            >
              □
            </button>
            <button 
              onClick={() => onClose(app.id)} 
              className="retro-btn px-2 py-0 h-[18px] text-xs leading-none font-bold"
              title="Close"
            >
              X
            </button>
          </div>
        </div>

        {/* --- CLASSIC MENU BAR --- */}
        <div className="retro-menu-bar border-b border-os-dark-gray select-none">
          <span className="retro-menu-item"><span className="underline">F</span>ile</span>
          <span className="retro-menu-item"><span className="underline">E</span>dit</span>
          <span className="retro-menu-item"><span className="underline">V</span>iew</span>
          <span className="retro-menu-item"><span className="underline">H</span>elp</span>
        </div>

        {/* --- WINDOW CONTENT --- */}
        <div className="flex-1 bg-os-gray overflow-hidden p-1 border-t border-os-white">
          {renderAppContent()}
        </div>
        
        {/* --- STATUS BAR --- */}
        <div className="retro-status-bar">
          <span>1 object(s) selected</span>
          <span className="border-l border-os-dark-gray pl-2">Vishal OS 98</span>
        </div>
      </div>
    </Draggable>
  );
};

export default Window;