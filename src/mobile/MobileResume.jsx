import React, { useState, useEffect } from 'react';
import { useSound } from '../hooks/useSound';

const MobileResume = () => {
  const { playSound } = useSound();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
  const [resumeUrl, setResumeUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- DYNAMIC SEO INJECTION ---
  useEffect(() => {
    document.title = "Resume | Vishal Sinha";
  }, []);

  // --- FETCH REAL RESUME FROM BACKEND ---
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
    playSound('click');
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1 min-h-0 w-full h-full bg-os-gray text-black font-sans text-sm items-center justify-center shadow-retro-inset">
        Reading Document Data...
      </div>
    );
  }

  if (!resumeUrl) {
    return (
      <div className="flex flex-col flex-1 min-h-0 w-full h-full bg-os-gray text-black font-sans text-sm items-center justify-center p-4 text-center shadow-retro-inset">
        <div className="bg-white shadow-retro-outset p-6 border border-os-dark-gray max-w-[300px]">
          <p className="font-bold mb-2">Document Not Found</p>
          <p className="text-xs text-os-dark-gray">Please upload a valid PDF document via the System Admin Panel.</p>
        </div>
      </div>
    );
  }

  return (
    <article className="flex flex-col flex-1 min-h-0 w-full h-full bg-os-gray text-black font-sans text-sm">
      {/* Invisible H1 for Google Search Indexing */}
      <h1 className="sr-only">Vishal Sinha Resume Document</h1>

      {/* Document Viewer (Strict internal scrolling) */}
      <div className="flex-1 min-h-0 overflow-hidden bg-[#808080] p-1 sm:p-2 flex flex-col relative shadow-retro-inset border-t border-white">
         <div className="w-full h-full bg-white shadow-retro-outset border border-black relative overflow-hidden flex flex-col">
            <iframe 
              src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`} 
              title="Resume PDF Viewer" 
              className="w-full h-full flex-1 border-none min-h-0"
              style={{ backgroundColor: '#ffffff' }}
            />
         </div>
      </div>
    </article>
  );
};

export default MobileResume;