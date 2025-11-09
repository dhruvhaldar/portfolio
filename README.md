<div align="center">
  <h1>✨ Dhruv Haldar's Portfolio</h1>
  <p>A modern, performant portfolio built with Next.js, TypeScript, and Tailwind CSS</p>
  
  [![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC_BY--NC_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com)
  
  [![CodeRabbit PRs](https://img.shields.io/coderabbit/prs/github/dhruvhaldar/portfolio?color=FF570A&label=CodeRabbit%20Reviews)](https://coderabbit.ai)
</div>

## 🚀 Features

- ⚡ **Blazing Fast** - Built with Next.js 13+ and optimized for performance
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- 🌐 **SEO Optimized** - Metadata, OpenGraph, and sitemap support
- 🖼️ **Image Optimization** - Automatic AVIF/WebP conversion and lazy loading
- 📱 **Fully Responsive** - Works on all device sizes
- 🛠️ **Developer Experience** - TypeScript, ESLint, Prettier, and more
- 📦 **Optimized Builds** - Code splitting, tree-shaking, and minification

## 🛠️ Tech Stack

- **Framework**: [Next.js 13+](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Type Checking**: [TypeScript](https://www.typescriptlang.org/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Linting**: [ESLint](https://eslint.org/)
- **Code Formatting**: [Prettier](https://prettier.io/)
- **Deployment**: [Vercel](https://vercel.com/)

## 📦 Prerequisites

- Node.js 18+
- pnpm 8+
- Git

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/dhruvhaldar/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update the variables in `.env.local` with your configuration.

4. **Start the development server**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🖼️ Image Optimization

This project includes scripts to optimize images for web performance:

1. Place your images in the `public/images` directory
2. Run the optimization script:
   ```bash
   # Optimize all images (generates AVIF, WebP, and optimized versions)
   pnpm optimize-images
   
   # Process specific image
   pnpm process-image path/to/image.jpg
   ```

## 🏗️ Building for Production

1. **Create a production build**
   ```bash
   pnpm build
   ```

2. **Start the production server**
   ```bash
   pnpm start
   ```

## 📊 Performance Analysis

To analyze the bundle size and performance:

```bash
# Generate bundle analysis
pnpm build:analyze

# Run Lighthouse audit
pnpm lighthouse
```

Reports will be available in the `.next/analyze/` directory.

## 🏗️ Project Structure

```
portfolio/
├── public/               # Static files
│   ├── images/           # Optimized images
│   └── documents/        # PDFs and other documents
├── src/
│   ├── app/              # App Router pages and layouts
│   ├── components/       # Reusable components
│   ├── lib/              # Utility functions
│   └── styles/           # Global styles
├── .github/              # GitHub workflows
└── scripts/              # Build and optimization scripts
```

## ❌ Contributing

This is a personal portfolio project and does not accept external contributions at this time. The repository is maintained solely by the author.

## 📄 License

This project is licensed under the [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) License.

---

<div align="center">
  Made with ❤️ by Dhruv Haldar
</div>

## Project Structure

```
portfolio/
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # React components
│   ├── lib/            # Utility functions
│   └── once-ui/        # UI component library
├── scripts/
│   ├── convert-images.js  # AVIF conversion script
│   └── process-images.js  # Multi-format image processing
└── next.config.mjs     # Next.js configuration
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
