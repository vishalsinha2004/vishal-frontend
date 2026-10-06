import React, { useState } from 'react';
import { useSound } from '../hooks/useSound';

const MobileTicTacToe = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const { playSound } = useSound();

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(s => s !== null);

  const handleClick = (i) => {
    if (squares[i] || winner) return;
    playSound('click');
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    playSound('click');
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="flex flex-col items-center justify-start py-6 flex-1 min-h-0 w-full bg-os-gray font-sans select-none overflow-y-auto custom-scrollbar">
      <div className="bg-os-gray shadow-retro-outset border border-os-dark-gray p-4 mb-6 w-[90%] max-w-[320px] shrink-0">
        
        {/* Score/Status Board */}
        <div className="bg-white shadow-retro-inset border border-os-dark-gray p-2 mb-4 text-center font-bold text-lg">
          {winner ? (
            <span className="text-red-600 animate-pulse">Winner: {winner}!</span>
          ) : isDraw ? (
            <span className="text-os-dark-gray">Game Drawn!</span>
          ) : (
            <span>Next Player: <span className={xIsNext ? 'text-blue-600' : 'text-red-600'}>{xIsNext ? 'X' : 'O'}</span></span>
          )}
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-3 gap-1 bg-os-dark-gray p-1 shadow-retro-inset w-full aspect-square">
          {squares.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className="bg-os-gray shadow-retro-outset active:shadow-retro-inset flex items-center justify-center text-4xl sm:text-5xl font-bold font-sans"
            >
              <span className={sq === 'X' ? 'text-blue-600' : 'text-red-600'}>
                {sq}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={resetGame} 
        className="retro-btn px-8 py-2 font-bold text-sm shrink-0"
      >
        Restart Game
      </button>
    </div>
  );
};

export default MobileTicTacToe;