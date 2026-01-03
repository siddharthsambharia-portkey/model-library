import fs from 'fs'
import path from 'path'
import { Model, Provider, ModelPricing, ModelFeatures } from './types'

// Re-export types and utilities
export * from './types'

// Cache for models data
let cachedModels: Model[] | null = null
let cachedProviders: Provider[] | null = null

function formatModelName(id: string): string {
  // Convert model ID to human readable name
  return id
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/(\d)/g, ' $1')
    .replace(/\s+/g, ' ')
    .trim()
}

function formatProviderName(id: string): string {
  const providerNames: Record<string, string> = {
    'anthropic': 'Anthropic',
    'openai': 'OpenAI',
    'google': 'Google',
    'vertex-ai': 'Google Vertex AI',
    'meta': 'Meta',
    'mistral-ai': 'Mistral AI',
    'deepseek': 'DeepSeek',
    'cohere': 'Cohere',
    'x-ai': 'xAI',
    'groq': 'Groq',
    'together-ai': 'Together AI',
    'fireworks-ai': 'Fireworks AI',
    'fireworks': 'Fireworks',
    'perplexity-ai': 'Perplexity',
    'bedrock': 'AWS Bedrock',
    'azure-openai': 'Azure OpenAI',
    'azure-ai': 'Azure AI',
    'cerebras': 'Cerebras',
    'ai21': 'AI21 Labs',
    'reka-ai': 'Reka AI',
    'anyscale': 'Anyscale',
    'deepinfra': 'DeepInfra',
    'lambda': 'Lambda',
    'novita-ai': 'Novita AI',
    'openrouter': 'OpenRouter',
    'palm': 'Google PaLM',
    'sagemaker': 'AWS SageMaker',
    'stability-ai': 'Stability AI',
    'workers-ai': 'Cloudflare Workers AI',
    'zhipu': 'Zhipu AI',
    'dashscope': 'Alibaba DashScope',
    'nebius': 'Nebius',
    'inference-net': 'Inference.net',
    'jina': 'Jina AI',
    'lemonfox-ai': 'LemonFox AI',
    'monsterapi': 'Monster API',
    'nomic': 'Nomic',
    'oracle': 'Oracle',
    'predibase': 'Predibase',
    'segmind': 'Segmind',
    'deepbricks': 'DeepBricks',
    'github': 'GitHub Models',
  }
  return providerNames[id] || id.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

export async function getAllModels(): Promise<Model[]> {
  if (cachedModels) return cachedModels

  const combinedDir = path.join(process.cwd(), 'combined')
  const files = fs.readdirSync(combinedDir).filter(f => f.endsWith('.json'))
  
  const models: Model[] = []

  for (const file of files) {
    const providerId = file.replace('.json', '')
    const filePath = path.join(combinedDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    
    try {
      const data = JSON.parse(content)
      const providerName = formatProviderName(data.id || providerId)
      
      if (data.models) {
        for (const [modelId, modelData] of Object.entries(data.models)) {
          const model = modelData as Record<string, unknown>
          
          // Extract pricing
          let pricing: ModelPricing | undefined
          if (model.pricing && typeof model.pricing === 'object') {
            const p = model.pricing as Record<string, unknown>
            const tokens = p.tokens as Record<string, unknown> | undefined
            if (tokens) {
              pricing = {
                input: typeof tokens.input === 'number' ? tokens.input : 0,
                output: typeof tokens.output === 'number' ? tokens.output : 0,
                cached_input: typeof tokens.cached_input === 'number' ? tokens.cached_input : undefined,
                cache_write: typeof tokens.cache_write === 'number' ? tokens.cache_write : undefined,
                unit: (tokens.unit as string) || 'USD_per_million_tokens',
                currency: (p.currency as string) || 'USD',
              }
            }
          }

          // Extract features
          const features: ModelFeatures = {}
          if (model.features && typeof model.features === 'object') {
            const f = model.features as Record<string, unknown>
            features.vision = f.vision === true
            features.function_calling = f.function_calling === true
            features.reasoning = f.reasoning === true
          }

          // Extract modality
          const modality = model.modality as { input?: string[]; output?: string[] } | undefined
          
          // Get max output tokens and estimate context
          const maxOutputTokens = model.max_output_tokens as number | undefined
          
          models.push({
            id: modelId,
            name: formatModelName(modelId),
            provider: providerId,
            providerDisplayName: providerName,
            type: (model.type as 'chat' | 'embedding' | 'image' | 'completion') || 'chat',
            maxOutputTokens,
            modality: {
              input: modality?.input || ['text'],
              output: modality?.output || ['text'],
            },
            features,
            pricing,
          })
        }
      }
    } catch (error) {
      console.error(`Error parsing ${file}:`, error)
    }
  }

  // Sort by provider and then by model name
  models.sort((a, b) => {
    if (a.provider !== b.provider) {
      return a.provider.localeCompare(b.provider)
    }
    return a.id.localeCompare(b.id)
  })

  cachedModels = models
  return models
}

export async function getProviders(): Promise<Provider[]> {
  if (cachedProviders) return cachedProviders

  const models = await getAllModels()
  const providerMap = new Map<string, { name: string; count: number }>()

  for (const model of models) {
    const existing = providerMap.get(model.provider)
    if (existing) {
      existing.count++
    } else {
      providerMap.set(model.provider, {
        name: model.providerDisplayName,
        count: 1,
      })
    }
  }

  const providers: Provider[] = Array.from(providerMap.entries()).map(([id, data]) => ({
    id,
    name: data.name,
    modelCount: data.count,
  }))

  providers.sort((a, b) => b.modelCount - a.modelCount)

  cachedProviders = providers
  return providers
}

export async function getModelsByProvider(providerId: string): Promise<Model[]> {
  const models = await getAllModels()
  return models.filter(m => m.provider === providerId)
}

export async function getModel(providerId: string, modelId: string): Promise<Model | null> {
  const models = await getAllModels()
  return models.find(m => m.provider === providerId && m.id === modelId) || null
}
