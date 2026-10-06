import React, { useState } from 'react';
import { useSound } from '../hooks/useSound';

const MobileNotepad = () => {
  const [text, setText] = useState('');
  const { playSound } = useSound();

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full h-full bg-white text-black font-sans">
      {/* Main Text Area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 min-h-0 w-full p-2 outline-none resize-none text-sm font-sans custom-scrollbar"
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
};

export default MobileNotepad;