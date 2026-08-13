import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logosDir = path.join(__dirname, '../public/assets/logos');

if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

// Write SVG files
const createSvg = (title, subtitle, bg, primaryColor, accentColor, iconType) => `
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="70" viewBox="0 0 300 70">
  <rect width="300" height="70" fill="${bg}" rx="6"/>
  <rect x="12" y="12" width="46" height="46" rx="8" fill="${primaryColor}"/>
  ${iconType === 'verax' ? `
    <text x="35" y="42" font-family="Helvetica, Arial, sans-serif" font-weight="900" font-size="24" fill="#FFFFFF" text-anchor="middle">EV</text>
  ` : iconType === 'antartida' ? `
    <path d="M35 20 L48 48 L22 48 Z" fill="#FFFFFF"/>
    <circle cx="35" cy="36" r="4" fill="${accentColor}"/>
  ` : iconType === 'atm' ? `
    <text x="35" y="41" font-family="Helvetica, Arial, sans-serif" font-weight="900" font-size="18" fill="#FFFFFF" text-anchor="middle">ATM</text>
  ` : iconType === 'provincia' ? `
    <circle cx="35" cy="35" r="14" fill="none" stroke="#FFFFFF" stroke-width="4"/>
    <path d="M35 24 L35 46 M24 35 L46 35" stroke="#FFFFFF" stroke-width="3"/>
  ` : `
    <circle cx="35" cy="35" r="16" fill="#FFFFFF"/>
    <circle cx="35" cy="35" r="8" fill="${primaryColor}"/>
  `}
  <text x="70" y="34" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="15" fill="#0F172A">${title}</text>
  <text x="70" y="50" font-family="Helvetica, Arial, sans-serif" font-weight="normal" font-size="11" fill="#64748B">${subtitle}</text>
</svg>`;

const logoData = [
  { file: 'estudio_verax', title: 'ESTUDIO VERAX', subtitle: 'Abogados & Legal', bg: '#F8FAFC', primary: '#0F172A', accent: '#3B82F6', type: 'verax' },
  { file: 'antartida', title: 'ANTÁRTIDA SEGUROS', subtitle: 'Argentina de Seguros S.A.', bg: '#F0F9FF', primary: '#0284C7', accent: '#38BDF8', type: 'antartida' },
  { file: 'atm', title: 'ATM SEGUROS', subtitle: 'Compañía de Seguros S.A.', bg: '#FEF2F2', primary: '#DC2626', accent: '#EF4444', type: 'atm' },
  { file: 'provincia', title: 'PROVINCIA SEGUROS', subtitle: 'Provincia Seguros S.A.', bg: '#ECFDF5', primary: '#059669', accent: '#10B981', type: 'provincia' },
  { file: 'sancor', title: 'SANCOR SEGUROS', subtitle: 'Cooperativa de Seguros Ltda.', bg: '#FFF7ED', primary: '#EA580C', accent: '#F97316', type: 'sancor' },
];

logoData.forEach(item => {
  const svg = createSvg(item.title, item.subtitle, item.bg, item.primary, item.accent, item.type);
  fs.writeFileSync(path.join(logosDir, `${item.file}.svg`), svg);
});

console.log('Logos generated successfully.');
