import React, { useState, useRef, useEffect } from 'react';

const Terminal = () => {
  // Track the history of inputs and outputs
  const [history, setHistory] = useState([
    { type: 'output', text: 'SpaceX OS Terminal v1.0.0 initialized.' },
    { type: 'output', text: 'Type "help" to see a list of available commands.' }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  // Auto-scroll to the bottom whenever history updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      
      // Add the user's input to the history log
      const newHistory = [...history, { type: 'input', text: `root@spacex-os:~$ ${input}` }];
      
      // Handle the 'clear' command specially
      if (cmd === 'clear') {
        setHistory([]);
        setInput('');
        return;
      }

      let output = '';
      
      // Command routing logic
      switch (cmd) {
        case 'help':
          output = 'Available commands: help, clear, whoami, date, echo [text]';
          break;
        case 'whoami':
          output = 'Vishal Sinha - System Administrator';
          break;
        case 'date':
          output = new Date().toString();
          break;
        default:
          if (cmd.startsWith('echo ')) {
            output = input.substring(5); // Print whatever is after 'echo '
          } else if (cmd !== '') {
            output = `Command not found: ${cmd}`;
          }
      }

      // If there is an output, append it to the history
      if (output) {
        newHistory.push({ type: 'output', text: output });
      }

      setHistory(newHistory);
      setInput(''); // Clear the input field
    }
  };

  return (
    <div 
      className="h-full w-full bg-[#050505] text-green-400 font-mono text-sm p-4 overflow-y-auto flex flex-col cursor-text"
      onClick={() => document.getElementById('terminal-input').focus()}
    >
      {/* Render Command History */}
      {history.map((line, index) => (
        <div key={index} className={line.type === 'input' ? 'text-thruster-glow' : 'text-green-400 mb-2'}>
          {line.text}
        </div>
      ))}
      
      {/* Active Input Line */}
      <div className="flex mt-1">
        <span className="text-thruster-glow mr-2">root@spacex-os:~$</span>
        <input
          id="terminal-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className="flex-1 bg-transparent outline-none border-none text-green-400 shadow-none ring-0"
          autoComplete="off"
          spellCheck="false"
          autoFocus
        />
      </div>
      
      {/* Invisible div to anchor the auto-scroll */}
      <div ref={bottomRef} />
    </div>
  );
};

export default Terminal;