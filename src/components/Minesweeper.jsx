import React, { useState, useEffect, useCallback } from 'react';
import { useSound } from '../hooks/useSound';

const ROWS = 9;
const COLS = 9;
const MINES = 10;

const createBoard = () => {
  let board = Array(ROWS).fill(null).map(() => 
    Array(COLS).fill(null).map(() => ({ isMine: false, isRevealed: false, isFlagged: false, neighborMines: 0 }))
  );

  let minesPlaced = 0;
  while (minesPlaced < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!board[r][c].isMine) {
      board[r][c].isMine = true;
      minesPlaced++;
    }
  }

  const getNeighbors = (r, c) => {
    const neighbors = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newR = r + i, newC = c + j;
        if (newR >= 0 && newR < ROWS && newC >= 0 && newC < COLS) {
          neighbors.push([newR, newC]);
        }
      }
    }
    return neighbors;
  };

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!board[r][c].isMine) {
        let count = 0;
        getNeighbors(r, c).forEach(([nr, nc]) => {
          if (board[nr][nc].isMine) count++;
        });
        board[r][c].neighborMines = count;
      }
    }
  }

  return board;
};

const Minesweeper = () => {
  const [board, setBoard] = useState(createBoard());
  const [status, setStatus] = useState('playing'); // playing, won, lost
  const [flags, setFlags] = useState(MINES);
  const [time, setTime] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const { playSound } = useSound();

  useEffect(() => {
    let timer;
    if (status === 'playing' && time < 999) {
      timer = setInterval(() => setTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [status, time]);

  const checkWinCondition = (currentBoard) => {
    let unrevealedSafeCells = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!currentBoard[r][c].isMine && !currentBoard[r][c].isRevealed) {
          unrevealedSafeCells++;
        }
      }
    }
    if (unrevealedSafeCells === 0) {
      setStatus('won');
      playSound('notification');
    }
  };

  const revealCell = (r, c) => {
    if (status !== 'playing' || board[r][c].isRevealed || board[r][c].isFlagged) return;

    let newBoard = [...board.map(row => [...row])];
    
    if (newBoard[r][c].isMine) {
      // Game Over
      newBoard[r][c].isRevealed = true;
      setStatus('lost');
      playSound('error');
      // Reveal all mines
      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          if (newBoard[i][j].isMine) newBoard[i][j].isRevealed = true;
        }
      }
      setBoard(newBoard);
      return;
    }

    // Flood fill algorithm to reveal empty spaces
    playSound('click');
    const floodFill = (row, col) => {
      const stack = [[row, col]];
      while (stack.length > 0) {
        const [currR, currC] = stack.pop();
        if (newBoard[currR][currC].isRevealed || newBoard[currR][currC].isFlagged) continue;
        
        newBoard[currR][currC].isRevealed = true;
        
        if (newBoard[currR][currC].neighborMines === 0) {
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const nr = currR + i, nc = currC + j;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !newBoard[nr][nc].isRevealed) {
                stack.push([nr, nc]);
              }
            }
          }
        }
      }
    };

    floodFill(r, c);
    setBoard(newBoard);
    checkWinCondition(newBoard);
  };

  const toggleFlag = (e, r, c) => {
    e.preventDefault();
    if (status !== 'playing' || board[r][c].isRevealed) return;
    
    playSound('click');
    let newBoard = [...board.map(row => [...row])];
    const isCurrentlyFlagged = newBoard[r][c].isFlagged;
    
    newBoard[r][c].isFlagged = !isCurrentlyFlagged;
    setFlags(prev => isCurrentlyFlagged ? prev + 1 : prev - 1);
    setBoard(newBoard);
  };

  const resetGame = () => {
    playSound('button');
    setBoard(createBoard());
    setStatus('playing');
    setFlags(MINES);
    setTime(0);
  };

  const formatNumber = (num) => Math.max(0, num).toString().padStart(3, '0');

  const getNumberColor = (num) => {
    const colors = ['transparent', '#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000000', '#808080'];
    return colors[num];
  };

  return (
    <div 
      className="flex flex-col h-full bg-os-gray font-sans select-none items-center justify-center p-2"
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => setIsMouseDown(false)}
    >
      <div className="bg-os-gray border-[3px] border-os-white shadow-retro-inset p-2">
        
        {/* Scoreboard Header */}
        <div className="bg-os-gray shadow-retro-inset border-2 border-os-dark-gray h-10 mb-2 flex items-center justify-between px-1.5 pt-1 pb-1">
          <div className="bg-black text-red-600 font-pixel text-2xl px-1 w-12 text-center leading-none border border-os-dark-gray shadow-retro-inset">
            {formatNumber(flags)}
          </div>
          
          <button 
            onClick={resetGame} 
            className="w-8 h-8 flex items-center justify-center shadow-retro-outset active:shadow-retro-inset text-xl bg-os-gray outline-none"
          >
            {status === 'won' ? '😎' : status === 'lost' ? '😵' : isMouseDown ? '😮' : '🙂'}
          </button>
          
          <div className="bg-black text-red-600 font-pixel text-2xl px-1 w-12 text-center leading-none border border-os-dark-gray shadow-retro-inset">
            {formatNumber(time)}
          </div>
        </div>

        {/* Game Grid */}
        <div 
          className="bg-os-gray shadow-retro-inset border-2 border-os-dark-gray"
          onMouseDown={() => { if (status === 'playing') setIsMouseDown(true); }}
        >
          {board.map((row, r) => (
            <div key={r} className="flex">
              {row.map((cell, c) => (
                <div 
                  key={`${r}-${c}`}
                  onMouseUp={() => revealCell(r, c)}
                  onContextMenu={(e) => toggleFlag(e, r, c)}
                  className={`w-5 h-5 flex items-center justify-center text-sm font-bold leading-none select-none
                    ${cell.isRevealed 
                      ? 'bg-os-white border border-os-dark-gray shadow-retro-inset' 
                      : 'bg-os-gray shadow-retro-outset hover:bg-gray-200'
                    }`}
                  style={{ color: cell.isRevealed && cell.neighborMines > 0 ? getNumberColor(cell.neighborMines) : 'black' }}
                >
                  {cell.isRevealed ? (
                    cell.isMine ? (status === 'won' ? '🚩' : '💣') : (cell.neighborMines > 0 ? cell.neighborMines : '')
                  ) : (
                    cell.isFlagged ? '🚩' : ''
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Minesweeper;