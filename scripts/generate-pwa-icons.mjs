import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const iconsDir = path.join(process.cwd(), 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Master SVG template for PWA Icon
const createSvg = (isMaskable = false) => {
  const padding = isMaskable ? 80 : 40;
  const size = 512;
  const contentSize = size - padding * 2;
  const offset = padding;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6" />
    </filter>
  </defs>

  <!-- Base background (for maskable full bleed or rounded card) -->
  ${
    isMaskable
      ? `<rect width="${size}" height="${size}" fill="url(#bgGrad)" />`
      : `<rect width="${size}" height="${size}" rx="112" fill="url(#bgGrad)" />
         <rect x="2" y="2" width="${size - 4}" height="${size - 4}" rx="110" fill="none" stroke="url(#goldGrad)" stroke-width="4" stroke-opacity="0.4" />`
  }

  <!-- Inner Badge Container -->
  <g transform="translate(${offset}, ${offset})" filter="url(#dropShadow)">
    <rect width="${contentSize}" height="${contentSize}" rx="${isMaskable ? 80 : 72}" fill="#0f172a" stroke="url(#goldGrad)" stroke-width="6" stroke-opacity="0.75" />
    
    <!-- Stylized "N" Monogram -->
    <path 
      d="M ${contentSize * 0.28} ${contentSize * 0.72} V ${contentSize * 0.28} L ${contentSize * 0.72} ${contentSize * 0.72} V ${contentSize * 0.28}" 
      stroke="#ffffff" 
      stroke-width="${contentSize * 0.088}" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
    />
    
    <!-- Gold Crown/Accent Dot -->
    <circle 
      cx="${contentSize * 0.82}" 
      cy="${contentSize * 0.22}" 
      r="${contentSize * 0.06}" 
      fill="url(#goldGrad)" 
      filter="url(#goldGlow)"
    />
  </g>
</svg>`;
};

async function generateIcons() {
  const standardSvg = createSvg(false);
  const maskableSvg = createSvg(true);

  // Save SVG
  fs.writeFileSync(path.join(iconsDir, 'icon.svg'), standardSvg);
  fs.writeFileSync(path.join(iconsDir, 'icon-maskable.svg'), maskableSvg);

  const targets = [
    { name: 'icon-192x192.png', size: 192, svg: standardSvg },
    { name: 'icon-512x512.png', size: 512, svg: standardSvg },
    { name: 'icon-maskable-192x192.png', size: 192, svg: maskableSvg },
    { name: 'icon-maskable-512x512.png', size: 512, svg: maskableSvg },
    { name: 'apple-touch-icon.png', size: 180, svg: standardSvg },
    { name: 'favicon-32x32.png', size: 32, svg: standardSvg },
    { name: 'favicon-16x16.png', size: 16, svg: standardSvg },
  ];

  for (const target of targets) {
    await sharp(Buffer.from(target.svg))
      .resize(target.size, target.size)
      .png()
      .toFile(path.join(iconsDir, target.name));
    console.log(`Generated ${target.name} (${target.size}x${target.size})`);
  }

  console.log('All PWA icons generated successfully!');
}

generateIcons().catch(console.error);
