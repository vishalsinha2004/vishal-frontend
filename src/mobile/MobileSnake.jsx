import React, { useState, useEffect, useCallback } from 'react';
import { useSound } from '../hooks/useSound';

const GRID_SIZE = 15; // Slightly smaller grid for mobile visibility
const INITIAL_SNAKE = [{ x: 7, y: 7 }, { x: 7, y: 8 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 180;

const MobileSnake = () => {
  const { playSound } = useSound();
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 3, y: 3 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const generateFood = useCallback((currentSnake) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    playSound('click');
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    setHasStarted(false);
  };

  const handleDPad = (newDirStr) => {
    if (gameOver || isPaused) return;
    if (!hasStarted) setHasStarted(true);
    playSound('click');

    switch (newDirStr) {
      case 'UP':
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case 'DOWN':
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case 'LEFT':
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case 'RIGHT':
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        // Wall Collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          playSound('error');
          setGameOver(true);
          return prevSnake;
        }

        // Self Collision
        if (prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          playSound('error');
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const currentSpeed = Math.max(60, INITIAL_SPEED - Math.floor(score / 30) * 10);
    const gameLoop = setInterval(moveSnake, currentSpeed);
    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver, isPaused, hasStarted, score, generateFood, playSound]);

  return (
    <div className="flex flex-col items-center flex-1 min-h-0 w-full bg-os-gray font-sans select-none overflow-y-auto custom-scrollbar p-2 pb-6">
      
      {/* LCD Header */}
      <div className="w-full max-w-[340px] shrink-0 flex justify-between items-center bg-black border-2 border-os-dark-gray shadow-retro-inset p-2 mb-2 text-[#00ff00] font-pixel text-lg leading-none mt-2">
        <span>SCORE: {score.toString().padStart(4, '0')}</span>
        <span className="text-red-500 animate-pulse">{gameOver ? 'GAME OVER' : ''}</span>
      </div>

      {/* Game Grid Container */}
      <div 
        className="w-full max-w-[340px] shrink-0 aspect-square bg-[#0a1a0a] border-4 border-os-dark-gray shadow-retro-inset relative"
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/60">
             <span className="text-[#00ff00] font-pixel text-xl text-center">TAP D-PAD<br/>TO START</span>
          </div>
        )}

        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.some((seg, idx) => idx !== 0 && seg.x === x && seg.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div 
              key={index} 
              className={`w-full h-full border-[0.5px] border-[#003300]/20
                ${isSnakeHead ? 'bg-[#00ff00]' : isSnakeBody ? 'bg-[#00cc00]' : isFood ? 'bg-red-500 rounded-full' : 'bg-transparent'}`
              }
            />
          );
        })}
      </div>

      {/* Action Controls */}
      <div className="flex w-full max-w-[340px] shrink-0 justify-between mt-3 gap-2">
        <button onClick={resetGame} className="retro-btn flex-1 py-2 font-bold text-xs">RESTART</button>
        <button onClick={() => { playSound('click'); setIsPaused(!isPaused); }} className="retro-btn flex-1 py-2 font-bold text-xs text-red-700">
          {isPaused ? 'RESUME' : 'PAUSE'}
        </button>
      </div>

      {/* Mobile D-Pad Control Grid */}
      <div className="mt-4 shrink-0 grid grid-cols-3 grid-rows-3 gap-1 w-[200px] h-[200px] bg-os-gray p-2 shadow-retro-outset border border-os-dark-gray rounded-full touch-manipulation">
        <div />
        <button onClick={() => handleDPad('UP')} className="retro-btn text-xl font-bold rounded-t-lg active:bg-[#e0e0e0] shadow-retro-outset active:shadow-retro-inset flex items-center justify-center pb-1">▲</button>
        <div />
        
        <button onClick={() => handleDPad('LEFT')} className="retro-btn text-xl font-bold rounded-l-lg active:bg-[#e0e0e0] shadow-retro-outset active:shadow-retro-inset flex items-center justify-center pr-1">◀</button>
        <div className="bg-[#808080] rounded-full shadow-retro-inset m-2 flex items-center justify-center border border-[#606060]">
           <div className="w-4 h-4 bg-os-gray rounded-full shadow-retro-outset"></div>
        </div>
        <button onClick={() => handleDPad('RIGHT')} className="retro-btn text-xl font-bold rounded-r-lg active:bg-[#e0e0e0] shadow-retro-outset active:shadow-retro-inset flex items-center justify-center pl-1">▶</button>
        
        <div />
        <button onClick={() => handleDPad('DOWN')} className="retro-btn text-xl font-bold rounded-b-lg active:bg-[#e0e0e0] shadow-retro-outset active:shadow-retro-inset flex items-center justify-center pt-1">▼</button>
        <div />
      </div>

    </div>
  );
};

export default MobileSnake;