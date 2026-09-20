import React from 'react';

// --- Classic 90s Pixel Icon Component ---
// Removed the modern spinning loader ring and smooth fade-in transitions.
// Added pixelated rendering to give high-res images a chunkier, aliased look.
const ProjectIcon = ({ src, alt }) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      className="w-10 h-10 object-contain pointer-events-none"
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

const Project = ({ apps, onOpenApp }) => {
  // Categorize apps based on the Django Backend 'project_type'
  const startups = apps.filter(a => a.project_type === 'Startup');
  const clients = apps.filter(a => a.project_type === 'Client Project');
  const personal = apps.filter(a => !a.project_type || a.project_type === 'Personal Project');

  // Reusable Classic Folder Grid Renderer
  const renderGrid = (title, categoryApps) => {
    if (categoryApps.length === 0) return null;
    
    return (
      <div className="mb-6">
        {/* Classic 90s grouping header */}
        <h3 className="text-sm font-bold text-os-text mb-3 border-b border-os-dark-gray pb-1 select-none">
          {title}
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
          {categoryApps.map(app => (
            <button
              key={app.id}
              onClick={() => onOpenApp(app.id)}
              className="flex flex-col items-center gap-1 focus:outline-none group"
              title={app.description || `${app.name} Executable`}
            >
              <div className="w-12 h-12 flex items-center justify-center mb-1">
                <ProjectIcon src={app.icon} alt={app.name} />
              </div>
              
              {/* Classic Selection State: Navy background with dotted border on hover */}
              <span className="text-xs font-sans px-1 text-center line-clamp-2 leading-tight border border-transparent group-hover:bg-os-navy group-hover:text-os-white group-hover:border-dotted group-hover:border-os-white cursor-default">
                {app.name}.exe
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    // Classic Windows 98 File Explorer content pane: White background, inset shadow
    <div className="h-full bg-os-white p-4 overflow-y-auto custom-scrollbar shadow-retro-inset m-1 border border-os-dark-gray font-sans">
      <div className="max-w-6xl mx-auto">
        {renderGrid('Startup Ventures', startups)}
        {renderGrid('Client Projects', clients)}
        {renderGrid('Personal Projects', personal)}
      </div>
    </div>
  );
};

export default Project;