import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSound } from '../hooks/useSound';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

const Snake = () => {
  const { playSound } = useSound();
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const boardRef = useRef(null);

  const generateFood = useCallback((currentSnake) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't spawn on the snake
      const onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
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
    if (boardRef.current) boardRef.current.focus();
  };

  const handleKeyDown = useCallback((e) => {
    if (gameOver) return;
    
    // Prevent default scrolling for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (!hasStarted && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      setHasStarted(true);
    }

    switch (e.key) {
      case 'ArrowUp':
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
      case ' ':
      case 'Enter':
        setIsPaused(prev => !prev);
        break;
      default:
        break;
    }
  }, [direction, gameOver, hasStarted]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        // Check Wall Collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          playSound('error');
          setGameOver(true);
          return prevSnake;
        }

        // Check Self Collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          playSound('error');
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          playSound('click'); // Mild sound for eating
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    // Calculate speed based on score (faster as you eat more)
    const currentSpeed = Math.max(50, INITIAL_SPEED - Math.floor(score / 30) * 10);
    const gameLoop = setInterval(moveSnake, currentSpeed);

    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver, isPaused, hasStarted, score, generateFood, playSound]);

  // Focus the board on mount so keyboard events work immediately
  useEffect(() => {
    if (boardRef.current) boardRef.current.focus();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-os-gray font-sans select-none p-4">
      <div className="bg-os-gray shadow-retro-outset border border-os-dark-gray p-4 flex flex-col items-center">
        
        {/* LCD Header */}
        <div className="w-full flex justify-between items-center bg-black border-2 border-os-dark-gray shadow-retro-inset p-2 mb-4 text-[#00ff00] font-pixel text-xl leading-none">
          <div className="flex gap-4">
            <span>SCORE: {score.toString().padStart(4, '0')}</span>
          </div>
          <div className="text-red-500 animate-pulse">
            {gameOver ? 'GAME OVER' : isPaused ? 'PAUSED' : ''}
          </div>
        </div>

        {/* Game Grid Container */}
        <div 
          ref={boardRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="relative bg-[#0a1a0a] border-4 border-os-dark-gray shadow-retro-inset outline-none"
          style={{ 
            width: `${GRID_SIZE * 15}px`, 
            height: `${GRID_SIZE * 15}px`,
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}
        >
          {!hasStarted && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50">
               <span className="text-[#00ff00] font-pixel text-xl text-center bg-black p-2 border border-[#00ff00]">PRESS ARROW KEY<br/>TO START</span>
            </div>
          )}

          {/* Render Grid Cells */}
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.some((seg, idx) => idx !== 0 && seg.x === x && seg.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={index} 
                className={`w-full h-full border-[0.5px] border-[#003300]/30 
                  ${isSnakeHead ? 'bg-[#00ff00] shadow-[0_0_5px_#00ff00]' : 
                    isSnakeBody ? 'bg-[#00cc00]' : 
                    isFood ? 'bg-red-500 rounded-full animate-pulse' : 'bg-transparent'}`
                }
              />
            );
          })}
        </div>

        <div className="mt-4 flex gap-4 w-full justify-between">
          <button onClick={resetGame} className="retro-btn px-4 py-1 font-bold text-xs">
            Restart
          </button>
          <button onClick={() => { playSound('click'); setIsPaused(!isPaused); }} className="retro-btn px-4 py-1 font-bold text-xs">
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Snake;