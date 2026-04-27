const sharp = require('sharp');
const path = require('path');

const images = [
  { src: 'hero_bg.png',                  dest: 'hero_bg.webp',                  w: 1920, q: 78 },
  { src: 'rose_quartz_ring.png',         dest: 'rose_quartz_ring.webp',         w: 800,  q: 80 },
  { src: 'about_workshop.png',           dest: 'about_workshop.webp',           w: 900,  q: 80 },
  { src: 'pearl_bracelet.png',           dest: 'pearl_bracelet.webp',           w: 800,  q: 80 },
  { src: 'moonstone_necklace.png',       dest: 'moonstone_necklace.webp',       w: 800,  q: 80 },
  { src: 'logo-jewelry-transparent.png', dest: 'logo-jewelry-transparent.webp', w: 400,  q: 80 },
  { src: 'logo-jewelry.png',             dest: 'logo-jewelry.webp',             w: 400,  q: 80 },
  { src: 'brand-icon.png',               dest: 'brand-icon.webp',               w: 200,  q: 80 },
];

const dir = path.join(__dirname, 'public', 'images');

(async () => {
  for (const img of images) {
    try {
      const info = await sharp(path.join(dir, img.src))
        .resize({ width: img.w, withoutEnlargement: true })
        .webp({ quality: img.q })
        .toFile(path.join(dir, img.dest));
      console.log(`✅ ${img.dest}: ${Math.round(info.size / 1024)} KB`);
    } catch (e) {
      console.log(`⚠️  Skip ${img.src}: ${e.message}`);
    }
  }
})();
