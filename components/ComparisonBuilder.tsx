'use client'

import { useState, useMemo } from 'react'
import { X, Plus, Download, Link as LinkIcon, Check, Eye, Wrench, Brain, ChevronDown, Search } from 'lucide-react'
import Fuse from 'fuse.js'
import { Model, Provider, formatPrice, formatContextWindow } from '@/lib/types'
import { getProviderColor } from '@/lib/gradients'

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
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-bg-secondary border border-border-primary cursor-pointer hover:border-border-hover transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Search className="w-4 h-4 text-text-muted" />
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
              className="flex-1 bg-transparent border-none outline-none text-text-primary text-sm placeholder:text-text-muted disabled:cursor-not-allowed"
            />
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {isDropdownOpen && selectedModels.length < 4 && (
            <div className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto rounded-xl bg-bg-secondary border border-border-primary shadow-elevated z-50">
              {searchResults.map(model => {
                const isSelected = selectedModels.find(m => m.id === model.id && m.provider === model.provider)
                const providerStyle = getProviderColor(model.provider)
                
                return (
                  <button
                    key={`${model.provider}-${model.id}`}
                    onClick={() => !isSelected && addModel(model)}
                    disabled={!!isSelected}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-hover transition-colors text-left ${isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: providerStyle.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-text-primary text-sm font-medium truncate">{model.id}</div>
                      <div className="text-text-muted text-xs truncate">{model.providerDisplayName}</div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-success flex-shrink-0" />
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
              const providerStyle = getProviderColor(model.provider)
              return (
                <div
                  key={`${model.provider}-${model.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-secondary border border-border-primary"
                >
                  <span 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: providerStyle.color }}
                  />
                  <span className="text-sm text-text-primary">{model.id}</span>
                  <button
                    onClick={() => removeModel(index)}
                    className="p-0.5 rounded-full hover:bg-bg-hover text-text-muted hover:text-text-primary transition-colors"
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
        <div className="rounded-xl border border-border-primary overflow-hidden bg-bg-primary">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bg-secondary">
                  <th className="px-5 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider border-b border-border-primary">
                    Attribute
                  </th>
                  {selectedModels.map(model => {
                    const providerStyle = getProviderColor(model.provider)
                    return (
                      <th key={`${model.provider}-${model.id}`} className="px-5 py-4 text-left border-b border-border-primary">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: providerStyle.color }}
                          />
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
                <tr className="border-b border-border-secondary hover:bg-bg-secondary/50 transition-colors">
                  <td className="px-5 py-4 text-sm text-text-muted">Input Price</td>
                  {selectedModels.map(model => (
                    <td key={`${model.provider}-${model.id}-input`} className="px-5 py-4 text-text-primary font-mono text-sm">
                      {formatPrice(model.pricing?.input)}<span className="text-text-muted">/M</span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border-secondary hover:bg-bg-secondary/50 transition-colors">
                  <td className="px-5 py-4 text-sm text-text-muted">Output Price</td>
                  {selectedModels.map(model => (
                    <td key={`${model.provider}-${model.id}-output`} className="px-5 py-4 text-text-primary font-mono text-sm">
                      {formatPrice(model.pricing?.output)}<span className="text-text-muted">/M</span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border-secondary hover:bg-bg-secondary/50 transition-colors">
                  <td className="px-5 py-4 text-sm text-text-muted">Max Output</td>
                  {selectedModels.map(model => (
                    <td key={`${model.provider}-${model.id}-context`} className="px-5 py-4 text-text-primary font-mono text-sm">
                      {formatContextWindow(model.maxOutputTokens)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border-secondary hover:bg-bg-secondary/50 transition-colors">
                  <td className="px-5 py-4 text-sm text-text-muted">Vision</td>
                  {selectedModels.map(model => (
                    <td key={`${model.provider}-${model.id}-vision`} className="px-5 py-4">
                      {model.features.vision ? (
                        <span className="badge badge-vision">
                          <Eye className="w-3 h-3" /> Yes
                        </span>
                      ) : (
                        <span className="text-text-faint">—</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border-secondary hover:bg-bg-secondary/50 transition-colors">
                  <td className="px-5 py-4 text-sm text-text-muted">Tool Calling</td>
                  {selectedModels.map(model => (
                    <td key={`${model.provider}-${model.id}-tools`} className="px-5 py-4">
                      {model.features.function_calling ? (
                        <span className="badge badge-tools">
                          <Wrench className="w-3 h-3" /> Yes
                        </span>
                      ) : (
                        <span className="text-text-faint">—</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border-secondary hover:bg-bg-secondary/50 transition-colors">
                  <td className="px-5 py-4 text-sm text-text-muted">Reasoning</td>
                  {selectedModels.map(model => (
                    <td key={`${model.provider}-${model.id}-reasoning`} className="px-5 py-4">
                      {model.features.reasoning ? (
                        <span className="badge badge-reasoning">
                          <Brain className="w-3 h-3" /> Yes
                        </span>
                      ) : (
                        <span className="text-text-faint">—</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border-secondary hover:bg-bg-secondary/50 transition-colors">
                  <td className="px-5 py-4 text-sm text-text-muted">Input Modality</td>
                  {selectedModels.map(model => (
                    <td key={`${model.provider}-${model.id}-input-mod`} className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {model.modality.input.map(m => (
                          <span key={m} className="px-2 py-0.5 rounded bg-bg-elevated text-text-secondary text-xs capitalize">
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-bg-secondary/50 transition-colors">
                  <td className="px-5 py-4 text-sm text-text-muted">Output Modality</td>
                  {selectedModels.map(model => (
                    <td key={`${model.provider}-${model.id}-output-mod`} className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {model.modality.output.map(m => (
                          <span key={m} className="px-2 py-0.5 rounded bg-bg-elevated text-text-secondary text-xs capitalize">
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
            className="btn btn-primary btn-lg"
          >
            <Download className="w-4 h-4" />
            Download Card
          </button>
          <button
            onClick={copyLink}
            className="btn btn-secondary btn-lg"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-success" />
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
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-bg-secondary flex items-center justify-center">
            <Plus className="w-8 h-8 text-text-muted" />
          </div>
          <p className="text-text-secondary mb-2">Select models above to start comparing</p>
          <p className="text-sm text-text-muted">You can compare up to 4 models side by side</p>
        </div>
      )}
    </div>
  )
}
