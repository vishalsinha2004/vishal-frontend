import React, { useState, useEffect } from 'react';

const MobileAboutMe = ({ apiUrl }) => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reverted back to /about/ to match your Django backend route
    fetch(`${apiUrl}/about-us/`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setAboutData(Array.isArray(data) ? data[0] : data);
        setLoading(false);
      })
      .catch(() => {
        setAboutData(null); 
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) return <div className="p-4 text-xs font-sans">Loading profile data...</div>;

  return (
    // Outer wrapper is strictly bounded to the parent window
    <div className="flex flex-col flex-1 min-h-0 w-full h-full bg-os-gray text-black font-sans text-sm p-2">
      
      {/* Profile Card Header (Anchored) */}
      <div className="bg-white shadow-retro-inset border border-os-dark-gray p-3 mb-2 flex flex-col items-center text-center shrink-0">
         <div className="w-20 h-20 bg-os-gray shadow-retro-outset border border-os-dark-gray mb-2 overflow-hidden flex items-center justify-center p-1">
            {aboutData?.profile_image ? (
              <img src={aboutData.profile_image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <img src="https://cdn.jsdelivr.net/gh/trapd00r/win95-winxp_icons@master/icons/w98_users.ico" alt="User" className="w-10 h-10 object-contain" style={{ imageRendering: 'pixelated' }} />
            )}
         </div>
         <h2 className="font-bold text-lg leading-tight">{aboutData?.name || 'Vishal Sinha'}</h2>
         <p className="text-xs text-os-dark-gray mt-1">{aboutData?.title || 'Full-Stack Software Developer'}</p>
      </div>

      {/* Details Container (Internally Scrollable) */}
      <div className="bg-white shadow-retro-inset border border-os-dark-gray p-3 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
         <h3 className="font-bold border-b border-os-gray mb-2 pb-1 text-sm bg-os-gray px-1 shadow-retro-outset">Biography</h3>
         <p className="text-xs whitespace-pre-wrap leading-relaxed">
           {aboutData?.bio || 'AI/ML Data Science Intern and Full-Stack Software Developer focusing on retro system architectures and modern web integration.'}
         </p>
         
         <h3 className="font-bold border-b border-os-gray mb-2 pb-1 text-sm mt-4 bg-os-gray px-1 shadow-retro-outset">System Registry</h3>
         <div className="text-xs flex flex-col gap-1">
           <p><span className="font-bold">Email:</span> {aboutData?.email || 'N/A'}</p>
           <p><span className="font-bold">Location:</span> {aboutData?.location || 'Ahmedabad, Gujarat'}</p>
         </div>

         {/* External Links */}
         <div className="flex flex-wrap gap-2 mt-4 shrink-0">
            {aboutData?.github && <a href={aboutData.github} target="_blank" rel="noopener noreferrer" className="retro-btn text-[10px] px-2 py-1">GitHub</a>}
            {aboutData?.linkedin && <a href={aboutData.linkedin} target="_blank" rel="noopener noreferrer" className="retro-btn text-[10px] px-2 py-1">LinkedIn</a>}
         </div>
      </div>

    </div>
  );
};

export default MobileAboutMe;