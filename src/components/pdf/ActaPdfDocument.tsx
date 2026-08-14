import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  Image, 
  StyleSheet
} from '@react-pdf/renderer';
import type { Company, DocumentTemplate } from '../../config/templates';
import type { ActaFormData, ImageAttachment } from '../../types/acta';
import { renderBoldBodyText, formatDniWithDots } from '../../utils/templateHelpers';
import { LOGO_DATA_URLS } from '../../config/logoAssets';

// Estilos para maquetado en 1 SOLA HOJA
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
  
  // Encabezado Dual (Logo Verax Agrandado y Alineado al Margen Izquierdo, Aseguradora a la Derecha)
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

  // Document Title (Fijo "ACTA DE DESISTIMIENTO")
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

  // Body Paragraph Justified with Bold placeholders
  bodyParagraph: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.45,
    textAlign: 'justify',
    marginBottom: 12,
    color: '#0F172A',
  },

  // Declaración Complementaria (Disclaimer de Firma Digital)
  legalNote: {
    fontSize: 8,
    fontFamily: 'Helvetica-Oblique',
    color: '#475569',
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 3,
    borderLeftColor: '#B53B3A',
    padding: 5,
    marginBottom: 10,
  },

  // Bloque de Firma (FIRMANTE)
  signatureSection: {
    marginTop: 22,
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

  // Sección de Imágenes al pie de la Hoja 1
  imagesFooterRow: {
    marginTop: 16,
    paddingTop: 0,
    borderTopWidth: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  footerImageCard: {
    width: '48%',
    height: 135,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 4,
    padding: 3,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
});

interface ActaPdfDocumentProps {
  formData: ActaFormData;
  attachments: ImageAttachment[];
  company: Company;
  template: DocumentTemplate;
  veraxLogoUrl?: string;
  companyLogoUrl?: string;
}

export const ActaPdfDocument: React.FC<ActaPdfDocumentProps> = ({
  formData,
  attachments,
  company,
  template,
  veraxLogoUrl = LOGO_DATA_URLS.VERAX || LOGO_DATA_URLS.ESTUDIO_VERAX || '/assets/logos/estudio_verax.png',
  companyLogoUrl = LOGO_DATA_URLS[company.id] || company.logoUrl,
}) => {
  const formattedDni = formatDniWithDots(formData.dni);
  const tieneTextoAdicional = Boolean(formData.textoAdicional && formData.textoAdicional.trim());

  return (
    <Document
      title={`ACTA DE DESISTIMIENTO - ${formData.nombreCompleto || 'Siniestro'}`}
      author="Estudio Verax"
      subject={`Siniestro N° ${formData.numeroSiniestro}`}
    >
      {/* HOJA 1 ÚNICA */}
      <Page size="A4" style={styles.page}>
        {/* Encabezado Dual con Logo de Estudio Verax Agrandado y Alineado al Margen Izquierdo */}
        <View style={styles.headerContainer}>
          <Image src={veraxLogoUrl} style={styles.logoLeft} />
          <Image src={companyLogoUrl} style={styles.logoRight} />
        </View>

        {/* Título del Documento (Fijo "ACTA DE DESISTIMIENTO") */}
        <View style={styles.titleBlock}>
          <Text style={styles.titleText}>ACTA DE DESISTIMIENTO</Text>
        </View>

        {/* Cuerpo Principal Transcrito Idéntico con Campos en Negrita y Texto Adicional al final del párrafo */}
        <Text style={styles.bodyParagraph}>
          {renderBoldBodyText(template.bodyTemplate, formData)}
          {tieneTextoAdicional && (
            <Text style={{ fontFamily: 'Helvetica' }}>
              {` ${formData.textoAdicional!.trim()}`}
            </Text>
          )}
        </Text>

        {/* Nota de Validez Legal */}
        <View style={styles.legalNote}>
          <Text>
            El presente instrumento privado se suscribe con plena conformidad y alcance legal, 
            siendo apto para su validación e integración mediante firma digital.
          </Text>
        </View>

        {/* Bloque de Firma (FIRMANTE) */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureTitle}>FIRMANTE</Text>
            <Text style={styles.signatureDetailBold}>DNI N°: {formattedDni || '—'}</Text>
            <Text style={styles.signatureDetailBold}>Email: {formData.email || '—'}</Text>
          </View>
        </View>

        {/* Imágenes Adjuntas al Pie de la Hoja 1 */}
        {attachments.length > 0 && (
          <View style={styles.imagesFooterRow}>
            {attachments.slice(0, 2).map((att, idx) => (
              <View 
                key={att.id || idx} 
                style={[
                  styles.footerImageCard,
                  { width: attachments.length === 1 ? '75%' : '48%' }
                ]}
              >
                <Image src={att.dataUrl} style={styles.footerImage} />
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};
