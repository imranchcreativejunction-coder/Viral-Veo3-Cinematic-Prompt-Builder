
import React, { useState, useCallback } from 'react';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import type { FormState, OutputFormat, Veo3JsonResponse } from './types';
import { generateCinematicPrompt } from './services/geminiService';

const App: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    productName: '',
    description: '',
    preset: 'Logo → Product (Minimal Luxury)',
    aspectRatio: '16:9',
    referenceImageUrl: '',
    outputFormat: 'JSON',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonOutput, setJsonOutput] = useState<Veo3JsonResponse | null>(null);
  const [paragraphOutput, setParagraphOutput] = useState<string>('');

  const handleFormChange = useCallback(<K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormState(prevState => ({ ...prevState, [field]: value }));
  }, []);
  
  const handleOutputFormatChange = (format: OutputFormat) => {
    handleFormChange('outputFormat', format);
  };

  const handleGenerate = async () => {
    if (!formState.productName) {
      setError('Product Name is required.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setJsonOutput(null);
    setParagraphOutput('');

    try {
      const result = await generateCinematicPrompt(formState);
      if (formState.outputFormat === 'JSON') {
        // Attempt to parse the result as JSON
        try {
          const parsedResult = JSON.parse(result);
          setJsonOutput(parsedResult);
        } catch (e) {
            console.error("Failed to parse JSON response:", result);
            setError("Failed to generate a valid JSON response. The model returned malformed data. Please try again.");
        }
      } else {
        setParagraphOutput(result);
      }
    } catch (e) {
      console.error(e);
      setError('An error occurred while generating the prompt. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InputPanel
          formState={formState}
          onFormChange={handleFormChange}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />
        <OutputPanel
          outputFormat={formState.outputFormat}
          onOutputFormatChange={handleOutputFormatChange}
          jsonOutput={jsonOutput}
          paragraphOutput={paragraphOutput}
          isLoading={isLoading}
          error={error}
        />
      </main>
      <Footer />
    </div>
  );
};

export default App;
