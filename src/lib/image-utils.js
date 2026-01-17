import sharp from 'sharp';
import { promises as fs } from 'fs';
import { join } from 'path';

/**
 * Processes a single image file with specified options.
 * @param {string} inputPath - The path to the input image file.
 * @param {Object} options - Processing options.
 * @param {number} [options.quality=80] - The quality of the output image (0-100).
 * @param {number} [options.width] - The width to resize the image to.
 * @param {number} [options.height] - The height to resize the image to.
 * @param {string} [options.format='avif'] - The output format ('avif', 'webp', 'jpeg', 'jpg').
 * @returns {import('sharp').Sharp} The sharp pipeline instance.
 * @throws {Error} If the format is not supported.
 */
export function processImage(inputPath, options = {}) {
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

/**
 * Recursively processes all images in a directory.
 * Generates AVIF, WebP, and optimized JPEG versions for each image.
 * @param {string} dir - The directory to process.
 * @returns {Promise<void>}
 */
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
          const sourceStat = await fs.stat(fullPath);

          // Helper to check if target is up to date
          const isUpToDate = async (targetPath) => {
            try {
              const targetStat = await fs.stat(targetPath);
              return targetStat.mtime > sourceStat.mtime;
            } catch {
              return false;
            }
          };

          // Generate AVIF version
          const avifPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, '.avif');
          if (await isUpToDate(avifPath)) {
            console.log(`Skipped ${avifPath} (already up to date)`);
          } else {
            const avifPipeline = await processImage(fullPath, { format: 'avif' });
            await avifPipeline.toFile(avifPath);
            console.log(`Processed ${fullPath} -> ${avifPath}`);
          }

          // Generate WebP version
          const webpPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
          if (await isUpToDate(webpPath)) {
            console.log(`Skipped ${webpPath} (already up to date)`);
          } else {
            const webpPipeline = await processImage(fullPath, { format: 'webp' });
            await webpPipeline.toFile(webpPath);
            console.log(`Processed ${fullPath} -> ${webpPath}`);
          }

          // Generate optimized JPEG version
          if (!/\.jpe?g$/i.test(entry.name)) {
            const jpegPath = fullPath.replace(/\.(png)$/i, '.jpg');
            if (await isUpToDate(jpegPath)) {
              console.log(`Skipped ${jpegPath} (already up to date)`);
            } else {
              const jpegPipeline = await processImage(fullPath, { format: 'jpeg' });
              await jpegPipeline.toFile(jpegPath);
              console.log(`Processed ${fullPath} -> ${jpegPath}`);
            }
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