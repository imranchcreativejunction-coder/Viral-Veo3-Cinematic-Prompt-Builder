
import React from 'react';
import type { FormState } from '../types';
import { PRESETS, ASPECT_RATIOS } from '../constants';
import { Select, TextInput, Textarea, Button } from './FormControls';

interface InputPanelProps {
  formState: FormState;
  onFormChange: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({ formState, onFormChange, onGenerate, isLoading }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 flex flex-col gap-6 h-fit">
      <TextInput
        label="Product Name"
        id="productName"
        value={formState.productName}
        onChange={(e) => onFormChange('productName', e.target.value)}
        placeholder="e.g., Aurora Brew"
        required
      />
      <Textarea
        label="Product Description (Optional)"
        id="description"
        value={formState.description}
        onChange={(e) => onFormChange('description', e.target.value)}
        placeholder="e.g., A refreshing lavender mint drink. Auto-expands if brief."
        rows={3}
      />
      <Select
        label="Preset Style"
        id="preset"
        value={formState.preset}
        onChange={(e) => onFormChange('preset', e.target.value)}
        options={PRESETS.map(p => ({ value: p.name, label: p.name }))}
        // Tooltip functionality can be added with a library or custom CSS
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Aspect Ratio"
          id="aspectRatio"
          value={formState.aspectRatio}
          onChange={(e) => onFormChange('aspectRatio', e.target.value as FormState['aspectRatio'])}
          options={ASPECT_RATIOS.map(ar => ({ value: ar, label: ar }))}
        />
        <TextInput
          label="Reference Image URL (Optional)"
          id="referenceImageUrl"
          value={formState.referenceImageUrl}
          onChange={(e) => onFormChange('referenceImageUrl', e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      <Button onClick={onGenerate} disabled={isLoading || !formState.productName}>
        {isLoading ? 'Generating...' : 'Generate Prompt'}
      </Button>
    </div>
  );
};
