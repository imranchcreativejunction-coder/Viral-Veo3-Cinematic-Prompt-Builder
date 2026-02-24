
export type OutputFormat = 'JSON' | 'Paragraph';
export type AspectRatio = '16:9' | '9:16' | '1:1';

export interface Preset {
  name: string;
  description: string;
  thumbnail: string;
}

export interface FormState {
  productName: string;
  description: string;
  preset: string;
  aspectRatio: AspectRatio;
  referenceImageUrl: string;
  outputFormat: OutputFormat;
}

export interface Shot {
  time: string;
  visual: string;
  sfx: string;
  music: string;
}

export interface Veo3JsonResponse {
  title: string;
  product: string;
  aspect_ratio: string;
  duration: string;
  style: string;
  description: string;
  reference_image: string;
  negative_prompts: string;
  shots: Shot[];
}
