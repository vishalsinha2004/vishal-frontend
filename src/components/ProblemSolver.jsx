import React, { useState, useEffect, useRef } from 'react';

const ProblemSolver = () => {
  const [secretCode, setSecretCode] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);

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

  useEffect(() => {
    // Keep terminal scrolled to latest output
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollTop = terminalEndRef.current.scrollHeight;
    }
  }, [guesses, gameStatus]);

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
        secretCopy[i] = null;
        guessCopy[i] = null;
      }
    }

    // Second pass: Find Partial Matches (Right number, wrong place)
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] !== null) {
        const matchIdx = secretCopy.indexOf(guessCopy[i]);
        if (matchIdx > -1) {
          partialMatches++;
          secretCopy[matchIdx] = null;
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
    <div className="h-full w-full bg-black text-[#c0c0c0] font-mono p-4 overflow-hidden flex flex-col justify-between select-none">
      
      {/* --- DOS TERMINAL OUTPUT WINDOW --- */}
      <div ref={terminalEndRef} className="flex-1 overflow-y-auto custom-scrollbar text-xs md:text-sm leading-relaxed pr-2">
        
        {/* DOS Header Banner */}
        <div className="text-[#808080] mb-2">
          <p>Vishal OS 98 [Version 4.10.1998]</p>
          <p>(C) Copyright Vishal Sinha 1998. All rights reserved.</p>
        </div>

        <p className="text-white mb-2">C:\VISHAL\GAMES&gt; RUN CODECRACK.EXE</p>

        <div className="text-white border-y border-[#808080] py-2 mb-3">
          <p className="font-bold text-[#00ff00]">================================================================</p>
          <p className="font-bold text-[#ffff00]">   SECURITY SYSTEM DECODER - PIN CRACKING UTILITY v1.0</p>
          <p className="font-bold text-[#00ff00]">================================================================</p>
          <p className="text-[#c0c0c0] mt-1">Rule 1: Exact matches represent correct digit in correct index.</p>
          <p className="text-[#c0c0c0]">Rule 2: Partial matches represent correct digit in wrong index.</p>
          <p className="text-white font-bold mt-1">Attempts Remaining: {Math.max(0, MAX_ATTEMPTS - guesses.length)} / {MAX_ATTEMPTS}</p>
        </div>

        {/* Attempt Log Header */}
        <div className="grid grid-cols-[80px_100px_1fr] text-[#808080] border-b border-[#404040] pb-1 mb-2 uppercase tracking-wider text-xs">
          <span>Attempt</span>
          <span>Sequence</span>
          <span>Diagnostic Output</span>
        </div>

        {/* Guesses Rows */}
        {guesses.map((g, idx) => (
          <div key={idx} className="grid grid-cols-[80px_100px_1fr] py-0.5 text-xs md:text-sm">
            <span className="text-[#808080]">[{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}/{MAX_ATTEMPTS}]</span>
            <span className="text-[#ffffff] font-bold tracking-widest">{g.guess}</span>
            <span className="text-[#00ff00]">
              EXACT: <span className="text-white font-bold">{g.exact}</span> | PARTIAL: <span className="text-[#ffff00] font-bold">{g.partial}</span>
            </span>
          </div>
        ))}

        {guesses.length === 0 && gameStatus === 'playing' && (
          <p className="text-[#808080] italic my-2">System awaiting first sequence input below...</p>
        )}

        {/* Win / Loss Terminal Messages */}
        {gameStatus === 'won' && (
          <div className="mt-4 p-2 border border-[#00ff00] bg-[#002200] text-[#00ff00]">
            <p className="font-bold">*** SUCCESS: ACCESS GRANTED ***</p>
            <p className="text-white">Mainframe decoded in {guesses.length} attempt(s).</p>
            <p className="text-xs text-[#00ff00] mt-1">Status: Normal execution restored.</p>
          </div>
        )}

        {gameStatus === 'lost' && (
          <div className="mt-4 p-2 border border-[#ff0000] bg-[#220000] text-[#ff0000]">
            <p className="font-bold">*** CRITICAL: SECURITY LOCKOUT ***</p>
            <p className="text-white">Maximum allowable attempts exceeded.</p>
            <p className="text-xs text-[#ffff00] mt-1">CORRECT KEY WAS: [{secretCode.join('')}]</p>
          </div>
        )}

      </div>

      {/* --- COMMAND LINE INPUT & CONTROLS --- */}
      <div className="mt-3 pt-2 border-t border-[#808080] bg-black">
        {gameStatus === 'playing' ? (
          <form onSubmit={handleGuess} className="flex items-center gap-2">
            <span className="text-[#00ff00] font-bold whitespace-nowrap">C:\VISHAL\GAMES&gt;</span>
            <input 
              ref={inputRef}
              type="text" 
              maxLength="4"
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value.replace(/\D/g, ''))}
              className="bg-black text-white font-mono text-sm border-b-2 border-white focus:border-[#00ff00] outline-none w-28 tracking-[0.3em] px-1"
              placeholder="____"
              autoComplete="off"
              autoFocus
            />
            <button 
              type="submit" 
              disabled={currentGuess.length !== 4}
              className="retro-btn text-xs px-3 py-1 font-bold ml-2 disabled:opacity-40"
            >
              Execute
            </button>
            <button 
              type="button" 
              onClick={generateSecretCode}
              className="retro-btn text-xs px-3 py-1"
            >
              Reset
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-[#808080] text-xs">Sequence terminated.</span>
            <button 
              onClick={generateSecretCode}
              className="retro-btn text-xs font-bold px-4 py-1"
              autoFocus
            >
              Restart Program (Y/N)
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProblemSolver;