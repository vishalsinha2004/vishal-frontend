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

  const handleClick = (index) => {
    if (board[index] || winnerData || !xIsNext) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setXIsNext(false);
  };

  useEffect(() => {
    const currentWinner = calculateWinner(board);
    
    if (currentWinner) {
      setWinnerData(currentWinner);
      setShowModal(true);
      return;
    }

    if (!xIsNext) {
      const timer = setTimeout(() => {
        const emptyIndices = board
          .map((val, idx) => (val === null ? idx : null))
          .filter((val) => val !== null);
          
        if (emptyIndices.length > 0) {
          const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          const newBoard = [...board];
          newBoard[randomIndex] = 'O'; 
          setBoard(newBoard);
          setXIsNext(true); 
        }
      }, 500); 

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
    <div className="h-full w-full bg-os-teal flex items-center justify-center p-4 select-none font-sans">
      
      {/* Classic Window Container for the Game */}
      <div className="retro-window w-full max-w-[320px] shadow-retro-outset bg-os-gray">
        
        {/* Internal Menubar */}
        <div className="flex items-center gap-4 px-2 py-1 text-xs border-b border-os-dark-gray shadow-[0_1px_0_#ffffff]">
          <span className="hover:bg-os-navy hover:text-os-white px-1 cursor-default"><span className="underline">G</span>ame</span>
          <span className="hover:bg-os-navy hover:text-os-white px-1 cursor-default"><span className="underline">H</span>elp</span>
        </div>

        {/* Game Area */}
        <div className="p-4 flex flex-col items-center">
          
          {/* Status Display */}
          <div className="w-full bg-os-white shadow-retro-inset border border-os-dark-gray p-2 mb-4 text-center text-xs font-bold text-os-text h-8 flex items-center justify-center">
            {winnerData 
              ? 'Game Over' 
              : xIsNext 
                ? 'Your turn (X)' 
                : 'Computer thinking...'}
          </div>

          {/* Classic Mechanical Grid */}
          <div className="grid grid-cols-3 gap-0 bg-os-gray border border-os-dark-gray p-1 mb-4 shadow-retro-inset">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleClick(index)}
                disabled={cell !== null || winnerData !== null || !xIsNext}
                className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-4xl font-bold font-sans outline-none
                  ${!cell && !winnerData && xIsNext 
                    ? 'retro-btn hover:shadow-retro-inset active:shadow-retro-inset active:pt-[2px] active:pl-[2px]' 
                    : 'retro-btn shadow-retro-outset bg-os-gray'
                  }
                  ${cell ? 'shadow-retro-inset bg-os-white' : ''}
                `}
              >
                <span className={cell === 'X' ? 'text-black' : cell === 'O' ? 'text-os-navy' : ''}>
                  {cell}
                </span>
              </button>
            ))}
          </div>

          {/* Reset Action */}
          <button onClick={resetGame} className="retro-btn text-xs font-bold w-full py-1">
            New Game
          </button>
        </div>
      </div>

      {/* --- CLASSIC SYSTEM DIALOG FOR GAME OVER --- */}
      {showModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none">
          {/* Mock blocking overlay to prevent clicking behind */}
          <div className="absolute inset-0 pointer-events-auto"></div>
          
          <div className="retro-window w-64 shadow-retro-outset bg-os-gray font-sans text-os-text pointer-events-auto border border-os-dark-gray">
            
            <div className="retro-title-bar">
              <span>Tic Tac Toe</span>
              <button onClick={resetGame} className="retro-btn px-2 py-0 h-[18px] text-xs leading-none font-bold">X</button>
            </div>
            
            <div className="p-4 flex items-start gap-4">
              <span className="text-3xl leading-none">
                {winnerData === 'Draw' ? 'ℹ️' : winnerData === 'X' ? '🏆' : '⚠️'}
              </span>
              <div className="flex flex-col text-xs mt-1">
                <span className="font-bold mb-2">
                  {winnerData === 'Draw' ? 'The game is a draw.' : winnerData === 'X' ? 'You won!' : 'The computer won.'}
                </span>
                <span>Play again?</span>
              </div>
            </div>

            <div className="flex justify-center gap-2 p-3 bg-os-gray border-t border-os-dark-gray shadow-retro-inset">
              <button onClick={resetGame} className="retro-btn text-xs w-20 font-bold focus:shadow-retro-inset">
                Yes
              </button>
              <button onClick={resetGame} className="retro-btn text-xs w-20">
                No
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
};

export default TicTacToe;