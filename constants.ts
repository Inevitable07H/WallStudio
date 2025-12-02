import { StylePreset } from "./types";

export const MODEL_NAME = "gemini-3-pro-image-preview";

export const STYLE_PRESETS: StylePreset[] = [
  { id: 'none', name: 'No Style', promptModifier: '' },
  { id: 'photorealistic', name: 'Photorealistic', promptModifier: 'highly detailed, photorealistic, 8k resolution, cinematic lighting, sharp focus' },
  { id: 'cyberpunk', name: 'Cyberpunk', promptModifier: 'cyberpunk style, neon lights, high contrast, futuristic, sci-fi aesthetic, detailed tech' },
  { id: 'anime', name: 'Anime', promptModifier: 'anime style, vibrant colors, clean lines, studio ghibli inspired, high quality 2D art' },
  { id: 'digital-art', name: 'Digital Art', promptModifier: 'digital art, trending on artstation, masterpiece, intricate details, vivid colors' },
  { id: 'oil-painting', name: 'Oil Painting', promptModifier: 'oil painting texture, visible brushstrokes, classical art style, rich colors' },
  { id: 'concept-art', name: 'Concept Art', promptModifier: 'concept art, matte painting, epic scale, atmospheric, rule of thirds' },
  { id: '3d-render', name: '3D Render', promptModifier: '3d render, unreal engine 5, ray tracing, global illumination, hyper-realistic texture' },
];

export const ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95 }
};