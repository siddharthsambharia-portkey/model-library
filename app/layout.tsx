import type { Metadata } from 'next'
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <JsonLd type="website" />
        <JsonLd type="organization" />
      </head>
      <body className="font-sora">
        {children}
      </body>
    </html>
  )
}
