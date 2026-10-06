import React, { useState, useRef, useEffect } from 'react';
import { useSound } from '../hooks/useSound';

const MobileVoiceAssistant = () => {
  const [messages, setMessages] = useState([
    { sender: 'luma', text: 'LUMA.EXE V1.0 ONLINE.\nAWAITING VOICE OR TEXT INPUT...' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { playSound } = useSound();
  const endRef = useRef(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    playSound('click');
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');
    
    // Fallback UI simulation if the backend API is disconnected on the mobile preview
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'luma', text: 'PROCESSING REQUEST...\n[SYSTEM WARNING: API CONNECTION PENDING IN MOBILE PREVIEW]' }]);
      playSound('click'); 
    }, 1000);
  };

  const toggleMic = () => {
    playSound('click');
    setIsListening(!isListening);
    if (!isListening) {
      setMessages(prev => [...prev, { sender: 'system', text: '[ MICROPHONE ACTIVATED - LISTENING... ]' }]);
    } else {
      setMessages(prev => [...prev, { sender: 'system', text: '[ MICROPHONE DEACTIVATED ]' }]);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full bg-black text-[#00ff00] font-pixel text-sm sm:text-base p-1 select-none">
      
      {/* Terminal Output Area - Now strict min-h-0 to prevent pushing controls out of viewport */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar border border-os-dark-gray shadow-retro-inset p-2 mb-1 bg-[#0a0a0a]">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-3 ${msg.sender === 'user' ? 'text-white' : msg.sender === 'system' ? 'text-yellow-400' : 'text-[#00ff00]'}`}>
            <span className="font-bold">{msg.sender === 'user' ? 'USER> ' : msg.sender === 'system' ? 'SYS> ' : 'LUMA> '}</span>
            <span className="whitespace-pre-wrap break-words">{msg.text}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Mobile-Optimized Controls Panel - shrink-0 ensures it stays anchored */}
      <div className="flex flex-col gap-2 shrink-0 bg-os-gray p-2 shadow-retro-outset border border-os-dark-gray font-sans">
        
        {/* Text Input Row */}
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 min-w-0 shadow-retro-inset bg-black text-[#00ff00] font-pixel px-2 py-1 outline-none text-sm"
            placeholder="Type command..."
            autoComplete="off"
            spellCheck="false"
          />
          <button 
            onClick={handleSend}
            className="retro-btn shrink-0 px-4 py-1 font-bold text-xs"
          >
            Send
          </button>
        </div>
        
        {/* Giant Retro Mic Toggle */}
        <button 
          onClick={toggleMic}
          className={`retro-btn w-full shrink-0 py-3 font-bold text-sm flex items-center justify-center gap-2 
            ${isListening ? 'shadow-retro-inset bg-[#d0d0d0] text-red-700' : 'text-black'}`}
        >
          <div className={`w-3 h-3 rounded-full border border-os-dark-gray shrink-0 ${isListening ? 'bg-red-600 animate-pulse shadow-[0_0_5px_red]' : 'bg-[#800000]'}`}></div>
          {isListening ? 'MIC ACTIVE - TAP TO STOP' : 'ACTIVATE VOICE INPUT'}
        </button>

      </div>
    </div>
  );
};

export default MobileVoiceAssistant;