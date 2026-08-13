import React, { useState, useEffect } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { Download, FileCheck, RefreshCw } from 'lucide-react';
import { ActaPdfDocument } from './ActaPdfDocument';
import type { Company, DocumentTemplate } from '../../config/templates';
import type { ActaFormData, ImageAttachment } from '../../types/acta';
import { LOGO_DATA_URLS } from '../../config/logoAssets';
import { getLogoBase64 } from '../../utils/logoLoader';

interface PdfPreviewPanelProps {
  formData: ActaFormData;
  attachments: ImageAttachment[];
  selectedCompany: Company;
  selectedTemplate: DocumentTemplate;
}

export const PdfPreviewPanel: React.FC<PdfPreviewPanelProps> = ({
  formData,
  attachments,
  selectedCompany,
  selectedTemplate,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [veraxLogoBase64, setVeraxLogoBase64] = useState<string>(
    LOGO_DATA_URLS.VERAX || LOGO_DATA_URLS.ESTUDIO_VERAX || '/assets/logos/estudio_verax.png'
  );
  const [companyLogoBase64, setCompanyLogoBase64] = useState<string>(
    LOGO_DATA_URLS[selectedCompany.id] || selectedCompany.logoUrl
  );

  useEffect(() => {
    setIsClient(true);

    if (LOGO_DATA_URLS.VERAX || LOGO_DATA_URLS.ESTUDIO_VERAX) {
      setVeraxLogoBase64(LOGO_DATA_URLS.VERAX || LOGO_DATA_URLS.ESTUDIO_VERAX);
    } else {
      getLogoBase64('/assets/logos/estudio_verax.png').then(setVeraxLogoBase64);
    }

    if (LOGO_DATA_URLS[selectedCompany.id]) {
      setCompanyLogoBase64(LOGO_DATA_URLS[selectedCompany.id]);
    } else {
      getLogoBase64(selectedCompany.logoUrl).then(setCompanyLogoBase64);
    }
  }, [selectedCompany.id, selectedCompany.logoUrl]);

  const sanitizedDni = (formData.dni || 'SIN_DNI').replace(/[^a-zA-Z0-9]/g, '');
  const sanitizedSiniestro = (formData.numeroSiniestro || 'SIN_NUMERO').replace(/[^a-zA-Z0-9]/g, '_');
  const pdfFilename = `Acta_${selectedCompany.id}_${sanitizedSiniestro}_${sanitizedDni}.pdf`;

  const documentComponent = (
    <ActaPdfDocument
      formData={formData}
      attachments={attachments}
      company={selectedCompany}
      template={selectedTemplate}
      veraxLogoUrl={veraxLogoBase64}
      companyLogoUrl={companyLogoBase64}
    />
  );

  if (!isClient) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-6 rounded-2xl">
        <RefreshCw className="w-8 h-8 animate-spin mb-3 text-verax-red" />
        <p className="text-sm font-medium">Cargando visor de PDF...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* TOOLBAR SUPERIOR DEL VISOR PDF */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full bg-verax-red animate-pulse" />
          <span className="text-xs font-bold text-slate-200 truncate">
            Vista Previa del Acta (Hoja Única)
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-300 rounded-full border border-slate-700">
            {selectedCompany.id}
          </span>
        </div>

        {/* BOTÓN PRINCIPAL DE DESCARGA PDF */}
        <div className="flex items-center gap-2">
          <PDFDownloadLink
            document={documentComponent}
            fileName={pdfFilename}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-verax-red hover:bg-verax-red-dark active:bg-rose-900 rounded-xl shadow-lg shadow-verax-red/20 transition transform hover:-translate-y-0.5"
          >
            {({ loading }) => (
              <>
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Download className="w-4 h-4 text-white" />
                )}
                <span>{loading ? 'Generando PDF...' : 'Descargar Acta (.pdf)'}</span>
              </>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      {/* VISOR DE PDF EN TIEMPO REAL */}
      <div className="flex-1 w-full h-full bg-slate-950 relative overflow-hidden flex items-center justify-center">
        <PDFViewer
          className="w-full h-full border-0"
          showToolbar={false}
        >
          {documentComponent}
        </PDFViewer>
      </div>

      {/* BARRA INFERIOR DE ESTADO */}
      <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <FileCheck className="w-3.5 h-3.5 text-verax-red" />
          <span>Estudio Verax • Documento de 1 Sola Hoja</span>
        </div>
        <span className="truncate max-w-[200px] text-slate-500">
          {pdfFilename}
        </span>
      </div>
    </div>
  );
};
