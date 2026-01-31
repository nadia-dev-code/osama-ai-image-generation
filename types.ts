
export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export type ImageSize = '1K' | '2K' | '4K';
export type ModelType = 'gemini-2.5-flash-image' | 'gemini-3-pro-image-preview';

export interface GeneratedMedia {
  id: string;
  url: string;
  prompt: string;
  negativePrompt?: string;
  aspectRatio: AspectRatio;
  timestamp: number;
  model: string;
}

export interface GenerationSettings {
  prompt: string;
  negativePrompt?: string;
  aspectRatio: AspectRatio;
  model: ModelType;
  imageSize?: ImageSize;
}
