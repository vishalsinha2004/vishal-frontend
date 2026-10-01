import React, { useState, useEffect } from 'react';
import { useSound } from '../hooks/useSound';
import Settings from '../components/Settings';
import AboutMe from '../components/AboutMe';
import ProjectPage from '../components/Project';
import MobileFileExplorer from './MobileFileExplorer';
import Resume from '../components/Resume';
import TicTacToe from '../components/TicTacToe';
import CommandPrompt from '../components/CommandPrompt';
import MobileMyComputer from './MobileMyComputer'; // <-- NEW IMPORT
import RecycleBin from '../components/RecycleBin';
import NetworkNeighborhood from '../components/NetworkNeighborhood';
import InternetExplorer from '../components/InternetExplorer';
import VoiceAssistant from '../components/VoiceAssistant';
import SystemMonitor from '../components/SystemMonitor';
import Notepad from '../components/Notepad';
import Paint from '../components/Paint';
import Minesweeper from '../components/Minesweeper';
import { showSystemDialog } from '../components/SystemDialog';

// Helpers to parse GitHub data for dynamic projects
const getRepoDetails = (url) => {
  if (!url) return null;
  const matches = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (matches && matches.length >= 3) return { owner: matches[1], repo: matches[2].replace('.git', '') };
  return null;
};

const parseTechStack = (stackStr) => {
  if (!stackStr) return [];
  const cleaned = stackStr.replace(/Frontend=/gi, '').replace(/Backend=/gi, ',').replace(/Database=/gi, ',');
  return cleaned.split(',').map(t => t.trim()).filter(t => t.length > 0);
};

const MobileWindow = ({
  app,
  isActive,
  fsApi,
  onClose,
  onOpenApp,
  systemApps,
  bgTheme,
  setBgTheme,
  onFocus,
  onMinimize,
  isCrtMode,
  setIsCrtMode,
  onCloseApp,
  openWindowCount
}) => {
  const { playSound } = useSound();

  const [activeTab, setActiveTab] = useState('frontend');
  const [repoFiles, setRepoFiles] = useState({ frontend: [], backend: [] });
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState(null);
  
  // Mobile touch menu state
  const [activeMenu, setActiveMenu] = useState(null);

  const closeMenu = () => setActiveMenu(null);
  const handleMenuAction = (action) => {
    playSound('click');
    if (action) action();
    closeMenu();
  };

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
          try {
            const res = await fetch(`https://api.github.com/repos/${details.owner}/${details.repo}/contents`);
            if (!res.ok) return []; 
            return await res.json();
          } catch (e) {
            return [];
          }
        };

        const [frontData, backData] = await Promise.all([fetchRepo(frontDetails), fetchRepo(backDetails)]);

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
  }, [app.id, app.frontend_repo, app.backend_repo, app.name]);

  const renderFileList = (files) => {
    if (githubLoading) return <div className="text-os-text text-xs p-2">Loading...</div>;
    if (githubError) return <div className="text-os-text text-xs p-2">{githubError}</div>;

    if (files.length === 0) return (
      <div className="text-os-dark-gray text-xs p-2 italic bg-white shadow-retro-inset border border-os-dark-gray h-[150px] flex items-center justify-center text-center px-4">
        Cannot display files.<br />Repository may be private or empty.
      </div>
    );

    return (
      <ul className="bg-os-white shadow-retro-inset p-1 h-[150px] overflow-y-auto custom-scrollbar border border-os-dark-gray">
        {files.map((file) => (
          <li key={file.sha} className="flex items-center gap-2 text-xs font-sans text-os-text hover:bg-os-navy hover:text-os-white px-1">
            <span>{file.type === 'dir' ? '📁' : '📄'}</span>
            <a href={file.html_url} target="_blank" rel="noopener noreferrer" className="truncate flex-1">{file.name}</a>
          </li>
        ))}
      </ul>
    );
  };

  const renderAppContent = () => {
    if (app.id === 'recycle-bin' || app.id === 'recycle') return <RecycleBin fsApi={fsApi} onOpenApp={onOpenApp} />;
    if (app.id === 'settings') return <Settings bgTheme={bgTheme} setBgTheme={setBgTheme} isCrtMode={isCrtMode} setIsCrtMode={setIsCrtMode} />;
    if (app.id === 'network') return <NetworkNeighborhood />;
    if (app.id === 'ie') return <InternetExplorer initialUrl={app.live_link} />;
    if (app.id === 'luma-ai') return <VoiceAssistant />;
    if (app.id === 'system-monitor') return <SystemMonitor openWindowCount={openWindowCount} />;
    if (app.id === 'notepad') return <Notepad />;
    if (app.id === 'paint') return <Paint />;
    if (app.id === 'minesweeper') return <Minesweeper />;
    
    if (app.id === 'system-os') return <MobileMyComputer onOpenApp={onOpenApp} />; // <-- UPDATE THIS LINE
    
    if (app.id === 'about-us' || app.name.toLowerCase() === 'about vishal') {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
      return <AboutMe apiUrl={apiUrl} onOpenApp={onOpenApp} />;
    }

    if (app.id === 'resume' || app.name.toLowerCase() === 'resume') return <Resume />;
    if (app.id === 'tic-tac-toe') return <TicTacToe />;
    if (app.id === 'problem-solver' || app.name.toLowerCase() === 'ms-dos prompt') {
      return <CommandPrompt onOpenApp={onOpenApp} onCloseApp={onCloseApp} systemApps={systemApps} isCrtMode={isCrtMode} setIsCrtMode={setIsCrtMode} fsApi={fsApi} />;
    }
    
    if (app.id === 'games-folder') {
      const gameApps = systemApps.filter(a => a.isGame);
      return <ProjectPage apps={gameApps} onOpenApp={onOpenApp} />;
    }

    if (app.id === 'projects-folder') {
      const projectApps = systemApps.filter(a => a.isProject);
      return <ProjectPage apps={projectApps} onOpenApp={onOpenApp} />;
    }

    if (app.id === 'file-explorer') return <MobileFileExplorer fsApi={fsApi} systemApps={systemApps} onOpenApp={onOpenApp} />;

    const techTags = parseTechStack(app.tech_stack);

    return (
      <div className="flex flex-col h-full bg-os-gray text-os-text p-2 overflow-y-auto font-sans">
        <div className="flex flex-col gap-3 mb-4 bg-os-gray shadow-retro-outset p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-os-white shadow-retro-inset p-1 flex items-center justify-center border border-os-dark-gray shrink-0">
              <img src={app.icon} alt={app.name} className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold truncate leading-tight">{app.name}</h2>
              <span className="text-[10px] text-os-dark-gray">{app.project_type || 'Application'}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {app.frontend_repo && <a href={app.frontend_repo} target="_blank" rel="noopener noreferrer" className="retro-btn text-[10px] px-2 py-1" onClick={() => playSound('click')}>Frontend</a>}
            {app.backend_repo && <a href={app.backend_repo} target="_blank" rel="noopener noreferrer" className="retro-btn text-[10px] px-2 py-1" onClick={() => playSound('click')}>Backend</a>}
            {app.live_link && <a href={app.live_link} target="_blank" rel="noopener noreferrer" className="retro-btn font-bold text-[10px] px-2 py-1" onClick={() => playSound('click')}>Run Program</a>}
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-4">
          <div className="bg-os-white shadow-retro-inset p-3 border border-os-dark-gray">
            <h3 className="font-bold border-b border-os-dark-gray mb-2 pb-1 text-sm">Description</h3>
            <p className="text-xs">{app.description || "No description provided."}</p>
          </div>
          <div className="bg-os-white shadow-retro-inset p-3 border border-os-dark-gray">
            <h3 className="font-bold border-b border-os-dark-gray mb-2 pb-1 text-sm">Properties</h3>
            <div className="flex flex-wrap gap-1">
              {techTags.length > 0 ? techTags.map((tag, idx) => (
                <span key={idx} className="bg-os-gray border border-os-dark-gray px-1 text-[10px] shadow-retro-outset">{tag}</span>
              )) : <span className="text-[10px]">N/A</span>}
            </div>
          </div>
        </div>

        {(app.frontend_repo || app.backend_repo) && (
          <div className="mb-4 bg-os-gray shadow-retro-outset p-2">
            <div className="flex gap-1 mb-2 overflow-x-auto">
              {app.frontend_repo && <button onClick={() => { playSound('click'); setActiveTab('frontend'); }} className={`retro-btn text-[10px] px-2 py-1 whitespace-nowrap ${activeTab === 'frontend' ? 'shadow-retro-inset' : ''}`}>Frontend Files</button>}
              {app.backend_repo && <button onClick={() => { playSound('click'); setActiveTab('backend'); }} className={`retro-btn text-[10px] px-2 py-1 whitespace-nowrap ${activeTab === 'backend' ? 'shadow-retro-inset' : ''}`}>Backend Files</button>}
            </div>
            {activeTab === 'frontend' && app.frontend_repo ? renderFileList(repoFiles.frontend) : null}
            {activeTab === 'backend' && app.backend_repo ? renderFileList(repoFiles.backend) : null}
          </div>
        )}

        {app.live_link ? (
          <div className="flex-1 min-h-[300px] border border-os-dark-gray">
            <InternetExplorer initialUrl={app.live_link} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-os-white shadow-retro-inset border border-os-dark-gray min-h-[150px]">
            <span className="text-os-dark-gray text-xs">Cannot connect to remote server.</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className={`absolute inset-0 flex-col bg-os-gray shadow-retro-outset z-40 overflow-hidden ${isActive ? 'flex' : 'hidden'}`}
      onMouseDownCapture={onFocus}
      onTouchStartCapture={onFocus}
    >
      <div className={`h-7 px-1 flex justify-between items-center shrink-0 font-dialog font-bold text-sm ${isActive ? 'bg-[#000080] text-white' : 'bg-[#808080] text-[#c0c0c0]'}`}>
        <div className="flex items-center gap-1.5 overflow-hidden pointer-events-none">
          <img src={app.icon} alt="" className="w-4 h-4 object-contain" style={{ imageRendering: 'pixelated' }} />
          <span className="truncate">{app.name}</span>
        </div>
        
        <div className="flex items-center gap-[2px]">
          <button onClick={(e) => { e.stopPropagation(); playSound('click'); onMinimize(); }} className="retro-btn w-6 h-5 flex items-center justify-center text-xs text-black bg-os-gray font-bold">_</button>
          <button onClick={(e) => { e.stopPropagation(); playSound('click'); onClose(); }} className="retro-btn w-6 h-5 flex items-center justify-center text-xs text-black bg-os-gray font-bold ml-1">X</button>
        </div>
      </div>

      <div className="h-6 border-b border-os-dark-gray bg-os-gray flex items-center gap-3 px-2 text-xs relative z-50 shrink-0 select-none">
        {activeMenu && <div className="fixed inset-0 z-40" onClick={closeMenu}></div>}
        <div className="relative z-50">
          <span className={`cursor-pointer px-1 ${activeMenu === 'file' ? 'bg-blue-900 text-white' : 'active:bg-blue-900 active:text-white'}`} onClick={() => { playSound('click'); setActiveMenu(activeMenu === 'file' ? null : 'file'); }}>File</span>
          {activeMenu === 'file' && (
            <div className="absolute top-full left-0 bg-os-gray shadow-retro-outset border border-os-white flex flex-col min-w-[120px] text-black py-1">
              <div className="px-3 py-1 active:bg-os-navy active:text-white" onClick={() => handleMenuAction(onClose)}>Close</div>
            </div>
          )}
        </div>
        <div className="relative z-50">
          <span className={`cursor-pointer px-1 ${activeMenu === 'help' ? 'bg-blue-900 text-white' : 'active:bg-blue-900 active:text-white'}`} onClick={() => { playSound('click'); setActiveMenu(activeMenu === 'help' ? null : 'help'); }}>Help</span>
          {activeMenu === 'help' && (
            <div className="absolute top-full left-0 bg-os-gray shadow-retro-outset border border-os-white flex flex-col min-w-[150px] text-black py-1">
              <div className="px-3 py-1 active:bg-os-navy active:text-white" onClick={() => handleMenuAction(() => onOpenApp('about-us'))}>About Vishal OS</div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 bg-os-gray overflow-hidden border-t border-os-white flex flex-col">
        {renderAppContent()}
      </div>
    </div>
  );
};

export default MobileWindow;