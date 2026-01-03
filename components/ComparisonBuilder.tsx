'use client'

import { useState, useMemo } from 'react'
import { X, Plus, Download, Link as LinkIcon, Check, Eye, Wrench, Brain, ChevronDown } from 'lucide-react'
import Fuse from 'fuse.js'
import { Model, Provider, formatPrice, formatContextWindow } from '@/lib/types'
import { getProviderGradient } from '@/lib/gradients'

interface ComparisonBuilderProps {
  models: Model[]
  providers: Provider[]
}

export default function ComparisonBuilder({ models, providers }: ComparisonBuilderProps) {
  const [selectedModels, setSelectedModels] = useState<Model[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const fuse = useMemo(() => new Fuse(models, {
    keys: ['id', 'name', 'provider', 'providerDisplayName'],
    threshold: 0.3,
    ignoreLocation: true,
  }), [models])

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return models.slice(0, 20)
    return fuse.search(searchQuery).slice(0, 20).map(r => r.item)
  }, [searchQuery, fuse, models])

  const addModel = (model: Model) => {
    if (selectedModels.length < 4 && !selectedModels.find(m => m.id === model.id && m.provider === model.provider)) {
      setSelectedModels([...selectedModels, model])
    }
    setSearchQuery('')
    setIsDropdownOpen(false)
  }

  const removeModel = (index: number) => {
    setSelectedModels(selectedModels.filter((_, i) => i !== index))
  }

  const copyLink = async () => {
    const modelParams = selectedModels.map(m => `${m.provider}:${m.id}`).join(',')
    const url = `${window.location.origin}/compare?models=${encodeURIComponent(modelParams)}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadComparison = async () => {
    const modelParams = selectedModels.map(m => `${m.provider}:${m.id}`).join(',')
    const url = `/api/og/compare?models=${encodeURIComponent(modelParams)}`
    
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = 'model-comparison.png'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <div>
      {/* Model Selector */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-bg-secondary border border-border-color cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Plus className="w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder={selectedModels.length >= 4 ? 'Maximum 4 models' : 'Add a model to compare...'}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setIsDropdownOpen(true)
              }}
              onClick={(e) => e.stopPropagation()}
              disabled={selectedModels.length >= 4}
              className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-muted disabled:cursor-not-allowed"
            />
            <ChevronDown className={`w-5 h-5 text-text-muted transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {isDropdownOpen && selectedModels.length < 4 && (
            <div className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto rounded-xl bg-bg-secondary border border-border-color shadow-xl z-50">
              {searchResults.map(model => {
                const isSelected = selectedModels.find(m => m.id === model.id && m.provider === model.provider)
                const gradient = getProviderGradient(model.provider)
                
                return (
                  <button
                    key={`${model.provider}-${model.id}`}
                    onClick={() => !isSelected && addModel(model)}
                    disabled={!!isSelected}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left ${isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    {isSelected && (
                      <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Selected Models Pills */}
        {selectedModels.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {selectedModels.map((model, index) => {
              const gradient = getProviderGradient(model.provider)
              return (
                <div
                  key={`${model.provider}-${model.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-border-color"
                >
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
                  />
                  <span className="text-sm text-text-primary">{model.id}</span>
                  <button
                    onClick={() => removeModel(index)}
                    className="p-0.5 rounded-full hover:bg-white/10 text-text-muted hover:text-text-primary"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Comparison Table */}
      {selectedModels.length > 0 && (
        <div className="rounded-xl border border-border-color overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-secondary">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-muted uppercase tracking-wider">
                    Attribute
                  </th>
                  {selectedModels.map(model => {
                    const gradient = getProviderGradient(model.provider)
                    return (
                      <th key={`${model.provider}-${model.id}`} className="px-6 py-4 text-left">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                            style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
                          >
                            {model.providerDisplayName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-text-primary">{model.id}</div>
                            <div className="text-xs text-text-muted">{model.providerDisplayName}</div>
                          </div>
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border-color">
                  <td className="px-6 py-4 text-sm text-text-muted">Input Price</td>
                  {selectedModels.map(model => (
                    <td key={`${model.provider}-${model.id}-input`} className="px-6 py-4 text-text-primary font-medium">
                      {formatPrice(model.pricing?.input)}<span className="text-text-muted text-sm">/M</span>
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-border-color">
                  <td className="px-6 py-4 text-sm text-text-muted">Output Price</td>
                  {selectedModels.map(model => (
                    <td key={`${model.provider}-${model.id}-output`} className="px-6 py-4 text-text-primary font-medium">
                      {formatPrice(model.pricing?.output)}<span className="text-text-muted text-sm">/M</span>
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-border-color">
                  <td className="px-6 py-4 text-sm text-text-muted">Max Output</td>
                  {selectedModels.map(model => (
                    <td key={`${model.provider}-${model.id}-context`} className="px-6 py-4 text-text-primary font-medium">
                      {formatContextWindow(model.maxOutputTokens)}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-border-color">
                  <td className="px-6 py-4 text-sm text-text-muted">Vision</td>
                  {selectedModels.map(model => (
                    <td key={`${model.provider}-${model.id}-vision`} className="px-6 py-4">
                      {model.features.vision ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-sm">
                          <Eye className="w-3.5 h-3.5" /> Yes
                        </span>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-border-color">
                  <td className="px-6 py-4 text-sm text-text-muted">Tool Calling</td>
                  {selectedModels.map(model => (
                    <td key={`${model.provider}-${model.id}-tools`} className="px-6 py-4">
                      {model.features.function_calling ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-sm">
                          <Wrench className="w-3.5 h-3.5" /> Yes
                        </span>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-border-color">
                  <td className="px-6 py-4 text-sm text-text-muted">Reasoning</td>
                  {selectedModels.map(model => (
                    <td key={`${model.provider}-${model.id}-reasoning`} className="px-6 py-4">
                      {model.features.reasoning ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 text-amber-400 text-sm">
                          <Brain className="w-3.5 h-3.5" /> Yes
                        </span>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-border-color">
                  <td className="px-6 py-4 text-sm text-text-muted">Input Modality</td>
                  {selectedModels.map(model => (
                    <td key={`${model.provider}-${model.id}-input-mod`} className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {model.modality.input.map(m => (
                          <span key={m} className="px-2 py-0.5 rounded bg-white/5 text-text-secondary text-sm capitalize">
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-border-color">
                  <td className="px-6 py-4 text-sm text-text-muted">Output Modality</td>
                  {selectedModels.map(model => (
                    <td key={`${model.provider}-${model.id}-output-mod`} className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {model.modality.output.map(m => (
                          <span key={m} className="px-2 py-0.5 rounded bg-white/5 text-text-secondary text-sm capitalize">
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Share Actions */}
      {selectedModels.length >= 2 && (
        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={downloadComparison}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Card
          </button>
          <button
            onClick={copyLink}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors border border-white/10"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                Copied!
              </>
            ) : (
              <>
                <LinkIcon className="w-4 h-4" />
                Share Link
              </>
            )}
          </button>
        </div>
      )}

      {/* Empty State */}
      {selectedModels.length === 0 && (
        <div className="text-center py-16 text-text-muted">
          <p className="mb-2">Select models above to start comparing</p>
          <p className="text-sm">You can compare up to 4 models side by side</p>
        </div>
      )}
    </div>
  )
}
