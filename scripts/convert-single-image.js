// To run this script, use the command: node scripts/convert-single-image.js
import sharp from 'sharp';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const IMAGES_DIR = join(process.cwd(), 'public', 'images');

async function convertToAvif(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .avif({ quality: 80, effort: 6 })
      .toFile(outputPath);
    console.log(`Converted ${inputPath} to ${outputPath}`);
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error);
  }
}

async function main() {
  try {
    const inputPath = join(IMAGES_DIR, '1700894012265.jpeg'); // Image path
    const outputPath = inputPath.replace('.jpeg', '.avif');
    await convertToAvif(inputPath, outputPath);
    console.log('Image conversion complete!');
  } catch (error) {
    console.error('Error processing image:', error);
    process.exit(1);
  }
}

main(); 