
import React from 'react';

export const Footer: React.FC = () => (
  <footer className="bg-gray-900 border-t border-gray-800/50">
    <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-500">
      <p>Powered by Google Gemini | Compatible with Veo 3 video generation.</p>
      <a href="#" className="mt-1 inline-block text-indigo-400 hover:text-indigo-300 transition-colors">
        How to use your prompt in Veo 3
      </a>
    </div>
  </footer>
);
