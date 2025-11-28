import React, { useState } from 'react';

interface PreviewProps {
  url: string;
  isStale: boolean;
}

const Preview: React.FC<PreviewProps> = ({ url, isStale }) => {
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Zoom in/out based on wheel direction
    // Delta Y is positive when scrolling down (pulling content up), negative when scrolling up
    const scaleAmount = 0.1;
    const direction = e.deltaY > 0 ? -1 : 1;
    const newZoom = Math.min(Math.max(0.1, zoom + direction * scaleAmount), 5);
    setZoom(newZoom);
  };

  const resetView = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] overflow-hidden relative">
       {/* Toolbar */}
       <div className="absolute top-4 right-4 z-10 flex gap-2 bg-[#252526] p-1 rounded shadow-lg border border-gray-700 select-none">
          <button onClick={() => setZoom(z => Math.max(0.1, z - 0.1))} className="p-2 hover:bg-gray-700 rounded text-gray-300">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
               <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
             </svg>
          </button>
          <span className="p-2 text-xs font-mono text-gray-400 flex items-center min-w-[3rem] justify-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(5, z + 0.1))} className="p-2 hover:bg-gray-700 rounded text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
          <div className="w-px bg-gray-700 mx-1"></div>
          <button onClick={resetView} className="p-2 hover:bg-gray-700 rounded text-gray-300" title="Reset View">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
             </svg>
          </button>
       </div>

       {/* Canvas */}
      <div 
        className="flex-1 w-full h-full overflow-hidden cursor-move flex items-center justify-center bg-[#1e1e1e]"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div 
            style={{ 
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
            className={`origin-center ${isStale ? 'opacity-50 grayscale' : 'opacity-100'} transition-opacity duration-300`}
        >
          {url ? (
            <img 
                src={url} 
                alt="PlantUML Diagram" 
                draggable={false}
                className="max-w-none shadow-2xl bg-white p-4 rounded select-none"
            />
          ) : (
            <div className="text-gray-500 font-mono text-sm select-none">No code to render</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;