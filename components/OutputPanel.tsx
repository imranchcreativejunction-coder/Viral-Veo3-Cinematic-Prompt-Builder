
import React, { useEffect } from 'react';
import type { Veo3JsonResponse, OutputFormat } from '../types';
import { JsonOutput } from './JsonOutput';
import { ParagraphOutput } from './ParagraphOutput';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { CopyIcon } from './icons/CopyIcon';
import { DownloadIcon } from './icons/DownloadIcon';

declare global {
    interface Window {
        Prism: any;
    }
}

interface OutputPanelProps {
    outputFormat: OutputFormat;
    onOutputFormatChange: (format: OutputFormat) => void;
    jsonOutput: Veo3JsonResponse | null;
    paragraphOutput: string;
    isLoading: boolean;
    error: string | null;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ outputFormat, onOutputFormatChange, jsonOutput, paragraphOutput, isLoading, error }) => {
    
    useEffect(() => {
        if (outputFormat === 'JSON' && jsonOutput && window.Prism) {
            window.Prism.highlightAll();
        }
    }, [jsonOutput, outputFormat]);

    const handleCopy = () => {
        const textToCopy = outputFormat === 'JSON' 
            ? JSON.stringify(jsonOutput, null, 2) 
            : paragraphOutput;
        navigator.clipboard.writeText(textToCopy);
    };

    const handleDownload = () => {
        const textToDownload = outputFormat === 'JSON' 
            ? JSON.stringify(jsonOutput, null, 2) 
            : paragraphOutput;
        const filename = outputFormat === 'JSON' ? 'prompt.json' : 'narrative.txt';
        const blob = new Blob([textToDownload], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const hasOutput = jsonOutput || paragraphOutput;

    return (
        <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 flex flex-col">
            <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
                <div className="flex gap-2 bg-gray-700/50 p-1 rounded-md">
                    <button
                        onClick={() => onOutputFormatChange('JSON')}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${outputFormat === 'JSON' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-600/50'}`}
                    >
                        JSON
                    </button>
                    <button
                        onClick={() => onOutputFormatChange('Paragraph')}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${outputFormat === 'Paragraph' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-600/50'}`}
                    >
                        Paragraph
                    </button>
                </div>
                {hasOutput && !isLoading && (
                    <div className="flex gap-2">
                        <button onClick={handleCopy} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"><CopyIcon /></button>
                        <button onClick={handleDownload} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"><DownloadIcon /></button>
                    </div>
                )}
            </div>
            <div className="p-6 flex-grow relative overflow-auto" style={{minHeight: '400px'}}>
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/80 z-10">
                        <SpinnerIcon />
                        <p className="mt-4 text-gray-300">Generating cinematic brilliance...</p>
                    </div>
                )}
                {error && (
                    <div className="text-red-400 bg-red-900/50 p-4 rounded-md">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}
                {!isLoading && !error && !hasOutput && (
                    <div className="text-center text-gray-500 h-full flex items-center justify-center">
                        <p>Your generated prompt will appear here.</p>
                    </div>
                )}
                {!isLoading && !error && (
                    outputFormat === 'JSON' 
                        ? jsonOutput && <JsonOutput json={jsonOutput} />
                        : paragraphOutput && <ParagraphOutput text={paragraphOutput} />
                )}
            </div>
        </div>
    );
};
