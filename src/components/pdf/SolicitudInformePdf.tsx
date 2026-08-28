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
import type { SolicitudInformeFormData, ImageAttachment } from '../../types/acta';
import { buildSolicitudInformeTemplateParts, COMPANY_LEGAL_NAMES } from '../../config/templateSolicitudInforme';
import { formatDniWithDots, formatDateToArgentine } from '../../utils/templateHelpers';
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
    marginBottom: 14,
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

  // Document Header Block (A: Destinatario)
  headerBlock: {
    marginBottom: 12,
  },
  headerMedicalTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#384969',
    textTransform: 'uppercase',
    marginBottom: 8,
    textAlign: 'center',
  },
  destinatarioText: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    textTransform: 'uppercase',
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

  // Section Puntos
  puntosParagraph: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.45,
    textAlign: 'justify',
    marginBottom: 14,
    color: '#0F172A',
  },

  // Cierre Legal
  cierreParagraph: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
    textAlign: 'justify',
    marginTop: 10,
    marginBottom: 16,
    color: '#334155',
  },

  // Bloque de Firma y Contacto
  signatureSection: {
    marginTop: 16,
    paddingTop: 0,
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
    fontSize: 8.5,
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

interface SolicitudInformePdfProps {
  formData: SolicitudInformeFormData;
  annexAttachments: ImageAttachment[];
  company: Company;
  veraxLogoUrl?: string;
  companyLogoUrl?: string;
}

export const SolicitudInformePdf: React.FC<SolicitudInformePdfProps> = ({
  formData,
  annexAttachments,
  company,
  veraxLogoUrl = LOGO_DATA_URLS.VERAX || LOGO_DATA_URLS.ESTUDIO_VERAX || '/assets/logos/estudio_verax.png',
  companyLogoUrl = LOGO_DATA_URLS[company.id] || company.logoUrl,
}) => {
  const parts = buildSolicitudInformeTemplateParts(formData);
  const companyLegalName = COMPANY_LEGAL_NAMES[formData.companyId] || COMPANY_LEGAL_NAMES.ANTARTIDA;

  // Intercalar tokens {{NOMBRE_ASEGURADORA}} y {{NUMERO_SINIESTRO}} en negrita en el cuerpo superior
  const cuerpoParts = parts.cuerpoSuperiorTemplate.split(/({{[A-Z_]+}})/g);

  // Intercalar tokens de Informe Médico si el modelo es INFORME_MEDICO
  const isMedico = formData.tipoModelo === 'INFORME_MEDICO';
  const puntosParts = parts.puntosTemplate.split(/({{[A-Z_]+}})/g);

  const formattedFechaAtencion = formatDateToArgentine(formData.fechaAtencionPaciente);
  const formattedDniPaciente = formatDniWithDots(formData.dniPaciente);

  const getPuntosVarValue = (varName: string): string => {
    switch (varName) {
      case 'FECHA_ATENCION':
        return (formattedFechaAtencion || '[FECHA ATENCIÓN]').toUpperCase();
      case 'NOMBRE_PACIENTE':
        return (formData.nombrePaciente || '[NOMBRE PACIENTE]').toUpperCase();
      case 'DNI_PACIENTE':
        return (formattedDniPaciente ? `DNI ${formattedDniPaciente}` : '[DNI PACIENTE]').toUpperCase();
      case 'NOMBRE_PROFESIONAL':
        return (formData.nombreProfesional || '[NOMBRE PROFESIONAL]').toUpperCase();
      case 'MATRICULA_PROVINCIAL':
        return (formData.matriculaProvincial || '[M.P.]').toUpperCase();
      case 'MATRICULA_NACIONAL':
        return (formData.matriculaNacional || '[M.N.]').toUpperCase();
      default:
        return `[${varName}]`;
    }
  };

  return (
    <Document
      title={`SOLICITUD DE INFORME - Siniestro ${formData.numeroSiniestro || ''}`}
      author="Estudio Verax"
      subject={`Requerimiento Pericial - Siniestro N° ${formData.numeroSiniestro}`}
    >
      {/* PÁGINA PRINCIPAL */}
      <Page size="A4" style={styles.page}>
        {/* Encabezado Dual */}
        <View style={styles.headerContainer}>
          <Image src={veraxLogoUrl} style={styles.logoLeft} />
          <Image src={companyLogoUrl} style={styles.logoRight} />
        </View>

        {/* Encabezado de Solicitud (A: Destinatario) */}
        <View style={styles.headerBlock}>
          {formData.tipoModelo === 'INFORME_MEDICO' && (
            <Text style={styles.headerMedicalTitle}>
              SE PRESENTA – MANIFIESTA – SOLICITA SE INFORME
            </Text>
          )}
          <Text style={styles.destinatarioText}>
            A: {(formData.destinatarioInstitucion || '[DESTINATARIO / INSTITUCIÓN]').toUpperCase()}
          </Text>
        </View>

        {/* Cuerpo Superior Verbatim con Variables en Negrita */}
        <Text style={styles.bodyParagraph}>
          {cuerpoParts.map((part, index) => {
            if (part === '{{NOMBRE_ASEGURADORA}}') {
              return (
                <Text key={index} style={{ fontFamily: 'Helvetica-Bold' }}>
                  {companyLegalName.toUpperCase()}
                </Text>
              );
            }
            if (part === '{{NUMERO_SINIESTRO}}') {
              return (
                <Text key={index} style={{ fontFamily: 'Helvetica-Bold' }}>
                  {(formData.numeroSiniestro || '[N° SINIESTRO]').toUpperCase()}
                </Text>
              );
            }
            return part;
          })}
        </Text>

        {/* Puntos Solicitados (Formato estructurado de 4 puntos en Informe Médico) */}
        <Text style={styles.puntosParagraph}>
          {isMedico ? (
            puntosParts.map((part, index) => {
              const match = part.match(/^{{([A-Z_]+)}}$/);
              if (match) {
                const varName = match[1];
                return (
                  <Text key={index} style={{ fontFamily: 'Helvetica-Bold' }}>
                    {getPuntosVarValue(varName)}
                  </Text>
                );
              }
              return part;
            })
          ) : (
            parts.puntosTemplate
          )}
        </Text>

        {/* Bloque de Cierre Legal y Firma juntos */}
        <View wrap={false}>
          {/* Cierre Legal Verbatim */}
          <Text style={styles.cierreParagraph}>
            {parts.cierreLegal}
          </Text>

          {/* Bloque de Firma e Identificación */}
          <View style={styles.signatureSection}>
            <View style={styles.signatureBox}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureTitle}>ESTUDIO VERAX</Text>
              <Text style={styles.signatureDetailBold}>Cesar H. PERICH</Text>
              <Text style={styles.signatureDetailBold}>Cel. 221-6160777</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* PÁGINAS SUBSIGUIENTES DE ANEXOS */}
      {annexAttachments.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.headerContainer}>
            <Image src={veraxLogoUrl} style={styles.logoLeft} />
            <Image src={companyLogoUrl} style={styles.logoRight} />
          </View>

          <View style={styles.annexTitleBlock}>
            <Text style={styles.annexTitleText}>
              ANEXO DOCUMENTAL / REQUERIMIENTO
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
