// Provider-specific gradient definitions for viral model cards
export const providerGradients: Record<string, {
  from: string
  to: string
  className: string
  accent: string
}> = {
  anthropic: {
    from: '#FF6B6B',
    to: '#FFB347',
    className: 'gradient-anthropic',
    accent: '#FF8A5B',
  },
  openai: {
    from: '#10B981',
    to: '#06B6D4',
    className: 'gradient-openai',
    accent: '#0EA5E9',
  },
  google: {
    from: '#4F46E5',
    to: '#7C3AED',
    className: 'gradient-google',
    accent: '#6366F1',
  },
  'vertex-ai': {
    from: '#4F46E5',
    to: '#7C3AED',
    className: 'gradient-google',
    accent: '#6366F1',
  },
  meta: {
    from: '#3B82F6',
    to: '#6366F1',
    className: 'gradient-meta',
    accent: '#4F46E5',
  },
  mistral: {
    from: '#A855F7',
    to: '#EC4899',
    className: 'gradient-mistral',
    accent: '#D946EF',
  },
  'mistral-ai': {
    from: '#A855F7',
    to: '#EC4899',
    className: 'gradient-mistral',
    accent: '#D946EF',
  },
  deepseek: {
    from: '#1E3A8A',
    to: '#22D3EE',
    className: 'gradient-deepseek',
    accent: '#0891B2',
  },
  cohere: {
    from: '#DC2626',
    to: '#F97316',
    className: 'gradient-cohere',
    accent: '#EA580C',
  },
  'x-ai': {
    from: '#475569',
    to: '#94A3B8',
    className: 'gradient-xai',
    accent: '#64748B',
  },
  groq: {
    from: '#F97316',
    to: '#FBBF24',
    className: 'gradient-groq',
    accent: '#F59E0B',
  },
  'together-ai': {
    from: '#8B5CF6',
    to: '#3B82F6',
    className: 'gradient-together',
    accent: '#6366F1',
  },
  fireworks: {
    from: '#EF4444',
    to: '#F97316',
    className: 'gradient-fireworks',
    accent: '#F97316',
  },
  'fireworks-ai': {
    from: '#EF4444',
    to: '#F97316',
    className: 'gradient-fireworks',
    accent: '#F97316',
  },
  perplexity: {
    from: '#22D3EE',
    to: '#3B82F6',
    className: 'gradient-perplexity',
    accent: '#0EA5E9',
  },
  'perplexity-ai': {
    from: '#22D3EE',
    to: '#3B82F6',
    className: 'gradient-perplexity',
    accent: '#0EA5E9',
  },
  bedrock: {
    from: '#F97316',
    to: '#FBBF24',
    className: 'gradient-bedrock',
    accent: '#F59E0B',
  },
  azure: {
    from: '#0078D4',
    to: '#00BCF2',
    className: 'gradient-azure',
    accent: '#0EA5E9',
  },
  'azure-openai': {
    from: '#0078D4',
    to: '#00BCF2',
    className: 'gradient-azure',
    accent: '#0EA5E9',
  },
  'azure-ai': {
    from: '#0078D4',
    to: '#00BCF2',
    className: 'gradient-azure',
    accent: '#0EA5E9',
  },
  cerebras: {
    from: '#FF6B35',
    to: '#FF9F1C',
    className: 'gradient-cerebras',
    accent: '#F97316',
  },
  ai21: {
    from: '#4ADE80',
    to: '#22D3EE',
    className: 'gradient-ai21',
    accent: '#2DD4BF',
  },
  'reka-ai': {
    from: '#F472B6',
    to: '#A855F7',
    className: 'gradient-reka',
    accent: '#D946EF',
  },
  default: {
    from: '#6366F1',
    to: '#8B5CF6',
    className: 'gradient-default',
    accent: '#7C3AED',
  },
}

export function getProviderGradient(providerId: string) {
  return providerGradients[providerId.toLowerCase()] || providerGradients.default
}

export function getProviderGradientCSS(providerId: string): string {
  const gradient = getProviderGradient(providerId)
  return `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`
}

