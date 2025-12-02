export type WindowWithAI = Omit<Window, 'aistudio'> & {
  aistudio?: {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  };
};

export enum AspectRatio {
  SQUARE = "1:1",
  PORTRAIT = "3:4",
  LANDSCAPE = "4:3",
  WIDE_PORTRAIT = "9:16",
  WIDE_LANDSCAPE = "16:9",
}

export enum ImageResolution {
  RES_1K = "1K",
  RES_2K = "2K",
  RES_4K = "4K",
  RES_8K = "8K",
}

export interface GenerationSettings {
  aspectRatio: AspectRatio;
  resolution: ImageResolution;
  style: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string; // Text prompt or description
  imageUrl?: string; // If the message contains a generated image
  timestamp: number;
  settings?: GenerationSettings;
  attachment?: {
    data: string; // base64
    mimeType: string;
  };
}

export interface StylePreset {
  id: string;
  name: string;
  promptModifier: string; // Added to the user prompt
}
