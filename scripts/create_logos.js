import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logosDir = path.join(__dirname, '../public/assets/logos');

if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

// Generate crisp SVG strings and store data URLs / PNG fallbacks
const createSvgLogo = (title, subtitle, primaryColor, secondaryColor, iconType) => {
  let iconSvg = '';
  
  if (iconType === 'verax') {
    iconSvg = `
      <rect x="20" y="15" width="50" height="50" rx="12" fill="${primaryColor}"/>
      <path d="M32 28 L45 52 L58 28" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M38 36 L52 36" stroke="#E2E8F0" stroke-width="3" stroke-linecap="round"/>
    `;
  } else if (iconType === 'antartida') {
    iconSvg = `
      <path d="M45 15 L70 28 L70 52 L45 65 L20 52 L20 28 Z" fill="${primaryColor}"/>
      <path d="M45 22 L60 31 L45 58 L30 31 Z" fill="#38BDF8"/>
      <circle cx="45" cy="40" r="6" fill="#FFFFFF"/>
    `;
  } else if (iconType === 'atm') {
    iconSvg = `
      <circle cx="45" cy="40" r="28" fill="${primaryColor}"/>
      <text x="45" y="47" font-family="Arial, sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" text-anchor="middle">ATM</text>
    `;
  } else if (iconType === 'provincia') {
    iconSvg = `
      <rect x="20" y="15" width="50" height="50" rx="8" fill="${primaryColor}"/>
      <circle cx="45" cy="40" r="18" fill="none" stroke="#F59E0B" stroke-width="4"/>
      <path d="M45 28 L45 52 M33 40 L57 40" stroke="#FFFFFF" stroke-width="3"/>
    `;
  } else if (iconType === 'sancor') {
    iconSvg = `
      <circle cx="45" cy="40" r="28" fill="${primaryColor}"/>
      <path d="M25 40 Q45 20 65 40 Q45 60 25 40 Z" fill="#FFFFFF"/>
      <circle cx="45" cy="40" r="8" fill="${secondaryColor}"/>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="320" height="80">
    <rect width="320" height="80" fill="#FFFFFF" rx="8"/>
    ${iconSvg}
    <text x="85" y="38" font-family="Arial, sans-serif" font-weight="bold" font-size="16" fill="#1E293B">${title}</text>
    <text x="85" y="55" font-family="Arial, sans-serif" font-weight="normal" font-size="11" fill="#64748B">${subtitle}</text>
  </svg>`;
};

const logos = [
  { name: 'estudio_verax.svg', title: 'ESTUDIO VERAX', subtitle: 'Abogados & Liquidadores', primary: '#0F172A', secondary: '#3B82F6', type: 'verax' },
  { name: 'antartida.svg', title: 'ANTÁRTIDA SEGUROS', subtitle: 'Compañía Argentina S.A.', primary: '#0284C7', secondary: '#38BDF8', type: 'antartida' },
  { name: 'atm.svg', title: 'ATM SEGUROS', subtitle: 'Compañía de Seguros S.A.', primary: '#DC2626', secondary: '#991B1B', type: 'atm' },
  { name: 'provincia.svg', title: 'PROVINCIA SEGUROS', subtitle: 'Provincia Seguros S.A.', primary: '#059669', secondary: '#10B981', type: 'provincia' },
  { name: 'sancor.svg', title: 'SANCOR SEGUROS', subtitle: 'Cooperativa de Seguros Ltda.', primary: '#EA580C', secondary: '#1E40AF', type: 'sancor' },
];

logos.forEach(logo => {
  const svgContent = createSvgLogo(logo.title, logo.subtitle, logo.primary, logo.secondary, logo.type);
  fs.writeFileSync(path.join(logosDir, logo.name), svgContent);
});

console.log('Logos SVGs created successfully in public/assets/logos/');
