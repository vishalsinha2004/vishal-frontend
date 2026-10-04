import React, { useEffect } from 'react';

// --- Classic 90s Pixel Icon Component ---
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
  // --- DYNAMIC SEO INJECTION ---
  useEffect(() => {
    document.title = "Projects & Applications | Vishal Sinha";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = "Browse the portfolio projects, startups, and applications engineered by Vishal Sinha.";
  }, []);

  const startups = apps.filter(a => a.project_type === 'Startup');
  const clients = apps.filter(a => a.project_type === 'Client Project');
  const personal = apps.filter(a => !a.project_type || a.project_type === 'Personal Project');

  const renderGrid = (title, categoryApps) => {
    if (categoryApps.length === 0) return null;
    
    return (
      <section className="mb-6">
        <h2 className="text-sm font-bold text-os-text mb-3 border-b border-os-dark-gray pb-1 select-none">
          {title}
        </h2>
        <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 list-none p-0 m-0">
          {categoryApps.map(app => (
            <li key={app.id}>
              <button
                onClick={() => onOpenApp(app.id)}
                className="w-full flex flex-col items-center gap-1 focus:outline-none group"
                title={app.description || `${app.name} Executable`}
                aria-label={`Open ${app.name}`}
              >
                <div className="w-12 h-12 flex items-center justify-center mb-1">
                  <ProjectIcon src={app.icon} alt={app.name} />
                </div>
                <span className="text-xs font-sans px-1 text-center line-clamp-2 leading-tight border border-transparent group-hover:bg-os-navy group-hover:text-os-white group-hover:border-dotted group-hover:border-os-white cursor-default">
                  {app.name}.exe
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    );
  };

  return (
    <main className="h-full bg-os-white p-4 overflow-y-auto custom-scrollbar shadow-retro-inset m-1 border border-os-dark-gray font-sans">
      {/* Invisible H1 for Googlebot structuring */}
      <h1 className="sr-only">Vishal Sinha Projects and Applications</h1>
      
      <div className="max-w-6xl mx-auto">
        {renderGrid('Startup Ventures', startups)}
        {renderGrid('Client Projects', clients)}
        {renderGrid('Personal Projects', personal)}
      </div>
    </main>
  );
};

export default Project;