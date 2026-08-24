import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  Image, 
  StyleSheet
} from '@react-pdf/renderer';
import type { Company } from '../../config/templates';
import type { DeclaracionFormData, ImageAttachment } from '../../types/acta';
import { buildDeclaracionLegalTemplate, COMPANY_LEGAL_NAMES } from '../../config/templateDeclaracion';
import { formatDniWithDots } from '../../utils/templateHelpers';
import { LOGO_DATA_URLS } from '../../config/logoAssets';

const styles = StyleSheet.create({
  page: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 38,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#0F172A',
    lineHeight: 1.35,
    backgroundColor: '#FFFFFF',
  },
  
  // Encabezado Dual
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 1.5,
    borderBottomColor: '#384969',
    borderBottomStyle: 'solid',
    paddingBottom: 6,
    marginBottom: 12,
  },
  logoLeft: {
    width: 220,
    height: 58,
    objectFit: 'contain',
    objectPosition: 'left',
  },
  logoRight: {
    width: 145,
    height: 42,
    objectFit: 'contain',
    objectPosition: 'right',
  },

  // Document Title
  titleBlock: {
    marginBottom: 14,
    textAlign: 'center',
  },
  titleText: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#384969',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Body Paragraph Justified
  bodyParagraph: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.45,
    textAlign: 'justify',
    marginBottom: 12,
    color: '#0F172A',
  },

  // Declaración Complementaria (Disclaimer de Firma Digital idéntico al de Desistimiento)
  legalNote: {
    fontSize: 8,
    fontFamily: 'Helvetica-Oblique',
    color: '#475569',
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 3,
    borderLeftColor: '#B53B3A',
    padding: 5,
    marginTop: 10,
    marginBottom: 10,
  },

  // Bloque de Firma (FIRMANTE idéntico al de Desistimiento)
  signatureSection: {
    marginTop: 14,
    paddingTop: 0,
    borderTopWidth: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  signatureBox: {
    width: '100%',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#0F172A',
    borderBottomStyle: 'solid',
    marginBottom: 4,
    width: 200,
    height: 24,
  },
  signatureTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#384969',
    textTransform: 'uppercase',
  },
  signatureDetailBold: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    marginTop: 1,
  },

  // Foto DNI junto al campo de firma
  dniCard: {
    width: 180,
    height: 105,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 4,
    padding: 3,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  dniImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },

  // Sección de Anexos / Croquis en Hoja Subsiguiente
  annexTitleBlock: {
    marginTop: 10,
    marginBottom: 14,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#384969',
    paddingBottom: 6,
  },
  annexTitleText: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#384969',
    textTransform: 'uppercase',
  },
  annexGrid: {
    flexDirection: 'column',
    gap: 16,
    alignItems: 'center',
  },
  annexCard: {
    width: '100%',
    maxHeight: 320,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 4,
    padding: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  annexImage: {
    width: '100%',
    height: 280,
    objectFit: 'contain',
  },
  annexCaption: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#384969',
    marginTop: 4,
  },
});

interface ActaDeclaracionPdfProps {
  formData: DeclaracionFormData;
  attachments: ImageAttachment[];
  company: Company;
  veraxLogoUrl?: string;
  companyLogoUrl?: string;
}

export const ActaDeclaracionPdf: React.FC<ActaDeclaracionPdfProps> = ({
  formData,
  attachments,
  company,
  veraxLogoUrl = LOGO_DATA_URLS.VERAX || LOGO_DATA_URLS.ESTUDIO_VERAX || '/assets/logos/estudio_verax.png',
  companyLogoUrl = LOGO_DATA_URLS[company.id] || company.logoUrl,
}) => {
  // 1. Filtrado de imágenes: DNI va junto a la firma; Croquis / Anexos van a hojas subsiguientes
  const dniAttachment = attachments.find(att => att.isDni);
  const annexAttachments = attachments.filter(att => att.isCroquis || (!att.isDni && !att.isCroquis));
  const hasCroquis = attachments.some(att => att.isCroquis);

  // 2. Obtener la plantilla con tokens {{TOKEN}}
  const rawTemplate = buildDeclaracionLegalTemplate({
    companyId: formData.companyId,
    condicionFirmante: formData.condicionFirmante,
    numeroSiniestro: formData.numeroSiniestro,
    numeroPoliza: formData.numeroPoliza,
    numeroReferencia: formData.numeroReferencia,
    numeroJuicio: formData.numeroJuicio,
    nombreCompleto: formData.nombreCompleto,
    nacionalidad: formData.nacionalidad,
    dni: formatDniWithDots(formData.dni),
    domicilioCalle: formData.domicilioCalle,
    domicilioLocalidad: formData.domicilioLocalidad,
    domicilioProvincia: formData.domicilioProvincia,
    textoDeclaracion: formData.textoDeclaracion,
    email: formData.email,
    hasCroquis: hasCroquis,
  });

  const formattedDni = formatDniWithDots(formData.dni);
  const companyLegalName = COMPANY_LEGAL_NAMES[formData.companyId] || COMPANY_LEGAL_NAMES.ANTARTIDA;

  // 3. Función auxiliar para obtener el valor del placeholder
  const getVarValue = (varName: string): string => {
    switch (varName) {
      case 'CONDICION_FIRMANTE':
        return (formData.condicionFirmante || '[CONDICIÓN]').toUpperCase();
      case 'NUMERO_SINIESTRO':
        return (formData.numeroSiniestro || '[N° SINIESTRO]').toUpperCase();
      case 'NOMBRE_ASEGURADORA':
        return companyLegalName.toUpperCase();
      case 'NUMERO_POLIZA':
        return (formData.numeroPoliza || '[N° PÓLIZA]').toUpperCase();
      case 'NUMERO_REFERENCIA':
        return (formData.numeroReferencia || '[N° REFERENCIA]').toUpperCase();
      case 'NUMERO_JUICIO':
        return (formData.numeroJuicio || '[N° JUICIO]').toUpperCase();
      case 'NOMBRE_COMPLETO':
        return (formData.nombreCompleto || '[NOMBRE COMPLETO]').toUpperCase();
      case 'NACIONALIDAD':
        return (formData.nacionalidad || '[NACIONALIDAD]').toUpperCase();
      case 'DNI':
        return (formattedDni || '[DNI]').toUpperCase();
      case 'DOMICILIO_CALLE':
        return (formData.domicilioCalle || '[CALLE Y N°]').toUpperCase();
      case 'DOMICILIO_LOCALIDAD':
        return (formData.domicilioLocalidad || '[LOCALIDAD]').toUpperCase();
      case 'DOMICILIO_PROVINCIA':
        return (formData.domicilioProvincia || '[PROVINCIA]').toUpperCase();
      case 'TEXTO_DECLARACION':
        return formData.textoDeclaracion || '[DECLARACIÓN]';
      case 'EMAIL':
        return (formData.email || '[EMAIL]').toUpperCase();
      default:
        return `[${varName}]`;
    }
  };

  const parts = rawTemplate.split(/({{[A-Z_]+}})/g);

  return (
    <Document
      title={`ACTA DE DECLARACIÓN - ${formData.nombreCompleto || 'Siniestro'}`}
      author="Estudio Verax"
      subject={`Siniestro N° ${formData.numeroSiniestro}`}
    >
      {/* PÁGINA PRINCIPAL DE TEXTO LEGAL Y FIRMA */}
      <Page size="A4" style={styles.page}>
        {/* Encabezado Dual */}
        <View style={styles.headerContainer}>
          <Image src={veraxLogoUrl} style={styles.logoLeft} />
          <Image src={companyLogoUrl} style={styles.logoRight} />
        </View>

        {/* Título Principal */}
        <View style={styles.titleBlock}>
          <Text style={styles.titleText}>ACTA DE DECLARACIÓN</Text>
        </View>

        {/* Cuerpo Legal Verbatim con Placeholders: TEXTO_DECLARACION en CURSIVA.
            Devuelve cadenas directamente para cadenas sin formato (evita bugs de anidamiento de nodos <Text> en @react-pdf). */}
        <Text style={styles.bodyParagraph}>
          {parts.map((part, index) => {
            const match = part.match(/^{{([A-Z_]+)}}$/);
            if (match) {
              const varName = match[1];
              if (varName === 'TEXTO_DECLARACION') {
                return (
                  <Text key={index} style={{ fontFamily: 'Helvetica-Oblique' }}>
                    {getVarValue(varName)}
                  </Text>
                );
              }
              return (
                <Text key={index} style={{ fontFamily: 'Helvetica-Bold' }}>
                  {getVarValue(varName)}
                </Text>
              );
            }
            return part; // Devuelve la cadena directamente
          })}
        </Text>

        {/* Bloque final de firma y nota legal envueltos juntos */}
        <View wrap={false}>
          {/* Nota de Validez Legal (Idéntica al Acta de Desistimiento) */}
          <View style={styles.legalNote}>
            <Text>
              El presente instrumento privado se suscribe con plena conformidad y alcance legal, 
              siendo apto para su validación e integración mediante firma digital.
            </Text>
          </View>

          {/* Foto DNI junto a la firma si fue adjuntada y marcada como DNI */}
          {dniAttachment && (
            <View style={styles.dniCard}>
              <Image src={dniAttachment.dataUrl} style={styles.dniImage} />
            </View>
          )}

          {/* Bloque de Firma (Idéntico al Acta de Desistimiento) */}
          <View style={styles.signatureSection}>
            <View style={styles.signatureBox}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureTitle}>FIRMANTE</Text>
              <Text style={styles.signatureDetailBold}>DNI N°: {formattedDni || '—'}</Text>
              <Text style={styles.signatureDetailBold}>Email: {formData.email || '—'}</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* PÁGINAS SUBSIGUIENTES DE ANEXOS Y CROQUIS */}
      {annexAttachments.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.headerContainer}>
            <Image src={veraxLogoUrl} style={styles.logoLeft} />
            <Image src={companyLogoUrl} style={styles.logoRight} />
          </View>

          <View style={styles.annexTitleBlock}>
            <Text style={styles.annexTitleText}>
              ANEXO DOCUMENTAL / CROQUIS ILUSTRATIVO
            </Text>
          </View>

          <View style={styles.annexGrid}>
            {annexAttachments.map((att, idx) => (
              <View key={att.id || idx} style={styles.annexCard} wrap={false}>
                <Image src={att.dataUrl} style={styles.annexImage} />
                <Text style={styles.annexCaption}>
                  {att.isCroquis ? `CROQUIS ILUSTRATIVO #${idx + 1}` : `ANEXO DOCUMENTAL #${idx + 1}`} - {att.name}
                </Text>
              </View>
            ))}
          </View>
        </Page>
      )}
    </Document>
  );
};
