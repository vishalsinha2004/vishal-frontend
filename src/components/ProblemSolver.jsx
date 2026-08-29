import React, { useState, useEffect, useRef } from 'react';

const ProblemSolver = () => {
  const [secretCode, setSecretCode] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const inputRef = useRef(null);

  const MAX_ATTEMPTS = 8;

  // Initialize a random 4-digit code
  const generateSecretCode = () => {
    const code = [];
    for (let i = 0; i < 4; i++) {
      code.push(Math.floor(Math.random() * 10).toString());
    }
    setSecretCode(code);
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    generateSecretCode();
  }, []);

  const handleGuess = (e) => {
    e.preventDefault();
    
    // Validate input: must be exactly 4 digits
    if (currentGuess.length !== 4 || !/^\d+$/.test(currentGuess)) return;

    let exactMatches = 0;
    let partialMatches = 0;
    
    const guessArr = currentGuess.split('');
    const secretCopy = [...secretCode];
    const guessCopy = [...guessArr];

    // First pass: Find Exact Matches (Right number, right place)
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] === secretCopy[i]) {
        exactMatches++;
        secretCopy[i] = null; // Mark as processed
        guessCopy[i] = null;
      }
    }

    // Second pass: Find Partial Matches (Right number, wrong place)
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] !== null) {
        const matchIdx = secretCopy.indexOf(guessCopy[i]);
        if (matchIdx > -1) {
          partialMatches++;
          secretCopy[matchIdx] = null; // Mark as processed
        }
      }
    }

    const newGuesses = [...guesses, { 
      guess: currentGuess, 
      exact: exactMatches, 
      partial: partialMatches 
    }];
    
    setGuesses(newGuesses);
    setCurrentGuess('');

    // Check Win/Loss
    if (exactMatches === 4) {
      setGameStatus('won');
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameStatus('lost');
    } else {
      if (inputRef.current) inputRef.current.focus();
    }
  };

  return (
    <div className="h-full w-full bg-[#050505] flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto custom-scrollbar shadow-[inset_0_0_50px_rgba(0,0,0,0.9)] font-sans">
      
      <div className="max-w-xl w-full bg-[#0a0a0a] border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col relative z-10 overflow-hidden min-h-[600px]">
        
        {/* Terminal Background Effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-thruster-glow to-transparent opacity-50"></div>

        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-800 pb-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-widest uppercase flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-thruster-glow"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              Firewall Bypass
            </h2>
            <p className="text-xs text-gray-500 font-mono mt-1">Deduce the 4-digit mainframe PIN.</p>
          </div>
          <div className="text-right font-mono flex flex-col items-end">
            <div className="text-xs text-gray-500 mb-1">ATTEMPTS REMAINING</div>
            <div className="text-xl text-thruster-glow font-bold">
              {Math.max(0, MAX_ATTEMPTS - guesses.length)}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-[#121212] border border-gray-800 rounded-lg p-4 mb-6 flex flex-col gap-2 shadow-inner">
          <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
            <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(74,222,128,0.6)]"></span>
            <span>EXACT: Correct digit, correct position.</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
            <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></span>
            <span>PARTIAL: Correct digit, wrong position.</span>
          </div>
        </div>

        {/* Log / Terminal Output */}
        <div className="flex-1 bg-black border border-gray-800 rounded-xl p-4 mb-6 overflow-y-auto custom-scrollbar font-mono flex flex-col gap-3 shadow-inner">
          {guesses.length === 0 && gameStatus === 'playing' ? (
            <div className="text-gray-600 text-sm h-full flex items-center justify-center animate-pulse">
              [ SYSTEM READY. ENTER FIRST SEQUENCE ]
            </div>
          ) : (
            guesses.map((g, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-gray-900 pb-2">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 text-xs">#{idx + 1}</span>
                  <span className="text-xl text-white tracking-[0.3em] font-bold">{g.guess}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5" title="Exact Matches">
                    <span className="text-green-500 font-bold">{g.exact}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(74,222,128,0.5)]"></span>
                  </div>
                  <div className="w-px h-4 bg-gray-800"></div>
                  <div className="flex items-center gap-1.5" title="Partial Matches">
                    <span className="text-yellow-500 font-bold">{g.partial}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.5)]"></span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Form & Game Over States */}
        {gameStatus === 'playing' ? (
          <form onSubmit={handleGuess} className="flex gap-4">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-thruster-glow font-bold font-mono">&gt;</span>
              <input 
                ref={inputRef}
                type="text" 
                maxLength="4"
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value.replace(/\D/g, ''))} // Restrict to numbers
                className="w-full bg-[#1a1a1a] border-2 border-gray-700 focus:border-thruster-glow rounded-xl pl-10 pr-4 py-4 text-white font-mono text-xl tracking-[0.2em] outline-none transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] placeholder-gray-600"
                placeholder="0000"
                autoComplete="off"
              />
            </div>
            <button 
              type="submit"
              disabled={currentGuess.length !== 4}
              className="bg-thruster-blue hover:bg-thruster-glow text-black font-bold uppercase px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(79,195,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Inject
            </button>
          </form>
        ) : (
          <div className={`p-6 rounded-xl border-2 flex flex-col items-center text-center animate-fade-in-up ${gameStatus === 'won' ? 'bg-green-900/20 border-green-500/50' : 'bg-red-900/20 border-red-500/50'}`}>
            <h3 className={`text-2xl font-bold uppercase tracking-widest mb-2 ${gameStatus === 'won' ? 'text-green-400' : 'text-red-500'}`}>
              {gameStatus === 'won' ? 'Access Granted' : 'Access Denied'}
            </h3>
            <p className="text-gray-300 font-mono text-sm mb-6">
              {gameStatus === 'won' 
                ? `Decryption successful in ${guesses.length} attempts.` 
                : `Security lockdown initiated. The PIN was ${secretCode.join('')}.`}
            </p>
            <button 
              onClick={generateSecretCode}
              className="bg-[#1a1a1a] hover:bg-gray-800 border border-gray-600 text-white font-mono uppercase px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M21.5 2v6h-6M2.13 15.57a10 10 0 1 0 2.43-11.45L2 6"></path></svg>
              Restart Sequence
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProblemSolver;