import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, '../public/assets/logos/estudio_verax.png');

const buf = fs.readFileSync(filePath);
console.log('Hex header:', buf.slice(0, 16).toString('hex'));
console.log('Text header:', buf.slice(0, 64).toString('utf-8'));
