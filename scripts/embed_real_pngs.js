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
    const buffer = fs.readFileSync(filePath);
    const key = file.replace(/\.[^/.]+$/, "").toUpperCase();
    const mime = file.endsWith('.png') ? 'image/png' : 'image/jpeg';
    base64Map[key] = `data:${mime};base64,${buffer.toString('base64')}`;
  }
});

const content = `// Generated Base64 Data URLs for real original PNG logos in public/assets/logos/
export const LOGO_DATA_URLS: Record<string, string> = ${JSON.stringify(base64Map, null, 2)};
`;

fs.writeFileSync(outputFile, content);
console.log('Successfully generated src/config/logoAssets.ts with real PNG Base64 strings.');
