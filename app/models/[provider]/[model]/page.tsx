import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Eye, Wrench, Brain } from 'lucide-react'
import Header from '@/components/Header'
import ModelCardPreview from '@/components/ModelCardPreview'
import { getModel, getAllModels } from '@/lib/models'
import { formatPrice, formatContextWindow } from '@/lib/types'
import { getProviderGradient } from '@/lib/gradients'

interface ModelPageProps {
  params: Promise<{ provider: string; model: string }>
}

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const { provider, model: modelId } = await params
  const model = await getModel(provider, modelId)
  
  if (!model) {
    return { title: 'Model Not Found' }
  }

  const description = `${model.id} by ${model.providerDisplayName}. Input: ${formatPrice(model.pricing?.input)}/M, Output: ${formatPrice(model.pricing?.output)}/M. ${model.features.vision ? 'Vision, ' : ''}${model.features.function_calling ? 'Tool Calling, ' : ''}${model.maxOutputTokens ? formatContextWindow(model.maxOutputTokens) + ' output tokens' : ''}`

  return {
    title: `${model.id} | ${model.providerDisplayName} | AI Model Directory`,
    description,
    openGraph: {
      title: `${model.id} | ${model.providerDisplayName}`,
      description,
      images: [`/api/og/model/${provider}/${modelId}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${model.id} | ${model.providerDisplayName}`,
      description,
      images: [`/api/og/model/${provider}/${modelId}`],
    },
  }
}

export default async function ModelPage({ params }: ModelPageProps) {
  const { provider, model: modelId } = await params
  const model = await getModel(provider, modelId)

  if (!model) {
    notFound()
  }

  const gradient = getProviderGradient(provider)

  return (
    <main className="min-h-screen bg-bg-primary">
      <Header />
      
      <div className="pt-24 px-8 max-w-[1200px] mx-auto pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
          <Link href="/" className="hover:text-text-primary transition-colors">Models</Link>
          <span>/</span>
          <Link href={`/models/${provider}`} className="hover:text-text-primary transition-colors">
            {model.providerDisplayName}
          </Link>
          <span>/</span>
          <span className="text-text-secondary">{model.id}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Model Info */}
          <div>
            {/* Model Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
                >
                  {model.providerDisplayName.charAt(0)}
                </div>
                <span className="text-text-secondary">{model.providerDisplayName}</span>
              </div>
              <h1 className="text-4xl font-semibold text-text-primary mb-2">
                {model.id}
              </h1>
              <p className="text-text-secondary font-mono text-sm">
                {model.id}
              </p>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-bg-secondary border border-border-color">
                <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Input Price</div>
                <div className="text-2xl font-semibold text-text-primary">
                  {formatPrice(model.pricing?.input)}
                  <span className="text-sm text-text-muted font-normal">/M tokens</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-bg-secondary border border-border-color">
                <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Output Price</div>
                <div className="text-2xl font-semibold text-text-primary">
                  {formatPrice(model.pricing?.output)}
                  <span className="text-sm text-text-muted font-normal">/M tokens</span>
                </div>
              </div>
            </div>

            {/* Specs */}
            <div className="space-y-4 mb-8">
              <h2 className="text-lg font-medium text-text-primary">Specifications</h2>
              <div className="grid grid-cols-2 gap-3">
                {model.maxOutputTokens && (
                  <div className="p-3 rounded-lg bg-bg-secondary border border-border-color">
                    <div className="text-xs text-text-muted mb-1">Max Output</div>
                    <div className="text-text-primary font-medium">
                      {formatContextWindow(model.maxOutputTokens)} tokens
                    </div>
                  </div>
                )}
                <div className="p-3 rounded-lg bg-bg-secondary border border-border-color">
                  <div className="text-xs text-text-muted mb-1">Type</div>
                  <div className="text-text-primary font-medium capitalize">{model.type}</div>
                </div>
                {model.pricing?.cached_input && (
                  <div className="p-3 rounded-lg bg-bg-secondary border border-border-color">
                    <div className="text-xs text-text-muted mb-1">Cached Input</div>
                    <div className="text-text-primary font-medium">
                      {formatPrice(model.pricing.cached_input)}/M
                    </div>
                  </div>
                )}
                {model.pricing?.cache_write && (
                  <div className="p-3 rounded-lg bg-bg-secondary border border-border-color">
                    <div className="text-xs text-text-muted mb-1">Cache Write</div>
                    <div className="text-text-primary font-medium">
                      {formatPrice(model.pricing.cache_write)}/M
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <h2 className="text-lg font-medium text-text-primary">Features</h2>
              <div className="flex flex-wrap gap-2">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${model.features.vision ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-text-muted border border-transparent'}`}>
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">Vision</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${model.features.function_calling ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-white/5 text-text-muted border border-transparent'}`}>
                  <Wrench className="w-4 h-4" />
                  <span className="text-sm font-medium">Tool Calling</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${model.features.reasoning ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-white/5 text-text-muted border border-transparent'}`}>
                  <Brain className="w-4 h-4" />
                  <span className="text-sm font-medium">Reasoning</span>
                </div>
              </div>
            </div>

            {/* Modalities */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-text-primary">Modalities</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-bg-secondary border border-border-color">
                  <div className="text-xs text-text-muted uppercase tracking-wider mb-2">Input</div>
                  <div className="flex flex-wrap gap-2">
                    {model.modality.input.map(m => (
                      <span key={m} className="px-2 py-1 rounded-md bg-white/5 text-text-secondary text-sm capitalize">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-bg-secondary border border-border-color">
                  <div className="text-xs text-text-muted uppercase tracking-wider mb-2">Output</div>
                  <div className="flex flex-wrap gap-2">
                    {model.modality.output.map(m => (
                      <span key={m} className="px-2 py-1 rounded-md bg-white/5 text-text-secondary text-sm capitalize">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Card Preview */}
          <div>
            <ModelCardPreview model={model} />
          </div>
        </div>
      </div>
    </main>
  )
}

export async function generateStaticParams() {
  const models = await getAllModels()
  return models.map((model) => ({
    provider: model.provider,
    model: model.id,
  }))
}
