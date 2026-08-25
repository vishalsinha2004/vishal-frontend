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

  // Loading State
  if (loading) {
    return (
      <div className="h-full w-full bg-[#050505] flex items-center justify-center font-mono text-thruster-glow animate-pulse">
        Fetching Document Stream...
      </div>
    );
  }

  // Error/Empty State (If no resume is uploaded yet in Django Admin)
  if (!resumeUrl) {
    return (
      <div className="h-full bg-[#050505] flex flex-col items-center justify-center font-mono text-gray-500 p-8 text-center shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 mb-4 text-gray-700">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p>No Resume Uploaded.</p>
        <p className="text-xs mt-2">Please upload your PDF in the <span className="text-space-white">About Me Info</span> section of the Django Admin Panel.</p>
      </div>
    );
  }

  // Success State: Render the PDF viewer
  return (
    <div className="h-full w-full bg-[#121212]">
      <iframe 
        src={resumeUrl} 
        title="Resume PDF Viewer" 
        className="w-full h-full border-none"
        style={{ backgroundColor: '#ffffff' }}
      />
    </div>
  );
};

export default Resume;