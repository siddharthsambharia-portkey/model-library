import Header from '@/components/Header'
import Hero from '@/components/Hero'
import LogoRibbon from '@/components/LogoRibbon'
import ModelTable from '@/components/ModelTable'
import { getAllModels, getProviders } from '@/lib/models'

export default async function Home() {
  const models = await getAllModels()
  const providers = await getProviders()

  return (
    <main className="min-h-screen bg-bg-primary">
      <Header />
      <Hero />
      <LogoRibbon />
      <section className="px-8 py-16 max-w-[1400px] mx-auto">
        <ModelTable models={models} providers={providers} />
      </section>
    </main>
  )
}

