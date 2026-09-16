import React, { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import gsap from 'gsap';
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
    return <div className="h-full flex items-center justify-center font-mono text-thruster-glow animate-pulse">Fetching Project Architecture...</div>;
  }

  if (error || sysInfo.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center font-mono text-gray-500 p-8 text-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 mb-4 text-gray-700"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
        <p>Awaiting Admin Panel Configuration.</p>
        <p className="text-xs mt-2">Please ensure your Django backend is actively returning data on the <span className="text-space-white">/api/system-os/</span> endpoint.</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#050505] p-6 overflow-y-auto custom-scrollbar shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
      <div className="flex flex-col gap-6">
        {sysInfo.map((item, index) => (
          <div key={index} className="bg-[#121212] border border-space-gray hover:border-gray-500 transition-all rounded-xl p-6 shadow-lg flex flex-col md:flex-row items-start gap-6 group cursor-default">
            
            {(item.icon || item.image) && (
              <div className="w-24 h-24 flex-shrink-0 bg-[#1a1a1a] p-3 rounded-xl border border-gray-700 group-hover:border-thruster-glow transition-colors">
                <img src={item.icon || item.image} alt="Project component icon" className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform" />
              </div>
            )}
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {Object.entries(item).map(([key, value]) => {
                const hiddenKeys = ['id', 'icon', 'image', 'created_at', 'updated_at'];
                if (hiddenKeys.includes(key.toLowerCase())) return null; 
                
                return (
                  <div key={key} className="flex flex-col bg-[#0a0a0a] p-4 rounded-lg border border-space-gray">
                    <span className="text-[10px] text-gray-500 uppercase font-mono tracking-widest mb-1">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm text-space-white font-sans whitespace-pre-wrap leading-relaxed">
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

// --- Regular Window Component Logic ---
const getRepoDetails = (url) => {
  if (!url) return null;
  const matches = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (matches && matches.length >= 3) {
    return { owner: matches[1], repo: matches[2].replace('.git', '') };
  }
  return null;
};

// Parses raw tech stack strings (like "Frontend=React,Vite Backend=Python") into clean array tags
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
    if (nodeRef.current) {
      gsap.fromTo(
        nodeRef.current,
        { scale: 0.85, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }
      );
    }
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
          if (!res.ok) throw new Error('API Rate Limit or Repo Not Found');
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
        console.error("GitHub fetch error:", err);
        setGithubError("Could not load repository files.");
      } finally {
        setGithubLoading(false);
      }
    };

    fetchFiles();
  }, [app]);

  const renderFileList = (files) => {
    if (githubLoading) return <div className="text-gray-400 font-mono text-sm p-4 animate-pulse">Fetching repository data...</div>;
    if (githubError) return <div className="text-red-400 font-mono text-sm p-4">{githubError}</div>;
    if (files.length === 0) return <div className="text-gray-400 font-mono text-sm p-4">No files found.</div>;

    return (
      <ul className="space-y-2 p-3 bg-[#0a0a0a] rounded h-[200px] overflow-y-auto custom-scrollbar">
        {files.map((file) => (
          <li key={file.sha} className="flex items-center gap-2 text-sm font-mono text-gray-300 hover:text-thruster-glow transition-colors">
            <span>{file.type === 'dir' ? '📁' : '📄'}</span>
            <a href={file.html_url} target="_blank" rel="noopener noreferrer" className="truncate">
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

    // ==============================================================
    // REDESIGNED PROJECT PREVIEW APP (BENTO GRID UI)
    // ==============================================================
    const techTags = parseTechStack(app.tech_stack);

    return (
      <div className="flex flex-col h-full bg-[#050505] text-space-white p-6 md:p-8 overflow-y-auto custom-scrollbar font-sans relative">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-thruster-blue opacity-[0.03] blur-[80px] pointer-events-none"></div>

        {/* 1. Header & Action Commands */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-gray-800 pb-6 relative z-10">
          
          {/* App Info */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-[#0a0a0a] border border-gray-700 rounded-2xl flex items-center justify-center p-3 shadow-[0_0_20px_rgba(0,0,0,0.5)] shrink-0">
              <img src={app.icon} alt={app.name} className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1">{app.name}</h2>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse"></span>
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                  {app.project_type || 'System Module'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {app.frontend_repo && (
              <a href={app.frontend_repo} target="_blank" rel="noopener noreferrer" className="bg-[#121212] hover:bg-space-gray text-gray-300 hover:text-white px-5 py-2.5 rounded-xl text-xs font-mono font-bold border border-gray-700 hover:border-gray-500 transition-all flex items-center gap-2 shadow-lg">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                Frontend Code
              </a>
            )}
            {app.backend_repo && (
              <a href={app.backend_repo} target="_blank" rel="noopener noreferrer" className="bg-[#121212] hover:bg-space-gray text-gray-300 hover:text-white px-5 py-2.5 rounded-xl text-xs font-mono font-bold border border-gray-700 hover:border-gray-500 transition-all flex items-center gap-2 shadow-lg">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                Backend Code
              </a>
            )}
            {app.live_link && (
              <a href={app.live_link} target="_blank" rel="noopener noreferrer" className="bg-thruster-blue/10 hover:bg-thruster-blue text-thruster-glow hover:text-black border border-thruster-glow/50 px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(79,195,247,0.2)] hover:shadow-[0_0_20px_rgba(79,195,247,0.6)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                Initialize Deployment
              </a>
            )}
          </div>
        </div>

        {/* 2. System Specs Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 relative z-10">
          
          {/* Overview Card */}
          <div className="lg:col-span-2 bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-thruster-blue opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-[11px] font-mono text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2 font-bold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-thruster-glow"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
              Module Overview
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed font-sans">
              {app.description || "System telemetry module description unassigned."}
            </p>
          </div>

          {/* Tech Stack Card */}
          <div className="lg:col-span-1 bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-[11px] font-mono text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2 font-bold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-purple-400"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
              Core Architecture
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {techTags.length > 0 ? techTags.map((tag, idx) => (
                <span key={idx} className="bg-[#141414] border border-gray-700 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-mono hover:border-thruster-glow hover:text-thruster-glow transition-colors cursor-default shadow-sm">
                  {tag}
                </span>
              )) : (
                <span className="text-gray-600 text-xs font-mono">Unspecified Architecture</span>
              )}
            </div>
          </div>
        </div>

        {/* 3. Github Repository Explorer */}
        {(app.frontend_repo || app.backend_repo) && (
          <div className="mb-8 flex flex-col bg-[#0a0a0a] rounded-2xl border border-gray-800 overflow-hidden shadow-xl relative z-10">
            <div className="flex border-b border-gray-800 bg-[#121212]">
              {app.frontend_repo && (
                <button 
                  onClick={() => setActiveTab('frontend')}
                  className={`flex-1 py-3.5 text-xs uppercase font-mono font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'frontend' ? 'bg-[#1a1a1a] text-thruster-glow border-b-2 border-thruster-glow' : 'text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300'}`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                  Frontend Source
                </button>
              )}
              {app.backend_repo && (
                <button 
                  onClick={() => setActiveTab('backend')}
                  className={`flex-1 py-3.5 text-xs uppercase font-mono font-bold transition-all flex items-center justify-center gap-2 ${app.frontend_repo ? 'border-l border-gray-800' : ''} ${activeTab === 'backend' ? 'bg-[#1a1a1a] text-thruster-glow border-b-2 border-thruster-glow' : 'text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300'}`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                  Backend Source
                </button>
              )}
            </div>
            <div className="p-3 bg-[#050505]">
              {activeTab === 'frontend' && app.frontend_repo ? renderFileList(repoFiles.frontend) : null}
              {activeTab === 'backend' && app.backend_repo ? renderFileList(repoFiles.backend) : null}
            </div>
          </div>
        )}

        {/* 4. Live Deployment Mockup Container */}
        {app.live_link ? (
          <div className="flex-1 flex flex-col border border-gray-800 rounded-2xl overflow-hidden bg-black min-h-[600px] shadow-2xl relative z-10">
            
            {/* Mock macOS Browser Header */}
            <div className="bg-[#121212] px-4 py-3 border-b border-gray-800 flex items-center gap-4">
               <div className="flex gap-2">
            
               </div>
               <div className="flex-1 bg-[#0a0a0a] px-4 py-1.5 rounded-lg text-xs text-gray-400 font-mono border border-gray-800 flex items-center justify-center gap-2 relative">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-gray-500"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                 <span className="truncate max-w-[80%]">{app.live_link}</span>
               </div>
               <div className="w-16"></div> {/* Spacer to center URL */}
            </div>
            
            {/* Live iFrame */}
            <iframe 
              src={app.live_link} 
              className="w-full h-full bg-white flex-1"
              title={`${app.name} Live Preview`}
              sandbox="allow-scripts allow-same-origin allow-forms"
            ></iframe>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#0a0a0a] border border-gray-800 rounded-2xl border-dashed min-h-[200px] relative z-10">
             <div className="flex flex-col items-center opacity-50">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12 mb-3 text-gray-500"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
               <span className="text-gray-400 font-mono text-xs uppercase tracking-widest">Deployment Offline / Not Available</span>
             </div>
          </div>
        )}

      </div>
    );
  };

  return (
    <Draggable 
      nodeRef={nodeRef} 
      handle=".window-header" 
      cancel=".window-controls" 
      bounds="parent" 
      disabled={isMaximized}
    >
      <div 
        ref={nodeRef} 
        className={`absolute z-[70] flex flex-col bg-space-dark border border-space-gray shadow-2xl overflow-hidden backdrop-blur-md transition-opacity duration-200 opacity-100 pointer-events-auto
        ${isMaximized 
          ? 'top-0 left-0 w-full h-[calc(100vh-3.5rem)] rounded-none !transform-none bg-opacity-100' 
          : 'top-24 left-10 w-[1000px] h-[800px] max-w-[95vw] max-h-[85vh] rounded-lg bg-opacity-95'
        }`}
      >
        <div className="window-header cursor-move h-12 bg-[#0a0a0a] flex justify-between items-center px-4 border-b border-space-gray select-none">
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => onClose(app.id)} 
              className="flex items-center gap-1.5 text-gray-400 hover:text-white bg-[#1a1a1a] hover:bg-space-gray border border-gray-700 px-3 py-1 rounded-md text-xs font-sans font-bold transition-all mr-2 shadow-sm focus:outline-none"
              title="Go Back / Close Folder"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M15 18l-6-6 6-6"></path>
              </svg>
              Back
            </button>

            <div className="w-px h-4 bg-gray-700 mr-2"></div>

            <img src={app.icon} alt={app.name} className="w-5 h-5 object-contain" />
            <span className="text-space-white font-mono text-sm tracking-wider">{app.name}</span>
          </div>
          
          <div className="flex items-center space-x-1 window-controls">
            <button 
              onClick={() => setIsMaximized(!isMaximized)} 
              className="text-gray-400 hover:text-space-white hover:bg-space-gray transition-colors w-8 h-8 flex items-center justify-center rounded font-mono text-lg"
            >
              □
            </button>
            <button 
              onClick={() => onClose(app.id)} 
              className="text-gray-400 hover:text-white hover:bg-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {renderAppContent()}
        </div>
      </div>
    </Draggable>
  );
};

export default Window;