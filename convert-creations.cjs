const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const creationsDir = path.join(__dirname, 'public', 'images', 'creations');
const files = fs.readdirSync(creationsDir);

(async () => {
  console.log(`🚀 Starting conversion of ${files.filter(f => f.endsWith('.jpg')).length} images...`);
  for (const file of files) {
    if (file.endsWith('.jpg')) {
      const inputPath = path.join(creationsDir, file);
      const outputPath = path.join(creationsDir, file.replace('.jpg', '.webp'));
      try {
        await sharp(inputPath)
          .resize({ width: 600, withoutEnlargement: true }) // optimized for grids
          .webp({ quality: 80 })
          .toFile(outputPath);
        // console.log(`✅ Converted ${file}`);
      } catch (err) {
        console.error(`❌ Error converting ${file}:`, err.message);
      }
    }
  }
  console.log('✨ All images converted to WebP.');
})();
