import React from 'react';

const MarkAI = () => {
  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-thruster-glow font-mono p-4 rounded border border-space-gray">
      <div className="flex-1 overflow-y-auto space-y-2 text-sm">
        <p className="text-gray-400">System initialization complete.</p>
        <p className="text-gray-400">Speech recognition engine: <span className="text-green-400">ONLINE</span></p>
        <p className="text-gray-400">Generative AI integration: <span className="text-green-400">STANDBY</span></p>
        <p className="mt-4">&gt; Awaiting voice input...</p>
      </div>
      <div className="mt-4 flex items-center justify-center">
        <button className="h-16 w-16 rounded-full bg-space-gray border-2 border-thruster-blue flex items-center justify-center hover:bg-space-dark transition-colors animate-pulse shadow-[0_0_15px_rgba(79,195,247,0.3)]">
          🎤
        </button>
      </div>
    </div>
  );
};

export default MarkAI;