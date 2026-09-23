import React, { useState, useEffect } from 'react';

const SystemMonitor = ({ openWindowCount }) => {
  const [cpuUsage, setCpuUsage] = useState(14);
  const [memUsage, setMemUsage] = useState(42);
  const [battery, setBattery] = useState('Detecting...');
  
  // Simulated CPU/RAM Fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate CPU between 5% and 35%
      setCpuUsage(Math.floor(Math.random() * 30) + 5);
      // Keep Memory relatively stable with slight jitter
      setMemUsage(prev => {
        const jitter = Math.floor(Math.random() * 3) - 1;
        return Math.min(Math.max(prev + jitter, 35), 85);
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Real Battery API
  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then((batt) => {
        const updateBattery = () => {
          setBattery(`${Math.round(batt.level * 100)}% ${batt.charging ? '(Charging)' : '(On Battery)'}`);
        };
        updateBattery();
        batt.addEventListener('levelchange', updateBattery);
        batt.addEventListener('chargingchange', updateBattery);
      });
    } else {
      setBattery('Not Supported');
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-os-gray font-sans p-2 overflow-y-auto custom-scrollbar">
      
      {/* Header section */}
      <div className="flex items-center gap-4 mb-4 border-b border-os-dark-gray pb-2">
        <div className="w-12 h-12 bg-black border-2 border-os-dark-gray shadow-retro-inset flex items-center justify-center">
          <span className="text-green-500 font-pixel text-3xl">💻</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-os-text">Vishal OS 98 Resource Meter</h2>
          <p className="text-xs text-os-dark-gray">System diagnostics and performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left Column: Simulated Performance Graphs */}
        <fieldset className="border border-os-dark-gray p-3 shadow-retro-outset">
          <legend className="text-xs font-bold px-1 select-none">Performance (Simulated)</legend>
          
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span>CPU Usage</span>
              <span>{cpuUsage}%</span>
            </div>
            <div className="w-full h-4 bg-black border border-os-dark-gray shadow-retro-inset flex">
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 mx-[1px] ${i < (cpuUsage / 5) ? 'bg-green-500 shadow-[0_0_2px_#00ff00]' : 'bg-transparent'}`}
                ></div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Memory Usage</span>
              <span>{memUsage}%</span>
            </div>
            <div className="w-full h-4 bg-black border border-os-dark-gray shadow-retro-inset flex">
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 mx-[1px] ${i < (memUsage / 5) ? 'bg-blue-500 shadow-[0_0_2px_#0000ff]' : 'bg-transparent'}`}
                ></div>
              ))}
            </div>
          </div>
        </fieldset>

        {/* Right Column: Real Diagnostics */}
        <fieldset className="border border-os-dark-gray p-3 shadow-retro-outset">
          <legend className="text-xs font-bold px-1 select-none">System Hardware</legend>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs border-b border-dotted border-os-dark-gray pb-1">
              <span className="font-bold">Network:</span>
              <span>{navigator.onLine ? 'Connected' : 'Offline'}</span>
            </div>
            <div className="flex justify-between text-xs border-b border-dotted border-os-dark-gray pb-1">
              <span className="font-bold">Battery:</span>
              <span>{battery}</span>
            </div>
            <div className="flex justify-between text-xs border-b border-dotted border-os-dark-gray pb-1">
              <span className="font-bold">Resolution:</span>
              <span>{window.innerWidth} x {window.innerHeight}</span>
            </div>
            <div className="flex justify-between text-xs border-b border-dotted border-os-dark-gray pb-1">
              <span className="font-bold">Active Windows:</span>
              <span>{openWindowCount} process(es)</span>
            </div>
          </div>
        </fieldset>
      </div>

      {/* Full width row: Environment & Software */}
      <fieldset className="border border-os-dark-gray p-3 shadow-retro-outset mt-4">
        <legend className="text-xs font-bold px-1 select-none">Environment Details</legend>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 text-xs">
            <span className="font-bold min-w-[80px]">Browser:</span>
            <span className="truncate text-os-dark-gray" title={navigator.userAgent}>{navigator.userAgent}</span>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="font-bold min-w-[80px]">Backend:</span>
            <span className="text-green-700 font-bold">Online (Simulated via Django)</span>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="font-bold min-w-[80px]">LUMA AI:</span>
            <span className="text-green-700 font-bold">Groq Interface Ready</span>
          </div>
        </div>
      </fieldset>

    </div>
  );
};

export default SystemMonitor;