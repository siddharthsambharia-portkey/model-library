'use client'

import { ArrowRight, Zap, Database, GitCompare } from 'lucide-react'

interface HeroProps {
  modelCount?: number
  providerCount?: number
}

export default function Hero({ modelCount = 600, providerCount = 40 }: HeroProps) {
  const scrollToModels = () => {
    const modelsSection = document.querySelector('.model-table-section')
    if (modelsSection) {
      modelsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 px-4 md:px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Main Content */}
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-6 animate-fade-in-up">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-secondary/10 border border-accent-secondary/20 text-accent-secondary text-xs font-medium">
              <Zap className="w-3 h-3" />
              Open Source
            </span>
          </div>

          {/* Title */}
          <h1 className="display-lg mb-5 animate-fade-in-up animation-delay-100">
            The AI Model
            <br />
            <span className="text-accent-primary">Directory</span>
          </h1>

          {/* Subtitle */}
          <p className="body-lg text-text-secondary max-w-xl mb-8 animate-fade-in-up animation-delay-200">
            Compare pricing, context windows, and capabilities across{' '}
            <span className="text-text-primary font-medium">{modelCount}+ models</span> from{' '}
            <span className="text-text-primary font-medium">{providerCount}+ providers</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 mb-12 animate-fade-in-up animation-delay-300">
            <button 
              onClick={scrollToModels}
              className="btn btn-primary btn-lg"
            >
              Explore Models
              <ArrowRight className="w-4 h-4" />
            </button>
            <a 
              href="https://github.com/portkey-ai/gateway"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-lg"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap items-stretch gap-4 md:gap-6 animate-fade-in-up animation-delay-400">
          <div className="flex-1 min-w-[140px] p-4 md:p-5 rounded-xl bg-bg-primary border border-border-primary">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-accent-primary" />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-semibold text-text-primary tracking-tight">{modelCount}+</div>
                <div className="text-xs text-text-muted uppercase tracking-wider">Models</div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-w-[140px] p-4 md:p-5 rounded-xl bg-bg-primary border border-border-primary">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-secondary/10 flex items-center justify-center">
                <GitCompare className="w-5 h-5 text-accent-secondary" />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-semibold text-text-primary tracking-tight">{providerCount}+</div>
                <div className="text-xs text-text-muted uppercase tracking-wider">Providers</div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-w-[140px] p-4 md:p-5 rounded-xl bg-bg-primary border border-border-primary">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-semibold text-text-primary tracking-tight">Free</div>
                <div className="text-xs text-text-muted uppercase tracking-wider">Forever</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
