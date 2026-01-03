import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Header from '@/components/Header'
import ModelTable from '@/components/ModelTable'
import { getModelsByProvider, getProviders } from '@/lib/models'
import { getProviderGradient } from '@/lib/gradients'

interface ProviderPageProps {
  params: Promise<{ provider: string }>
}

export async function generateMetadata({ params }: ProviderPageProps): Promise<Metadata> {
  const { provider } = await params
  const providers = await getProviders()
  const providerData = providers.find(p => p.id === provider)
  
  if (!providerData) {
    return { title: 'Provider Not Found' }
  }

  return {
    title: `${providerData.name} Models | AI Model Directory`,
    description: `Explore ${providerData.modelCount} AI models from ${providerData.name}. Compare pricing, features, and capabilities.`,
    openGraph: {
      title: `${providerData.name} Models | AI Model Directory`,
      description: `Explore ${providerData.modelCount} AI models from ${providerData.name}. Compare pricing, features, and capabilities.`,
    },
  }
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const { provider } = await params
  const models = await getModelsByProvider(provider)
  const providers = await getProviders()
  const providerData = providers.find(p => p.id === provider)

  if (!providerData || models.length === 0) {
    notFound()
  }

  const gradient = getProviderGradient(provider)

  return (
    <main className="min-h-screen bg-bg-primary">
      <Header />
      
      <div className="pt-24 px-8 max-w-[1400px] mx-auto">
        {/* Breadcrumb */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all models
        </Link>

        {/* Provider Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
            >
              {providerData.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-text-primary">
                {providerData.name}
              </h1>
              <p className="text-text-secondary">
                {providerData.modelCount} models available
              </p>
            </div>
          </div>
        </div>

        {/* Models Table */}
        <ModelTable models={models} providers={providers} />
      </div>
    </main>
  )
}

export async function generateStaticParams() {
  const providers = await getProviders()
  return providers.map((provider) => ({
    provider: provider.id,
  }))
}

