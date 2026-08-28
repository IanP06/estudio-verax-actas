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
import type { RetiroDenunciaFormData, ImageAttachment } from '../../types/acta';
import { buildRetiroDenunciaContent, COMPANY_HEADER_NAMES } from '../../config/templateRetiroDenuncia';
import { formatDniWithDots, formatDateToArgentine } from '../../utils/templateHelpers';
import { LOGO_DATA_URLS } from '../../config/logoAssets';

// Estilos compactados de alta precisión para GARANTIZAR que todo el documento y la firma quepan en HOJA 1 A TODA COSTA
const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 36,
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    color: '#0F172A',
    lineHeight: 1.28,
    backgroundColor: '#FFFFFF',
  },
  
  // Encabezado Dual Compacto
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 1.5,
    borderBottomColor: '#384969',
    borderBottomStyle: 'solid',
    paddingBottom: 4,
    marginBottom: 8,
  },
  logoLeft: {
    width: 190,
    height: 46,
    objectFit: 'contain',
    objectPosition: 'left',
  },
  logoRight: {
    width: 125,
    height: 34,
    objectFit: 'contain',
    objectPosition: 'right',
  },

  // Document Header Block
  headerBlock: {
    marginBottom: 8,
  },
  titleTextBold: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: '#384969',
    textTransform: 'uppercase',
    marginBottom: 1,
  },
  gerenteTextBold: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    textTransform: 'uppercase',
    marginBottom: 1,
  },
  companyTextBold: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  refTextBold: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    marginBottom: 6,
  },

  // Body Paragraph Justified
  bodyParagraph: {
    fontSize: 9.5,
    fontFamily: 'Helvetica',
    lineHeight: 1.32,
    textAlign: 'justify',
    marginBottom: 8,
    color: '#0F172A',
  },

  // Declaración Complementaria
  legalNote: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Oblique',
    color: '#475569',
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 3,
    borderLeftColor: '#B53B3A',
    padding: 4,
    marginTop: 4,
    marginBottom: 6,
  },

  // Bloque de Firma y Foto DNI
  signatureBlock: {
    marginTop: 6,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  dniBox: {
    width: 145,
    height: 80,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 4,
    padding: 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  dniImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  dniPlaceholder: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#94A3B8',
  },
  dniLabelContainer: {
    marginBottom: 6,
  },
  dniLabelText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
  },
  signatureSection: {
    marginTop: 2,
    width: '100%',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#0F172A',
    borderBottomStyle: 'solid',
    marginBottom: 3,
    width: 180,
    height: 18,
  },
  signatureTitle: {
    fontSize: 8.5,
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

  // Sección de Anexos
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

interface RetiroDenunciaPdfProps {
  formData: RetiroDenunciaFormData;
  dniAttachments: ImageAttachment[];
  annexAttachments: ImageAttachment[];
  company: Company;
  veraxLogoUrl?: string;
  companyLogoUrl?: string;
}

export const RetiroDenunciaPdf: React.FC<RetiroDenunciaPdfProps> = ({
  formData,
  dniAttachments,
  annexAttachments,
  company,
  veraxLogoUrl = LOGO_DATA_URLS.VERAX || LOGO_DATA_URLS.ESTUDIO_VERAX || '/assets/logos/estudio_verax.png',
  companyLogoUrl = LOGO_DATA_URLS[company.id] || company.logoUrl,
}) => {
  const content = buildRetiroDenunciaContent(formData);
  const companyHeader = COMPANY_HEADER_NAMES[formData.companyId] || COMPANY_HEADER_NAMES.ANTARTIDA;
  const formattedDni = formatDniWithDots(formData.dni);
  const formattedFechaOcurrencia = formatDateToArgentine(formData.fechaOcurrencia);

  const dniImage = dniAttachments.length > 0 ? dniAttachments[0].dataUrl : null;

  // Intercalar tokens {{TOKEN}} en negrita
  const getVarValue = (varName: string): string => {
    switch (varName) {
      case 'NOMBRE_COMPLETO':
        return (formData.nombreCompleto || '[NOMBRE COMPLETO]').toUpperCase();
      case 'DNI':
        return (formattedDni || '[DNI]').toUpperCase();
      case 'DOMICILIO_CALLE':
        return (formData.domicilioCalle || '[CALLE Y N°]').toUpperCase();
      case 'DOMICILIO_LOCALIDAD':
        return (formData.domicilioLocalidad || '[LOCALIDAD]').toUpperCase();
      case 'DOMICILIO_PROVINCIA':
        return (formData.domicilioProvincia || '[PROVINCIA]').toUpperCase();
      case 'NUMERO_POLIZA':
        return (formData.numeroPoliza || '[N° PÓLIZA]').toUpperCase();
      case 'VEHICULO_MARCA':
        return (formData.vehiculoMarca || '[MARCA]').toUpperCase();
      case 'VEHICULO_MODELO':
        return (formData.vehiculoModelo || '[MODELO]').toUpperCase();
      case 'VEHICULO_DOMINIO':
        return (formData.vehiculoDominio ? formData.vehiculoDominio.toUpperCase() : '[DOMINIO]').toUpperCase();
      case 'FECHA_OCURRENCIA':
        return (formattedFechaOcurrencia || '[FECHA OCURRENCIA]').toUpperCase();
      case 'NUMERO_SINIESTRO':
        return (formData.numeroSiniestro || '[N° SINIESTRO]').toUpperCase();
      case 'EMAIL':
        return (formData.email || '[EMAIL]').toUpperCase();
      default:
        return `[${varName}]`;
    }
  };

  const parts = content.cuerpoTemplate.split(/({{[A-Z_]+}})/g);

  return (
    <Document
      title={`RETIRO DE DENUNCIA - ${formData.nombreCompleto || 'Siniestro'}`}
      author="Estudio Verax"
      subject={`Siniestro N° ${formData.numeroSiniestro}`}
    >
      {/* PÁGINA PRINCIPAL - GARANTIZADA EN 1 SOLA HOJA */}
      <Page size="A4" style={styles.page}>
        {/* Encabezado Dual */}
        <View style={styles.headerContainer}>
          <Image src={veraxLogoUrl} style={styles.logoLeft} />
          <Image src={companyLogoUrl} style={styles.logoRight} />
        </View>

        {/* Encabezado de Documento */}
        <View style={styles.headerBlock}>
          <Text style={styles.titleTextBold}>RETIRO DE DENUNCIA</Text>
          <Text style={styles.gerenteTextBold}>Sr. Gerente</Text>
          <Text style={styles.companyTextBold}>{companyHeader}</Text>
          <Text style={styles.refTextBold}>
            Ref.: Stro. N° {formData.numeroSiniestro ? formData.numeroSiniestro.toUpperCase() : '[N° SINIESTRO]'}
          </Text>
        </View>

        {/* Cuerpo Principal Verbatim con Placeholders en Negrita */}
        <Text style={styles.bodyParagraph}>
          {parts.map((part, index) => {
            const match = part.match(/^{{([A-Z_]+)}}$/);
            if (match) {
              const varName = match[1];
              return (
                <Text key={index} style={{ fontFamily: 'Helvetica-Bold' }}>
                  {getVarValue(varName)}
                </Text>
              );
            }
            return part;
          })}
        </Text>

        {/* Bloque final de firma y foto DNI envueltos juntos */}
        <View wrap={false}>
          {/* Nota de Validez Legal */}
          <View style={styles.legalNote}>
            <Text>
              El presente instrumento privado se suscribe con plena conformidad y alcance legal, 
              siendo apto para su validación e integración mediante firma digital.
            </Text>
          </View>

          {/* Bloque de Firma y Foto DNI */}
          <View style={styles.signatureBlock}>
            <View style={styles.dniBox}>
              {dniImage ? (
                <Image src={dniImage} style={styles.dniImage} />
              ) : (
                <Text style={styles.dniPlaceholder}>FOTO DNI</Text>
              )}
            </View>
            <View style={styles.dniLabelContainer}>
              <Text style={styles.dniLabelText}>DNI {formattedDni || '—'}</Text>
            </View>

            <View style={styles.signatureSection}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureTitle}>FIRMANTE</Text>
              <Text style={styles.signatureDetailBold}>DNI N°: {formattedDni || '—'}</Text>
              <Text style={styles.signatureDetailBold}>Email: {formData.email || '—'}</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* PÁGINAS SUBSIGUIENTES DE ANEXOS (Si existen) */}
      {annexAttachments.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.headerContainer}>
            <Image src={veraxLogoUrl} style={styles.logoLeft} />
            <Image src={companyLogoUrl} style={styles.logoRight} />
          </View>

          <View style={styles.annexTitleBlock}>
            <Text style={styles.annexTitleText}>
              ANEXO DOCUMENTAL
            </Text>
          </View>

          <View style={styles.annexGrid}>
            {annexAttachments.map((att, idx) => (
              <View key={att.id || idx} style={styles.annexCard} wrap={false}>
                <Image src={att.dataUrl} style={styles.annexImage} />
                <Text style={styles.annexCaption}>
                  ANEXO DOCUMENTAL #{idx + 1} - {att.name}
                </Text>
              </View>
            ))}
          </View>
        </Page>
      )}
    </Document>
  );
};
