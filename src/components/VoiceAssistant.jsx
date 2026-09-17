import React, { useState, useEffect } from 'react';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [emotion, setEmotion] = useState('NEUTRAL');
  const [availableVoices, setAvailableVoices] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

  // --- NEW: Load voices when the component mounts ---
  useEffect(() => {
    const loadVoices = () => {
      setAvailableVoices(window.speechSynthesis.getVoices());
    };
    
    // Initial load
    loadVoices();
    
    // Chrome loads voices asynchronously, so we must listen for this event
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleMicClick = () => {
    // Prevent starting if already listening or waiting for AI
    if (isListening || isProcessing) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setTranscript("Browser does not support voice recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('Listening...');
      setEmotion('NEUTRAL');
      window.speechSynthesis.cancel(); // Stop any ongoing speech
    };

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      setIsListening(false);
      setTranscript(`You: ${text}`);
      await processVoiceCommand(text);
    };

    recognition.onerror = (event) => {
      console.error("Speech error", event.error);
      setIsListening(false);
      setTranscript('Microphone error or no speech detected.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processVoiceCommand = async (text) => {
    setIsProcessing(true);
    setTranscript('Luma is thinking...');
    
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
        speakResponse("[SAD] I encountered a system error.");
      }
    } catch (error) {
      speakResponse("[SAD] I cannot reach the server right now.");
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
    setTranscript(cleanText);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // --- NEW: Female Voice Selection Logic ---
    if (availableVoices.length > 0) {
      // Find the best available female voice based on OS/Browser
      const femaleVoice = availableVoices.find(voice => 
        voice.name.includes('Zira') ||                  // Windows US Female
        voice.name.includes('Neerja') ||                // Windows Indian Female
        voice.name.includes('Samantha') ||              // Mac US Female
        voice.name.includes('Victoria') ||              // Mac UK Female
        voice.name.includes('Google UK English Female') // Chrome Default Female
      );

      // If a match is found, use it. Otherwise, it defaults to the system standard.
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
    }
    
    // Apply emotional tweaks to pitch and rate
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

  const getEmotionColor = () => {
    switch(emotion) {
      case 'HAPPY': case 'EXCITED': return 'shadow-[0_0_20px_rgba(74,222,128,0.4)]'; 
      case 'ANGRY': case 'FRUSTRATED': return 'shadow-[0_0_20px_rgba(239,68,68,0.4)]'; 
      case 'SAD': case 'EMPATHETIC': return 'shadow-[0_0_20px_rgba(168,85,247,0.4)]'; 
      default: return 'shadow-[0_0_20px_rgba(79,195,247,0.2)]'; 
    }
  };

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[80] flex flex-col items-center">
      
      {/* Floating Transcript Text */}
      {(transcript && !isListening) && (
        <div className="mb-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-800 text-sm font-mono text-gray-300 max-w-sm text-center shadow-lg animate-fade-in-up">
          {transcript}
        </div>
      )}

      {/* Main Voice Widget */}
      <div className={`bg-[#1e1e1e] border border-gray-700 rounded-2xl w-56 p-4 flex flex-col items-center shadow-2xl transition-all duration-300 ${getEmotionColor()}`}>
        
        {/* Top Handle bar */}
        <div className="w-8 h-1 bg-gray-600 rounded-full mb-4"></div>

        {/* Controls Row */}
        <div className="w-full flex justify-between items-center px-2">
          
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          </button>

          <button 
            onClick={handleMicClick}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening 
                ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse text-white' 
                : isProcessing
                ? 'bg-thruster-blue shadow-[0_0_15px_rgba(79,195,247,0.5)] text-black animate-spin'
                : 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-300'
            }`}
          >
            {isProcessing ? (
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="10" strokeDasharray="16"></circle></svg>
            ) : (
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                 <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                 <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                 <line x1="12" y1="19" x2="12" y2="22"></line>
               </svg>
            )}
          </button>

          <button className="text-gray-400 hover:text-white transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </button>

        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;