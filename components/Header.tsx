
import React from 'react';

export const Header: React.FC = () => (
  <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
    <div className="container mx-auto px-4 py-4 text-center">
      <h1 className="text-3xl font-bold text-white tracking-tight">
        Viral Veo 3 <span className="text-indigo-400">– Cinematic Prompt Builder</span>
      </h1>
      <p className="mt-2 text-md text-gray-400">
        Generate studio-quality Veo 3 JSON prompts or cinematic narratives in seconds.
      </p>
    </div>
  </header>
);
