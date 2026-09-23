import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '../hooks/useSound';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const VoiceAssistant = () => {
  const [status, setStatus] = useState('IDLE'); // IDLE, LISTENING, PROCESSING, SPEAKING, ERROR
  const [emotion, setEmotion] = useState('neutral');
  const [transcript, setTranscript] = useState('');
  const [chatLog, setChatLog] = useState([
    "[SYSTEM]: LUMA.EXE initialized.",
    "[SYSTEM]: Groq AI interface connected.",
    "[LUMA]: Online and ready. Speak or type a command."
  ]);
  const [inputText, setInputText] = useState('');
  
  const { playSound } = useSound();
  const logEndRef = useRef(null);

  // Cross-browser speech recognition support
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  // Auto-scroll transcript
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const appendLog = (sender, msg) => {
    setChatLog(prev => [...prev, `[${sender}]: ${msg}`]);
  };

  const handleListen = () => {
    if (!recognition) {
      appendLog('SYSTEM', 'Speech recognition not supported in this browser.');
      return;
    }
    playSound('button');
    setStatus('LISTENING');
    recognition.start();

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript;
      setTranscript(text);
      appendLog('USER', text);
      sendToAI(text);
    };

    recognition.onspeechend = () => {
      recognition.stop();
      if (status === 'LISTENING') setStatus('PROCESSING');
    };

    recognition.onerror = (event) => {
      setStatus('ERROR');
      playSound('error');
      appendLog('SYSTEM', `Microphone error: ${event.error}`);
    };
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    playSound('typing');
    appendLog('USER', inputText);
    sendToAI(inputText);
    setInputText('');
  };

  const sendToAI = async (text) => {
    setStatus('PROCESSING');
    setEmotion('thinking');
    try {
      // Calls your existing backend API endpoint
      const response = await fetch(`${API_BASE_URL}/voice-assistant/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }) // Adjust payload key to match your Django view
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      // Fallback keys in case your backend uses different standard response formats
      const reply = data.response || data.message || data.answer || data.reply || "I received your request, but the response was empty.";
      
      setStatus('SPEAKING');
      setEmotion(data.emotion || 'happy');
      appendLog('LUMA', reply);
      playSound('ai-response');
      speakText(reply);

    } catch (error) {
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
    
    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[*#_]/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = 1.1; // Slightly robotic/higher pitch
    utterance.rate = 1.0;
    
    utterance.onend = () => {
      setStatus('IDLE');
      setEmotion('neutral');
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const handleStopAudio = () => {
    playSound('click');
    window.speechSynthesis.cancel();
    if (recognition) recognition.stop();
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
      <div className="flex gap-4 mb-2">
        {/* Visualizer / Avatar */}
        <div className="w-32 h-32 bg-black border-2 border-os-dark-gray shadow-retro-inset flex flex-col items-center justify-center text-green-500 font-pixel text-5xl">
           <div className={status === 'SPEAKING' ? 'animate-pulse text-yellow-400' : ''}>{getFace()}</div>
           <div className="text-[10px] mt-4 text-green-700 font-terminal uppercase tracking-widest">LUMA.EXE v1.0</div>
        </div>
        
        {/* Status Panel */}
        <div className="flex-1 flex flex-col gap-2">
           <div className="bg-os-white border border-os-dark-gray shadow-retro-inset p-2 h-16 flex flex-col justify-center">
              <div className="text-[10px] font-bold text-os-dark-gray mb-1 uppercase">System Status</div>
              <div className={`text-lg font-terminal uppercase font-bold 
                ${status === 'ERROR' ? 'text-red-600' : status === 'LISTENING' ? 'text-red-500 animate-pulse' : 'text-blue-900'}`}>
                {status}
              </div>
           </div>
           
           <div className="flex gap-2 mt-auto">
             <button 
               className="retro-btn flex-1 py-2 font-bold text-xs flex items-center justify-center gap-2" 
               onClick={handleListen} 
               disabled={status === 'LISTENING' || status === 'PROCESSING' || status === 'SPEAKING'}
             >
               <span className="text-red-600 text-lg leading-none">●</span> Start Mic
             </button>
             <button 
               className="retro-btn flex-1 py-2 text-xs flex items-center justify-center gap-2" 
               onClick={handleStopAudio}
             >
               <span className="text-black text-lg leading-none">■</span> Stop
             </button>
           </div>
        </div>
      </div>

      {/* Transcript Log */}
      <div className="flex-1 bg-black border border-os-white shadow-retro-inset p-2 overflow-y-auto font-terminal text-[11px] text-green-500 mb-2 leading-relaxed">
         {chatLog.map((log, i) => (
            <div key={i} className={`mb-1 
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
      <form onSubmit={handleTextSubmit} className="flex gap-2">
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a command or query..."
          className="flex-1 bg-white border border-os-dark-gray shadow-retro-inset px-2 py-1 text-xs font-sans outline-none focus:bg-blue-50"
          disabled={status === 'PROCESSING'}
          spellCheck="false"
        />
        <button type="submit" className="retro-btn px-4 font-bold text-xs" disabled={status === 'PROCESSING'}>Send</button>
      </form>
    </div>
  );
};

export default VoiceAssistant;