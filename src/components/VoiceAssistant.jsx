import React, { useState, useEffect } from 'react';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [emotion, setEmotion] = useState('NEUTRAL');
  const [availableVoices, setAvailableVoices] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

  useEffect(() => {
    const loadVoices = () => {
      setAvailableVoices(window.speechSynthesis.getVoices());
    };
    
    loadVoices();
    
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleMicClick = () => {
    if (isListening || isProcessing) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setTranscript("ERR: Speech Recognition API not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('Listening for audio input...');
      setEmotion('NEUTRAL');
      window.speechSynthesis.cancel();
    };

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      setIsListening(false);
      setTranscript(`USR> ${text}`);
      await processVoiceCommand(text);
    };

    recognition.onerror = (event) => {
      console.error("Speech error", event.error);
      setIsListening(false);
      setTranscript('ERR: No speech detected or mic failure.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processVoiceCommand = async (text) => {
    setIsProcessing(true);
    setTranscript('SYS> Processing natural language query...');
    
    try {
      const res = await fetch(`${API_BASE_URL}/voice-assistant/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      });
      
      const data = await res.json();
      if (res.ok) {
        speakResponse(data.reply);
      } else {
        speakResponse("[SAD] Subsystem error occurred.");
      }
    } catch (error) {
      speakResponse("[SAD] Cannot connect to central AI core.");
    }
    setIsProcessing(false);
  };

  const speakResponse = (fullText) => {
    const match = fullText.match(/^\[(.*?)\]\s*(.*)/);
    let currentEmotion = 'NEUTRAL';
    let cleanText = fullText;

    if (match) {
      currentEmotion = match[1].toUpperCase();
      cleanText = match[2];
    }

    setEmotion(currentEmotion);
    setTranscript(`AI> ${cleanText}`);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    if (availableVoices.length > 0) {
      const femaleVoice = availableVoices.find(voice => 
        voice.name.includes('Zira') ||                  
        voice.name.includes('Neerja') ||                
        voice.name.includes('Samantha') ||              
        voice.name.includes('Victoria') ||              
        voice.name.includes('Google UK English Female') 
      );

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
    }
    
    if (currentEmotion === 'HAPPY' || currentEmotion === 'EXCITED') {
      utterance.pitch = 1.2;
      utterance.rate = 1.1;
    } else if (currentEmotion === 'SAD' || currentEmotion === 'EMPATHETIC') {
      utterance.pitch = 0.8;
      utterance.rate = 0.9;
    } else if (currentEmotion === 'ANGRY' || currentEmotion === 'FRUSTRATED') {
      utterance.pitch = 0.9;
      utterance.rate = 1.2;
    } else {
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
    }

    window.speechSynthesis.speak(utterance);
  };

  // Convert modern glow colors to harsh 90s LED indicator colors
  const getRetroEmotionColor = () => {
    switch(emotion) {
      case 'HAPPY': case 'EXCITED': return 'bg-[#00ff00] shadow-[0_0_5px_#00ff00]'; 
      case 'ANGRY': case 'FRUSTRATED': return 'bg-[#ff0000] shadow-[0_0_5px_#ff0000]'; 
      case 'SAD': case 'EMPATHETIC': return 'bg-[#ff00ff] shadow-[0_0_5px_#ff00ff]'; 
      default: return 'bg-[#ffff00]'; // Yellow for idle/neutral active
    }
  };

  return (
    <div className="absolute bottom-12 right-4 z-[80] flex flex-col items-end select-none">
      
      {/* Main Voice Utility Window */}
      <div className="retro-window w-64 bg-os-gray font-sans text-os-text shadow-retro-outset">
        
        {/* Title Bar */}
        <div className="retro-title-bar cursor-default">
          <div className="flex items-center gap-1">
            <span className="text-[10px]">🎙️</span>
            <span>Luma AI Link</span>
          </div>
          <button className="retro-btn px-2 py-0 h-[18px] text-xs leading-none font-bold">X</button>
        </div>

        <div className="p-2 border-t border-os-white">
          
          {/* Status Display Area */}
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-2">
               {/* Hardware LED Emotion Indicator */}
               <div className={`w-3 h-3 border border-os-dark-gray shadow-retro-inset ${!isListening && !isProcessing && transcript === '' ? 'bg-black' : getRetroEmotionColor()}`}></div>
               <span className="text-[10px] font-bold uppercase tracking-wider">
                 {isListening ? 'Awaiting Audio...' : isProcessing ? 'Computing...' : 'System Idle'}
               </span>
            </div>
          </div>

          {/* Terminal Transcript Box */}
          <div className="bg-os-white shadow-retro-inset border border-os-dark-gray h-20 p-2 mb-3 overflow-y-auto text-xs font-mono text-os-text custom-scrollbar break-words">
            {transcript || "Ready. Click 'Record' to issue a voice command."}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1 justify-between">
            
            <button 
              onClick={handleMicClick}
              disabled={isListening || isProcessing}
              className={`retro-btn flex-1 flex items-center justify-center gap-1 text-xs font-bold ${isListening ? 'shadow-retro-inset bg-os-dark-gray text-os-white' : ''}`}
            >
              <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-[#ff0000] shadow-[0_0_5px_#ff0000]' : 'bg-[#800000]'}`}></div>
              {isListening ? 'Recording' : 'Record'}
            </button>
            
            <button className="retro-btn px-3 text-xs" title="Settings">⚙️</button>
            <button className="retro-btn px-3 text-xs font-bold" title="Help">?</button>
            
          </div>

        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;