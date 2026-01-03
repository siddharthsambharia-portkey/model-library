import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'AI Model Directory | Portkey',
  description: 'The open source AI model directory. Compare pricing, features, and capabilities across 600+ models from 40+ providers.',
  keywords: ['AI models', 'LLM pricing', 'GPT-4', 'Claude', 'Gemini', 'model comparison', 'AI API'],
  authors: [{ name: 'Portkey', url: 'https://portkey.ai' }],
  openGraph: {
    title: 'AI Model Directory | Portkey',
    description: 'Compare pricing, features, and capabilities across 600+ models from 40+ providers.',
    type: 'website',
    siteName: 'Portkey Model Library',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Model Directory | Portkey',
    description: 'Compare pricing, features, and capabilities across 600+ models from 40+ providers.',
    creator: '@portkeyai',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://portkey.ai'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <JsonLd type="website" />
        <JsonLd type="organization" />
      </head>
      <body className="font-sans antialiased">
        {/* Background Grid Pattern - only on homepage, reduced opacity */}
        <div className="fixed inset-0 bg-grid-pattern opacity-20 pointer-events-none z-[-1]" />
        {children}
      </body>
    </html>
  )
}
