const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Splash screen sizes for different iOS devices
const splashSizes = [
  { width: 640, height: 1136, name: 'apple-splash-640x1136.png' },
  { width: 750, height: 1334, name: 'apple-splash-750x1334.png' },
  { width: 1242, height: 2208, name: 'apple-splash-1242x2208.png' },
  { width: 1125, height: 2436, name: 'apple-splash-1125x2436.png' },
  { width: 828, height: 1792, name: 'apple-splash-828x1792.png' },
  { width: 1242, height: 2688, name: 'apple-splash-1242x2688.png' },
  { width: 1170, height: 2532, name: 'apple-splash-1170x2532.png' },
  { width: 1284, height: 2778, name: 'apple-splash-1284x2778.png' },
  { width: 1179, height: 2556, name: 'apple-splash-1179x2556.png' },
  { width: 1290, height: 2796, name: 'apple-splash-1290x2796.png' },
];

const logoPath = path.join(__dirname, '../public/calgeo-logo-1080.png');
const outputDir = path.join(__dirname, '../public/splash');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateSplashScreens() {
  console.log('Generating iOS splash screens...\n');

  for (const size of splashSizes) {
    try {
      // Calculate logo size (40% of the smaller dimension)
      const logoSize = Math.round(Math.min(size.width, size.height) * 0.35);

      // Create splash screen with dark background and centered logo
      await sharp({
        create: {
          width: size.width,
          height: size.height,
          channels: 4,
          background: { r: 10, g: 10, b: 10, alpha: 1 } // #0a0a0a
        }
      })
        .composite([
          {
            input: await sharp(logoPath)
              .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
              .toBuffer(),
            gravity: 'center'
          }
        ])
        .png()
        .toFile(path.join(outputDir, size.name));

      console.log(`✓ Created ${size.name}`);
    } catch (error) {
      console.error(`✗ Failed to create ${size.name}:`, error.message);
    }
  }

  console.log('\nDone! Splash screens saved to public/splash/');
}

generateSplashScreens();
