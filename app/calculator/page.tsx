import { Metadata } from 'next'
import Header from '@/components/Header'
import PriceCalculator from '@/components/PriceCalculator'
import { getAllModels, getProviders } from '@/lib/models'

export const metadata: Metadata = {
  title: 'AI Model Price Calculator | AI Model Directory',
  description: 'Calculate and compare costs for AI models. Estimate your monthly spend based on usage.',
}

export default async function CalculatorPage() {
  const models = await getAllModels()
  const providers = await getProviders()

  return (
    <main className="min-h-screen bg-bg-base">
      <Header />
      
      <div className="pt-24 px-4 md:px-6 max-w-[1000px] mx-auto pb-16">
        <div className="text-center mb-10">
          <h1 className="display-md text-text-primary mb-4">
            Price <span className="text-accent-secondary">Calculator</span>
          </h1>
          <p className="body-md text-text-secondary max-w-xl mx-auto">
            Estimate your costs based on expected usage. Compare pricing across different models.
          </p>
        </div>

        <PriceCalculator models={models} providers={providers} />
      </div>
    </main>
  )
}
