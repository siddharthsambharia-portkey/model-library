'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  Wrench, 
  Brain,
  Copy,
  Check,
  ArrowUpDown,
  X,
  Filter
} from 'lucide-react'
import Fuse from 'fuse.js'
import { Model, Provider, formatPrice, formatContextWindow } from '@/lib/types'
import { getProviderGradient } from '@/lib/gradients'

interface ModelTableProps {
  models: Model[]
  providers: Provider[]
}

type SortField = 'provider' | 'name' | 'context' | 'inputPrice' | 'outputPrice'
type SortDirection = 'asc' | 'desc'

export default function ModelTable({ models, providers }: ModelTableProps) {
  const [search, setSearch] = useState('')
  const [selectedProviders, setSelectedProviders] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [sortField, setSortField] = useState<SortField>('provider')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Fuse.js for fuzzy search
  const fuse = useMemo(() => new Fuse(models, {
    keys: ['id', 'name', 'provider', 'providerDisplayName'],
    threshold: 0.3,
    ignoreLocation: true,
  }), [models])

  // Filter and sort models
  const filteredModels = useMemo(() => {
    let result = models

    // Apply search
    if (search.trim()) {
      const searchResults = fuse.search(search.trim())
      result = searchResults.map(r => r.item)
    }

    // Apply provider filter
    if (selectedProviders.length > 0) {
      result = result.filter(m => selectedProviders.includes(m.provider))
    }

    // Apply feature filters
    if (selectedFeatures.includes('vision')) {
      result = result.filter(m => m.features.vision)
    }
    if (selectedFeatures.includes('tools')) {
      result = result.filter(m => m.features.function_calling)
    }
    if (selectedFeatures.includes('reasoning')) {
      result = result.filter(m => m.features.reasoning)
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      let comparison = 0
      
      switch (sortField) {
        case 'provider':
          comparison = a.providerDisplayName.localeCompare(b.providerDisplayName)
          break
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'context':
          comparison = (a.maxOutputTokens || 0) - (b.maxOutputTokens || 0)
          break
        case 'inputPrice':
          comparison = (a.pricing?.input || 0) - (b.pricing?.input || 0)
          break
        case 'outputPrice':
          comparison = (a.pricing?.output || 0) - (b.pricing?.output || 0)
          break
      }
      
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [models, search, selectedProviders, selectedFeatures, sortField, sortDirection, fuse])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const toggleProvider = (providerId: string) => {
    setSelectedProviders(prev => 
      prev.includes(providerId) 
        ? prev.filter(p => p !== providerId)
        : [...prev, providerId]
    )
  }

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const clearFilters = () => {
    setSelectedProviders([])
    setSelectedFeatures([])
    setSearch('')
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-3.5 h-3.5" /> 
      : <ChevronDown className="w-3.5 h-3.5" />
  }

  const hasActiveFilters = selectedProviders.length > 0 || selectedFeatures.length > 0 || search.trim()

  return (
    <div className="model-table-section">
      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search models..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
              showFilters || hasActiveFilters
                ? 'border-white/20 bg-white/10 text-text-primary'
                : 'border-border-color text-text-secondary hover:text-text-primary hover:border-white/20'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full bg-violet-500 text-xs flex items-center justify-center">
                {selectedProviders.length + selectedFeatures.length + (search ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              Clear all
            </button>
          )}

          {/* Results Count */}
          <div className="ml-auto text-sm text-text-muted">
            {filteredModels.length} {filteredModels.length === 1 ? 'model' : 'models'}
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="p-4 rounded-xl bg-bg-secondary border border-border-color space-y-4">
            {/* Provider Filter */}
            <div>
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 block">
                Providers
              </label>
              <div className="flex flex-wrap gap-2">
                {providers.slice(0, 12).map(provider => (
                  <button
                    key={provider.id}
                    onClick={() => toggleProvider(provider.id)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      selectedProviders.includes(provider.id)
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                        : 'bg-white/5 text-text-secondary border border-transparent hover:bg-white/10'
                    }`}
                  >
                    {provider.name}
                    <span className="ml-1.5 text-text-muted">({provider.modelCount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Filter */}
            <div>
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 block">
                Features
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleFeature('vision')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                    selectedFeatures.includes('vision')
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/5 text-text-secondary border border-transparent hover:bg-white/10'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Vision
                </button>
                <button
                  onClick={() => toggleFeature('tools')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                    selectedFeatures.includes('tools')
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-white/5 text-text-secondary border border-transparent hover:bg-white/10'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  Tool Calling
                </button>
                <button
                  onClick={() => toggleFeature('reasoning')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                    selectedFeatures.includes('reasoning')
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-white/5 text-text-secondary border border-transparent hover:bg-white/10'
                  }`}
                >
                  <Brain className="w-3.5 h-3.5" />
                  Reasoning
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border-color overflow-hidden">
        <div className="overflow-x-auto">
          <table className="model-table w-full">
            <thead className="bg-bg-secondary">
              <tr>
                <th 
                  className="cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => handleSort('provider')}
                >
                  <div className="flex items-center gap-2">
                    Provider
                    <SortIcon field="provider" />
                  </div>
                </th>
                <th 
                  className="cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Model
                    <SortIcon field="name" />
                  </div>
                </th>
                <th 
                  className="cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => handleSort('context')}
                >
                  <div className="flex items-center gap-2">
                    Output
                    <SortIcon field="context" />
                  </div>
                </th>
                <th 
                  className="cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => handleSort('inputPrice')}
                >
                  <div className="flex items-center gap-2">
                    Input
                    <SortIcon field="inputPrice" />
                  </div>
                </th>
                <th 
                  className="cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => handleSort('outputPrice')}
                >
                  <div className="flex items-center gap-2">
                    Output
                    <SortIcon field="outputPrice" />
                  </div>
                </th>
                <th>Features</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredModels.map((model) => {
                const gradient = getProviderGradient(model.provider)
                return (
                  <tr key={`${model.provider}-${model.id}`} className="group">
                    <td>
                      <Link 
                        href={`/models/${model.provider}`}
                        className="flex items-center gap-2 hover:text-text-primary transition-colors"
                      >
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
                        />
                        <span className="text-text-secondary group-hover:text-text-primary transition-colors">
                          {model.providerDisplayName}
                        </span>
                      </Link>
                    </td>
                    <td>
                      <Link 
                        href={`/models/${model.provider}/${model.id}`}
                        className="font-medium text-text-primary hover:text-violet-400 transition-colors"
                      >
                        {model.id}
                      </Link>
                    </td>
                    <td className="text-text-secondary">
                      {formatContextWindow(model.maxOutputTokens)}
                    </td>
                    <td className="text-text-secondary">
                      {formatPrice(model.pricing?.input)}<span className="text-text-muted">/M</span>
                    </td>
                    <td className="text-text-secondary">
                      {formatPrice(model.pricing?.output)}<span className="text-text-muted">/M</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {model.features.vision && (
                          <span className="feature-badge active" title="Vision">
                            <Eye className="w-3 h-3" />
                          </span>
                        )}
                        {model.features.function_calling && (
                          <span className="feature-badge active" title="Tool Calling">
                            <Wrench className="w-3 h-3" />
                          </span>
                        )}
                        {model.features.reasoning && (
                          <span className="feature-badge active" title="Reasoning">
                            <Brain className="w-3 h-3" />
                          </span>
                        )}
                        {!model.features.vision && !model.features.function_calling && !model.features.reasoning && (
                          <span className="text-text-muted text-sm">—</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => copyToClipboard(model.id, model.id)}
                        className="p-1.5 rounded-md hover:bg-white/10 text-text-muted hover:text-text-primary transition-all opacity-0 group-hover:opacity-100"
                        title="Copy model ID"
                      >
                        {copiedId === model.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredModels.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-text-muted">No models found matching your criteria.</p>
            <button 
              onClick={clearFilters}
              className="mt-4 text-sm text-violet-400 hover:text-violet-300"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
