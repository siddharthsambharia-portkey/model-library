'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Star, Eye, Wrench, Brain } from 'lucide-react'
import { Model, Provider, formatPrice } from '@/lib/types'
import { getProviderColor } from '@/lib/gradients'

interface HeroProps {
  modelCount?: number
  providerCount?: number
  featuredModels?: Model[]
  providers?: Provider[]
}

// 3D-style animated icon component
function HeroIcon() {
  return (
    <div className="relative w-24 h-24 mx-auto mb-8">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-accent-primary/20 rounded-2xl blur-2xl animate-pulse" />
      
      {/* Main cube */}
      <div className="relative w-full h-full">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Back face */}
          <polygon 
            points="20,30 50,15 80,30 80,70 50,85 20,70" 
            fill="none" 
            stroke="rgba(14, 165, 233, 0.3)" 
            strokeWidth="1.5"
          />
          {/* Left face */}
          <polygon 
            points="20,30 50,45 50,85 20,70" 
            fill="rgba(14, 165, 233, 0.1)" 
            stroke="rgba(14, 165, 233, 0.5)" 
            strokeWidth="1.5"
          />
          {/* Right face */}
          <polygon 
            points="50,45 80,30 80,70 50,85" 
            fill="rgba(14, 165, 233, 0.15)" 
            stroke="rgba(14, 165, 233, 0.5)" 
            strokeWidth="1.5"
          />
          {/* Top face */}
          <polygon 
            points="20,30 50,15 80,30 50,45" 
            fill="rgba(14, 165, 233, 0.2)" 
            stroke="rgba(14, 165, 233, 0.8)" 
            strokeWidth="1.5"
          />
          {/* Inner lines */}
          <line x1="50" y1="45" x2="50" y2="85" stroke="rgba(14, 165, 233, 0.4)" strokeWidth="1" />
          
          {/* Floating particles */}
          <circle cx="35" cy="25" r="2" fill="#0EA5E9" className="animate-float-slow" />
          <circle cx="70" cy="35" r="1.5" fill="#F54E00" className="animate-float-medium" />
          <circle cx="25" cy="55" r="1" fill="#10B981" className="animate-float-fast" />
        </svg>
      </div>
    </div>
  )
}

// Helper to get display name - model.name is already formatted during data load
function getModelDisplayName(model: Model): string {
  return model.name || model.id
}

// Featured model card component - cursor.directory style
function FeaturedModelCard({ model }: { model: Model }) {
  const providerStyle = getProviderColor(model.provider)
  const hasVision = model.features.vision
  const hasTools = model.features.function_calling
  const hasReasoning = model.features.reasoning
  
  return (
    <Link 
      href={`/models/${encodeURIComponent(model.provider)}/${encodeURIComponent(model.id)}`}
      className="group block p-5 rounded-xl bg-bg-primary border border-border-primary hover:border-border-hover hover:bg-bg-secondary transition-all duration-200"
    >
      {/* Provider Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span 
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: providerStyle.color }}
        />
        <span className="text-xs text-text-muted uppercase tracking-wider">
          {model.providerDisplayName}
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-text-faint group-hover:text-accent-primary group-hover:translate-x-0.5 transition-all ml-auto" />
      </div>
      
      {/* Model Name */}
      <h3 className="text-text-primary font-medium mb-3 group-hover:text-accent-primary transition-colors line-clamp-1">
        {getModelDisplayName(model)}
      </h3>
      
      {/* Pricing */}
      <div className="flex items-center gap-3 text-sm mb-3">
        <span className="text-text-muted">
          <span className="text-text-secondary font-mono">{formatPrice(model.pricing?.input)}</span>
          <span className="text-text-faint text-xs">/M in</span>
        </span>
        <span className="text-text-muted">
          <span className="text-text-secondary font-mono">{formatPrice(model.pricing?.output)}</span>
          <span className="text-text-faint text-xs">/M out</span>
        </span>
      </div>
      
      {/* Features */}
      {(hasVision || hasTools || hasReasoning) && (
        <div className="flex items-center gap-1.5">
          {hasVision && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-accent-primary/10 text-accent-primary">
              <Eye className="w-3 h-3" />
              Vision
            </span>
          )}
          {hasTools && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-accent-secondary/10 text-accent-secondary">
              <Wrench className="w-3 h-3" />
              Tools
            </span>
          )}
          {hasReasoning && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-yellow-500/10 text-yellow-500">
              <Brain className="w-3 h-3" />
              Reasoning
            </span>
          )}
        </div>
      )}
    </Link>
  )
}

// Provider pill component
function ProviderPill({ provider }: { provider: Provider }) {
  const providerStyle = getProviderColor(provider.id)
  
  return (
    <Link
      href={`/models/${encodeURIComponent(provider.id)}`}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-primary border border-border-primary hover:border-border-hover hover:bg-bg-secondary transition-all text-sm"
    >
      <span 
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: providerStyle.color }}
      />
      <span className="text-text-secondary">{provider.name}</span>
      <span className="text-text-faint text-xs">({provider.modelCount})</span>
    </Link>
  )
}

export default function Hero({ modelCount = 2334, providerCount = 39, featuredModels = [], providers = [] }: HeroProps) {
  const modelsRef = useRef<HTMLDivElement>(null)
  
  const scrollToModels = () => {
    const modelsSection = document.querySelector('.model-table-section')
    if (modelsSection) {
      modelsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Get top providers by model count
  const topProviders = providers
    .sort((a, b) => b.modelCount - a.modelCount)
    .slice(0, 8)

  // Get featured models - ensure variety of providers
  const displayModels = featuredModels.slice(0, 9)

  return (
    <section className="relative pt-24 pb-8 px-4 md:px-6">
      <div className="max-w-[1100px] mx-auto">
        {/* Hero Icon */}
        <HeroIcon />
        
        {/* Main Headline - Centered */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-text-primary tracking-tight mb-4 leading-[1.1]">
            AI Model Directory
            <br />
            <span className="text-text-muted">for your project</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            The open-source directory with{' '}
            <span className="text-text-primary font-medium">{modelCount.toLocaleString()}+ models</span> from{' '}
            <span className="text-text-primary font-medium">{providerCount}+ providers</span>.
            Compare pricing, features, and capabilities.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            <button 
              onClick={scrollToModels}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-text-primary text-bg-base font-medium hover:opacity-90 transition-all"
            >
              Explore Models
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link 
              href="/compare"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-bg-primary border border-border-primary text-text-primary font-medium hover:bg-bg-secondary hover:border-border-hover transition-all"
            >
              Compare Models
            </Link>
          </div>
        </div>

        {/* Featured Providers - Pills */}
        {topProviders.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-center gap-2 mb-5">
              <Star className="w-4 h-4 text-text-muted" />
              <span className="text-sm text-text-muted uppercase tracking-wider">Popular Providers</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {topProviders.map(provider => (
                <ProviderPill key={provider.id} provider={provider} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
