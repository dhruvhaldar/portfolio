import { processImageDirectory } from '../src/lib/image-utils.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const IMAGES_DIR = join(process.cwd(), 'public', 'images');

async function main() {
  try {
    console.log('Processing images...');
    await processImageDirectory(IMAGES_DIR);
    console.log('Image processing complete!');
  } catch (error) {
    console.error('Error processing images:', error);
    process.exit(1);
  }
}

main(); 