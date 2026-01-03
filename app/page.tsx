import Header from '@/components/Header'
import Hero from '@/components/Hero'
import LogoRibbon from '@/components/LogoRibbon'
import ModelTable from '@/components/ModelTable'
import { getAllModels, getProviders } from '@/lib/models'

export default async function Home() {
  const models = await getAllModels()
  const providers = await getProviders()

  // Get featured models - ensure variety of providers (ONE per provider)
  const getFeaturedModels = () => {
    const modelsWithPricing = models.filter(m => m.pricing?.input && m.pricing?.output)
    
    // Group by provider
    const byProvider = new Map<string, typeof modelsWithPricing>()
    modelsWithPricing.forEach(m => {
      const existing = byProvider.get(m.provider) || []
      existing.push(m)
      byProvider.set(m.provider, existing)
    })
    
    // Score models by features
    const scoreModel = (m: typeof modelsWithPricing[0]) => 
      (m.features.vision ? 3 : 0) + 
      (m.features.function_calling ? 2 : 0) + 
      (m.features.reasoning ? 4 : 0)
    
    // Priority providers to showcase variety
    const topProviderIds = [
      'openai', 'anthropic', 'google-ai-studio', 'mistral', 
      'deepseek', 'cohere', 'groq', 'together-ai', 'openrouter'
    ]
    
    const featured: typeof modelsWithPricing = []
    const usedProviders = new Set<string>()
    
    // Get best model from each priority provider (one per provider)
    for (const providerId of topProviderIds) {
      if (usedProviders.has(providerId)) continue
      const providerModels = byProvider.get(providerId) || []
      if (providerModels.length > 0) {
        const sorted = providerModels.sort((a, b) => scoreModel(b) - scoreModel(a))
        featured.push(sorted[0])
        usedProviders.add(providerId)
        if (featured.length >= 9) break
      }
    }
    
    // If we don't have enough, fill with best from other providers (one each)
    if (featured.length < 9) {
      const allProviders = Array.from(byProvider.keys())
        .filter(p => !usedProviders.has(p))
      
      for (const providerId of allProviders) {
        const providerModels = byProvider.get(providerId) || []
        if (providerModels.length > 0) {
          const sorted = providerModels.sort((a, b) => scoreModel(b) - scoreModel(a))
          featured.push(sorted[0])
          usedProviders.add(providerId)
          if (featured.length >= 9) break
        }
      }
    }
    
    return featured
  }
  
  const featuredModels = getFeaturedModels()

  return (
    <main className="min-h-screen bg-bg-base relative">
      <Header />
      <Hero 
        modelCount={models.length} 
        providerCount={providers.length}
        featuredModels={featuredModels}
        providers={providers}
      />
      <LogoRibbon />
      <section className="model-table-section px-4 md:px-6 py-12 max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-text-primary mb-2">All Models</h2>
          <p className="text-text-muted">Browse and filter the complete directory</p>
        </div>
        <ModelTable models={models} providers={providers} />
      </section>
      
      {/* Footer */}
      <footer className="border-t border-border-secondary py-8 px-4 md:px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-text-muted">
            Open source by{' '}
            <a 
              href="https://portkey.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent-primary transition-colors"
            >
              Portkey
            </a>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a 
              href="https://github.com/portkey-ai/gateway" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-secondary transition-colors"
            >
              GitHub
            </a>
            <a 
              href="https://portkey.ai/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-secondary transition-colors"
            >
              Documentation
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
