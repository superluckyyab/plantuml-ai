import React, { useState, useEffect } from 'react';
import Editor from './components/Editor';
import ChatPanel from './components/ChatPanel';
import Preview from './components/Preview';
import { encodePlantUML } from './utils/plantuml';
import { generatePlantUML } from './services/gemini';
import { ChatMessage } from './types';

const INITIAL_CODE = `@startuml
title Welcome to AI Architect

actor User
participant "Web App" as App
participant "Gemini AI" as AI
participant "PlantUML Server" as PlantUML

User -> App: Writes Code or Prompt
activate App

alt Manual Edit
    App -> App: Update State
else AI Prompt
    App -> AI: Send Code + Prompt
    activate AI
    AI --> App: Return Updated Code
    deactivate AI
end

App -> App: Encode (Deflate + B64)
App -> PlantUML: Request SVG
activate PlantUML
PlantUML --> App: Return Image
deactivate PlantUML

App --> User: Show Diagram
deactivate App

@enduml`;

function App() {
  const [code, setCode] = useState<string>(INITIAL_CODE);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isImagePending, setIsImagePending] = useState(false);

  // Debounced Image Generation
  useEffect(() => {
    setIsImagePending(true);
    const timer = setTimeout(async () => {
      try {
        const url = await encodePlantUML(code);
        setImageUrl(url);
      } catch (e) {
        console.error("Encoding error", e);
      } finally {
        setIsImagePending(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [code]);

  const handleAiRequest = async (prompt: string) => {
    // Add user message to history
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: Date.now(),
    };
    setHistory((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const newCode = await generatePlantUML(code, prompt);
      setCode(newCode);
      // We do not add an AI text response to history, as requested.
    } catch (error) {
      console.error(error);
      // Optional: Add a system error message to the log if needed, 
      // but for now we'll just keep the UI clean as per "No need to see AI reply"
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-white font-sans selection:bg-blue-500 selection:text-white overflow-hidden">
      {/* Left Sidebar (Editor + Chat) */}
      <div className="w-[400px] lg:w-[500px] flex flex-col border-r border-gray-700 flex-shrink-0 z-20 shadow-xl bg-[#1e1e1e]">
        {/* Top: Editor (70%) */}
        <div className="h-[70%] flex flex-col border-b border-gray-700">
          <Editor 
            code={code} 
            onChange={setCode} 
            disabled={isAiLoading}
          />
        </div>
        
        {/* Bottom: Chat (30%) */}
        <div className="h-[30%] min-h-[150px] flex flex-col">
          <ChatPanel 
            onSendMessage={handleAiRequest} 
            isLoading={isAiLoading}
            history={history}
          />
        </div>
      </div>

      {/* Right Main (Preview) */}
      <div className="flex-1 h-full bg-[#1e1e1e] relative overflow-hidden">
        <Preview url={imageUrl} isStale={isImagePending || isAiLoading} />
        
        {/* Loading Overlay */}
        {!imageUrl && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 pointer-events-none">
                Rendering...
            </div>
        )}
      </div>
    </div>
  );
}

export default App;