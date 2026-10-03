import React, { useRef, useState, useEffect } from 'react';
import { useSound } from '../hooks/useSound';

const colors = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'
];

const MobilePaint = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [isEraser, setIsEraser] = useState(false);
  const { playSound } = useSound();

  // Initialize canvas size to match its responsive container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && canvas.parentElement) {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, []);

  const getCoordinates = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e) => {
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = isEraser ? 16 : 3;
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.closePath();
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    playSound('click');
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="flex flex-col h-full bg-os-gray text-black font-sans w-full select-none">
      
      {/* Mobile-Optimized Toolbar */}
      <div className="flex flex-col gap-2 p-1.5 bg-os-gray border-b border-os-dark-gray shrink-0 shadow-retro-inset">
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            <button 
              onClick={() => { playSound('click'); setIsEraser(false); }}
              className={`retro-btn px-3 py-1 text-xs font-bold ${!isEraser ? 'shadow-retro-inset bg-[#e0e0e0]' : 'shadow-retro-outset'}`}
            >
              Draw
            </button>
            <button 
              onClick={() => { playSound('click'); setIsEraser(true); }}
              className={`retro-btn px-3 py-1 text-xs font-bold ${isEraser ? 'shadow-retro-inset bg-[#e0e0e0]' : 'shadow-retro-outset'}`}
            >
              Erase
            </button>
          </div>
          <button 
            onClick={clearCanvas}
            className="retro-btn px-3 py-1 text-xs text-black shadow-retro-outset active:shadow-retro-inset"
          >
            Clear
          </button>
        </div>
        
        {/* Compact 16-Color Palette */}
        <div className="flex flex-wrap gap-[1px] p-[2px] bg-white border border-os-dark-gray shadow-retro-inset w-fit self-center">
          {colors.map(c => (
            <div 
              key={c}
              onClick={() => { playSound('click'); setColor(c); setIsEraser(false); }}
              className={`w-5 h-5 border-2 cursor-pointer ${color === c && !isEraser ? 'border-black' : 'border-os-gray shadow-retro-outset'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-os-dark-gray p-1 overflow-hidden flex">
        <div className="flex-1 bg-white shadow-retro-inset border border-black relative">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            onTouchCancel={stopDrawing}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
            style={{ touchAction: 'none' }} // <-- CRITICAL: Prevents mobile pull-to-refresh & scrolling
          />
        </div>
      </div>
    </div>
  );
};

export default MobilePaint;