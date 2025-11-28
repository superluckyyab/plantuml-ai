import React from 'react';

interface EditorProps {
  code: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const Editor: React.FC<EditorProps> = ({ code, onChange, disabled }) => {
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-r border-gray-700">
      <div className="px-4 py-2 bg-[#252526] text-xs font-mono text-gray-400 border-b border-gray-700 flex justify-between items-center select-none">
        <span>EDITOR.puml</span>
        <span className={disabled ? "text-yellow-500" : "text-green-500"}>
          {disabled ? "AI Generating..." : "Ready"}
        </span>
      </div>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        spellCheck={false}
        className="flex-1 w-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm p-4 resize-none outline-none focus:bg-[#262626] transition-colors leading-relaxed"
        placeholder="@startuml\n\n@enduml"
      />
    </div>
  );
};

export default Editor;
