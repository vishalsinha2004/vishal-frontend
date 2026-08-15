import React from 'react';

const Finder = () => {
  const files = [
    { name: 'index.html', size: '12 KB', type: 'HTML' },
    { name: 'styles.css', size: '45 KB', type: 'Tailwind CSS' },
    { name: 'database.rules', size: '2 KB', type: 'Firebase' },
    { name: 'app_config.json', size: '1 KB', type: 'Config' }
  ];

  return (
    <div className="flex flex-col h-full bg-space-dark">
      <div className="grid grid-cols-4 gap-4 font-bold text-gray-400 border-b border-space-gray pb-2 mb-4 px-2">
        <div className="col-span-2">Name</div>
        <div>Type</div>
        <div>Size</div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {files.map((file, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-4 text-space-white hover:bg-space-gray p-2 rounded cursor-pointer transition-colors">
            <div className="col-span-2 flex items-center gap-2">
              <span>📄</span> {file.name}
            </div>
            <div className="text-gray-400 text-sm flex items-center">{file.type}</div>
            <div className="text-gray-400 text-sm flex items-center">{file.size}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Finder;