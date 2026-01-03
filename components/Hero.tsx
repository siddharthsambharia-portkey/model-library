'use client'

import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
  const scrollToModels = () => {
    const modelsSection = document.querySelector('.model-table-section')
    if (modelsSection) {
      modelsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="pt-32 pb-16 px-8 text-center">
      <div className="max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-border-color mb-8 animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-text-secondary">Open Source</span>
          <span className="text-sm text-text-muted">•</span>
          <span className="text-sm text-text-secondary">Community Driven</span>
        </div>

        {/* Title */}
        <h1 className="hero-title mb-6 animate-fade-in-up animation-delay-100">
          The Open Source
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-orange-400 bg-clip-text text-transparent">
            AI Model Directory
          </span>
        </h1>

        {/* Subtitle */}
        <p className="section-description max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
          Compare pricing, features, and capabilities across{' '}
          <span className="text-text-primary font-medium">600+ models</span> from{' '}
          <span className="text-text-primary font-medium">40+ providers</span>.
          Find the perfect model for your use case.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
          <button 
            onClick={scrollToModels}
            className="btn btn-primary"
          >
            Explore Models
            <ArrowRight className="w-4 h-4" />
          </button>
          <a 
            href="https://github.com/portkey-ai/gateway"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            View on GitHub
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-12 mt-16 animate-fade-in-up animation-delay-400">
          <div className="text-center">
            <div className="text-3xl font-semibold text-text-primary">600+</div>
            <div className="text-sm text-text-muted mt-1">Models</div>
          </div>
          <div className="w-px h-12 bg-border-color"></div>
          <div className="text-center">
            <div className="text-3xl font-semibold text-text-primary">40+</div>
            <div className="text-sm text-text-muted mt-1">Providers</div>
          </div>
          <div className="w-px h-12 bg-border-color"></div>
          <div className="text-center">
            <div className="text-3xl font-semibold text-text-primary">Free</div>
            <div className="text-sm text-text-muted mt-1">Forever</div>
          </div>
        </div>
      </div>
    </section>
  )
}

