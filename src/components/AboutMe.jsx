import React, { useState, useEffect } from 'react';

const AboutMe = ({ apiUrl }) => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/about-us/`)
      .then((res) => {
        if (!res.ok) throw new Error('API Endpoint not found');
        return res.json();
      })
      .then((data) => {
        // Handle getting the first profile if it returns an array
        const profile = Array.isArray(data) ? data[0] : data;
        setAboutData(profile);
        setLoading(false);
      })
      .catch((err) => {
        console.error("About Us API Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) return <div className="h-full flex items-center justify-center font-mono text-green-400 animate-pulse">Decrypting Commander Profile...</div>;

  if (error || !aboutData) {
    return (
      <div className="h-full flex flex-col items-center justify-center font-mono text-gray-500 p-8 text-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 mb-4 text-gray-700"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <p>Awaiting Admin Panel Configuration.</p>
        <p className="text-xs mt-2">Add data to the <span className="text-space-white">About Me Info</span> section in your Django Admin.</p>
      </div>
    );
  }

  // Pre-configured social icons mapped to the database keys
  const socialLinks = [
    { key: 'github_url', name: '', icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> },
    { key: 'linkedin_url', name: '', icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> },
    { key: 'x_url', name: '', icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 4.15H5.078z"/></svg> },
    { key: 'instagram_url', name: '', icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
    { key: 'facebook_url', name: '', icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg> }
  ];

  return (
    <div className="h-full bg-[#050505] p-10 overflow-y-auto custom-scrollbar shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Profile Image & Name */}
        <div className="flex flex-col items-center mb-8">
          {aboutData.profile_image ? (
            <img src={aboutData.profile_image} alt={aboutData.name} className="w-32 h-32 rounded-full border-4 border-gray-700 object-cover mb-4 shadow-xl shadow-green-900/20" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-[#1a1a1a] border-4 border-gray-700 flex items-center justify-center text-4xl mb-4 shadow-xl">
              👨‍🚀
            </div>
          )}
          <h2 className="text-4xl font-bold text-space-white tracking-wide">{aboutData.name}</h2>
          <p className="text-sm font-mono text-green-400 mt-2 uppercase tracking-widest">System Administrator</p>
        </div>

        {/* Dynamic Social Links */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {socialLinks.map((social) => {
            if (aboutData[social.key]) {
              return (
                <a 
                  key={social.key} 
                  href={aboutData[social.key]} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-space-gray border border-gray-700 hover:border-green-400 px-5 py-2.5 rounded-full transition-all text-sm font-sans text-gray-300 hover:text-white shadow-lg"
                >
                  {social.icon} {social.name}
                </a>
              );
            }
            return null;
          })}
        </div>

        {/* Dynamic Description Box */}
        {aboutData.description && (
          <div className="w-full bg-[#121212] border border-space-gray rounded-2xl p-8 shadow-2xl relative">
            <div className="absolute top-0 left-8 -translate-y-1/2 bg-green-500 text-black px-3 py-1 rounded text-xs font-bold font-mono tracking-widest uppercase shadow-[0_0_10px_rgba(74,222,128,0.5)]">
              About Profile
            </div>
            <p className="text-gray-300 font-sans leading-loose text-lg whitespace-pre-wrap">
              {aboutData.description}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AboutMe;