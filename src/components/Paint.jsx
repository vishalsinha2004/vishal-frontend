import React, { useRef, useState, useEffect } from 'react';
import { useSound } from '../hooks/useSound';
import { pencilIcon, eraserIcon, fillIcon, lineIcon, rectIcon, clearIcon, floppyIcon } from '../utils/icons';

const CLASSIC_COLORS = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'
];

const TOOLS = [
  { id: 'pencil', icon: pencilIcon, name: 'Pencil' },
  { id: 'eraser', icon: eraserIcon, name: 'Eraser' },
  { id: 'fill', icon: fillIcon, name: 'Fill' },
  { id: 'line', icon: lineIcon, name: 'Line' },
  { id: 'rect', icon: rectIcon, name: 'Rectangle' },
];

const Paint = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  
  const [activeTool, setActiveTool] = useState('pencil');
  const [activeColor, setActiveColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState(null);
  
  const { playSound } = useSound();

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 600; 
    canvas.height = 400;
    
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.lineCap = 'square';
    context.lineJoin = 'miter';
    context.lineWidth = 2;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    contextRef.current = context;
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = activeTool === 'eraser' ? '#ffffff' : activeColor;
      contextRef.current.fillStyle = activeColor;
      contextRef.current.lineWidth = activeTool === 'eraser' ? 8 : 2;
    }
  }, [activeColor, activeTool]);

  const hexToRgba = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b, 255];
  };

  const floodFill = (startX, startY, fillColorHex) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    const startPos = (startY * canvas.width + startX) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];
    const startA = data[startPos + 3];

    const [fillR, fillG, fillB, fillA] = hexToRgba(fillColorHex);

    if (startR === fillR && startG === fillG && startB === fillB && startA === fillA) return;

    const matchStartColor = (pos) => {
      return data[pos] === startR && data[pos + 1] === startG && data[pos + 2] === startB && data[pos + 3] === startA;
    };

    const colorPixel = (pos) => {
      data[pos] = fillR;
      data[pos + 1] = fillG;
      data[pos + 2] = fillB;
      data[pos + 3] = fillA;
    };

    const pixelStack = [[startX, startY]];

    while (pixelStack.length) {
      const newPos = pixelStack.pop();
      const x = newPos[0];
      let y = newPos[1];

      let pixelPos = (y * canvas.width + x) * 4;
      
      while (y-- >= 0 && matchStartColor(pixelPos)) {
        pixelPos -= canvas.width * 4;
      }
      pixelPos += canvas.width * 4;
      ++y;

      let reachLeft = false;
      let reachRight = false;

      while (y++ < canvas.height - 1 && matchStartColor(pixelPos)) {
        colorPixel(pixelPos);

        if (x > 0) {
          if (matchStartColor(pixelPos - 4)) {
            if (!reachLeft) {
              pixelStack.push([x - 1, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }

        if (x < canvas.width - 1) {
          if (matchStartColor(pixelPos + 4)) {
            if (!reachRight) {
              pixelStack.push([x + 1, y]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }
        pixelPos += canvas.width * 4;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    
    if (activeTool === 'fill') {
      floodFill(offsetX, offsetY, activeColor);
      return;
    }

    setSnapshot(contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setStartPos({ x: offsetX, y: offsetY });
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    if (activeTool !== 'fill') {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const ctx = contextRef.current;

    if (activeTool === 'pencil' || activeTool === 'eraser') {
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    } else if (activeTool === 'line' || activeTool === 'rect') {
      ctx.putImageData(snapshot, 0, 0);
      ctx.beginPath();
      
      if (activeTool === 'line') {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
      } else if (activeTool === 'rect') {
        const width = offsetX - startPos.x;
        const height = offsetY - startPos.y;
        ctx.strokeRect(startPos.x, startPos.y, width, height);
      }
    }
  };

  const clearCanvas = () => {
    playSound('click');
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = activeColor;
  };

  const saveCanvas = () => {
    playSound('click');
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'untitled.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-os-gray font-sans select-none border border-os-dark-gray shadow-retro-inset overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-12 bg-os-gray border-r border-os-dark-gray shadow-[1px_0_0_#dfdfdf] p-1 flex flex-col gap-1 items-center z-10 pt-2">
          <div className="grid grid-cols-2 gap-1 w-full">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                title={tool.name}
                onClick={() => { playSound('click'); setActiveTool(tool.id); }}
                className={`w-5 h-5 flex items-center justify-center outline-none
                  ${activeTool === tool.id 
                    ? 'shadow-retro-inset bg-os-dark-gray/20' 
                    : 'shadow-retro-outset bg-os-gray hover:bg-os-gray active:shadow-retro-inset'}`}
              >
                <img src={tool.icon} alt={tool.name} className="w-3.5 h-3.5 object-contain" style={{ imageRendering: 'pixelated' }} />
              </button>
            ))}
          </div>
          <div className="w-full border-t border-os-dark-gray border-b border-white my-1"></div>
          {/* Action Buttons */}
          <button title="Clear Canvas" onClick={clearCanvas} className="w-10 h-6 flex justify-center items-center shadow-retro-outset active:shadow-retro-inset mb-1">
            <img src={clearIcon} alt="Clear" className="w-4 h-4 object-contain" style={{ imageRendering: 'pixelated' }} />
          </button>
          <button title="Save Image" onClick={saveCanvas} className="w-10 h-6 flex justify-center items-center shadow-retro-outset active:shadow-retro-inset">
            <img src={floppyIcon} alt="Save" className="w-4 h-4 object-contain" style={{ imageRendering: 'pixelated' }} />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-[#808080] p-1 overflow-auto custom-scrollbar shadow-retro-inset">
          <div className="bg-white border border-os-dark-gray shadow-retro-outset inline-block">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseUp={finishDrawing}
              onMouseMove={draw}
              onMouseOut={finishDrawing}
              className="cursor-crosshair block"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Color Palette */}
      <div className="h-10 bg-os-gray border-t border-os-dark-gray shadow-[0_-1px_0_#dfdfdf] flex items-center px-2 gap-2 shrink-0 z-10 relative">
        <div className="w-8 h-8 shadow-retro-inset flex items-center justify-center bg-os-gray shrink-0 relative">
           <div className="absolute w-4 h-4 shadow-retro-inset" style={{ backgroundColor: '#ffffff', top: '4px', left: '4px' }}></div>
           <div className="absolute w-4 h-4 shadow-retro-inset" style={{ backgroundColor: activeColor, top: '12px', left: '12px' }}></div>
        </div>
        
        <div className="flex flex-wrap gap-[1px] w-64 h-7">
          {CLASSIC_COLORS.map((color) => (
            <div
              key={color}
              onClick={() => { playSound('click'); setActiveColor(color); }}
              className={`w-[14px] h-[14px] shadow-retro-inset cursor-pointer ${activeColor === color ? 'ring-1 ring-white' : ''}`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Paint;