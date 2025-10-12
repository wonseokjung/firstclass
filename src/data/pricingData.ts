// OpenAI API 가격 데이터 (2025년 기준)

export type PricingTier = 'batch' | 'flex' | 'standard' | 'priority';
export type ApiType = 'text' | 'image-gen' | 'audio' | 'video' | 'embedding' | 'transcription' | 'fine-tuning';

// Text API 가격 (per 1M tokens)
export interface TextModelPrice {
  input: number;
  cachedInput: number | null;
  output: number;
  name: string;
  category: string;
}

export const textModelPrices: Record<PricingTier, Record<string, TextModelPrice>> = {
  batch: {
    'gpt-5': { input: 0.625, cachedInput: 0.0625, output: 5.00, name: 'GPT-5', category: 'Latest Models' },
    'gpt-5-mini': { input: 0.125, cachedInput: 0.0125, output: 1.00, name: 'GPT-5 Mini', category: 'Latest Models' },
    'gpt-5-nano': { input: 0.025, cachedInput: 0.0025, output: 0.20, name: 'GPT-5 Nano', category: 'Latest Models' },
    'gpt-5-pro': { input: 7.50, cachedInput: null, output: 60.00, name: 'GPT-5 Pro', category: 'Premium' },
    'gpt-4.1': { input: 1.00, cachedInput: null, output: 4.00, name: 'GPT-4.1', category: 'GPT-4 Series' },
    'gpt-4.1-mini': { input: 0.20, cachedInput: null, output: 0.80, name: 'GPT-4.1 Mini', category: 'GPT-4 Series' },
    'gpt-4.1-nano': { input: 0.05, cachedInput: null, output: 0.20, name: 'GPT-4.1 Nano', category: 'GPT-4 Series' },
    'gpt-4o': { input: 1.25, cachedInput: null, output: 5.00, name: 'GPT-4o', category: 'Vision' },
    'gpt-4o-mini': { input: 0.075, cachedInput: null, output: 0.30, name: 'GPT-4o Mini', category: 'Vision' },
    'o1': { input: 7.50, cachedInput: null, output: 30.00, name: 'O1', category: 'Reasoning' },
    'o1-pro': { input: 75.00, cachedInput: null, output: 300.00, name: 'O1 Pro', category: 'Reasoning' },
    'o3-pro': { input: 10.00, cachedInput: null, output: 40.00, name: 'O3 Pro', category: 'Reasoning' },
    'o3': { input: 1.00, cachedInput: null, output: 4.00, name: 'O3', category: 'Reasoning' },
    'o3-mini': { input: 0.55, cachedInput: null, output: 2.20, name: 'O3 Mini', category: 'Reasoning' },
    'o4-mini': { input: 0.55, cachedInput: null, output: 2.20, name: 'O4 Mini', category: 'Reasoning' },
    'computer-use-preview': { input: 1.50, cachedInput: null, output: 6.00, name: 'Computer Use Preview', category: 'Special' },
  },
  flex: {
    'gpt-5': { input: 0.625, cachedInput: 0.0625, output: 5.00, name: 'GPT-5', category: 'Latest Models' },
    'gpt-5-mini': { input: 0.125, cachedInput: 0.0125, output: 1.00, name: 'GPT-5 Mini', category: 'Latest Models' },
    'gpt-5-nano': { input: 0.025, cachedInput: 0.0025, output: 0.20, name: 'GPT-5 Nano', category: 'Latest Models' },
    'o3': { input: 1.00, cachedInput: 0.25, output: 4.00, name: 'O3', category: 'Reasoning' },
    'o4-mini': { input: 0.55, cachedInput: 0.138, output: 2.20, name: 'O4 Mini', category: 'Reasoning' },
  },
  standard: {
    'gpt-5': { input: 1.25, cachedInput: 0.125, output: 10.00, name: 'GPT-5', category: 'Latest Models' },
    'gpt-5-mini': { input: 0.25, cachedInput: 0.025, output: 2.00, name: 'GPT-5 Mini', category: 'Latest Models' },
    'gpt-5-nano': { input: 0.05, cachedInput: 0.005, output: 0.40, name: 'GPT-5 Nano', category: 'Latest Models' },
    'gpt-5-chat-latest': { input: 1.25, cachedInput: 0.125, output: 10.00, name: 'GPT-5 Chat Latest', category: 'Latest Models' },
    'gpt-5-codex': { input: 1.25, cachedInput: 0.125, output: 10.00, name: 'GPT-5 Codex', category: 'Latest Models' },
    'gpt-5-pro': { input: 15.00, cachedInput: null, output: 120.00, name: 'GPT-5 Pro', category: 'Premium' },
    'gpt-4.1': { input: 2.00, cachedInput: 0.50, output: 8.00, name: 'GPT-4.1', category: 'GPT-4 Series' },
    'gpt-4.1-mini': { input: 0.40, cachedInput: 0.10, output: 1.60, name: 'GPT-4.1 Mini', category: 'GPT-4 Series' },
    'gpt-4.1-nano': { input: 0.10, cachedInput: 0.025, output: 0.40, name: 'GPT-4.1 Nano', category: 'GPT-4 Series' },
    'gpt-4o': { input: 2.50, cachedInput: 1.25, output: 10.00, name: 'GPT-4o', category: 'Vision' },
    'gpt-4o-2024-05-13': { input: 5.00, cachedInput: null, output: 15.00, name: 'GPT-4o (2024-05-13)', category: 'Vision' },
    'gpt-4o-mini': { input: 0.15, cachedInput: 0.075, output: 0.60, name: 'GPT-4o Mini', category: 'Vision' },
    'gpt-realtime': { input: 4.00, cachedInput: 0.40, output: 16.00, name: 'GPT Realtime', category: 'Realtime' },
    'gpt-realtime-mini': { input: 0.60, cachedInput: 0.06, output: 2.40, name: 'GPT Realtime Mini', category: 'Realtime' },
    'gpt-audio': { input: 2.50, cachedInput: null, output: 10.00, name: 'GPT Audio', category: 'Audio' },
    'gpt-audio-mini': { input: 0.60, cachedInput: null, output: 2.40, name: 'GPT Audio Mini', category: 'Audio' },
    'o1': { input: 15.00, cachedInput: 7.50, output: 60.00, name: 'O1', category: 'Reasoning' },
    'o1-pro': { input: 150.00, cachedInput: null, output: 600.00, name: 'O1 Pro', category: 'Reasoning' },
    'o3-pro': { input: 20.00, cachedInput: null, output: 80.00, name: 'O3 Pro', category: 'Reasoning' },
    'o3': { input: 2.00, cachedInput: 0.50, output: 8.00, name: 'O3', category: 'Reasoning' },
    'o3-deep-research': { input: 10.00, cachedInput: 2.50, output: 40.00, name: 'O3 Deep Research', category: 'Reasoning' },
    'o4-mini': { input: 1.10, cachedInput: 0.275, output: 4.40, name: 'O4 Mini', category: 'Reasoning' },
    'o4-mini-deep-research': { input: 2.00, cachedInput: 0.50, output: 8.00, name: 'O4 Mini Deep Research', category: 'Reasoning' },
    'o3-mini': { input: 1.10, cachedInput: 0.55, output: 4.40, name: 'O3 Mini', category: 'Reasoning' },
    'o1-mini': { input: 1.10, cachedInput: 0.55, output: 4.40, name: 'O1 Mini', category: 'Reasoning' },
    'codex-mini-latest': { input: 1.50, cachedInput: 0.375, output: 6.00, name: 'Codex Mini Latest', category: 'Code' },
    'gpt-4o-mini-search-preview': { input: 0.15, cachedInput: null, output: 0.60, name: 'GPT-4o Mini Search', category: 'Search' },
    'gpt-4o-search-preview': { input: 2.50, cachedInput: null, output: 10.00, name: 'GPT-4o Search', category: 'Search' },
    'computer-use-preview': { input: 3.00, cachedInput: null, output: 12.00, name: 'Computer Use Preview', category: 'Special' },
    'gpt-image-1': { input: 5.00, cachedInput: 1.25, output: 0, name: 'GPT Image 1', category: 'Image Input' },
    'gpt-image-1-mini': { input: 2.00, cachedInput: 0.20, output: 0, name: 'GPT Image 1 Mini', category: 'Image Input' },
  },
  priority: {
    'gpt-5': { input: 2.50, cachedInput: 0.25, output: 20.00, name: 'GPT-5', category: 'Latest Models' },
    'gpt-5-mini': { input: 0.45, cachedInput: 0.045, output: 3.60, name: 'GPT-5 Mini', category: 'Latest Models' },
    'gpt-4.1': { input: 3.50, cachedInput: 0.875, output: 14.00, name: 'GPT-4.1', category: 'GPT-4 Series' },
    'gpt-4.1-mini': { input: 0.70, cachedInput: 0.175, output: 2.80, name: 'GPT-4.1 Mini', category: 'GPT-4 Series' },
    'gpt-4.1-nano': { input: 0.20, cachedInput: 0.05, output: 0.80, name: 'GPT-4.1 Nano', category: 'GPT-4 Series' },
    'gpt-4o': { input: 4.25, cachedInput: 2.125, output: 17.00, name: 'GPT-4o', category: 'Vision' },
    'gpt-4o-2024-05-13': { input: 8.75, cachedInput: null, output: 26.25, name: 'GPT-4o (2024-05-13)', category: 'Vision' },
    'gpt-4o-mini': { input: 0.25, cachedInput: 0.125, output: 1.00, name: 'GPT-4o Mini', category: 'Vision' },
    'o3': { input: 3.50, cachedInput: 0.875, output: 14.00, name: 'O3', category: 'Reasoning' },
    'o4-mini': { input: 2.00, cachedInput: 0.50, output: 8.00, name: 'O4 Mini', category: 'Reasoning' },
  },
};

// Image Generation 가격 (per image)
export interface ImageGenPrice {
  low?: number;
  medium?: number;
  high?: number;
  standard?: number;
  hd?: number;
  name: string;
  sizes: {
    '1024x1024': number;
    '1024x1536': number;
    '1536x1024': number;
    '1024x1792'?: number;
    '1792x1024'?: number;
    '256x256'?: number;
    '512x512'?: number;
  };
}

export const imageGenPrices: Record<string, any> = {
  'gpt-image-1': {
    name: 'GPT Image 1',
    quality: {
      low: { '1024x1024': 0.011, '1024x1536': 0.016, '1536x1024': 0.016 },
      medium: { '1024x1024': 0.042, '1024x1536': 0.063, '1536x1024': 0.063 },
      high: { '1024x1024': 0.167, '1024x1536': 0.25, '1536x1024': 0.25 },
    },
  },
  'gpt-image-1-mini': {
    name: 'GPT Image 1 Mini',
    quality: {
      low: { '1024x1024': 0.005, '1024x1536': 0.006, '1536x1024': 0.006 },
      medium: { '1024x1024': 0.011, '1024x1536': 0.015, '1536x1024': 0.015 },
      high: { '1024x1024': 0.036, '1024x1536': 0.052, '1536x1024': 0.052 },
    },
  },
  'dall-e-3': {
    name: 'DALL·E 3',
    quality: {
      standard: { '1024x1024': 0.04, '1024x1792': 0.08, '1792x1024': 0.08 },
      hd: { '1024x1024': 0.08, '1024x1792': 0.12, '1792x1024': 0.12 },
    },
  },
  'dall-e-2': {
    name: 'DALL·E 2',
    quality: {
      standard: { '256x256': 0.016, '512x512': 0.018, '1024x1024': 0.02 },
    },
  },
};

// Audio 가격 (per 1M tokens)
export const audioTokenPrices: Record<string, { input: number; cachedInput: number | null; output: number; name: string }> = {
  'gpt-realtime': { input: 32.00, cachedInput: 0.40, output: 64.00, name: 'GPT Realtime' },
  'gpt-realtime-mini': { input: 10.00, cachedInput: 0.30, output: 20.00, name: 'GPT Realtime Mini' },
  'gpt-4o-realtime-preview': { input: 40.00, cachedInput: 2.50, output: 80.00, name: 'GPT-4o Realtime Preview' },
  'gpt-4o-mini-realtime-preview': { input: 10.00, cachedInput: 0.30, output: 20.00, name: 'GPT-4o Mini Realtime Preview' },
  'gpt-audio': { input: 32.00, cachedInput: null, output: 64.00, name: 'GPT Audio' },
  'gpt-audio-mini': { input: 10.00, cachedInput: null, output: 20.00, name: 'GPT Audio Mini' },
  'gpt-4o-audio-preview': { input: 40.00, cachedInput: null, output: 80.00, name: 'GPT-4o Audio Preview' },
  'gpt-4o-mini-audio-preview': { input: 10.00, cachedInput: null, output: 20.00, name: 'GPT-4o Mini Audio Preview' },
};

// Video 가격 (per second)
export const videoPrices: Record<string, { price: number; resolution: string; name: string }> = {
  'sora-2': { price: 0.10, resolution: '720x1280 / 1280x720', name: 'Sora 2' },
  'sora-2-pro-720p': { price: 0.30, resolution: '720x1280 / 1280x720', name: 'Sora 2 Pro (720p)' },
  'sora-2-pro-hd': { price: 0.50, resolution: '1024x1792 / 1792x1024', name: 'Sora 2 Pro (HD)' },
};

// Embedding 가격 (per 1M tokens)
export const embeddingPrices: Record<string, { standard: number; batch: number; name: string }> = {
  'text-embedding-3-small': { standard: 0.02, batch: 0.01, name: 'Text Embedding 3 Small' },
  'text-embedding-3-large': { standard: 0.13, batch: 0.065, name: 'Text Embedding 3 Large' },
  'text-embedding-ada-002': { standard: 0.10, batch: 0.05, name: 'Text Embedding Ada 002' },
};

// Transcription & TTS 가격
export const transcriptionPrices: Record<string, { costPerMinute?: number; costPer1MChars?: number; name: string }> = {
  'whisper': { costPerMinute: 0.006, name: 'Whisper' },
  'gpt-4o-transcribe': { costPerMinute: 0.006, name: 'GPT-4o Transcribe' },
  'gpt-4o-mini-transcribe': { costPerMinute: 0.003, name: 'GPT-4o Mini Transcribe' },
  'tts': { costPer1MChars: 15.00, name: 'TTS' },
  'tts-hd': { costPer1MChars: 30.00, name: 'TTS HD' },
  'gpt-4o-mini-tts': { costPerMinute: 0.015, name: 'GPT-4o Mini TTS' },
};

