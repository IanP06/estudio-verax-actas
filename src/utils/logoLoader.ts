// Cache for loaded base64 PNG logos
const base64Cache: Record<string, string> = {};

/**
 * Convierte una imagen PNG local (/assets/logos/*.png) a Base64 Data URL
 * para asegurar renderizado instantáneo en @react-pdf/renderer sin latencia de red.
 */
export async function getLogoBase64(url: string): Promise<string> {
  if (base64Cache[url]) {
    return base64Cache[url];
  }

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        base64Cache[url] = base64data;
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn(`Could not load logo from ${url}:`, error);
    return url;
  }
}

export const ORIGINAL_LOGOS = {
  VERAX: '/assets/logos/estudio_verax.png',
  ANTARTIDA: '/assets/logos/antartida.png',
  ATM: '/assets/logos/atm.png',
  PROVINCIA: '/assets/logos/provincia.png',
  SANCOR: '/assets/logos/sancor.png',
};
