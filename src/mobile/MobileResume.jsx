import React from 'react';
import { useSound } from '../hooks/useSound';

const MobileResume = () => {
  const { playSound } = useSound();

  return (
    <div className="flex flex-col h-full bg-white text-black font-sans text-sm">
      

      {/* Document Viewer */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 custom-scrollbar bg-[#808080] flex justify-center">
         <div className="bg-white shadow-retro-outset w-full max-w-[400px] p-4 text-xs font-serif leading-relaxed">
            
            <h1 className="text-xl font-bold mb-1 border-b-2 border-black pb-1 uppercase font-sans">Vishal Sinha</h1>
            <p className="mb-4">Software Developer | Ahmedabad, Gujarat</p>
            
            <h2 className="text-sm font-bold bg-os-gray border border-black px-1 mb-2 font-sans shadow-retro-outset">EXPERIENCE</h2>
            <div className="mb-3">
              <p className="font-bold">Data Science Intern — TECHMICRE</p>
              <p className="italic mb-1">June 2025 - July 2025 | Ahmedabad</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Developed AI systems, CV models, and interactive retrieval-augmented generation pipelines.</li>
                <li>Built automated assistants using Gemini API and LangChain.</li>
              </ul>
            </div>

            <h2 className="text-sm font-bold bg-os-gray border border-black px-1 mb-2 font-sans shadow-retro-outset">PROJECTS</h2>
            <div className="mb-3 space-y-2">
              <div>
                <p className="font-bold">Vishal OS 98</p>
                <p>Interactive retro Windows 98-themed portfolio operating system with mobile responsivness.</p>
              </div>
              <div>
                <p className="font-bold">MarkAI</p>
                <p>Voice-controlled virtual assistant integrating Google Speech Recognition and OpenCV controls.</p>
              </div>
            </div>

            <h2 className="text-sm font-bold bg-os-gray border border-black px-1 mb-2 font-sans shadow-retro-outset">EDUCATION</h2>
            <div className="mb-3">
              <p className="font-bold">Bachelor of Computer Applications (B.C.A.)</p>
              <p className="italic">Shreyarth University</p>
            </div>

            <h2 className="text-sm font-bold bg-os-gray border border-black px-1 mb-2 font-sans shadow-retro-outset">CERTIFICATIONS & SKILLS</h2>
            <p className="mb-1"><strong>Skills:</strong> React, Node.js, Python, Django, Tailwind CSS, MySQL, AI/ML.</p>
            <p><strong>Certs:</strong> Python (Basic) Certificate - HackerRank (March 2025).</p>
         </div>
      </div>
    </div>
  );
};

export default MobileResume;