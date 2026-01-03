'use client'

import { useState, useMemo } from 'react'
import { Download, Link as LinkIcon, Check, Eye, Wrench, Brain, Sparkles } from 'lucide-react'
import { Model, formatPrice, formatContextWindow } from '@/lib/types'
import { getProviderColor } from '@/lib/gradients'

interface ModelCardPreviewProps {
  model: Model
}

// Generate dot matrix pattern - exactly like Cursor's Year in Review
function DotMatrix({ model }: { model: Model }) {
  const rows = 14
  const cols = 12
  const providerColor = getProviderColor(model.provider).color
  
  // Create activity pattern based on model capabilities
  const getActivityLevel = (row: number, col: number): 'active' | 'highlight' | 'muted' => {
    // Last column shows capability "bars"
    if (col === 11) {
      // Vision capability (rows 0-3)
      if (model.features.vision && row >= 0 && row <= 3) return 'active'
      // Tool Calling capability (rows 4-7)
      if (model.features.function_calling && row >= 4 && row <= 7) return 'active'
      // Reasoning capability or premium pricing (rows 8-11)
      if ((model.features.reasoning || (model.pricing?.input || 0) > 5) && row >= 8 && row <= 11) return 'highlight'
      // Multimodal (rows 6-8) 
      if (model.modality.input.includes('image') && row >= 5 && row <= 7) return 'highlight'
    }
    return 'muted'
  }
  
  return (
    <div 
      className="grid gap-[5px]" 
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: rows * cols }).map((_, index) => {
        const row = Math.floor(index / cols)
        const col = index % cols
        const level = getActivityLevel(row, col)
        
        return (
          <div
            key={index}
            className="w-[6px] h-[6px] rounded-full"
            style={{ 
              backgroundColor: level === 'active' 
                ? providerColor 
                : level === 'highlight' 
                  ? '#F54E00' 
                  : 'rgba(237, 236, 236, 0.08)'
            }}
          />
        )
      })}
    </div>
  )
}

export default function ModelCardPreview({ model }: ModelCardPreviewProps) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  
  const providerStyle = getProviderColor(model.provider)
  const cardUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/og/model/${model.provider}/${model.id}`
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/models/${model.provider}/${model.id}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadCard = async () => {
    setDownloading(true)
    try {
      const response = await fetch(cardUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${model.provider}-${model.id}-card.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
    setDownloading(false)
  }

  // Get capabilities list
  const capabilities = useMemo(() => {
    const caps = []
    if (model.features.vision) caps.push('Vision')
    if (model.features.function_calling) caps.push('Tool Calling')
    if (model.features.reasoning) caps.push('Reasoning')
    if (model.modality.input.includes('image') && !model.features.vision) caps.push('Multimodal')
    if (caps.length === 0) caps.push('Text Generation')
    return caps.slice(0, 3)
  }, [model])

  return (
    <div className="space-y-5">
      <div>
        <h2 className="heading-md text-text-primary mb-1">Share This Model</h2>
        <p className="text-sm text-text-muted">
          Download or share on social media
        </p>
      </div>

      {/* Card Preview - Cursor Style */}
      <div className="relative rounded-xl overflow-hidden bg-[#1A1915] border border-[rgba(237,236,236,0.1)]">
        {/* Subtle vertical lines */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(237,236,236,0.04) 1px, transparent 1px)',
            backgroundSize: '40px 100%'
          }}
        />

        <div className="relative p-6 flex gap-4">
          {/* Left Side - Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Provider */}
            <div className="text-[11px] text-text-muted tracking-wide uppercase mb-5">
              {model.providerDisplayName}
            </div>

            {/* Capabilities Section */}
            <div className="mb-5">
              <div className="text-[10px] text-text-muted tracking-widest uppercase mb-2.5">Capabilities</div>
              <div className="space-y-1.5">
                {capabilities.map((cap, i) => (
                  <div key={cap} className="flex items-center gap-2.5">
                    <span className="text-text-muted text-xs font-mono w-3">{i + 1}</span>
                    <span className="text-text-primary font-medium text-[13px]">{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-5">
              <div>
                <div className="text-[10px] text-text-muted tracking-wide uppercase mb-0.5">Input</div>
                <div className="text-lg font-semibold text-text-primary font-mono leading-tight">
                  {formatPrice(model.pricing?.input)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-text-muted tracking-wide uppercase mb-0.5">Output</div>
                <div className="text-lg font-semibold text-text-primary font-mono leading-tight">
                  {formatPrice(model.pricing?.output)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-text-muted tracking-wide uppercase mb-0.5">Tokens</div>
                <div className="text-lg font-semibold text-text-primary font-mono leading-tight">
                  {formatContextWindow(model.maxOutputTokens) || '—'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-text-muted tracking-wide uppercase mb-0.5">Type</div>
                <div className="text-lg font-semibold text-text-primary capitalize leading-tight">
                  {model.type}
                </div>
              </div>
            </div>

            {/* Model Name */}
            <div className="mt-auto pt-4 border-t border-[rgba(237,236,236,0.06)]">
              <div className="text-lg font-semibold text-text-primary leading-tight truncate">
                {model.name || model.id}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 mt-3">
              <div 
                className="w-4 h-4 rounded flex items-center justify-center"
                style={{ backgroundColor: providerStyle.color }}
              >
                <span className="text-white text-[8px] font-bold">P</span>
              </div>
              <span className="text-[10px] text-text-muted">portkey.ai/models</span>
            </div>
          </div>

          {/* Right Side - Dot Matrix */}
          <div className="flex-shrink-0 flex items-start pt-6">
            <DotMatrix model={model} />
          </div>
        </div>
      </div>

      {/* Action Buttons - Cursor Style Pill Buttons */}
      <div className="flex gap-3">
        <button
          onClick={downloadCard}
          disabled={downloading}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-text-primary text-bg-base font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {downloading ? 'Downloading...' : 'Download'}
        </button>
        <button
          onClick={copyLink}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#2A2925] text-text-primary font-medium text-sm hover:bg-[#353530] transition-all border border-[rgba(237,236,236,0.1)]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-success" />
              Copied!
            </>
          ) : (
            <>
              <LinkIcon className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  )
}
