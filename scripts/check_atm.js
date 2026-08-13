import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, '../public/assets/logos/atm.png');

const stat = fs.statSync(filePath);
const buf = fs.readFileSync(filePath);
console.log('ATM file size:', stat.size, 'bytes');
console.log('ATM header hex:', buf.slice(0, 16).toString('hex'));
