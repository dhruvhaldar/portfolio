const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

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

async function processDirectory(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
      continue;
    }

    if (entry.isFile() && /\.(jpg|jpeg|png)$/i.test(entry.name)) {
      const avifPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, '.avif');
      await convertToAvif(fullPath, avifPath);
    }
  }
}

async function main() {
  try {
    await processDirectory(IMAGES_DIR);
    console.log('Image conversion complete!');
  } catch (error) {
    console.error('Error processing images:', error);
    process.exit(1);
  }
}

main(); 