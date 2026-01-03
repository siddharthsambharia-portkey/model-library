'use client'

import { useState } from 'react'
import { Download, Link as LinkIcon, Check, Eye, Wrench, Brain } from 'lucide-react'
import { Model, formatPrice, formatContextWindow } from '@/lib/types'
import { getProviderGradient } from '@/lib/gradients'

interface ModelCardPreviewProps {
  model: Model
}

export default function ModelCardPreview({ model }: ModelCardPreviewProps) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  
  const gradient = getProviderGradient(model.provider)
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

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-text-primary">Shareable Card</h2>
      <p className="text-sm text-text-secondary">
        Download or share this card on social media
      </p>

      {/* Card Preview */}
      <div 
        className="relative aspect-[1200/630] rounded-2xl overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${gradient.from}22, ${gradient.to}22)` }}
      >
        <div 
          className="absolute inset-0"
          style={{ 
            background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
            opacity: 0.15 
          }}
        />
        
        {/* Dot Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, ${gradient.from}40 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Card Content */}
        <div className="relative h-full p-8 flex flex-col">
          {/* Provider */}
          <div className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-auto">
            {model.providerDisplayName}
          </div>

          {/* Model Name */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-text-primary mb-1">
              {model.name}
            </h3>
            <p className="text-sm font-mono text-text-muted">
              {model.id}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-xs text-text-muted mb-1">Output</div>
              <div className="text-lg font-semibold text-text-primary">
                {formatContextWindow(model.maxOutputTokens) || '—'}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-xs text-text-muted mb-1">Input</div>
              <div className="text-lg font-semibold text-text-primary">
                {formatPrice(model.pricing?.input)}<span className="text-xs text-text-muted">/M</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-xs text-text-muted mb-1">Output</div>
              <div className="text-lg font-semibold text-text-primary">
                {formatPrice(model.pricing?.output)}<span className="text-xs text-text-muted">/M</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="flex items-center gap-2 mb-6">
            {model.features.vision && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                <Eye className="w-3 h-3" />
                Vision
              </div>
            )}
            {model.features.function_calling && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-400 text-xs font-medium">
                <Wrench className="w-3 h-3" />
                Tools
              </div>
            )}
            {model.features.reasoning && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 text-xs font-medium">
                <Brain className="w-3 h-3" />
                Reasoning
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <div 
              className="w-5 h-5 rounded flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
            >
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span>portkey.ai/models</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={downloadCard}
          disabled={downloading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {downloading ? 'Downloading...' : 'Download'}
        </button>
        <button
          onClick={copyLink}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors border border-white/10"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              Copied!
            </>
          ) : (
            <>
              <LinkIcon className="w-4 h-4" />
              Copy Link
            </>
          )}
        </button>
      </div>
    </div>
  )
}
