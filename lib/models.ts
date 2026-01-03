import fs from 'fs'
import path from 'path'
import { Model, Provider, ModelPricing, ModelFeatures } from './types'

// Re-export types and utilities
export * from './types'

// Cache for models data
let cachedModels: Model[] | null = null
let cachedProviders: Provider[] | null = null

function formatModelName(id: string): string {
  let name = id
  
  // Handle org/model format - keep only the model part
  if (name.includes('/')) {
    const parts = name.split('/')
    name = parts[parts.length - 1]
  }
  
  // Remove @ symbol variants (e.g., claude-3-5-haiku@20241022)
  name = name.replace(/@\d+$/, '')
  
  // Remove date suffixes: -20241022, -2024-10-22, etc. (before hyphen replacement)
  name = name.replace(/-20\d{6}(-v[\d.:]+)?$/g, '')  // -20241022 or -20241022-v1:0
  name = name.replace(/-20\d{2}-\d{2}-\d{2}$/g, '')  // -2024-10-22
  name = name.replace(/-\d{4}$/g, '')                 // -0725, -2507 (month-day patterns)
  name = name.replace(/-latest$/i, '')                // -latest
  
  // Replace hyphens/underscores with spaces
  name = name.replace(/[-_]/g, ' ')
  
  // Clean up multiple spaces
  name = name.replace(/\s+/g, ' ').trim()
  
  // Title case with smart handling
  name = name.split(' ').map(word => {
    const lower = word.toLowerCase()
    
    // Uppercase known abbreviations
    if (['gpt', 'ai', 'xl', 'xxl', 'ocr', 'vl', 'fp8', 'fp16', 'llm', 'bert', 'moe'].includes(lower)) {
      return word.toUpperCase()
    }
    
    // Version patterns (v1, v2, v0.1, etc.)
    if (lower.match(/^v\d/i)) return word.toUpperCase()
    
    // Size patterns - handle B (billion) suffix
    if (word.match(/^\d+b$/i)) return word.slice(0, -1) + 'B'
    
    // Keep numbers as-is
    if (word.match(/^\d+$/)) return word
    
    // Normal title case
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  }).join(' ')
  
  return name
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
  // Decode URL-encoded model ID (e.g., "anthropic%2Fclaude-4-opus" -> "anthropic/claude-4-opus")
  const decodedModelId = decodeURIComponent(modelId)
  const decodedProviderId = decodeURIComponent(providerId)
  return models.find(m => m.provider === decodedProviderId && m.id === decodedModelId) || null
}
