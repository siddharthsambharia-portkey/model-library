export interface ModelPricing {
  input: number
  output: number
  cached_input?: number
  cache_write?: number
  unit: string
  currency: string
}

export interface ModelFeatures {
  vision?: boolean
  function_calling?: boolean
  reasoning?: boolean
  streaming?: boolean
  json_mode?: boolean
}

export interface Model {
  id: string
  name: string
  provider: string
  providerDisplayName: string
  type: 'chat' | 'embedding' | 'image' | 'completion'
  maxOutputTokens?: number
  contextWindow?: number
  modality: {
    input: string[]
    output: string[]
  }
  features: ModelFeatures
  pricing?: ModelPricing
}

export interface Provider {
  id: string
  name: string
  modelCount: number
}

export function formatPrice(price: number | undefined): string {
  if (price === undefined || price === null) return '—'
  if (price === 0) return 'Free'
  if (price < 0.01) return `$${price.toFixed(4)}`
  if (price < 1) return `$${price.toFixed(2)}`
  return `$${price.toFixed(2)}`
}

export function formatContextWindow(tokens: number | undefined): string {
  if (!tokens) return '—'
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`
  if (tokens >= 1000) return `${Math.round(tokens / 1000)}K`
  return tokens.toString()
}

