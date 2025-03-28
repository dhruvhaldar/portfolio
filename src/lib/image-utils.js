import sharp from 'sharp';
import { promises as fs } from 'fs';
import { extname, join } from 'path';

export async function generateBlurPlaceholder(imagePath) {
  try {
    const image = sharp(imagePath);
    const { width, height } = await image.metadata();
    
    // Generate a tiny version of the image
    const tinyImage = await image
      .resize(10, 10, { fit: 'inside' })
      .jpeg({ quality: 20 })
      .toBuffer();
    
    // Convert to base64
    return `data:image/jpeg;base64,${tinyImage.toString('base64')}`;
  } catch (error) {
    console.error('Error generating blur placeholder:', error);
    return '';
  }
}

export async function processImage(imagePath) {
  const ext = extname(imagePath);
  const avifPath = imagePath.replace(ext, '.avif');
  
  try {
    // Convert to AVIF
    await sharp(imagePath)
      .avif({ quality: 80, effort: 6 })
      .toFile(avifPath);
    
    // Generate blur placeholder
    const blurDataURL = await generateBlurPlaceholder(imagePath);
    
    return { avifPath, blurDataURL };
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
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
      await processImage(fullPath);
    }
  }
} 