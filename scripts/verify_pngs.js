import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logosDir = path.join(__dirname, '../public/assets/logos');

const files = fs.readdirSync(logosDir);

files.forEach(file => {
  const filePath = path.join(logosDir, file);
  const stat = fs.statSync(filePath);
  const buf = fs.readFileSync(filePath);
  const isPng = buf.slice(0, 8).toString('hex') === '89504e470d0a1a0a';
  console.log(`File: ${file}, Size: ${stat.size} bytes, PNG Header valid: ${isPng}`);
});
