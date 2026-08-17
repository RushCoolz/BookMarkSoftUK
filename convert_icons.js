const fs = require('fs');
const sharp = require('sharp');

async function convertIcons() {
  try {
    const inputPath = 'public/logo.png'; // This is the JPEG file
    const sizes = [16, 48, 128];
    
    for (const size of sizes) {
      await sharp(inputPath)
        .resize(size, size)
        .png() // Force output to be actual PNG format
        .toFile(`extension/icon${size}.png`);
      console.log(`Created icon${size}.png`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

convertIcons();
