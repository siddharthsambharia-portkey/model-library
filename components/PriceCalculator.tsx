'use client'

import { useState, useMemo } from 'react'
import { Calculator, ChevronDown, DollarSign, ArrowRight } from 'lucide-react'
import Fuse from 'fuse.js'
import { Model, Provider, formatPrice } from '@/lib/types'
import { getProviderGradient } from '@/lib/gradients'

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
    <div className="space-y-8">
      {/* Model Selector */}
      <div className="p-6 rounded-2xl bg-bg-secondary border border-border-color">
        <label className="text-sm text-text-muted mb-3 block">Select Model</label>
        <div className="relative">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-border-color cursor-pointer hover:border-white/20 transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedModel ? (
              <>
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: `linear-gradient(135deg, ${getProviderGradient(selectedModel.provider).from}, ${getProviderGradient(selectedModel.provider).to})` }}
                >
                  {selectedModel.providerDisplayName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="text-text-primary font-medium">{selectedModel.id}</div>
                  <div className="text-text-muted text-sm">{selectedModel.providerDisplayName}</div>
                </div>
              </>
            ) : (
              <input
                type="text"
                placeholder="Search for a model..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setIsDropdownOpen(true)
                }}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-muted"
              />
            )}
            <ChevronDown className={`w-5 h-5 text-text-muted transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto rounded-xl bg-bg-secondary border border-border-color shadow-xl z-50">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Search models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-border-color text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-white/20"
                  autoFocus
                />
              </div>
              {searchResults.map(model => {
                const gradient = getProviderGradient(model.provider)
                return (
                  <button
                    key={`${model.provider}-${model.id}`}
                    onClick={() => selectModel(model)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
                    >
                      {model.providerDisplayName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-text-primary font-medium truncate">{model.id}</div>
                      <div className="text-text-muted text-sm truncate">{model.providerDisplayName}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-text-primary text-sm">{formatPrice(model.pricing?.input)}/M</div>
                      <div className="text-text-muted text-xs">input</div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 rounded-xl bg-bg-secondary border border-border-color">
        <button
          onClick={() => setMode('simple')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            mode === 'simple' 
              ? 'bg-white text-black' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Simple
        </button>
        <button
          onClick={() => setMode('detailed')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            mode === 'detailed' 
              ? 'bg-white text-black' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Detailed
        </button>
      </div>

      {/* Usage Inputs */}
      <div className="p-6 rounded-2xl bg-bg-secondary border border-border-color space-y-6">
        <h3 className="text-lg font-medium text-text-primary flex items-center gap-2">
          <Calculator className="w-5 h-5 text-violet-400" />
          Usage Estimate
        </h3>

        {mode === 'simple' ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-text-muted mb-2 block">Input Tokens (Monthly)</label>
              <div className="relative">
                <input
                  type="range"
                  min={100000}
                  max={100000000}
                  step={100000}
                  value={inputTokens}
                  onChange={(e) => setInputTokens(Number(e.target.value))}
                  className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer"
                />
                <div className="mt-2 text-xl font-semibold text-text-primary">
                  {formatNumber(inputTokens)} tokens
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm text-text-muted mb-2 block">Output Tokens (Monthly)</label>
              <div className="relative">
                <input
                  type="range"
                  min={100000}
                  max={50000000}
                  step={100000}
                  value={outputTokens}
                  onChange={(e) => setOutputTokens(Number(e.target.value))}
                  className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer"
                />
                <div className="mt-2 text-xl font-semibold text-text-primary">
                  {formatNumber(outputTokens)} tokens
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="text-sm text-text-muted mb-2 block">Requests per Day</label>
              <input
                type="number"
                value={requestsPerDay}
                onChange={(e) => setRequestsPerDay(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border-color text-text-primary outline-none focus:border-white/20"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-text-muted mb-2 block">Avg Input Tokens per Request</label>
                <input
                  type="number"
                  value={avgInputPerRequest}
                  onChange={(e) => setAvgInputPerRequest(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border-color text-text-primary outline-none focus:border-white/20"
                />
              </div>
              <div>
                <label className="text-sm text-text-muted mb-2 block">Avg Output Tokens per Request</label>
                <input
                  type="number"
                  value={avgOutputPerRequest}
                  onChange={(e) => setAvgOutputPerRequest(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border-color text-text-primary outline-none focus:border-white/20"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cost Breakdown */}
      {selectedModel && costs && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20">
          <h3 className="text-lg font-medium text-text-primary mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Monthly Cost Estimate
          </h3>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/5">
              <div className="text-sm text-text-muted mb-1">Input Cost</div>
              <div className="text-2xl font-semibold text-text-primary">
                ${costs.inputCost.toFixed(2)}
              </div>
              <div className="text-xs text-text-muted mt-1">
                {formatNumber(costs.totalInputTokens)} tokens × {formatPrice(selectedModel.pricing?.input)}/M
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <div className="text-sm text-text-muted mb-1">Output Cost</div>
              <div className="text-2xl font-semibold text-text-primary">
                ${costs.outputCost.toFixed(2)}
              </div>
              <div className="text-xs text-text-muted mt-1">
                {formatNumber(costs.totalOutputTokens)} tokens × {formatPrice(selectedModel.pricing?.output)}/M
              </div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-sm text-emerald-400 mb-1">Total Monthly</div>
              <div className="text-3xl font-bold text-emerald-400">
                ${costs.totalCost.toFixed(2)}
              </div>
              <div className="text-xs text-emerald-400/60 mt-1">
                ~${(costs.totalCost / 30).toFixed(2)}/day
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-text-muted">
            <span>Want to compare?</span>
            <a href="/compare" className="text-violet-400 hover:text-violet-300 flex items-center gap-1">
              Compare models
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* No Model Selected */}
      {!selectedModel && (
        <div className="p-12 rounded-2xl border border-dashed border-border-color text-center">
          <Calculator className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="text-text-muted">Select a model above to calculate costs</p>
        </div>
      )}
    </div>
  )
}
