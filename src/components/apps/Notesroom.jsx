import React from 'react';

const Notesroom = () => {
  return (
    <div className="flex flex-col h-full bg-space-dark text-space-white p-4 overflow-y-auto">
      
      {/* 1. Header & Action Links */}
      <div className="flex justify-between items-start border-b border-space-gray pb-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-thruster-glow flex items-center gap-2">
            <span>📝</span> Notesroom
          </h2>
          <p className="text-sm text-gray-400 mt-1 font-mono">Secure Credential Verification System</p>
        </div>
        
        <div className="flex gap-3">
          {/* GitHub Button */}
          <a 
            href="https://github.com/vishalsinha2004/notesroom-backend" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-[#1a1a1a] hover:bg-space-gray px-4 py-2 rounded text-sm font-mono border border-gray-600 transition-all flex items-center gap-2 shadow-lg"
          >
            <span>🐙</span> GitHub
          </a>
          
          {/* Live Link Button */}
          <a 
            href="https://your-live-notesroom-link.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-thruster-blue hover:bg-thruster-glow text-space-black px-4 py-2 rounded text-sm font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(79,195,247,0.4)]"
          >
            <span>🚀</span> Open Live App
          </a>
        </div>
      </div>

      {/* 2. Project Description */}
      <div className="mb-4 space-y-2 text-sm text-gray-300 font-sans bg-[#0a0a0a] p-4 rounded border border-space-gray">
        <p>
          <strong className="text-space-white">Overview:</strong> Notesroom is a full-stack web application designed for secure registration and credential verification. It allows users to securely manage and store sensitive information.
        </p>
        <p>
          <strong className="text-space-white">Tech Stack:</strong> React, Node.js, Tailwind CSS, Express, MongoDB (JWT Authentication).
        </p>
      </div>

      {/* 3. Live Preview Embedded Window */}
      <div className="flex-1 flex flex-col border border-space-gray rounded-lg overflow-hidden bg-black mt-2 min-h-[300px]">
        {/* Browser Mockup Header */}
        <div className="bg-[#1a1a1a] px-3 py-2 border-b border-space-gray flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-red-500"></div>
           <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
           <div className="w-3 h-3 rounded-full bg-green-500"></div>
           <div className="ml-4 bg-[#0a0a0a] px-3 py-1 rounded text-xs text-gray-400 font-mono w-full text-center border border-gray-700">
             https://notesroom.live-preview.com
           </div>
        </div>
        
        {/* The Actual Live Site (Iframe) */}
        {/* Note: Replace 'src' with your actual deployed Notesroom URL */}
        <iframe 
          src="https://example.com" 
          className="w-full h-full bg-white"
          title="Notesroom Live Preview"
          sandbox="allow-scripts allow-same-origin"
        ></iframe>
      </div>

    </div>
  );
};

export default Notesroom;