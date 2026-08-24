import React from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { Download, Eye } from 'lucide-react';
import type { Company, DocumentTemplate } from '../../config/templates';
import type { ActaFormData, DeclaracionFormData, ImageAttachment } from '../../types/acta';
import { ActaPdfDocument } from './ActaPdfDocument';
import { ActaDeclaracionPdf } from './ActaDeclaracionPdf';

interface PdfPreviewPanelProps {
  activeTab: 'DESISTIMIENTO' | 'DECLARACION';
  formData: ActaFormData;
  declaracionData: DeclaracionFormData;
  attachments: ImageAttachment[];
  selectedCompany: Company;
  selectedTemplate: DocumentTemplate;
}

export const PdfPreviewPanel: React.FC<PdfPreviewPanelProps> = ({
  activeTab,
  formData,
  declaracionData,
  attachments,
  selectedCompany,
  selectedTemplate,
}) => {
  const isDeclaracion = activeTab === 'DECLARACION';

  const currentDocument = isDeclaracion ? (
    <ActaDeclaracionPdf
      formData={declaracionData}
      attachments={attachments}
      company={selectedCompany}
    />
  ) : (
    <ActaPdfDocument
      formData={formData}
      attachments={attachments}
      company={selectedCompany}
      template={selectedTemplate}
    />
  );

  const downloadFileName = isDeclaracion
    ? `Acta_Declaracion_${selectedCompany.id}_${declaracionData.nombreCompleto || 'Siniestro'}.pdf`
    : `Acta_Desistimiento_${selectedCompany.id}_${formData.nombreCompleto || 'Siniestro'}.pdf`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header del Panel de Previsualización */}
      <div className="bg-verax-blue px-6 py-4 text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-verax-red animate-pulse" />
          <div>
            <h3 className="text-sm font-bold tracking-wide uppercase">
              {isDeclaracion ? 'Vista Previa: Acta de Declaración' : 'Vista Previa: Acta de Desistimiento'}
            </h3>
            <p className="text-xs text-slate-300">
              Renderizado directo en tiempo real • Listo para Adobe Sign
            </p>
          </div>
        </div>

        {/* Único Botón de Descarga Directa del PDF (Header) */}
        <PDFDownloadLink
          document={currentDocument}
          fileName={downloadFileName}
          className="inline-flex items-center gap-2 px-4 py-2 bg-verax-red hover:bg-verax-red-dark text-white font-bold text-xs rounded-xl shadow-md transition transform active:scale-95"
        >
          {({ loading }) => (
            <>
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generando PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Descargar PDF</span>
                </>
              )}
            </>
          )}
        </PDFDownloadLink>
      </div>

      {/* Visor PDF Interactivo */}
      <div className="flex-1 bg-slate-800 p-2 relative">
        <PDFViewer className="w-full h-full rounded-xl border-0 shadow-inner" showToolbar={true}>
          {currentDocument}
        </PDFViewer>
      </div>
    </div>
  );
};
