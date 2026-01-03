import { Metadata } from 'next'
import Header from '@/components/Header'
import ComparisonBuilder from '@/components/ComparisonBuilder'
import { getAllModels, getProviders } from '@/lib/models'

export const metadata: Metadata = {
  title: 'Compare AI Models | AI Model Directory',
  description: 'Compare pricing, features, and capabilities of AI models side by side. Find the best model for your use case.',
}

export default async function ComparePage() {
  const models = await getAllModels()
  const providers = await getProviders()

  return (
    <main className="min-h-screen bg-bg-primary">
      <Header />
      
      <div className="pt-24 px-8 max-w-[1400px] mx-auto pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-text-primary mb-4">
            Compare AI Models
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Select up to 4 models to compare side by side. Find the perfect model for your use case.
          </p>
        </div>

        <ComparisonBuilder models={models} providers={providers} />
      </div>
    </main>
  )
}

