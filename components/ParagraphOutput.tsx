
import React from 'react';

interface ParagraphOutputProps {
  text: string;
}

export const ParagraphOutput: React.FC<ParagraphOutputProps> = ({ text }) => {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return (
    <div>
        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{text}</p>
        <div className="mt-4 text-right text-xs text-gray-500">
            {wordCount} words
        </div>
    </div>
  );
};
