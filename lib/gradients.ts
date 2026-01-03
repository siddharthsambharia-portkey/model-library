// Provider-specific colors (flat, no gradients - Cursor-inspired)
export const providerColors: Record<string, {
  color: string
  bgClass: string
  textClass: string
}> = {
  anthropic: {
    color: '#D4A574',
    bgClass: 'bg-provider-anthropic',
    textClass: 'text-provider-anthropic',
  },
  openai: {
    color: '#10B981',
    bgClass: 'bg-provider-openai',
    textClass: 'text-provider-openai',
  },
  'open-ai': {
    color: '#10B981',
    bgClass: 'bg-provider-openai',
    textClass: 'text-provider-openai',
  },
  google: {
    color: '#4285F4',
    bgClass: 'bg-provider-google',
    textClass: 'text-provider-google',
  },
  'vertex-ai': {
    color: '#4285F4',
    bgClass: 'bg-provider-google',
    textClass: 'text-provider-google',
  },
  meta: {
    color: '#0866FF',
    bgClass: 'bg-provider-meta',
    textClass: 'text-provider-meta',
  },
  mistral: {
    color: '#FF7000',
    bgClass: 'bg-provider-mistral',
    textClass: 'text-provider-mistral',
  },
  'mistral-ai': {
    color: '#FF7000',
    bgClass: 'bg-provider-mistral',
    textClass: 'text-provider-mistral',
  },
  deepseek: {
    color: '#0891B2',
    bgClass: 'bg-provider-deepseek',
    textClass: 'text-provider-deepseek',
  },
  cohere: {
    color: '#FF5A5A',
    bgClass: 'bg-provider-cohere',
    textClass: 'text-provider-cohere',
  },
  'x-ai': {
    color: '#A3A3A3',
    bgClass: 'bg-provider-xai',
    textClass: 'text-provider-xai',
  },
  groq: {
    color: '#F97316',
    bgClass: 'bg-provider-groq',
    textClass: 'text-provider-groq',
  },
  'together-ai': {
    color: '#8B5CF6',
    bgClass: 'bg-provider-together',
    textClass: 'text-provider-together',
  },
  fireworks: {
    color: '#EF4444',
    bgClass: 'bg-provider-fireworks',
    textClass: 'text-provider-fireworks',
  },
  'fireworks-ai': {
    color: '#EF4444',
    bgClass: 'bg-provider-fireworks',
    textClass: 'text-provider-fireworks',
  },
  perplexity: {
    color: '#0EA5E9',
    bgClass: 'bg-provider-perplexity',
    textClass: 'text-provider-perplexity',
  },
  'perplexity-ai': {
    color: '#0EA5E9',
    bgClass: 'bg-provider-perplexity',
    textClass: 'text-provider-perplexity',
  },
  bedrock: {
    color: '#FF9900',
    bgClass: 'bg-provider-bedrock',
    textClass: 'text-provider-bedrock',
  },
  azure: {
    color: '#0078D4',
    bgClass: 'bg-provider-azure',
    textClass: 'text-provider-azure',
  },
  'azure-openai': {
    color: '#0078D4',
    bgClass: 'bg-provider-azure',
    textClass: 'text-provider-azure',
  },
  'azure-ai': {
    color: '#0078D4',
    bgClass: 'bg-provider-azure',
    textClass: 'text-provider-azure',
  },
  cerebras: {
    color: '#FF6B35',
    bgClass: 'bg-provider-cerebras',
    textClass: 'text-provider-cerebras',
  },
  ai21: {
    color: '#4ADE80',
    bgClass: 'bg-provider-ai21',
    textClass: 'text-provider-ai21',
  },
  'reka-ai': {
    color: '#F472B6',
    bgClass: 'bg-provider-reka',
    textClass: 'text-provider-reka',
  },
  default: {
    color: '#0EA5E9',
    bgClass: 'bg-accent-primary',
    textClass: 'text-accent-primary',
  },
}

export function getProviderColor(providerId: string) {
  return providerColors[providerId.toLowerCase()] || providerColors.default
}

// Legacy compatibility - returns flat gradient (same color)
export function getProviderGradient(providerId: string) {
  const provider = getProviderColor(providerId)
  return {
    from: provider.color,
    to: provider.color,
    accent: provider.color,
    className: provider.bgClass,
  }
}

export function getProviderGradientCSS(providerId: string): string {
  const provider = getProviderColor(providerId)
  return provider.color
}
