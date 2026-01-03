'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Github, ExternalLink } from 'lucide-react'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-8 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-border-color">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/assets/Full Logo Light.png" 
            alt="Portkey" 
            width={120} 
            height={28}
            className="h-7 w-auto"
          />
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
          <Link 
            href="/" 
            className="px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all text-sm font-medium"
          >
            Models
          </Link>
          <Link 
            href="/compare" 
            className="px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all text-sm font-medium"
          >
            Compare
          </Link>
          <Link 
            href="/calculator" 
            className="px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all text-sm font-medium"
          >
            Calculator
          </Link>
        </nav>
      </div>
      
      <div className="flex items-center gap-3">
        <a 
          href="https://portkey.ai/docs" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all text-sm font-medium"
        >
          API Docs
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <a 
          href="https://github.com/portkey-ai/gateway" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all text-sm font-medium"
        >
          <Github className="w-4 h-4" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
        <a 
          href="https://portkey.ai" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-primary text-sm py-2 px-4"
        >
          Get Started
        </a>
      </div>
    </header>
  )
}

