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
      
      if (isJpeg && stat.size > 100 * 1024) {
        console.log(`Compressing: ${file} (${Math.round(stat.size / 1024)} KB)`);
        const tempPath = fullPath + '.tmp';
        
        try {
          let processor = sharp(fullPath);
          
          if (file.toLowerCase().includes('logo')) {
            // Logos n'ont pas besoin de dépasser 200px
            processor = processor.resize({ width: 200, withoutEnlargement: true });
          } else {
            // Photos standards max 800px (largement suffisant pour cartes et miniatures)
            processor = processor.resize({ width: 800, withoutEnlargement: true });
          }

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
