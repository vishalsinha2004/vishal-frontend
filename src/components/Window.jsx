import React, { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import Settings from './Settings';
import AboutMe from './AboutMe';
import ProjectPage from './Project';
import FileExplorer from './FileExplorer';
import Resume from './Resume';
import TicTacToe from './TicTacToe';
import ProblemSolver from './ProblemSolver';
import { useSound } from '../hooks/useSound';
import ContextMenu from './ContextMenu'; // <-- NEW IMPORT
import CommandPrompt from './CommandPrompt';
import MyComputer from './MyComputer'; //
import RecycleBin from './RecycleBin';
import NetworkNeighborhood from './NetworkNeighborhood';
import InternetExplorer from './InternetExplorer'; // <-- ADD THIS IMPORT
import VoiceAssistant from './VoiceAssistant'; // <-- ADD/VERIFY IMPORT
import SystemMonitor from './SystemMonitor'; // <-- ADD THIS
import Notepad from './Notepad'; // <-- ADD THIS
import Paint from './Paint'; // <-- ADD THIS
import Minesweeper from './Minesweeper'; // <-- ADD THIS
import { showSystemDialog } from './SystemDialog';
// --- Dynamic System OS Component ---
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

  if (loading) return <div className="h-full flex items-center justify-center font-mono text-os-text">Loading System Information...</div>;

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
                    <span className="text-xs font-bold whitespace-nowrap">{key.replace(/_/g, ' ')}:</span>
                    <span className="text-xs font-sans whitespace-pre-wrap">{value}</span>
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
  if (matches && matches.length >= 3) return { owner: matches[1], repo: matches[2].replace('.git', '') };
  return null;
};

const parseTechStack = (stackStr) => {
  if (!stackStr) return [];
  const cleaned = stackStr.replace(/Frontend=/gi, '').replace(/Backend=/gi, ',').replace(/Database=/gi, ',');
  return cleaned.split(',').map(t => t.trim()).filter(t => t.length > 0);
};

// --- MAIN WINDOW COMPONENT ---
const Window = ({
  app,
  isActive,
  fsApi,
  onClose,
  onOpenApp,
  systemApps,
  bgTheme,
  setBgTheme,
  accentColor,
  setAccentColor,
  onFocus,
  onMinimize,
  onToggleMaximize,
  onUpdatePosition,
  isCrtMode,
  setIsCrtMode,
  onCloseApp,
  openWindowCount // <-- ADD THIS PROP
}) => {
  const nodeRef = useRef(null);
  const { playSound } = useSound();

  const [activeTab, setActiveTab] = useState('frontend');
  const [repoFiles, setRepoFiles] = useState({ frontend: [], backend: [] });
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState(null);

  // -- Context Menu State for Title Bar --
  const [titleMenu, setTitleMenu] = useState({ visible: false, x: 0, y: 0 });
  const [activeMenu, setActiveMenu] = useState(null);

  const closeMenu = () => setActiveMenu(null);
  const handleMenuAction = (action) => {
    playSound('click');
    if (action) action();
    closeMenu();
  };

  const handleTitleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setTitleMenu({ visible: true, x: e.clientX, y: e.clientY });
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
        // Updated fetch function: Catches 404s gracefully without breaking Promise.all
        const fetchRepo = async (details) => {
          if (!details) return [];
          try {
            const res = await fetch(`https://api.github.com/repos/${details.owner}/${details.repo}/contents`);
            if (!res.ok) {
              console.warn(`Could not fetch ${details.repo}. It may be private or empty.`);
              return []; // Return empty array instead of throwing error
            }
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

    // Updated empty state message
    if (files.length === 0) return (
      <div className="text-os-dark-gray text-xs p-2 italic bg-white shadow-retro-inset border border-os-dark-gray h-[150px] flex items-center justify-center text-center px-4">
        Cannot display files.<br />This repository is either private, empty, or unreachable.
      </div>
    );

    return (
      <ul className="bg-os-white shadow-retro-inset p-1 h-[150px] overflow-y-auto custom-scrollbar border border-os-dark-gray">
        {files.map((file) => (
          <li key={file.sha} className="flex items-center gap-2 text-xs font-sans text-os-text hover:bg-os-navy hover:text-os-white cursor-default px-1">
            <span>{file.type === 'dir' ? '📁' : '📄'}</span>
            <a href={file.html_url} target="_blank" rel="noopener noreferrer" className="truncate flex-1">{file.name}</a>
          </li>
        ))}
      </ul>
    );
  };

  const renderAppContent = () => {
    // Inside renderAppContent():
    if (app.id === 'recycle-bin' || app.id === 'recycle') return <RecycleBin fsApi={fsApi} onOpenApp={onOpenApp} />; // <--- UPDATE

    // ADD THIS LINE:
    if (app.id === 'settings') {
      return (
        <Settings
          bgTheme={bgTheme}
          setBgTheme={setBgTheme}
          isCrtMode={isCrtMode}
          setIsCrtMode={setIsCrtMode}
        />
      );
    }
    if (app.id === 'network') return <NetworkNeighborhood />;
    if (app.id === 'ie') return <InternetExplorer initialUrl={app.live_link} />;
    if (app.id === 'luma-ai') return <VoiceAssistant />; // <-- ADD THIS LINE   
    if (app.id === 'system-monitor') return <SystemMonitor openWindowCount={openWindowCount} />; // <-- ADD THIS LINE 
    if (app.id === 'notepad') return <Notepad />; // <-- ADD THIS LINE
    if (app.id === 'paint') return <Paint />; // <-- ADD THIS LINE
    if (app.id === 'minesweeper') return <Minesweeper />; // <-- ADD THIS LINE
    if (app.id === 'system-os') {
      return <MyComputer onOpenApp={onOpenApp} />;
    }

    if (app.id === 'about-us' || app.name.toLowerCase() === 'about vishal') {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
      return <AboutMe apiUrl={apiUrl} onOpenApp={onOpenApp} />;
    }

    if (app.id === 'resume' || app.name.toLowerCase() === 'resume') return <Resume />;
    if (app.id === 'tic-tac-toe') return <TicTacToe />;
    if (app.id === 'problem-solver' || app.name.toLowerCase() === 'ms-dos prompt') {
      return (
        <CommandPrompt
          onOpenApp={onOpenApp}
          onCloseApp={onCloseApp}
          systemApps={systemApps}
          isCrtMode={isCrtMode}
          setIsCrtMode={setIsCrtMode}
        />
      );
    }
    if (app.id === 'games-folder') {
      const gameApps = systemApps.filter(a => a.isGame);
      return <ProjectPage apps={gameApps} onOpenApp={onOpenApp} />;
    }

    if (app.id === 'projects-folder') {
      // ONLY grabs items fetched from your database
      const projectApps = systemApps.filter(a => a.isProject);
      return <ProjectPage apps={projectApps} onOpenApp={onOpenApp} />;
    }

    if (app.id === 'file-explorer') return <FileExplorer fsApi={fsApi} systemApps={systemApps} onOpenApp={onOpenApp} />; // <--- UPDATE

    const techTags = parseTechStack(app.tech_stack);

    return (
      <div className="flex flex-col h-full bg-os-gray text-os-text p-2 overflow-y-auto font-sans">
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
          <div className="flex flex-wrap gap-2">
            {app.frontend_repo && <a href={app.frontend_repo} target="_blank" rel="noopener noreferrer" className="retro-btn text-xs" onClick={() => playSound('click')}>Frontend</a>}
            {app.backend_repo && <a href={app.backend_repo} target="_blank" rel="noopener noreferrer" className="retro-btn text-xs" onClick={() => playSound('click')}>Backend</a>}
            {app.live_link && <a href={app.live_link} target="_blank" rel="noopener noreferrer" className="retro-btn font-bold text-xs" onClick={() => playSound('click')}>Run Program</a>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2 bg-os-white shadow-retro-inset p-4 border border-os-dark-gray">
            <h3 className="font-bold border-b border-os-dark-gray mb-2 pb-1">Description</h3>
            <p className="text-sm">{app.description || "No description provided."}</p>
          </div>
          <div className="lg:col-span-1 bg-os-white shadow-retro-inset p-4 border border-os-dark-gray">
            <h3 className="font-bold border-b border-os-dark-gray mb-2 pb-1">Properties</h3>
            <div className="flex flex-wrap gap-1">
              {techTags.length > 0 ? techTags.map((tag, idx) => (
                <span key={idx} className="bg-os-gray border border-os-dark-gray px-1 text-xs shadow-retro-outset">{tag}</span>
              )) : <span className="text-xs">N/A</span>}
            </div>
          </div>
        </div>

        {(app.frontend_repo || app.backend_repo) && (
          <div className="mb-4 bg-os-gray shadow-retro-outset p-2">
            <div className="flex gap-1 mb-2">
              {app.frontend_repo && <button onClick={() => { playSound('click'); setActiveTab('frontend'); }} className={`retro-btn text-xs ${activeTab === 'frontend' ? 'shadow-retro-inset' : ''}`}>Frontend Files</button>}
              {app.backend_repo && <button onClick={() => { playSound('click'); setActiveTab('backend'); }} className={`retro-btn text-xs ${activeTab === 'backend' ? 'shadow-retro-inset' : ''}`}>Backend Files</button>}
            </div>
            {activeTab === 'frontend' && app.frontend_repo ? renderFileList(repoFiles.frontend) : null}
            {activeTab === 'backend' && app.backend_repo ? renderFileList(repoFiles.backend) : null}
          </div>
        )}

        {app.live_link ? (
          <div className="flex-1 min-h-[400px]">
            {/* Replace static iframe with authentic IE interface */}
            <InternetExplorer initialUrl={app.live_link} />
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
    <>
      <Draggable
        nodeRef={nodeRef}
        handle=".retro-title-bar"
        cancel=".window-controls"
        bounds="parent"
        disabled={app.isMaximized}
        position={app.isMaximized ? { x: 0, y: 0 } : app.position}
        onStop={(e, data) => onUpdatePosition({ x: data.x, y: data.y })}
      >
        <div
          ref={nodeRef}
          onMouseDown={(e) => {
            onFocus();
            if (titleMenu.visible) setTitleMenu({ ...titleMenu, visible: false });
          }}
          style={{
            zIndex: app.zIndex || 70,
            display: app.isMinimized ? 'none' : 'flex'
          }}
          className={`absolute flex flex-col retro-window shadow-retro-outset border border-os-dark-gray bg-os-gray
        ${app.isMaximized
              ? 'w-[100vw] h-[calc(100vh-32px)] !transform-none top-0 left-0'
              : 'w-[95vw] md:w-[800px] h-[85vh] md:h-[600px] max-w-[100vw] max-h-[calc(100vh-32px)]'
            }`}
        >
          {/* TITLE BAR WITH RIGHT-CLICK HANDLER */}
          <div
            className={`retro-title-bar cursor-move select-none flex justify-between items-center px-1 font-dialog font-bold text-sm
              ${isActive ? 'bg-[#000080] text-white' : 'bg-[#808080] text-[#c0c0c0]'}`}
            onContextMenu={handleTitleContextMenu}
          >
            <div className="flex items-center gap-1 overflow-hidden pointer-events-none">
              <img src={app.icon} alt="" className="w-4 h-4 object-contain" />
              <span className="truncate pr-2">{app.name}</span>
            </div>

            <div className="flex items-center gap-[2px] window-controls">
              <button
                onClick={(e) => { e.stopPropagation(); onMinimize(); }}
                className="retro-btn px-2 py-0 h-[18px] text-xs leading-none font-bold text-black bg-os-gray shadow-retro-outset"
                title="Minimize"
              >
                _
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onToggleMaximize(); }}
                className="retro-btn px-2 py-0 h-[18px] text-xs leading-none font-bold text-black bg-os-gray shadow-retro-outset"
                title="Maximize"
              >
                □
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="retro-btn px-2 py-0 h-[18px] text-xs leading-none font-bold text-black bg-os-gray shadow-retro-outset"
                title="Close"
              >
                X
              </button>
            </div>
          </div>

          {/* INTERACTIVE MENU BAR */}
          <div className="retro-menu-bar border-b border-os-dark-gray select-none bg-os-gray flex gap-2 px-1 text-sm relative z-50 shrink-0">

            {/* Invisible overlay to close dropdowns when clicking outside */}
            {activeMenu && (
              <div className="fixed inset-0 z-40" onClick={closeMenu}></div>
            )}

            {/* FILE MENU */}
            <div className="relative z-50">
              <span
                className={`cursor-pointer px-2 py-[1px] inline-block ${activeMenu === 'file' ? 'bg-blue-900 text-white' : 'hover:bg-blue-900 hover:text-white'}`}
                onClick={() => { playSound('click'); setActiveMenu(activeMenu === 'file' ? null : 'file'); }}
              >
                <span className="underline">F</span>ile
              </span>
              {activeMenu === 'file' && (
                <div className="absolute top-full left-0 bg-os-gray shadow-retro-outset border border-os-white flex flex-col min-w-[150px] text-black py-1">
                  <div className="px-3 py-1 hover:bg-os-navy hover:text-white cursor-pointer" onClick={() => handleMenuAction(onClose)}>Close</div>
                </div>
              )}
            </div>

            {/* EDIT MENU */}
            <div className="relative z-50">
              <span
                className={`cursor-pointer px-2 py-[1px] inline-block ${activeMenu === 'edit' ? 'bg-blue-900 text-white' : 'hover:bg-blue-900 hover:text-white'}`}
                onClick={() => { playSound('click'); setActiveMenu(activeMenu === 'edit' ? null : 'edit'); }}
              >
                <span className="underline">E</span>dit
              </span>
              {activeMenu === 'edit' && (
                <div className="absolute top-full left-0 bg-os-gray shadow-retro-outset border border-os-white flex flex-col min-w-[150px] text-black py-1">
                  <div className="px-3 py-1 hover:bg-os-navy hover:text-white cursor-pointer" onClick={() => handleMenuAction(() => document.execCommand('copy'))}>Copy</div>
                  <div className="px-3 py-1 hover:bg-os-navy hover:text-white cursor-pointer" onClick={() => handleMenuAction(() => document.execCommand('paste'))}>Paste</div>
                  <div className="px-3 py-1 hover:bg-os-navy hover:text-white cursor-pointer" onClick={() => handleMenuAction(() => document.execCommand('selectAll'))}>Select All</div>
                </div>
              )}
            </div>

            {/* VIEW MENU */}
            <div className="relative z-50">
              <span
                className={`cursor-pointer px-2 py-[1px] inline-block ${activeMenu === 'view' ? 'bg-blue-900 text-white' : 'hover:bg-blue-900 hover:text-white'}`}
                onClick={() => { playSound('click'); setActiveMenu(activeMenu === 'view' ? null : 'view'); }}
              >
                <span className="underline">V</span>iew
              </span>
              {activeMenu === 'view' && (
                <div className="absolute top-full left-0 bg-os-gray shadow-retro-outset border border-os-white flex flex-col min-w-[200px] text-black py-1">
                  <div className="px-3 py-1 hover:bg-os-navy hover:text-white cursor-pointer" onClick={() => handleMenuAction(onToggleMaximize)}>
                    {app.isMaximized ? 'Restore Window' : 'Maximize Window'}
                  </div>
                  <div className="px-3 py-1 hover:bg-os-navy hover:text-white cursor-pointer" onClick={() => handleMenuAction(onMinimize)}>
                    Minimize Window
                  </div>
                </div>
              )}
            </div>

            {/* HELP MENU */}
            <div className="relative z-50">
              <span
                className={`cursor-pointer px-2 py-[1px] inline-block ${activeMenu === 'help' ? 'bg-blue-900 text-white' : 'hover:bg-blue-900 hover:text-white'}`}
                onClick={() => { playSound('click'); setActiveMenu(activeMenu === 'help' ? null : 'help'); }}
              >
                <span className="underline">H</span>elp
              </span>
              {activeMenu === 'help' && (
                <div className="absolute top-full left-0 bg-os-gray shadow-retro-outset border border-os-white flex flex-col min-w-[200px] text-black py-1">
                  <div className="px-3 py-1 hover:bg-os-navy hover:text-white cursor-pointer" onClick={() => handleMenuAction(() => onOpenApp('about-us'))}>About Vishal OS</div>
                  <div className="px-3 py-1 hover:bg-os-navy hover:text-white cursor-pointer" onClick={() => handleMenuAction(() => {
                    showSystemDialog({ 
                      type: 'info', 
                      title: 'Help', 
                      message: `Help topics for ${app.name} are currently unavailable.`, 
                      buttons: ['OK'] 
                    });
                  })}>Help Topics</div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 bg-os-gray overflow-hidden p-1 border-t border-os-white">
            {renderAppContent()}
          </div>

          <div className="retro-status-bar bg-os-gray shadow-retro-inset px-2 py-1 text-xs border border-os-dark-gray flex justify-between">
            <span>1 object(s) selected</span>
            <span className="border-l border-os-dark-gray pl-2">Vishal OS 98</span>
          </div>
        </div>
      </Draggable>

      {/* SYSTEM CONTEXT MENU FOR TITLE BAR */}
      <ContextMenu
        visible={titleMenu.visible}
        x={titleMenu.x}
        y={titleMenu.y}
        onClose={() => setTitleMenu({ ...titleMenu, visible: false })}
        items={[
          { label: 'Restore', disabled: !app.isMaximized, action: onToggleMaximize },
          { label: 'Move', disabled: true },
          { label: 'Size', disabled: true },
          { label: 'Minimize', action: onMinimize },
          { label: 'Maximize', disabled: app.isMaximized, action: onToggleMaximize },
          { type: 'separator' },
          { label: 'Close\tAlt+F4', action: onClose }
        ]}
      />
    </>
  );
};

export default Window;