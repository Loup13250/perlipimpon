import sharp from 'sharp';

async function generateMobileHero() {
  try {
    await sharp('public/images/hero_bg.png')
      .resize({ width: 600, height: 800, fit: 'cover', position: 'center' })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile('public/images/hero_bg_mobile.jpg');
    console.log('Mobile hero successfully generated at public/images/hero_bg_mobile.jpg');
  } catch (error) {
    console.error('Error generating mobile hero:', error);
  }
}

generateMobileHero();
