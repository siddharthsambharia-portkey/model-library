# AI Model Directory

A world-class directory of AI models, providers, and their details — built by [Portkey](https://portkey.ai).

![AI Model Directory](https://models.portkey.ai/og-image.png)

## Features

- **600+ AI Models** — Comprehensive database of models from OpenAI, Anthropic, Google, Mistral, Cohere, and more
- **Searchable & Filterable Table** — Find any model instantly with fuzzy search and advanced filters
- **Individual Model Pages** — Detailed specs, pricing, and features for every model
- **Viral Shareable Cards** — Beautiful model cards with dynamic OG images for social sharing
- **Model Comparison** — Compare up to 4 models side-by-side
- **Price Calculator** — Estimate costs based on your usage patterns
- **Provider Pages** — Browse all models from a specific provider
- **SEO Optimized** — JSON-LD structured data, sitemap, and meta tags

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with CSS Variables
- **OG Images**: @vercel/og for dynamic image generation
- **Search**: Fuse.js for fuzzy search
- **Table**: TanStack Table for sorting, filtering, pagination
- **Icons**: Lucide React
- **Typography**: Sora font
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/portkey-ai/model-library.git
cd model-library

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the directory.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
model-library/
├── app/
│   ├── api/og/           # Dynamic OG image generation
│   ├── calculator/       # Price calculator page
│   ├── compare/          # Model comparison page
│   ├── models/
│   │   ├── [provider]/   # Provider pages
│   │   └── [provider]/[model]/  # Individual model pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   ├── sitemap.ts        # Dynamic sitemap
│   └── robots.ts         # Robots.txt config
├── components/
│   ├── Header.tsx        # Navigation header
│   ├── Hero.tsx          # Hero section
│   ├── LogoRibbon.tsx    # Animated customer logos
│   ├── ModelTable.tsx    # Main model table
│   ├── ModelCardPreview.tsx  # Shareable model card
│   ├── ComparisonBuilder.tsx # Comparison tool
│   ├── PriceCalculator.tsx   # Calculator component
│   └── JsonLd.tsx        # Structured data
├── lib/
│   ├── models.ts         # Data loading utilities
│   ├── types.ts          # TypeScript interfaces
│   ├── gradients.ts      # Provider gradient colors
│   └── utils.ts          # Helper functions
├── combined/             # Model data JSON files
└── public/               # Static assets
```

## Data Structure

Model data is stored in the `combined/` directory with one JSON file per provider:

```json
{
  "_defaults": {
    "organization": "OpenAI",
    "modality": "text->text"
  },
  "models": {
    "gpt-4o": {
      "max_input_tokens": 128000,
      "max_output_tokens": 16384,
      "features": {
        "tool_calling": true,
        "vision": true,
        "json_mode": true
      },
      "pricing": {
        "input_cost_per_token": 0.0000025,
        "output_cost_per_token": 0.00001
      }
    }
  }
}
```

## API (Coming Soon)

REST API endpoints for programmatic access to model data:

- `GET /api/models` — List all models
- `GET /api/models/:provider` — List models by provider
- `GET /api/models/:provider/:model` — Get specific model details

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Links

- [Portkey](https://portkey.ai) — AI Gateway for production LLMs
- [Portkey Docs](https://docs.portkey.ai) — Documentation
- [GitHub](https://github.com/portkey-ai) — Open source projects

---

Built with ❤️ by [Portkey](https://portkey.ai)

