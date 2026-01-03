'use client'

import { useState, useMemo } from 'react'
import { Calculator, ChevronDown, DollarSign, ArrowRight, Search } from 'lucide-react'
import Fuse from 'fuse.js'
import { Model, Provider, formatPrice } from '@/lib/types'
import { getProviderColor } from '@/lib/gradients'

interface PriceCalculatorProps {
  models: Model[]
  providers: Provider[]
}

export default function PriceCalculator({ models, providers }: PriceCalculatorProps) {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  // Usage inputs
  const [inputTokens, setInputTokens] = useState(1000000) // 1M tokens
  const [outputTokens, setOutputTokens] = useState(500000) // 500K tokens
  const [requestsPerDay, setRequestsPerDay] = useState(100)
  const [avgInputPerRequest, setAvgInputPerRequest] = useState(1000)
  const [avgOutputPerRequest, setAvgOutputPerRequest] = useState(500)

  // Calculator mode
  const [mode, setMode] = useState<'simple' | 'detailed'>('simple')

  const fuse = useMemo(() => new Fuse(models, {
    keys: ['id', 'name', 'provider', 'providerDisplayName'],
    threshold: 0.3,
    ignoreLocation: true,
  }), [models])

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return models.slice(0, 20)
    return fuse.search(searchQuery).slice(0, 20).map(r => r.item)
  }, [searchQuery, fuse, models])

  // Calculate costs
  const costs = useMemo(() => {
    if (!selectedModel?.pricing) return null

    let totalInputTokens: number
    let totalOutputTokens: number

    if (mode === 'simple') {
      totalInputTokens = inputTokens
      totalOutputTokens = outputTokens
    } else {
      totalInputTokens = requestsPerDay * avgInputPerRequest * 30 // monthly
      totalOutputTokens = requestsPerDay * avgOutputPerRequest * 30
    }

    const inputCost = (totalInputTokens / 1_000_000) * selectedModel.pricing.input
    const outputCost = (totalOutputTokens / 1_000_000) * selectedModel.pricing.output
    const totalCost = inputCost + outputCost

    return {
      inputCost,
      outputCost,
      totalCost,
      totalInputTokens,
      totalOutputTokens,
    }
  }, [selectedModel, mode, inputTokens, outputTokens, requestsPerDay, avgInputPerRequest, avgOutputPerRequest])

  const selectModel = (model: Model) => {
    setSelectedModel(model)
    setSearchQuery('')
    setIsDropdownOpen(false)
  }

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="space-y-6">
      {/* Model Selector */}
      <div className="p-5 rounded-xl bg-bg-primary border border-border-primary">
        <label className="label mb-3 block">Select Model</label>
        <div className="relative">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-bg-secondary border border-border-primary cursor-pointer hover:border-border-hover transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedModel ? (
              <>
                <span 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getProviderColor(selectedModel.provider).color }}
                />
                <div className="flex-1">
                  <div className="text-text-primary text-sm font-medium">{selectedModel.id}</div>
                  <div className="text-text-muted text-xs">{selectedModel.providerDisplayName}</div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 flex-1 text-text-muted">
                <Search className="w-4 h-4" />
                <span className="text-sm">Search for a model...</span>
              </div>
            )}
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto rounded-xl bg-bg-secondary border border-border-primary shadow-elevated z-50">
              <div className="p-2 sticky top-0 bg-bg-secondary border-b border-border-secondary">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search models..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-bg-elevated border border-border-secondary text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-accent-primary"
                    autoFocus
                  />
                </div>
              </div>
              {searchResults.map(model => {
                const providerStyle = getProviderColor(model.provider)
                return (
                  <button
                    key={`${model.provider}-${model.id}`}
                    onClick={() => selectModel(model)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-hover transition-colors text-left"
                  >
                    <span 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: providerStyle.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-text-primary text-sm font-medium truncate">{model.id}</div>
                      <div className="text-text-muted text-xs truncate">{model.providerDisplayName}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-text-primary text-sm font-mono">{formatPrice(model.pricing?.input)}</div>
                      <div className="text-text-muted text-xs">per M input</div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-1 p-1 rounded-lg bg-bg-primary border border-border-primary">
        <button
          onClick={() => setMode('simple')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            mode === 'simple' 
              ? 'bg-text-primary text-bg-base' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Simple
        </button>
        <button
          onClick={() => setMode('detailed')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            mode === 'detailed' 
              ? 'bg-text-primary text-bg-base' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Detailed
        </button>
      </div>

      {/* Usage Inputs */}
      <div className="p-5 rounded-xl bg-bg-primary border border-border-primary space-y-5">
        <h3 className="heading-md text-text-primary flex items-center gap-2">
          <Calculator className="w-5 h-5 text-accent-primary" />
          Usage Estimate
        </h3>

        {mode === 'simple' ? (
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="label mb-2 block">Input Tokens (Monthly)</label>
              <div className="relative">
                <input
                  type="range"
                  min={100000}
                  max={100000000}
                  step={100000}
                  value={inputTokens}
                  onChange={(e) => setInputTokens(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full bg-bg-elevated appearance-none cursor-pointer accent-accent-primary"
                />
                <div className="mt-3 text-xl font-semibold text-text-primary font-mono">
                  {formatNumber(inputTokens)}
                </div>
              </div>
            </div>
            <div>
              <label className="label mb-2 block">Output Tokens (Monthly)</label>
              <div className="relative">
                <input
                  type="range"
                  min={100000}
                  max={50000000}
                  step={100000}
                  value={outputTokens}
                  onChange={(e) => setOutputTokens(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full bg-bg-elevated appearance-none cursor-pointer accent-accent-secondary"
                />
                <div className="mt-3 text-xl font-semibold text-text-primary font-mono">
                  {formatNumber(outputTokens)}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="label mb-2 block">Requests per Day</label>
              <input
                type="number"
                value={requestsPerDay}
                onChange={(e) => setRequestsPerDay(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg bg-bg-secondary border border-border-primary text-text-primary outline-none focus:border-accent-primary transition-colors"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="label mb-2 block">Avg Input Tokens / Request</label>
                <input
                  type="number"
                  value={avgInputPerRequest}
                  onChange={(e) => setAvgInputPerRequest(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-lg bg-bg-secondary border border-border-primary text-text-primary outline-none focus:border-accent-primary transition-colors"
                />
              </div>
              <div>
                <label className="label mb-2 block">Avg Output Tokens / Request</label>
                <input
                  type="number"
                  value={avgOutputPerRequest}
                  onChange={(e) => setAvgOutputPerRequest(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-lg bg-bg-secondary border border-border-primary text-text-primary outline-none focus:border-accent-primary transition-colors"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cost Breakdown */}
      {selectedModel && costs && (
        <div className="p-5 rounded-xl bg-bg-primary border border-accent-primary/30 relative overflow-hidden">
          {/* Accent Line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-primary" />
          
          <h3 className="heading-md text-text-primary mb-5 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-success" />
            Monthly Cost Estimate
          </h3>

          <div className="grid md:grid-cols-3 gap-3 mb-5">
            <div className="p-4 rounded-lg bg-bg-secondary border border-border-secondary">
              <div className="label mb-1">Input Cost</div>
              <div className="text-2xl font-semibold text-text-primary font-mono">
                ${costs.inputCost.toFixed(2)}
              </div>
              <div className="text-xs text-text-muted mt-1">
                {formatNumber(costs.totalInputTokens)} × {formatPrice(selectedModel.pricing?.input)}/M
              </div>
            </div>
            <div className="p-4 rounded-lg bg-bg-secondary border border-border-secondary">
              <div className="label mb-1">Output Cost</div>
              <div className="text-2xl font-semibold text-text-primary font-mono">
                ${costs.outputCost.toFixed(2)}
              </div>
              <div className="text-xs text-text-muted mt-1">
                {formatNumber(costs.totalOutputTokens)} × {formatPrice(selectedModel.pricing?.output)}/M
              </div>
            </div>
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <div className="label text-success mb-1">Total Monthly</div>
              <div className="text-3xl font-bold text-success font-mono">
                ${costs.totalCost.toFixed(2)}
              </div>
              <div className="text-xs text-success/70 mt-1">
                ~${(costs.totalCost / 30).toFixed(2)}/day
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-text-muted">
            <span>Want to compare?</span>
            <a href="/compare" className="text-accent-primary hover:underline flex items-center gap-1">
              Compare models
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* No Model Selected */}
      {!selectedModel && (
        <div className="p-12 rounded-xl border border-dashed border-border-primary text-center bg-bg-primary">
          <Calculator className="w-10 h-10 text-text-faint mx-auto mb-3" />
          <p className="text-text-muted text-sm">Select a model above to calculate costs</p>
        </div>
      )}
    </div>
  )
}
