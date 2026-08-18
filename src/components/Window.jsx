import React, { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import gsap from 'gsap';
import Settings from './Settings';

const getRepoDetails = (url) => {
  if (!url) return null;
  const matches = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (matches && matches.length >= 3) {
    return { owner: matches[1], repo: matches[2].replace('.git', '') };
  }
  return null;
};

const Window = ({ app, onClose, bgTheme, setBgTheme, accentColor, setAccentColor }) => {
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
    if (app.id === 'settings') return;

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
    if (app.id === 'settings') {
      return (
        <Settings bgTheme={bgTheme} setBgTheme={setBgTheme} accentColor={accentColor} setAccentColor={setAccentColor} />
      );
    }

    return (
      <div className="flex flex-col h-full bg-space-dark text-space-white p-4 overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-start border-b border-space-gray pb-4 mb-5 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-thruster-glow flex items-center gap-3">
              <img src={app.icon} alt={app.name} className="w-8 h-8 object-contain" />
              {app.name}
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {app.frontend_repo && (
              <a href={app.frontend_repo} target="_blank" rel="noopener noreferrer" className="bg-[#1a1a1a] hover:bg-space-gray px-4 py-2 rounded text-sm font-mono border border-gray-600 transition-all flex items-center gap-2 shadow-lg">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                Frontend
              </a>
            )}
            {app.backend_repo && (
              <a href={app.backend_repo} target="_blank" rel="noopener noreferrer" className="bg-[#1a1a1a] hover:bg-space-gray px-4 py-2 rounded text-sm font-mono border border-gray-600 transition-all flex items-center gap-2 shadow-lg">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                Backend
              </a>
            )}
            {app.live_link && (
              <a href={app.live_link} target="_blank" rel="noopener noreferrer" className="bg-thruster-blue hover:bg-thruster-glow text-space-black px-5 py-2 rounded text-sm font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(79,195,247,0.4)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                Open Live App
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-5">
          {app.description && (
            <div className="text-[15px] text-gray-300 font-sans bg-[#0a0a0a] p-5 rounded border border-space-gray leading-relaxed">
              <strong className="text-space-white block mb-2 text-lg">Project Overview</strong> 
              {app.description}
            </div>
          )}
          
          {app.tech_stack && (
            <div className="text-sm text-gray-300 font-sans bg-[#0a0a0a] p-4 rounded border border-space-gray flex items-center gap-3">
              <strong className="text-space-white">Tech Stack:</strong> 
              <span className="font-mono text-thruster-glow bg-[#1a1a1a] px-3 py-1 rounded border border-gray-700">{app.tech_stack}</span>
            </div>
          )}
        </div>

        {(app.frontend_repo || app.backend_repo) && (
          <div className="mb-6 flex flex-col bg-[#121212] rounded border border-space-gray overflow-hidden">
            <div className="flex border-b border-space-gray bg-[#1a1a1a]">
              {app.frontend_repo && (
                <button 
                  onClick={() => setActiveTab('frontend')}
                  className={`flex-1 py-3 text-xs uppercase font-mono font-bold transition-colors ${activeTab === 'frontend' ? 'bg-space-gray text-thruster-glow border-b-2 border-thruster-glow' : 'text-gray-400 hover:bg-space-gray'}`}
                >
                  Frontend Files
                </button>
              )}
              {app.backend_repo && (
                <button 
                  onClick={() => setActiveTab('backend')}
                  className={`flex-1 py-3 text-xs uppercase font-mono font-bold transition-colors ${app.frontend_repo ? 'border-l border-space-gray' : ''} ${activeTab === 'backend' ? 'bg-space-gray text-thruster-glow border-b-2 border-thruster-glow' : 'text-gray-400 hover:bg-space-gray'}`}
                >
                  Backend Files
                </button>
              )}
            </div>
            <div className="p-2 bg-[#0a0a0a]">
              {activeTab === 'frontend' && app.frontend_repo ? renderFileList(repoFiles.frontend) : null}
              {activeTab === 'backend' && app.backend_repo ? renderFileList(repoFiles.backend) : null}
            </div>
          </div>
        )}

        {app.live_link ? (
          /* INCREASED min-h-[400px] to min-h-[600px] for more height */
          <div className="flex-1 flex flex-col border border-space-gray rounded-lg overflow-hidden bg-black min-h-[600px]">
            <div className="bg-[#1a1a1a] px-4 py-2 border-b border-space-gray flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
               <div className="ml-4 bg-[#0a0a0a] px-4 py-1 rounded text-xs text-gray-400 font-mono w-full border border-gray-700 truncate">
                 {app.live_link}
               </div>
            </div>
            <iframe 
              src={app.live_link} 
              className="w-full h-full bg-white"
              title={`${app.name} Live Preview`}
              sandbox="allow-scripts allow-same-origin allow-forms"
            ></iframe>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 font-mono text-sm border border-space-gray rounded-lg border-dashed min-h-[200px]">
             No live preview available.
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
            <img src={app.icon} alt={app.name} className="w-5 h-5 object-contain" />
            <span className="text-space-white font-mono text-sm tracking-wider">{app.name}</span>
          </div>
          
          <div className="flex items-center space-x-1 window-controls">
            {/* The Maximize/Restore Button remains */}
            <button 
              onClick={() => setIsMaximized(!isMaximized)} 
              className="text-gray-400 hover:text-space-white hover:bg-space-gray transition-colors w-8 h-8 flex items-center justify-center rounded font-mono text-lg"
            >
              □
            </button>
            {/* The Close Button remains */}
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