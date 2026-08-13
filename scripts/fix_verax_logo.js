import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logosDir = path.join(__dirname, '../public/assets/logos');
const outputFile = path.join(__dirname, '../src/config/logoAssets.ts');

const files = fs.readdirSync(logosDir);
const base64Map = {};

files.forEach(file => {
  if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
    const filePath = path.join(logosDir, file);
    const buf = fs.readFileSync(filePath);
    let key = file.replace(/\.[^/.]+$/, "").toUpperCase();
    if (key === 'ESTUDIO_VERAX') key = 'VERAX';

    let mime = 'image/png';
    // Check if JPEG
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      mime = 'image/jpeg';
    }

    base64Map[key] = `data:${mime};base64,${buf.toString('base64')}`;
  }
});

// Also alias ESTUDIO_VERAX
if (base64Map.VERAX) {
  base64Map.ESTUDIO_VERAX = base64Map.VERAX;
}

const content = `// Generated Base64 Data URLs for real original PNG/JPEG logos in public/assets/logos/
export const LOGO_DATA_URLS: Record<string, string> = ${JSON.stringify(base64Map, null, 2)};
`;

fs.writeFileSync(outputFile, content);
console.log('Successfully updated logoAssets.ts with correct MIME types!');
