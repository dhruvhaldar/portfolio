![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Next js](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![CC-BY-NC-4.0](https://img.shields.io/badge/CC--BY--NC--4.0-lightgrey?style=for-the-badge)

![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/dhruvhaldar/portfolio?utm_source=oss&utm_medium=github&utm_campaign=dhruvhaldar%2Fportfolio&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

# Portfolio

A modern, optimized portfolio built with Next.js, featuring image optimization, responsive design, and performance optimizations.

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- Git

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/dhruvhaldar/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration.

## Development

Start the development server:

```bash
pnpm dev
```

The site will be available at `http://localhost:3000`.

## Image Optimization

The project includes automatic image optimization scripts that convert images to modern formats (AVIF, WebP) for better performance.

1. Place your images in the `public/images` directory

2. Run image optimization:
   ```bash
   # Convert images to AVIF format
   pnpm optimize-images

   # Process images (generates AVIF, WebP, and optimized JPEG versions)
   pnpm process-images
   ```

## Building for Production

1. Optimize images (if you've added new ones):
   ```bash
   pnpm optimize-images
   ```

2. Create a production build:
   ```bash
   pnpm build:prod
   ```

3. Test the production build locally:
   ```bash
   pnpm start
   ```

## Analyzing Bundle Size

To analyze the bundle size:

```bash
pnpm build:analyze
```

This will generate bundle analysis reports in `.next/analyze/`:
- `client.html`: Client-side bundles
- `edge.html`: Edge runtime bundles
- `nodejs.html`: Server-side bundles

## Project Structure

```
portfolio/
├── public/
│   └── images/          # Static images
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # React components
│   ├── lib/           # Utility functions
│   └── once-ui/       # UI component library
├── scripts/
│   ├── convert-images.js  # AVIF conversion script
│   └── process-images.js  # Multi-format image processing
└── next.config.mjs    # Next.js configuration
```

## Available Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Create production build
- `pnpm build:prod`: Create optimized production build
- `pnpm build:analyze`: Build with bundle analysis
- `pnpm start`: Start production server
- `pnpm optimize-images`: Convert images to AVIF
- `pnpm process-images`: Process images in multiple formats
- `pnpm lint`: Run ESLint

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: SCSS Modules
- **UI System**: Once UI
- **Image Processing**: Sharp
- **Optimization**: 
  - SWC Minification
  - Image optimization (AVIF, WebP)
  - Bundle analysis
  - Console removal in production

## Performance Optimizations

- Modern image formats (AVIF, WebP) with fallbacks
- Automatic image optimization
- Bundle size optimization
- Code minification
- Dead code elimination
- Console removal in production

## Browser Support

The site is optimized for modern browsers with fallbacks for older ones:
- Images: AVIF → WebP → JPEG/PNG
- CSS: Modern features with appropriate fallbacks
- JavaScript: ES6+ with necessary polyfills

## Troubleshooting

### Image Processing Issues

If you encounter issues with image processing:

1. Ensure Sharp is properly installed:
   ```bash
   pnpm install sharp
   ```

2. Clear the image cache:
   ```bash
   rm -rf public/images/**/*.avif
   rm -rf public/images/**/*.webp
   ```

3. Run the optimization scripts again

### Build Issues

If you encounter build issues:

1. Clear Next.js cache:
   ```bash
   rm -rf .next
   ```

2. Clean install dependencies:
   ```bash
   pnpm clean-install
   ```

3. Rebuild the project:
   ```bash
   pnpm build
   ```
