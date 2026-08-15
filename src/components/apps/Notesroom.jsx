import React from 'react';

const Notesroom = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-space-dark">
      <div className="bg-space-gray p-8 rounded-lg shadow-lg w-80 border border-gray-600">
        <h3 className="text-xl font-bold text-space-white mb-6 text-center flex items-center justify-center gap-2">
          <span>📝</span> Notesroom Portal
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider">Secure ID</label>
            <input type="text" className="w-full mt-1 p-2 bg-[#121212] border border-gray-600 rounded text-space-white focus:outline-none focus:border-thruster-blue" placeholder="Enter credentials..." />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider">Passcode</label>
            <input type="password" className="w-full mt-1 p-2 bg-[#121212] border border-gray-600 rounded text-space-white focus:outline-none focus:border-thruster-blue" placeholder="••••••••" />
          </div>
          <button className="w-full bg-thruster-blue hover:bg-thruster-glow text-space-black font-bold py-2 px-4 rounded transition-colors mt-4">
            Verify & Authenticate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notesroom;