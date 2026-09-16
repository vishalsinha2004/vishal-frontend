import React, { useState } from 'react';

// --- Helper component to handle individual image loading states ---
const ProjectIcon = ({ src, alt }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* A sleek, spinning loader ring */}
          <div className="w-6 h-6 border-2 border-space-gray border-t-thruster-glow rounded-full animate-spin"></div>
        </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        className={`w-full h-full object-contain drop-shadow-md transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)} // Stops the spinner if the image link is broken
      />
    </div>
  );
};

const Project = ({ apps, onOpenApp }) => {
  // Categorize apps based on the Django Backend 'project_type'
  const startups = apps.filter(a => a.project_type === 'Startup');
  const clients = apps.filter(a => a.project_type === 'Client Project');
  const personal = apps.filter(a => !a.project_type || a.project_type === 'Personal Project');

  // Reusable Grid Renderer for each section (Icons Removed for cleaner UI)
  const renderGrid = (title, categoryApps) => {
    if (categoryApps.length === 0) return null;
    
    return (
      <div className="mb-10 animate-fade-in-up">
        {/* Clean, minimalist header without SVG icons */}
        <h3 className="text-lg font-bold text-thruster-glow mb-5 border-b border-space-gray pb-2 tracking-wide">
          {title}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categoryApps.map(app => (
            <button
              key={app.id}
              onClick={() => onOpenApp(app.id)}
              className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-space-gray border border-transparent hover:border-gray-600 transition-all group focus:outline-none"
            >
              <div className="w-16 h-16 bg-[#1a1a1a] p-3 rounded-2xl shadow-lg border border-gray-700 group-hover:border-thruster-glow group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                
                {/* Replaced standard <img> with our loading component */}
                <ProjectIcon src={app.icon} alt={app.name} />
                
              </div>
              <span className="text-xs font-sans font-bold text-gray-300 group-hover:text-white text-center">
                {app.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Pure content area - Window.jsx handles the borders, header, and dragging
  return (
    <div className="h-full bg-space-dark p-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto">
        {/* Passing only the title and the filtered arrays */}
        {renderGrid('Startup Ventures', startups)}
        {renderGrid('Client Projects', clients)}
        {renderGrid('Personal Projects', personal)}
      </div>
    </div>
  );
};

export default Project;