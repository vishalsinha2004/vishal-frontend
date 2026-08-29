import React, { useState, useEffect } from 'react';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true); // True = Player (X), False = Computer (O)
  const [winnerData, setWinnerData] = useState(null); // 'X', 'O', or 'Draw'
  const [showModal, setShowModal] = useState(false);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6] // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (!squares.includes(null)) return 'Draw';
    return null;
  };

  // Handle Player click
  const handleClick = (index) => {
    // Prevent move if cell is taken, game is over, or it's the computer's turn
    if (board[index] || winnerData || !xIsNext) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setXIsNext(false);
  };

  // Handle Computer Move & Win Condition Checking
  useEffect(() => {
    const currentWinner = calculateWinner(board);
    
    // Check for win/draw after every move
    if (currentWinner) {
      setWinnerData(currentWinner);
      setShowModal(true);
      return;
    }

    // Trigger Computer's turn
    if (!xIsNext) {
      const timer = setTimeout(() => {
        const emptyIndices = board
          .map((val, idx) => (val === null ? idx : null))
          .filter((val) => val !== null);
          
        if (emptyIndices.length > 0) {
          const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          const newBoard = [...board];
          newBoard[randomIndex] = 'O'; // Computer places 'O'
          setBoard(newBoard);
          setXIsNext(true); // Pass turn back to Player
        }
      }, 600); // 600ms delay to simulate "thinking"

      return () => clearTimeout(timer);
    }
  }, [board, xIsNext]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinnerData(null);
    setShowModal(false);
  };

  return (
    <div className="h-full w-full bg-[#050505] flex flex-col items-center justify-center p-8 overflow-hidden relative shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
      
      <div className="max-w-md w-full bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center relative z-10">
        <h2 className="text-3xl font-bold text-white tracking-widest uppercase mb-2">Tic Tac Toe</h2>
        <p className="text-sm font-mono mb-8 h-5 flex items-center justify-center">
          <span className="text-gray-500">
            {xIsNext ? 'Awaiting Input: Commander ' : 'System AI is thinking '} 
            <span className={xIsNext ? 'text-thruster-glow' : 'text-green-400'}>
              {xIsNext ? 'X' : 'O'}
            </span>
            {!xIsNext && <span className="animate-pulse">...</span>}
          </span>
        </p>

        <div className="grid grid-cols-3 gap-3 mb-10 w-full max-w-[300px]">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={`aspect-square rounded-xl border-2 flex items-center justify-center text-5xl sm:text-6xl font-bold transition-all duration-300 focus:outline-none
                ${
                !cell && !winnerData && xIsNext ? 'border-gray-800 bg-[#121212] hover:border-gray-500 hover:bg-[#1a1a1a] cursor-pointer' :
                !cell && (!xIsNext || winnerData) ? 'border-gray-800 bg-[#121212] cursor-not-allowed' :
                cell === 'X' ? 'border-thruster-glow bg-thruster-blue/10 text-thruster-glow shadow-[0_0_15px_rgba(79,195,247,0.3)] cursor-default' :
                cell === 'O' ? 'border-green-400 bg-green-500/10 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.3)] cursor-default' :
                ''
              }`}
              disabled={cell !== null || winnerData !== null || !xIsNext}
            >
              {cell}
            </button>
          ))}
        </div>

        <button
          onClick={resetGame}
          className="bg-[#1a1a1a] hover:bg-space-gray border border-gray-700 hover:border-white px-8 py-3 rounded-full text-white font-bold tracking-widest uppercase text-sm transition-all shadow-lg flex items-center gap-3"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          Reset Board
        </button>
      </div>

      {/* Winner Pop-up Modal */}
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-[#121212] border border-gray-700 p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center flex flex-col items-center w-[90%] max-w-sm">
            
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-5 border-2 shadow-lg text-4xl font-bold
              ${winnerData === 'X' ? 'bg-thruster-blue/20 border-thruster-glow text-thruster-glow' : 
                winnerData === 'O' ? 'bg-green-500/20 border-green-400 text-green-400' : 
                'bg-yellow-500/20 border-yellow-400 text-yellow-400'}`}>
                {winnerData === 'Draw' ? '!' : winnerData}
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">
              {winnerData === 'Draw' ? 'Stalemate' : winnerData === 'X' ? 'Victory Achieved' : 'System Defeated'}
            </h3>
            
            <p className="text-gray-400 font-mono text-sm mb-8">
              {winnerData === 'Draw' ? 'No valid moves remain.' : winnerData === 'X' ? 'Commander has defeated the AI.' : 'The AI opponent proved superior.'}
            </p>
            
            <button
              onClick={resetGame}
              className="w-full bg-[#1a1a1a] hover:bg-space-gray border border-gray-600 hover:border-white py-3 rounded-lg text-white font-bold tracking-widest uppercase text-sm transition-all shadow-md focus:outline-none"
            >
              Acknowledge & Restart
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default TicTacToe;