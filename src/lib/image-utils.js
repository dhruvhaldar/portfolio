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

  let pipeline = sharp(inputPath);
  
  if (width || height) {
    pipeline = pipeline.resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true
    });
  }

  switch (format.toLowerCase()) {
    case 'avif':
      pipeline = pipeline.avif({ quality, effort: 6 });
      break;
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
    case 'jpeg':
    case 'jpg':
      pipeline = pipeline.jpeg({ quality });
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  return pipeline;
}

export async function processImageDirectory(dir) {
  try {
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
          const avifPipeline = await processImage(fullPath, { format: 'avif' });
          await avifPipeline.toFile(avifPath);
          console.log(`Processed ${fullPath} -> ${avifPath}`);

          // Generate WebP version
          const webpPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
          const webpPipeline = await processImage(fullPath, { format: 'webp' });
          await webpPipeline.toFile(webpPath);
          console.log(`Processed ${fullPath} -> ${webpPath}`);

          // Generate optimized JPEG version
          if (!/\.jpe?g$/i.test(entry.name)) {
            const jpegPath = fullPath.replace(/\.(png)$/i, '.jpg');
            const jpegPipeline = await processImage(fullPath, { format: 'jpeg' });
            await jpegPipeline.toFile(jpegPath);
            console.log(`Processed ${fullPath} -> ${jpegPath}`);
          }
        } catch (error) {
          console.error(`Error processing ${fullPath}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error processing directory:', error);
    throw error;
  }
} 