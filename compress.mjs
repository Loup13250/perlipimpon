import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, 'public', 'images');

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (file.match(/\.(jpg|jpeg|png)$/i)) {
      // Over 100KB is worth compressing for web 
      if (stat.size > 100 * 1024) {
        console.log(`Compressing: ${file} (${Math.round(stat.size / 1024)} KB)`);
        
        try {
          const tempPath = fullPath + '.tmp';
          await sharp(fullPath)
            .resize({ width: 1200, withoutEnlargement: true }) // Max width 1200
            .jpeg({ quality: 80, progressive: true, mozjpeg: true })
            .toFile(tempPath);
            
          fs.renameSync(tempPath, fullPath);
          const newStat = fs.statSync(fullPath);
          console.log(` -> Done: ${Math.round(newStat.size / 1024)} KB`);
        } catch (err) {
          console.error(`Error processing ${file}:`, err);
        }
      }
    }
  }
}

console.log('Starting image compression...');
processDirectory(directoryPath).then(() => console.log('All done!')).catch(console.error);
