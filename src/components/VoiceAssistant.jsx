import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSound } from '../hooks/useSound';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const VoiceAssistant = () => {
  const [status, setStatus] = useState('IDLE'); // IDLE, LISTENING, PROCESSING, SPEAKING, ERROR
  const [emotion, setEmotion] = useState('neutral');
  const [chatLog, setChatLog] = useState([
    "[SYSTEM]: LUMA.EXE initialized.",
    "[SYSTEM]: Neural Net Interface connected.",
    "[LUMA]: Online and ready. Speak or type a command."
  ]);
  const [inputText, setInputText] = useState('');
  
  const { playSound } = useSound();
  const logEndRef = useRef(null);
  
  // Safe refs for lifecycle and APIs
  const recognitionRef = useRef(null);
  const isMounted = useRef(true);

  // Auto-scroll transcript
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  // Lifecycle Initialization and Strict Cleanup
  useEffect(() => {
    isMounted.current = true;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
    }

    return () => {
      isMounted.current = false;
      // Kill microphone stream on unmount
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
      }
      // Kill phantom voices on unmount
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const appendLog = useCallback((sender, msg) => {
    setChatLog(prev => [...prev, `[${sender}]: ${msg}`]);
  }, []);

  const handleListen = () => {
    if (!recognitionRef.current) {
      appendLog('SYSTEM', 'Speech recognition not supported in this browser.');
      return;
    }
    
    // Interrupt any ongoing speech if user clicks mic
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    
    playSound('button');
    setStatus('LISTENING');

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn("Recognition start failed/already active:", e);
    }

    recognitionRef.current.onresult = (event) => {
      if (!isMounted.current) return;
      const current = event.resultIndex;
      const text = event.results[current][0].transcript;
      appendLog('USER', text);
      sendToAI(text);
    };

    recognitionRef.current.onspeechend = () => {
      if (!isMounted.current) return;
      try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
      setStatus(prev => prev === 'LISTENING' ? 'PROCESSING' : prev);
    };

    recognitionRef.current.onerror = (event) => {
      if (!isMounted.current) return;
      // 'aborted' happens when we manually call stop(), don't flag as error
      if (event.error === 'aborted') return;
      
      setStatus('ERROR');
      playSound('error');
      appendLog('SYSTEM', `Microphone error: ${event.error}`);
    };
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    
    playSound('typing');
    appendLog('USER', inputText);
    sendToAI(inputText);
    setInputText('');
  };

  const sendToAI = async (text) => {
    if (!isMounted.current) return;
    setStatus('PROCESSING');
    setEmotion('thinking');
    
    try {
      const response = await fetch(`${API_BASE_URL}/voice-assistant/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }) 
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      if (!isMounted.current) return;
      
      const reply = data.response || data.message || data.answer || data.reply || "I received your request, but the response was empty.";
      
      setStatus('SPEAKING');
      setEmotion(data.emotion || 'happy');
      appendLog('LUMA', reply);
      playSound('ai-response');
      speakText(reply);

    } catch (error) {
      if (!isMounted.current) return;
      setStatus('ERROR');
      setEmotion('sad');
      playSound('error');
      appendLog('SYSTEM', `Connection to AI Server failed: ${error.message}`);
    }
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
       setStatus('IDLE');
       return;
    }
    
    window.speechSynthesis.cancel(); // Clear queue
    const cleanText = text.replace(/[*#_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    utterance.pitch = 1.1; 
    utterance.rate = 1.0;
    
    utterance.onend = () => {
      if (!isMounted.current) return;
      setStatus('IDLE');
      setEmotion('neutral');
    };

    utterance.onerror = (e) => {
      if (!isMounted.current) return;
      // Ignore interruption errors when manually cancelled
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        setStatus('IDLE');
        setEmotion('neutral');
      }
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const handleStopAudio = () => {
    playSound('click');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
    }
    setStatus('IDLE');
    setEmotion('neutral');
  };

  // ASCII Faces for Retro Emotions
  const getFace = () => {
    if (status === 'LISTENING') return '(O_O)';
    if (status === 'PROCESSING') return '(-_-)zZ';
    if (status === 'ERROR') return '(x_x)';
    if (emotion === 'happy') return '(^u^)';
    if (emotion === 'sad') return '(._.)';
    if (emotion === 'thinking') return '(?_?)';
    return '(o_o)';
  };

  return (
    <div className="flex flex-col h-full bg-os-gray p-2 font-sans select-none">
      <div className="flex gap-4 mb-2 h-32 shrink-0">
        {/* Visualizer / Avatar */}
        <div className="w-32 h-32 bg-black border-2 border-os-dark-gray shadow-retro-inset flex flex-col items-center justify-center text-green-500 font-pixel text-4xl sm:text-5xl shrink-0">
           <div className={status === 'SPEAKING' ? 'animate-pulse text-yellow-400' : ''}>{getFace()}</div>
           <div className="text-[10px] mt-4 text-green-700 font-terminal uppercase tracking-widest text-center">LUMA.EXE<br/>v1.0</div>
        </div>
        
        {/* Status Panel */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
           <div className="bg-os-white border border-os-dark-gray shadow-retro-inset p-2 flex-1 flex flex-col justify-center min-h-0 overflow-hidden">
              <div className="text-[10px] font-bold text-os-dark-gray mb-1 uppercase truncate">System Status</div>
              <div className={`text-sm sm:text-lg font-terminal uppercase font-bold truncate
                ${status === 'ERROR' ? 'text-red-600' : status === 'LISTENING' ? 'text-red-500 animate-pulse' : 'text-blue-900'}`}>
                {status}
              </div>
           </div>
           
           <div className="flex gap-2 h-10 shrink-0">
             <button 
               className="retro-btn flex-1 px-1 font-bold text-xs flex items-center justify-center gap-1 sm:gap-2 truncate" 
               onClick={handleListen} 
               disabled={status === 'LISTENING' || status === 'PROCESSING' || status === 'SPEAKING'}
             >
               <span className="text-red-600 text-lg leading-none">●</span> <span className="hidden sm:inline">Start Mic</span><span className="sm:hidden">Mic</span>
             </button>
             <button 
               className="retro-btn flex-1 px-1 text-xs flex items-center justify-center gap-1 sm:gap-2 truncate" 
               onClick={handleStopAudio}
             >
               <span className="text-black text-lg leading-none">■</span> Stop
             </button>
           </div>
        </div>
      </div>

      {/* Transcript Log */}
      <div className="flex-1 bg-black border border-os-white shadow-retro-inset p-2 overflow-y-auto font-terminal text-[11px] text-green-500 mb-2 leading-relaxed min-h-[100px]">
         {chatLog.map((log, i) => (
            <div key={i} className={`mb-1 break-words
              ${log.startsWith('[USER]') ? 'text-yellow-400' : ''} 
              ${log.startsWith('[SYSTEM]') ? 'text-red-500 font-bold' : ''}
              ${log.startsWith('[LUMA]') ? 'text-[#00ff00]' : ''}
            `}>
               {log}
            </div>
         ))}
         <div ref={logEndRef} />
      </div>

      {/* Text Input Fallback */}
      <form onSubmit={handleTextSubmit} className="flex gap-2 h-8 shrink-0">
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type command..."
          className="flex-1 bg-white border border-os-dark-gray shadow-retro-inset px-2 py-1 text-xs font-sans outline-none focus:bg-blue-50 min-w-0"
          disabled={status === 'PROCESSING'}
          spellCheck="false"
        />
        <button type="submit" className="retro-btn px-4 font-bold text-xs shrink-0" disabled={status === 'PROCESSING'}>Send</button>
      </form>
    </div>
  );
};

export default VoiceAssistant;