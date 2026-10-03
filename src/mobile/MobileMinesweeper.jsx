import React, { useState, useEffect } from 'react';
import { useSound } from '../hooks/useSound';

// Mobile-optimized 8x8 grid (64 cells) with 10 mines
const ROWS = 8;
const COLS = 8;
const MINES = 10;

const MobileMinesweeper = () => {
  const { playSound } = useSound();
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [mode, setMode] = useState('dig'); // 'dig' or 'flag'
  const [flagsLeft, setFlagsLeft] = useState(MINES);

  const initGrid = () => {
    let newGrid = Array(ROWS).fill().map(() => Array(COLS).fill({ isMine: false, isRevealed: false, isFlagged: false, neighborMines: 0 }));
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      let r = Math.floor(Math.random() * ROWS);
      let c = Math.floor(Math.random() * COLS);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c] = { ...newGrid[r][c], isMine: true };
        minesPlaced++;
      }
    }
    // Calculate neighbors
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (r + i >= 0 && r + i < ROWS && c + j >= 0 && c + j < COLS && newGrid[r + i][c + j].isMine) {
                count++;
              }
            }
          }
          newGrid[r][c] = { ...newGrid[r][c], neighborMines: count };
        }
      }
    }
    setGrid(newGrid);
    setGameOver(false);
    setWin(false);
    setFlagsLeft(MINES);
  };

  useEffect(() => { initGrid(); }, []);

  const handleCellClick = (r, c) => {
    if (gameOver || win || grid[r][c].isRevealed) return;
    playSound('click');
    let newGrid = [...grid.map(row => [...row])];

    if (mode === 'flag') {
      const isFlagged = newGrid[r][c].isFlagged;
      newGrid[r][c].isFlagged = !isFlagged;
      setFlagsLeft(prev => isFlagged ? prev + 1 : prev - 1);
      setGrid(newGrid);
      return;
    }

    if (newGrid[r][c].isFlagged) return; // Can't dig a flag

    if (newGrid[r][c].isMine) {
      // Reveal all mines
      newGrid.forEach(row => row.forEach(cell => { if (cell.isMine) cell.isRevealed = true; }));
      setGrid(newGrid);
      setGameOver(true);
      playSound('error');
      return;
    }

    const revealEmpty = (row, col) => {
      if (row < 0 || row >= ROWS || col < 0 || col >= COLS || newGrid[row][col].isRevealed || newGrid[row][col].isFlagged) return;
      newGrid[row][col].isRevealed = true;
      if (newGrid[row][col].neighborMines === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            revealEmpty(row + i, col + j);
          }
        }
      }
    };

    revealEmpty(r, c);
    setGrid(newGrid);

    // Check Win
    let unrevealedSafe = 0;
    newGrid.forEach(row => row.forEach(cell => {
      if (!cell.isMine && !cell.isRevealed) unrevealedSafe++;
    }));
    if (unrevealedSafe === 0) setWin(true);
  };

  return (
    <div className="flex flex-col items-center pt-4 h-full bg-os-gray font-sans select-none overflow-y-auto custom-scrollbar">
      
      {/* Tool/Mode Selector for Mobile */}
      <div className="flex gap-2 mb-4 bg-os-gray p-1 shadow-retro-outset border border-os-dark-gray">
        <button 
          onClick={() => { playSound('click'); setMode('dig'); }}
          className={`retro-btn px-4 py-1 font-bold flex items-center gap-1 ${mode === 'dig' ? 'shadow-retro-inset bg-[#e0e0e0]' : ''}`}
        >
          <span>⛏️</span> Dig
        </button>
        <button 
          onClick={() => { playSound('click'); setMode('flag'); }}
          className={`retro-btn px-4 py-1 font-bold flex items-center gap-1 ${mode === 'flag' ? 'shadow-retro-inset bg-[#e0e0e0]' : ''}`}
        >
          <span>🚩</span> Flag
        </button>
      </div>

      <div className="bg-os-gray shadow-retro-outset border border-os-dark-gray p-2 w-fit">
        
        {/* Header LCD Panel */}
        <div className="flex justify-between items-center bg-os-gray shadow-retro-inset border border-os-dark-gray p-2 mb-2">
          <div className="bg-black text-red-600 font-pixel text-xl px-2 w-12 text-center border border-os-dark-gray shadow-retro-inset leading-none pt-1">
            {flagsLeft.toString().padStart(3, '0')}
          </div>
          <button onClick={() => { playSound('click'); initGrid(); }} className="retro-btn w-8 h-8 flex items-center justify-center text-lg shadow-retro-outset active:shadow-retro-inset">
            {gameOver ? '😵' : win ? '😎' : '🙂'}
          </button>
          <div className="bg-black text-red-600 font-pixel text-xl px-2 w-12 text-center border border-os-dark-gray shadow-retro-inset leading-none pt-1">
            000
          </div>
        </div>

        {/* Minesweeper Grid */}
        <div className="bg-os-dark-gray shadow-retro-inset p-[2px]">
          {grid.map((row, rIdx) => (
            <div key={rIdx} className="flex">
              {row.map((cell, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => handleCellClick(rIdx, cIdx)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center font-bold text-sm
                    ${cell.isRevealed 
                      ? (cell.isMine ? 'bg-red-500 border border-os-dark-gray' : 'bg-os-gray shadow-retro-inset border border-os-dark-gray') 
                      : 'bg-os-gray shadow-retro-outset cursor-pointer'}`}
                >
                  {cell.isRevealed ? (
                    cell.isMine ? '💣' : cell.neighborMines > 0 ? (
                      <span className={['', 'text-blue-600', 'text-green-600', 'text-red-600', 'text-blue-800', 'text-red-800'][cell.neighborMines] || 'text-black'}>
                        {cell.neighborMines}
                      </span>
                    ) : ''
                  ) : cell.isFlagged ? '🚩' : ''}
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MobileMinesweeper;