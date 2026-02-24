
import React from 'react';
import type { Veo3JsonResponse } from '../types';

interface JsonOutputProps {
  json: Veo3JsonResponse;
}

export const JsonOutput: React.FC<JsonOutputProps> = ({ json }) => {
  return (
    <pre className="language-json !bg-transparent !p-0 !text-sm !shadow-none">
      <code className="language-json">
        {JSON.stringify(json, null, 2)}
      </code>
    </pre>
  );
};
