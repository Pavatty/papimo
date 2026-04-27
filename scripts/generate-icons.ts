import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const root = process.cwd();
const iconsDir = path.join(root, "public", "icons");
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const svgContent = (size: number) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#FBF6EC"/>
  <text x="50%" y="50%"
        text-anchor="middle"
        dominant-baseline="central"
        font-family="DM Sans, sans-serif"
        font-weight="900"
        font-size="${size * 0.6}"
        fill="#1E5A96">p</text>
</svg>`;

async function generate() {
  await fs.mkdir(iconsDir, { recursive: true });

  for (const size of sizes) {
    await sharp(Buffer.from(svgContent(size)))
      .png()
      .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
  }

  await sharp(Buffer.from(svgContent(180)))
    .png()
    .toFile(path.join(root, "public", "apple-touch-icon.png"));
  await sharp(Buffer.from(svgContent(32)))
    .png()
    .toFile(path.join(root, "public", "favicon-32x32.png"));
  await sharp(Buffer.from(svgContent(16)))
    .png()
    .toFile(path.join(root, "public", "favicon-16x16.png"));
}

void generate();
