import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const convertToAvif = async (inputPath, outputPath) => {
  try {
    await sharp(inputPath)
      .avif({ quality: 80, effort: 6 })
      .toFile(outputPath);
    console.log(`Converted ${inputPath} to ${outputPath}`);
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error);
  }
};

const processDirectory = async (dir) => {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (file.match(/\.(jpg|jpeg|png)$/i)) {
      const outputPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, '.avif');
      await convertToAvif(fullPath, outputPath);
    }
  }
};

const start = async () => {
  const publicDir = path.join(process.cwd(), 'public', 'images');
  await processDirectory(publicDir);
};

start().catch(console.error); 