import React, { useState, useEffect } from 'react';
import { fileIcon, floppyIcon, navRefreshIcon } from '../utils/icons';

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
        const profile = Array.isArray(data) ? data[0] : data;
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

  if (loading) {
    return (
      <div className="h-full w-full bg-os-gray flex items-center justify-center font-sans text-sm text-os-text">
        Opening document...
      </div>
    );
  }

  if (!resumeUrl) {
    return (
      <div className="h-full bg-os-white flex flex-col items-center justify-center font-sans text-os-text p-8 text-center shadow-retro-inset m-1 border border-os-dark-gray">
        <img src={fileIcon} alt="File" className="w-12 h-12 mb-4 opacity-50 grayscale" style={{ imageRendering: 'pixelated' }} />
        <p className="font-bold text-sm">Document Not Found</p>
        <p className="text-xs mt-2 text-os-dark-gray">Please upload a valid PDF document via the System Admin Panel.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-os-gray flex flex-col font-sans text-os-text select-none">
      
      <div className="flex items-center gap-1 p-1 border-b border-os-dark-gray shadow-[0_1px_0_#ffffff] shrink-0">
        <button onClick={handleExternalAction} className="retro-btn px-2 py-1 flex items-center gap-1.5 text-xs" title="Open Document in External Viewer">
          <img src={fileIcon} alt="" className="w-3.5 h-3.5 object-contain" style={{ imageRendering: 'pixelated' }} /> Open
        </button>
        <button onClick={handleExternalAction} className="retro-btn px-2 py-1 flex items-center gap-1.5 text-xs" title="Save a copy">
          <img src={floppyIcon} alt="" className="w-3.5 h-3.5 object-contain" style={{ imageRendering: 'pixelated' }} /> Save
        </button>
        <button onClick={handleExternalAction} className="retro-btn px-2 py-1 flex items-center gap-1.5 text-xs" title="Refresh Viewer">
          <img src={navRefreshIcon} alt="" className="w-3 h-3 object-contain" style={{ imageRendering: 'pixelated' }} /> Reload
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

      <div className="flex-1 bg-os-dark-gray p-2 md:p-4 overflow-hidden flex justify-center shadow-retro-inset m-1">
        <div className="w-full max-w-4xl h-full bg-white shadow-retro-outset flex flex-col">
          <iframe 
            src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`} 
            title="Resume PDF Viewer" 
            className="w-full h-full border-none"
            style={{ backgroundColor: '#ffffff' }}
          />
        </div>
      </div>

      <div className="retro-status-bar shrink-0">
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