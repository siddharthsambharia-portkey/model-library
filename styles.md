# Design System & Style Guide
> Based on OpenAI's modern dark theme aesthetic

---

## Table of Contents
1. [Foundation](#foundation)
2. [Colors](#colors)
3. [Typography](#typography)
4. [Spacing](#spacing)
5. [Layout](#layout)
6. [Components](#components)
7. [Animations & Transitions](#animations--transitions)
8. [Responsive Breakpoints](#responsive-breakpoints)
9. [CSS Variables Reference](#css-variables-reference)
10. [Implementation Examples](#implementation-examples)

---

## Foundation

### Base Reset
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    font-size: 16px;              /* Base font size for rem calculations */
    scroll-behavior: smooth;
}

body {
    font-family: 'Sora', -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
}
```

### Font Import
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

---

## Colors

### Primary Palette (Dark Theme)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#000000` | Main background |
| `--bg-secondary` | `#0a0a0a` | Secondary/elevated backgrounds |
| `--text-primary` | `#ffffff` | Primary text, headings |
| `--text-secondary` | `rgba(255, 255, 255, 0.6)` | Secondary text, descriptions |
| `--text-muted` | `rgba(255, 255, 255, 0.44)` | Muted text, placeholders |
| `--border-color` | `rgba(255, 255, 255, 0.12)` | Borders, dividers |

### Interactive States

| State | Background | Text |
|-------|------------|------|
| Default | `rgba(255, 255, 255, 0.1)` | `var(--text-primary)` |
| Hover | `rgba(255, 255, 255, 0.15)` | `var(--text-primary)` |
| Active | `rgba(255, 255, 255, 0.08)` | `var(--text-primary)` |

### Gradient Colors (Feature Cards)

#### Pink/Purple Gradient
```css
background: 
    radial-gradient(ellipse at 30% 70%, #f472b6 0%, transparent 50%),
    radial-gradient(ellipse at 70% 30%, #c084fc 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, #e879f9 0%, transparent 60%),
    linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #d946ef 100%);
```

#### Orange/Yellow Gradient
```css
background: 
    radial-gradient(ellipse at 20% 80%, #fb7185 0%, transparent 45%),
    radial-gradient(ellipse at 80% 20%, #fbbf24 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, #fb923c 0%, transparent 55%),
    linear-gradient(135deg, #f472b6 0%, #fb923c 50%, #fcd34d 100%);
```

#### Blue/Lavender Gradient
```css
background: 
    radial-gradient(ellipse at 30% 70%, #ddd6fe 0%, transparent 50%),
    radial-gradient(ellipse at 70% 30%, #93c5fd 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, #a5b4fc 0%, transparent 55%),
    linear-gradient(135deg, #e9d5ff 0%, #bfdbfe 50%, #c7d2fe 100%);
```

### Color Tokens (Hex Reference)

| Name | Hex | Preview |
|------|-----|---------|
| Pink 400 | `#f472b6` | 🟣 |
| Pink 500 | `#ec4899` | 🔴 |
| Purple 400 | `#c084fc` | 🟣 |
| Purple 500 | `#a855f7` | 🟣 |
| Fuchsia 400 | `#e879f9` | 🟣 |
| Fuchsia 500 | `#d946ef` | 🟣 |
| Rose 400 | `#fb7185` | 🔴 |
| Orange 400 | `#fb923c` | 🟠 |
| Amber 400 | `#fbbf24` | 🟡 |
| Yellow 300 | `#fcd34d` | 🟡 |
| Violet 200 | `#ddd6fe` | 🟣 |
| Blue 300 | `#93c5fd` | 🔵 |
| Indigo 300 | `#a5b4fc` | 🔵 |
| Purple 200 | `#e9d5ff` | 🟣 |
| Blue 200 | `#bfdbfe` | 🔵 |
| Indigo 200 | `#c7d2fe` | 🔵 |

---

## Typography

### Font Family Stack
```css
font-family: 'Sora', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Font Weights
| Weight | Value | Usage |
|--------|-------|-------|
| Light | `300` | Rarely used |
| Regular | `400` | Body text, descriptions |
| Medium | `500` | Headlines, buttons, navigation |
| Semibold | `600` | Card titles |
| Bold | `700` | Logo, brand text |
| Extrabold | `800` | Emphasis logos (stripe) |

### Type Scale

#### Hero Title (H1)
```css
.hero-title {
    font-size: clamp(2.5rem, 6vw, 4.5rem);  /* 40px → 72px */
    font-weight: 500;
    letter-spacing: -0.03em;
    line-height: 1.1;
    text-wrap: balance;
}
```

#### Section Title (H2)
```css
.section-title {
    font-size: clamp(2rem, 4vw, 3rem);      /* 32px → 48px */
    font-weight: 500;
    letter-spacing: -0.02em;
    line-height: 1.2;
}
```

#### Logo Text
```css
.logo {
    font-size: 1.5rem;                       /* 24px */
    font-weight: 700;
    letter-spacing: -0.02em;
}
```

#### Body Text (Paragraph)
```css
.section-description {
    font-size: 1.0625rem;                    /* 17px */
    line-height: 1.75;
    letter-spacing: normal;
}
```

#### Navigation Links
```css
.nav-link {
    font-size: 0.9375rem;                    /* 15px */
    font-weight: 400;
}
```

#### Button Text
```css
.btn {
    font-size: 0.9375rem;                    /* 15px */
    font-weight: 500;
}
```

#### Small Text (Labels, Back Links)
```css
.nav-back {
    font-size: 0.875rem;                     /* 14px */
}

.login-btn {
    font-size: 0.875rem;                     /* 14px */
    font-weight: 500;
}
```

### Letter Spacing Guide
| Type | Value |
|------|-------|
| Tight (headings) | `-0.03em` |
| Slightly tight | `-0.02em` |
| Normal | `0` |
| Expanded (logos) | `0.08em` to `0.2em` |

---

## Spacing

### Spacing Scale (rem)
| Token | Value | Pixels |
|-------|-------|--------|
| `--spacing-xs` | `0.5rem` | 8px |
| `--spacing-sm` | `1rem` | 16px |
| `--spacing-md` | `1.5rem` | 24px |
| `--spacing-lg` | `2rem` | 32px |
| `--spacing-xl` | `3rem` | 48px |
| `--spacing-2xl` | `5rem` | 80px |
| `--spacing-3xl` | `7.5rem` | 120px |

### Fixed Dimensions
| Token | Value | Usage |
|-------|-------|-------|
| `--header-height` | `64px` | Header bar height |
| `--nav-width` | `200px` | Sidebar width |

### Component Spacing

#### Buttons
```css
/* Primary/Secondary buttons */
padding: 0.875rem 1.5rem;      /* 14px 24px */

/* Login/small buttons */
padding: 0.5rem 1.25rem;       /* 8px 20px */
```

#### Navigation Links
```css
padding: 0.625rem 0.875rem;    /* 10px 14px */
```

#### Cards
```css
padding: var(--spacing-lg);    /* 32px */
gap: var(--spacing-md);        /* 24px between cards */
```

#### Sections
```css
/* Hero section */
padding: var(--spacing-3xl) var(--spacing-lg);  /* 120px 32px */
gap: var(--spacing-lg);                          /* 32px */

/* Content sections */
padding: var(--spacing-2xl) var(--spacing-lg);  /* 80px 32px */
gap: var(--spacing-lg);                          /* 32px */
```

---

## Layout

### Page Structure
```
┌─────────────────────────────────────────────────────────┐
│  Header (fixed, height: 64px, z-index: 100)             │
├──────────┬──────────────────────────────────────────────┤
│ Sidebar  │                                              │
│ (fixed)  │           Main Content                       │
│ 200px    │           (flex: 1, margin-left: 200px)      │
│          │                                              │
│          │                                              │
│          │                                              │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

### Header Layout
```css
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--header-height);        /* 64px */
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--spacing-lg);        /* 0 32px */
    z-index: 100;
    background: var(--bg-primary);
}
```

### Sidebar Layout
```css
.sidebar {
    position: fixed;
    left: 0;
    top: var(--header-height);           /* 64px */
    width: var(--nav-width);             /* 200px */
    height: calc(100vh - var(--header-height));
    padding: var(--spacing-lg) var(--spacing-md);  /* 32px 24px */
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);              /* 8px */
}
```

### Main Content Layout
```css
.main {
    flex: 1;
    margin-left: var(--nav-width);       /* 200px */
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);             /* 80px */
    padding: var(--spacing-xl) var(--spacing-lg);  /* 48px 32px */
}
```

### Grid Layouts

#### 3-Column Card Grid
```css
.model-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);              /* 24px */
    max-width: 1100px;
}
```

#### Flexible Logo Row
```css
.logos-grid {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: clamp(2rem, 6vw, 5rem);         /* 32px → 80px */
    flex-wrap: wrap;
}
```

---

## Components

### Buttons

#### Primary Button (Light on Dark)
```css
.btn-secondary {
    padding: 0.875rem 1.5rem;
    border-radius: 9999px;               /* Fully rounded */
    font-size: 0.9375rem;
    font-weight: 500;
    background: var(--text-primary);     /* White */
    color: var(--bg-primary);            /* Black */
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
}
```

#### Ghost Button (Transparent)
```css
.btn-outline {
    padding: 0.875rem 1.5rem;
    border-radius: 9999px;
    font-size: 0.9375rem;
    font-weight: 500;
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-outline:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
}
```

#### Small Button (Login)
```css
.login-btn {
    padding: 0.5rem 1.25rem;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 9999px;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
}

.login-btn:hover {
    background: rgba(255, 255, 255, 0.15);
}
```

### Navigation Links

#### Standard Nav Link
```css
.nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.9375rem;
    padding: 0.625rem 0.875rem;
    border-radius: 8px;
    transition: all 0.2s;
}

.nav-link:hover {
    color: var(--text-primary);
}

.nav-link.active {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-primary);
}
```

#### Back Link
```css
.nav-back {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.875rem;
    padding: 0.5rem 0.75rem;
    margin-bottom: var(--spacing-sm);
    transition: color 0.2s;
}

.nav-back:hover {
    color: var(--text-primary);
}
```

### Cards

#### Feature Card (Gradient)
```css
.model-card {
    aspect-ratio: 1 / 1.15;
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.model-card:hover {
    transform: scale(1.03) translateY(-4px);
}

.model-card::before {
    content: '';
    position: absolute;
    inset: 0;
    /* Apply gradient backgrounds here */
}

.model-card-content {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: var(--spacing-lg);
}
```

### Icons

#### Icon Sizes
| Size | Dimensions | Usage |
|------|------------|-------|
| Small | `16px × 16px` | Navigation arrows |
| Medium | `20px × 20px` | Header icons, inline icons |
| Large | `24px × 24px` | Feature icons |
| XL | `32px × 32px` | Footer/floating icons |

#### Icon Button
```css
.header-icon,
.search-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    cursor: pointer;
    transition: color 0.2s;
}

.header-icon:hover,
.search-btn:hover {
    color: var(--text-primary);
}
```

### Footer Widget
```css
.footer-icon {
    position: fixed;
    bottom: var(--spacing-lg);           /* 32px */
    left: var(--spacing-lg);             /* 32px */
    width: 32px;
    height: 32px;
    color: var(--text-muted);
    cursor: pointer;
    transition: color 0.2s;
}

.footer-icon:hover {
    color: var(--text-secondary);
}
```

---

## Animations & Transitions

### Default Transition
```css
transition: all 0.2s;
/* or */
transition: color 0.2s;
transition: background 0.2s;
```

### Card Hover Transition
```css
transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

### Page Load Animation
```css
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Apply to elements */
.element {
    animation: fadeInUp 0.8s ease forwards;
}
```

### Staggered Animation Delays
```css
.hero-title { animation-delay: 0s; }
.hero-buttons { animation-delay: 0.1s; }
.logos-grid { animation-delay: 0.2s; }
.section-title { animation-delay: 0.3s; }
.section-description { animation-delay: 0.4s; }
.model-cards { animation-delay: 0.5s; }
```

### Hover Effects

#### Button Lift
```css
.btn:hover {
    transform: translateY(-1px);
}
```

#### Card Scale + Lift
```css
.card:hover {
    transform: scale(1.03) translateY(-4px);
}
```

---

## Responsive Breakpoints

### Breakpoint Values
| Name | Value | Typical Use |
|------|-------|-------------|
| Mobile | `max-width: 768px` | Single column, hidden sidebar |
| Tablet | `max-width: 1024px` | 2-column grid |
| Desktop | `> 1024px` | Full layout |

### Mobile Styles (≤ 768px)
```css
@media (max-width: 768px) {
    .sidebar {
        display: none;
    }

    .main {
        margin-left: 0;
    }

    .hero-title {
        font-size: 2.5rem;
    }

    .logos-grid {
        gap: var(--spacing-xl);
    }

    .logo-item {
        font-size: 1.25rem;
    }

    .model-cards {
        grid-template-columns: 1fr;
        max-width: 400px;
    }

    .hero-buttons {
        flex-direction: column;
        width: 100%;
        max-width: 300px;
    }

    .btn {
        justify-content: center;
    }
}
```

### Tablet Styles (≤ 1024px)
```css
@media (max-width: 1024px) {
    .model-cards {
        grid-template-columns: repeat(2, 1fr);
    }
}
```

---

## CSS Variables Reference

### Complete Variables Block
```css
:root {
    /* Colors */
    --bg-primary: #000000;
    --bg-secondary: #0a0a0a;
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.6);
    --text-muted: rgba(255, 255, 255, 0.44);
    --border-color: rgba(255, 255, 255, 0.12);
    
    /* Spacing */
    --spacing-xs: 0.5rem;      /* 8px */
    --spacing-sm: 1rem;        /* 16px */
    --spacing-md: 1.5rem;      /* 24px */
    --spacing-lg: 2rem;        /* 32px */
    --spacing-xl: 3rem;        /* 48px */
    --spacing-2xl: 5rem;       /* 80px */
    --spacing-3xl: 7.5rem;     /* 120px */
    
    /* Layout */
    --nav-width: 200px;
    --header-height: 64px;
    
    /* Border Radius */
    --radius-sm: 8px;
    --radius-md: 20px;
    --radius-full: 9999px;
}
```

---

## Implementation Examples

### HTML Structure Template
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-left">
            <a href="#" class="logo">Brand</a>
        </div>
        <div class="header-right">
            <button class="login-btn">Log in</button>
        </div>
    </header>

    <div class="layout">
        <!-- Sidebar -->
        <nav class="sidebar">
            <a href="#" class="nav-link active">Dashboard</a>
            <a href="#" class="nav-link">Settings</a>
        </nav>

        <!-- Main Content -->
        <main class="main">
            <section class="hero">
                <h1 class="hero-title">Your Headline Here</h1>
                <div class="hero-buttons">
                    <a href="#" class="btn btn-secondary">Primary Action</a>
                    <a href="#" class="btn btn-outline">Secondary Action ↗</a>
                </div>
            </section>
        </main>
    </div>
</body>
</html>
```

### Quick Reference Cheatsheet

| Element | Font Size | Font Weight | Padding | Border Radius |
|---------|-----------|-------------|---------|---------------|
| H1 (Hero) | `clamp(2.5rem, 6vw, 4.5rem)` | 500 | — | — |
| H2 (Section) | `clamp(2rem, 4vw, 3rem)` | 500 | — | — |
| Body | `1.0625rem` | 400 | — | — |
| Nav Link | `0.9375rem` | 400 | `0.625rem 0.875rem` | `8px` |
| Button | `0.9375rem` | 500 | `0.875rem 1.5rem` | `9999px` |
| Small Button | `0.875rem` | 500 | `0.5rem 1.25rem` | `9999px` |
| Card | — | — | `2rem` | `20px` |

---

## Best Practices

### Do's ✅
- Use CSS variables for all colors and spacing
- Apply `text-wrap: balance` to headlines
- Use `clamp()` for responsive typography
- Add subtle hover transitions (0.2s)
- Use `rgba()` for transparent overlays
- Apply `-webkit-font-smoothing: antialiased`

### Don'ts ❌
- Don't use borders for containers (use background instead)
- Don't mix px and rem units inconsistently
- Don't skip hover states
- Don't use hard-coded colors outside variables
- Don't forget mobile breakpoints

---

*Last updated: January 2026*
*Based on OpenAI Platform Design System*

