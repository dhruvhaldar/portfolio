import sharp from 'sharp';
import { promises as fs } from 'fs';
import { join } from 'path';

export async function processImage(inputPath, options = {}) {
  const {
    quality = 80,
    width,
    height,
    format = 'avif'
  } = options;

  const image = sharp(inputPath);
  
  if (width || height) {
    image.resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true
    });
  }

  switch (format.toLowerCase()) {
    case 'avif':
      image.avif({ quality, effort: 6 });
      break;
    case 'webp':
      image.webp({ quality });
      break;
    case 'jpeg':
    case 'jpg':
      image.jpeg({ quality });
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  return image;
}

export async function processImageDirectory(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await processImageDirectory(fullPath);
      continue;
    }

    if (entry.isFile() && /\.(jpg|jpeg|png)$/i.test(entry.name)) {
      try {
        // Generate AVIF version
        const avifPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, '.avif');
        await processImage(fullPath, { format: 'avif' }).toFile(avifPath);
        console.log(`Processed ${fullPath} -> ${avifPath}`);

        // Generate WebP version
        const webpPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        await processImage(fullPath, { format: 'webp' }).toFile(webpPath);
        console.log(`Processed ${fullPath} -> ${webpPath}`);

        // Generate optimized JPEG version
        if (!/\.jpe?g$/i.test(entry.name)) {
          const jpegPath = fullPath.replace(/\.(png)$/i, '.jpg');
          await processImage(fullPath, { format: 'jpeg' }).toFile(jpegPath);
          console.log(`Processed ${fullPath} -> ${jpegPath}`);
        }
      } catch (error) {
        console.error(`Error processing ${fullPath}:`, error);
      }
    }
  }
} 