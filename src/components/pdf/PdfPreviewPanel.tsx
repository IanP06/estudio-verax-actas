import React from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { Download, Eye } from 'lucide-react';
import type { Company, DocumentTemplate } from '../../config/templates';
import type { ActaFormData, DeclaracionFormData, SolicitudInformeFormData, RetiroDenunciaFormData, ImageAttachment } from '../../types/acta';
import { ActaPdfDocument } from './ActaPdfDocument';
import { ActaDeclaracionPdf } from './ActaDeclaracionPdf';
import { SolicitudInformePdf } from './SolicitudInformePdf';
import { RetiroDenunciaPdf } from './RetiroDenunciaPdf';

interface PdfPreviewPanelProps {
  activeTab: 'DESISTIMIENTO' | 'DECLARACION' | 'SOLICITUD' | 'RETIRO_DENUNCIA';
  formData: ActaFormData;
  declaracionData: DeclaracionFormData;
  solicitudData: SolicitudInformeFormData;
  retiroDenunciaData: RetiroDenunciaFormData;
  dniAttachments: ImageAttachment[];
  annexAttachments: ImageAttachment[];
  selectedCompany: Company;
  selectedTemplate: DocumentTemplate;
}

export const PdfPreviewPanel: React.FC<PdfPreviewPanelProps> = ({
  activeTab,
  formData,
  declaracionData,
  solicitudData,
  retiroDenunciaData,
  dniAttachments,
  annexAttachments,
  selectedCompany,
  selectedTemplate,
}) => {
  let currentDocument: React.ReactElement;
  let downloadFileName = '';
  let previewTitle = '';

  if (activeTab === 'RETIRO_DENUNCIA') {
    currentDocument = (
      <RetiroDenunciaPdf
        formData={retiroDenunciaData}
        dniAttachments={dniAttachments}
        annexAttachments={annexAttachments}
        company={selectedCompany}
      />
    );
    const reg = retiroDenunciaData.registroInterno?.trim() || 'S-N';
    downloadFileName = `${reg} - Retiro de Denuncia - ${selectedCompany.id}.pdf`;
    previewTitle = 'Vista Previa: Retiro de Denuncia';
  } else if (activeTab === 'SOLICITUD') {
    currentDocument = (
      <SolicitudInformePdf
        formData={solicitudData}
        annexAttachments={annexAttachments}
        company={selectedCompany}
      />
    );
    const reg = solicitudData.registroInterno?.trim() || 'S-N';
    downloadFileName = `${reg} - Solicitud de Informe - ${selectedCompany.id}.pdf`;
    previewTitle = 'Vista Previa: Solicitud de Informe / Colaboración';
  } else if (activeTab === 'DECLARACION') {
    currentDocument = (
      <ActaDeclaracionPdf
        formData={declaracionData}
        dniAttachments={dniAttachments}
        annexAttachments={annexAttachments}
        company={selectedCompany}
      />
    );
    const reg = declaracionData.registroInterno?.trim() || 'S-N';
    downloadFileName = `${reg} - Acta de Declaracion - ${selectedCompany.id}.pdf`;
    previewTitle = 'Vista Previa: Acta de Declaración';
  } else {
    currentDocument = (
      <ActaPdfDocument
        formData={formData}
        attachments={[...dniAttachments, ...annexAttachments]}
        company={selectedCompany}
        template={selectedTemplate}
      />
    );
    const reg = formData.registroInterno?.trim() || 'S-N';
    downloadFileName = `${reg} - Acta de Desistimiento - ${selectedCompany.id}.pdf`;
    previewTitle = 'Vista Previa: Acta de Desistimiento';
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header del Panel de Previsualización */}
      <div className="bg-verax-blue px-6 py-4 text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-verax-red animate-pulse" />
          <div>
            <h3 className="text-sm font-bold tracking-wide uppercase">
              {previewTitle}
            </h3>
            <p className="text-xs text-slate-300">
              Renderizado directo en tiempo real • Listo para envío o Adobe Sign
            </p>
          </div>
        </div>

        {/* Único Botón de Descarga Directa del PDF */}
        <PDFDownloadLink
          document={currentDocument as any}
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
          {currentDocument as any}
        </PDFViewer>
      </div>
    </div>
  );
};
