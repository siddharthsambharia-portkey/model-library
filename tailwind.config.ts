import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'SF Mono', 'Consolas', 'monospace'],
      },
      colors: {
        // Background Colors - Warm Dark
        'bg-base': '#0C0B09',
        'bg-primary': '#13120F',
        'bg-secondary': '#1A1915',
        'bg-elevated': '#21201B',
        'bg-hover': '#2A2822',
        
        // Text Colors - Warm Whites
        'text-primary': '#EDECEC',
        'text-secondary': 'rgba(237, 236, 236, 0.64)',
        'text-muted': 'rgba(237, 236, 236, 0.40)',
        'text-faint': 'rgba(237, 236, 236, 0.20)',
        
        // Accent Colors
        'accent': {
          DEFAULT: '#0EA5E9',
          primary: '#0EA5E9',
          secondary: '#F54E00',
          tertiary: '#10B981',
        },
        
        // Provider Colors (Flat)
        'provider': {
          anthropic: '#D4A574',
          openai: '#10B981',
          google: '#4285F4',
          mistral: '#FF7000',
          deepseek: '#0891B2',
          cohere: '#FF5A5A',
          meta: '#0866FF',
          xai: '#A3A3A3',
          groq: '#F97316',
          together: '#8B5CF6',
          fireworks: '#EF4444',
          perplexity: '#0EA5E9',
          azure: '#0078D4',
          bedrock: '#FF9900',
          cerebras: '#FF6B35',
          ai21: '#4ADE80',
          reka: '#F472B6',
        },
        
        // Border Colors
        'border-primary': 'rgba(237, 236, 236, 0.10)',
        'border-secondary': 'rgba(237, 236, 236, 0.06)',
        'border-hover': 'rgba(237, 236, 236, 0.16)',
        
        // Semantic Colors
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
        'info': '#0EA5E9',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '14px',
        'xl': '20px',
        '2xl': '24px',
      },
      boxShadow: {
        'glow-sm': '0 0 20px -5px rgba(14, 165, 233, 0.3)',
        'glow-md': '0 0 40px -10px rgba(14, 165, 233, 0.4)',
        'glow-accent': '0 0 60px -15px rgba(245, 78, 0, 0.4)',
        'elevated': '0 8px 32px -8px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'fade-in-up': 'fadeInUp 0.6s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'scroll-x': 'scrollX 40s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scrollX: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, rgba(237, 236, 236, 0.06) 1px, transparent 1px)',
        'dot-pattern': 'radial-gradient(circle at center, rgba(237, 236, 236, 0.1) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundSize: {
        'grid': '80px 100%',
        'dot': '24px 24px',
      },
    },
  },
  plugins: [],
}

export default config
