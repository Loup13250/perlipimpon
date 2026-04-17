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
    } else {
      const isJpeg = file.match(/\.(jpg|jpeg)$/i);
      const isPng = file.match(/\.png$/i);
      
      if ((isJpeg || isPng) && stat.size > 100 * 1024) {
        console.log(`Compressing: ${file} (${Math.round(stat.size / 1024)} KB)`);
        const tempPath = fullPath + '.tmp';
        
        try {
          let processor = sharp(fullPath).resize({ width: 1200, withoutEnlargement: true });
          
          if (isJpeg) {
            processor = processor.jpeg({ quality: 80, progressive: true, mozjpeg: true });
          } else if (isPng) {
            processor = processor.png({ quality: 80, palette: true, compressionLevel: 9 });
          }
          
          await processor.toFile(tempPath);
            
          fs.renameSync(tempPath, fullPath);
          const newStat = fs.statSync(fullPath);
          console.log(` -> Done: ${Math.round(newStat.size / 1024)} KB`);
        } catch (err) {
          console.error(`Error processing ${file}:`, err);
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
      }
    }
  }
}

console.log('Starting proper image compression (preserving PNG transparency)...');
processDirectory(directoryPath).then(() => console.log('All done!')).catch(console.error);
