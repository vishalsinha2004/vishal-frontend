import React, { useState, useEffect } from 'react';

const Resume = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
  const [resumeUrl, setResumeUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/about-us/`)
      .then((res) => {
        if (!res.ok) throw new Error('API Endpoint not found');
        return res.json();
      })
      .then((data) => {
        // Retrieve the object (works whether Django returns a list or a single object)
        const profile = Array.isArray(data) ? data[0] : data;
        
        // If the 'resume' URL exists in the DB, store it
        if (profile && profile.resume) {
          setResumeUrl(profile.resume);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Resume Fetch Error:", err);
        setLoading(false);
      });
  }, [apiUrl]);

  const handleExternalAction = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    }
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="h-full w-full bg-os-gray flex items-center justify-center font-sans text-sm text-os-text">
        Opening document...
      </div>
    );
  }

  // --- EMPTY / ERROR STATE ---
  if (!resumeUrl) {
    return (
      <div className="h-full bg-os-white flex flex-col items-center justify-center font-sans text-os-text p-8 text-center shadow-retro-inset m-1 border border-os-dark-gray">
        <span className="text-4xl mb-4">📄</span>
        <p className="font-bold text-sm">Document Not Found</p>
        <p className="text-xs mt-2">Please upload a valid PDF document via the System Admin Panel.</p>
      </div>
    );
  }

  // --- SUCCESS STATE: CLASSIC DOCUMENT VIEWER ---
  return (
    <div className="h-full w-full bg-os-gray flex flex-col font-sans text-os-text select-none">
      
      

      {/* 2. Classic Toolbar */}
      <div className="flex items-center gap-1 p-1 border-b border-os-dark-gray shadow-[0_1px_0_#ffffff]">
        <button onClick={handleExternalAction} className="retro-btn px-2 py-1 flex items-center gap-1 text-xs" title="Open Document in External Viewer">
          <span className="text-sm leading-none mt-[-2px]">📂</span> Open
        </button>
        <button onClick={handleExternalAction} className="retro-btn px-2 py-1 flex items-center gap-1 text-xs" title="Save a copy">
          <span className="text-sm leading-none mt-[-2px]">💾</span> Save
        </button>
        <button onClick={handleExternalAction} className="retro-btn px-2 py-1 flex items-center gap-1 text-xs" title="Print Document">
          <span className="text-sm leading-none mt-[-2px]">🖨️</span> Print
        </button>
        
        <div className="w-px h-5 bg-os-dark-gray border-r border-os-white mx-1"></div>
        
        <div className="flex items-center bg-os-white shadow-retro-inset border border-os-dark-gray px-2 py-0.5">
          <select className="bg-transparent text-xs outline-none cursor-pointer">
            <option>100%</option>
            <option>75%</option>
            <option>50%</option>
            <option>Fit Width</option>
            <option>Fit Page</option>
          </select>
        </div>
      </div>

      {/* 3. Document Workspace */}
      {/* A classic dark gray workspace background where the "paper" sits */}
      <div className="flex-1 bg-os-dark-gray p-2 md:p-4 overflow-hidden flex justify-center shadow-retro-inset m-1">
        
        {/* The PDF iFrame acting as the "Paper" */}
        <div className="w-full max-w-4xl h-full bg-white shadow-retro-outset flex flex-col">
          <iframe 
            src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`} 
            title="Resume PDF Viewer" 
            className="w-full h-full border-none"
            style={{ backgroundColor: '#ffffff' }}
          />
        </div>

      </div>

      {/* 4. Status Bar */}
      <div className="retro-status-bar">
        <span>Done</span>
        <div className="flex gap-4">
          <span className="border-l border-os-dark-gray pl-2">Page 1 of 1</span>
          <span className="border-l border-os-dark-gray pl-2 hidden sm:inline">8.5 x 11 in</span>
        </div>
      </div>

    </div>
  );
};

export default Resume;