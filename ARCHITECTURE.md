# Architecture Guide

This document provides a comprehensive technical overview of the AI Model Directory codebase. It is designed to help developers and AI assistants understand the project structure, data flow, and design decisions.

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Directory Structure](#directory-structure)
4. [Data Layer](#data-layer)
5. [Component Architecture](#component-architecture)
6. [Routing & Pages](#routing--pages)
7. [Styling System](#styling-system)
8. [OG Image Generation](#og-image-generation)
9. [SEO Strategy](#seo-strategy)
10. [Key Design Decisions](#key-design-decisions)

---

## Overview

The AI Model Directory is a Next.js 14 application that serves as a comprehensive database of AI models from various providers. It reads model data from JSON files, processes them, and presents them through a beautiful, searchable interface.

### Core Functionality

1. **Model Discovery** — Browse 600+ AI models in a filterable table
2. **Model Details** — View specifications, pricing, and features for each model
3. **Comparison** — Compare up to 4 models side-by-side
4. **Price Calculator** — Estimate costs based on usage
5. **Shareable Cards** — Generate viral social media cards with dynamic OG images

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| @vercel/og | Dynamic OG image generation |
| Fuse.js | Fuzzy search |
| TanStack Table | Table sorting, filtering, pagination |
| Lucide React | Icons |
| Sora (Google Fonts) | Typography |

---

## Directory Structure

```
model-library/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   └── og/               # OG image generation endpoints
│   │       ├── model/[provider]/[model]/route.tsx
│   │       └── compare/route.tsx
│   ├── calculator/           # Price calculator page
│   │   └── page.tsx
│   ├── compare/              # Comparison tool page
│   │   └── page.tsx
│   ├── models/               # Model pages (dynamic routes)
│   │   ├── [provider]/       # Provider listing page
│   │   │   ├── page.tsx
│   │   │   └── [model]/      # Individual model page
│   │   │       └── page.tsx
│   ├── globals.css           # Global styles + Tailwind
│   ├── layout.tsx            # Root layout (fonts, metadata)
│   ├── page.tsx              # Home page
│   ├── not-found.tsx         # 404 page
│   ├── sitemap.ts            # Dynamic sitemap generation
│   └── robots.ts             # Robots.txt configuration
│
├── components/               # React components
│   ├── Header.tsx            # Navigation header
│   ├── Hero.tsx              # Hero section with CTA
│   ├── LogoRibbon.tsx        # Animated customer logo ribbon
│   ├── ModelTable.tsx        # Main searchable table (client)
│   ├── ModelCardPreview.tsx  # Shareable card preview (client)
│   ├── ComparisonBuilder.tsx # Model comparison UI (client)
│   ├── PriceCalculator.tsx   # Cost calculator (client)
│   └── JsonLd.tsx            # Structured data component
│
├── lib/                      # Utilities and data
│   ├── models.ts             # Data loading (server-only)
│   ├── types.ts              # TypeScript interfaces (shared)
│   ├── gradients.ts          # Provider color gradients
│   └── utils.ts              # Helper functions (cn, formatters)
│
├── combined/                 # Model data (JSON files)
│   ├── openai.json
│   ├── anthropic.json
│   ├── google.json
│   ├── mistral.json
│   └── ... (one file per provider)
│
├── public/                   # Static assets
│   ├── portkey-logo.svg
│   └── customer-logo-ribbon-*.png
│
└── Configuration files
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── next.config.js
    └── postcss.config.js
```

---

## Data Layer

### Source Data Format

Model data is stored in `combined/` as JSON files, one per provider. Each file follows this structure:

```typescript
// Example: combined/openai.json
{
  "_defaults": {
    "organization": "OpenAI",
    "modality": "text->text",
    "supports_system_prompt": true
  },
  "models": {
    "gpt-4o": {
      "max_input_tokens": 128000,
      "max_output_tokens": 16384,
      "modality": "text+image->text",  // Overrides _defaults
      "features": {
        "tool_calling": true,
        "vision": true,
        "json_mode": true,
        "function_calling": true
      },
      "pricing": {
        "input_cost_per_token": 0.0000025,
        "output_cost_per_token": 0.00001
      }
    },
    // ... more models
  }
}
```

### Type Definitions (`lib/types.ts`)

This file contains all shared TypeScript interfaces. It's designed to be importable by both server and client components.

```typescript
// Core interfaces
interface ModelPricing {
  input_cost_per_token?: number;
  output_cost_per_token?: number;
  per_request_cost?: number;
  // ... more pricing fields
}

interface ModelFeatures {
  tool_calling?: boolean;
  vision?: boolean;
  json_mode?: boolean;
  streaming?: boolean;
  // ... more feature flags
}

interface ProcessedModel {
  id: string;
  provider: string;
  organization: string;
  modality: string;
  max_input_tokens?: number;
  max_output_tokens?: number;
  features: ModelFeatures;
  pricing: ModelPricing;
}

interface ProviderData {
  name: string;
  slug: string;
  modelCount: number;
  models: ProcessedModel[];
}
```

### Data Loading (`lib/models.ts`)

**Important**: This file uses Node.js `fs` module and can ONLY be imported in:
- Server Components
- API Routes
- `generateStaticParams` functions

**Never import this file in client components** — it will cause build errors.

```typescript
// Server-only functions
export function getAllModels(): ProcessedModel[]
export function getModelsByProvider(provider: string): ProcessedModel[]
export function getModel(provider: string, modelId: string): ProcessedModel | null
export function getAllProviders(): ProviderData[]
export function getProviderNames(): string[]
```

### Data Flow

```
combined/*.json
      │
      ▼
lib/models.ts (server-side, reads fs)
      │
      ▼
Server Components / API Routes
      │
      ▼
Props passed to Client Components
```

---

## Component Architecture

### Server vs Client Components

Next.js 14 App Router uses React Server Components by default. Components that need interactivity must be marked with `'use client'`.

| Component | Type | Why |
|-----------|------|-----|
| `Header.tsx` | Server | Static navigation |
| `Hero.tsx` | Server | Static content |
| `LogoRibbon.tsx` | Client | CSS animations with JS |
| `ModelTable.tsx` | Client | Search, sort, filter, pagination |
| `ModelCardPreview.tsx` | Client | Interactive card with copy/share |
| `ComparisonBuilder.tsx` | Client | Model selection, state |
| `PriceCalculator.tsx` | Client | Form inputs, calculations |
| `JsonLd.tsx` | Server | Static structured data |

### Component Hierarchy

```
layout.tsx (Server)
├── Header (Server)
└── page.tsx (Server)
    ├── Hero (Server)
    ├── LogoRibbon (Client)
    └── ModelTable (Client)
        └── Receives models as props (serialized from server)

models/[provider]/[model]/page.tsx (Server)
├── Model details (Server-rendered)
├── ModelCardPreview (Client)
└── JsonLd (Server)
```

### Props Serialization

Data flows from server to client via props. The data must be JSON-serializable:

```typescript
// In page.tsx (Server Component)
const models = getAllModels(); // Server-side data fetch

return (
  <ModelTable initialModels={models} /> // Passed as props
);

// In ModelTable.tsx (Client Component)
'use client';
export function ModelTable({ initialModels }: { initialModels: ProcessedModel[] }) {
  // Client-side interactivity with the data
}
```

---

## Routing & Pages

### Route Structure

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Home with hero + model table |
| `/models/[provider]` | `app/models/[provider]/page.tsx` | Provider's model list |
| `/models/[provider]/[model]` | `app/models/[provider]/[model]/page.tsx` | Model detail + card |
| `/compare` | `app/compare/page.tsx` | Comparison tool |
| `/calculator` | `app/calculator/page.tsx` | Price calculator |
| `/api/og/model/[provider]/[model]` | API route | OG image for model |
| `/api/og/compare` | API route | OG image for comparison |

### Dynamic Routes

Provider and model pages use Next.js dynamic segments:

```typescript
// app/models/[provider]/[model]/page.tsx
export async function generateStaticParams() {
  const models = getAllModels();
  return models.map((model) => ({
    provider: model.provider,
    model: encodeURIComponent(model.id),
  }));
}

export default function ModelPage({ 
  params 
}: { 
  params: { provider: string; model: string } 
}) {
  const modelId = decodeURIComponent(params.model);
  const model = getModel(params.provider, modelId);
  // ...
}
```

### URL Encoding

Model IDs often contain special characters (e.g., `gpt-4o-2024-08-06`, `claude-3-opus@20240229`). Always use:
- `encodeURIComponent()` when building URLs
- `decodeURIComponent()` when reading params

---

## Styling System

### Design Tokens

Based on OpenAI's design system (see `styles.md`), implemented via Tailwind + CSS variables:

```css
/* app/globals.css */
:root {
  --background: 0 0% 3%;      /* Near black */
  --foreground: 0 0% 98%;     /* Near white */
  --muted: 0 0% 15%;          /* Dark gray */
  --accent: 142 76% 36%;      /* Green accent */
}
```

### Tailwind Configuration

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      muted: 'hsl(var(--muted))',
      accent: 'hsl(var(--accent))',
    },
    fontFamily: {
      sans: ['var(--font-sora)', 'system-ui', 'sans-serif'],
    },
  },
}
```

### Provider Gradients (`lib/gradients.ts`)

Each provider has a unique gradient for visual identity:

```typescript
export const providerGradients: Record<string, ProviderGradient> = {
  openai: {
    from: '#10a37f',      // OpenAI green
    to: '#1a7f5a',
    accent: '#10a37f',
  },
  anthropic: {
    from: '#d4a574',      // Anthropic tan/orange
    to: '#c9956c',
    accent: '#d4a574',
  },
  google: {
    from: '#4285f4',      // Google blue
    to: '#34a853',        // Google green
    accent: '#4285f4',
  },
  // ... more providers
};
```

---

## OG Image Generation

### How It Works

We use `@vercel/og` to generate dynamic images at request time. These images are used for social media previews when sharing model pages.

### Model Card OG Image

**Route**: `/api/og/model/[provider]/[model]/route.tsx`

```typescript
import { ImageResponse } from '@vercel/og';

export async function GET(request: Request, { params }) {
  const model = getModel(params.provider, params.model);
  const gradient = getProviderGradient(params.provider);
  
  return new ImageResponse(
    (
      <div style={{ /* JSX with inline styles */ }}>
        {/* Card design with model info */}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

### Constraints

- `@vercel/og` uses Satori under the hood
- Only subset of CSS is supported (flexbox, no grid)
- All styles must be inline `style={{}}` objects
- Limited font support (must be loaded explicitly)
- Images must be absolute URLs or base64

### Meta Tags Integration

```typescript
// app/models/[provider]/[model]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    openGraph: {
      images: [{
        url: `/api/og/model/${params.provider}/${params.model}`,
        width: 1200,
        height: 630,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`/api/og/model/${params.provider}/${params.model}`],
    },
  };
}
```

---

## SEO Strategy

### Structured Data (JSON-LD)

Each model page includes schema.org Product markup:

```typescript
// components/JsonLd.tsx
export function JsonLd({ model }: { model: ProcessedModel }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: model.id,
    brand: { '@type': 'Brand', name: model.organization },
    description: `AI model by ${model.organization}`,
    // ... pricing, features as structured data
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

### Sitemap Generation

```typescript
// app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  const models = getAllModels();
  
  return [
    { url: 'https://models.portkey.ai', priority: 1 },
    { url: 'https://models.portkey.ai/compare', priority: 0.8 },
    { url: 'https://models.portkey.ai/calculator', priority: 0.8 },
    ...models.map((model) => ({
      url: `https://models.portkey.ai/models/${model.provider}/${model.id}`,
      priority: 0.6,
    })),
  ];
}
```

### Robots.txt

```typescript
// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://models.portkey.ai/sitemap.xml',
  };
}
```

---

## Key Design Decisions

### 1. Server-Side Data Loading

**Decision**: Load model data from filesystem on the server, pass to client via props.

**Rationale**: 
- No API calls needed for initial render
- Data is baked into the page at build time (SSG) or request time (SSR)
- Client bundle doesn't include data loading logic

### 2. Separate Types File

**Decision**: Put TypeScript interfaces in `lib/types.ts`, keep data loading in `lib/models.ts`.

**Rationale**:
- `types.ts` can be imported anywhere (server + client)
- `models.ts` uses `fs` and can only be server-side
- Prevents "Module not found: fs" errors in client components

### 3. Client Components for Interactivity

**Decision**: Keep interactive features in dedicated client components.

**Rationale**:
- Server components can't use hooks, event handlers, or browser APIs
- Isolating client code minimizes JavaScript bundle size
- Clear separation of concerns

### 4. Dynamic OG Images

**Decision**: Generate OG images on-demand via API routes.

**Rationale**:
- 600+ models would require 600+ static images
- Dynamic generation ensures images are always up-to-date
- Vercel Edge runtime makes generation fast

### 5. URL-Encoded Model IDs

**Decision**: Use `encodeURIComponent` for model IDs in URLs.

**Rationale**:
- Model IDs contain `/`, `@`, `:` characters
- URL encoding ensures valid URLs
- Consistent handling across all routes

---

## Common Tasks

### Adding a New Provider

1. Create `combined/newprovider.json` with the standard format
2. Add gradient colors to `lib/gradients.ts`
3. Models will automatically appear in the table

### Adding a New Feature Flag

1. Add the field to `ModelFeatures` interface in `lib/types.ts`
2. Update `ModelTable.tsx` to display the feature
3. Update `ModelCardPreview.tsx` if it should appear on cards

### Adding a New Page

1. Create `app/newpage/page.tsx`
2. Add navigation link to `components/Header.tsx`
3. Add to sitemap in `app/sitemap.ts`

### Modifying the Model Card Design

1. Edit `components/ModelCardPreview.tsx` for the preview
2. Edit `app/api/og/model/[provider]/[model]/route.tsx` for the OG image
3. Keep both in sync (OG has CSS limitations)

---

## Troubleshooting

### "Module not found: Can't resolve 'fs'"

**Cause**: Importing `lib/models.ts` in a client component.

**Fix**: Only import types from `lib/types.ts` in client components. Pass data as props from server components.

### OG Image Not Updating

**Cause**: Browser/CDN caching.

**Fix**: Add a cache-busting query param or wait for cache to expire.

### Model Not Found

**Cause**: URL encoding mismatch.

**Fix**: Ensure `encodeURIComponent` when building URLs and `decodeURIComponent` when reading params.

---

## Performance Considerations

1. **Static Generation**: Most pages can be statically generated at build time
2. **Client-Side Search**: Fuse.js runs entirely in the browser, no API calls
3. **Lazy Loading**: Table pagination limits DOM nodes
4. **Image Optimization**: Next.js Image component for customer logos
5. **Font Loading**: Sora font loaded via `next/font` for optimal loading

---

*Last updated: January 2026*

