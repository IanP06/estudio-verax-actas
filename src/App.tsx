import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { ActaForm } from './components/forms/ActaForm';
import { DeclaracionForm } from './components/forms/DeclaracionForm';
import { SolicitudInformeForm } from './components/forms/SolicitudInformeForm';
import { RetiroDenunciaForm } from './components/forms/RetiroDenunciaForm';
import { ImageUploader } from './components/attachments/ImageUploader';
import { PdfPreviewPanel } from './components/pdf/PdfPreviewPanel';
import { COMPANIES, ACTA_TEMPLATES } from './config/templates';
import { CONDICIONES_FIRMANTE } from './config/templateDeclaracion';
import type { Company, DocumentTemplate } from './config/templates';
import type { ActaFormData, DeclaracionFormData, SolicitudInformeFormData, RetiroDenunciaFormData, ImageAttachment } from './types/acta';
import { FileText, FileCheck2, ClipboardList, FileX2, IdCard, Map } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'DESISTIMIENTO' | 'DECLARACION' | 'SOLICITUD' | 'RETIRO_DENUNCIA'>('DESISTIMIENTO');

  const [selectedCompany, setSelectedCompany] = useState<Company>(COMPANIES[0]);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate>(ACTA_TEMPLATES[0]);

  const today = new Date().toISOString().split('T')[0];

  // Estado para Actas de Desistimiento (Tab 1)
  const [formData, setFormData] = useState<ActaFormData>({
    companyId: 'ANTARTIDA',
    templateId: 'ANTARTIDA_TITULAR',
    fecha: today,
    numeroSiniestro: '',
    numeroPoliza: '',
    ref: '',
    nombreCompleto: '',
    fechaOcurrencia: '',
    fechaDenuncia: '',
    vehiculoAsegurado: '',
    vehiculoMarca: '',
    vehiculoModelo: '',
    vehiculoDominio: '',
    causanteDano: '',
    textoAdicional: '',
    email: '',
    dni: '',
    lugarEmision: 'La Plata',
    fechaEmision: today,
  });

  // Estado para Actas de Declaración (Tab 2)
  const [declaracionData, setDeclaracionData] = useState<DeclaracionFormData>({
    companyId: 'ANTARTIDA',
    condicionFirmante: CONDICIONES_FIRMANTE[0],
    numeroSiniestro: '',
    numeroPoliza: '',
    numeroReferencia: '',
    numeroJuicio: '',
    nombreCompleto: '',
    nacionalidad: '',
    dni: '',
    domicilioCalle: '',
    domicilioLocalidad: '',
    domicilioProvincia: '',
    textoDeclaracion: '',
    email: '',
  });

  // Estado para Solicitudes de Informe (Tab 3)
  const [solicitudData, setSolicitudData] = useState<SolicitudInformeFormData>({
    companyId: 'ANTARTIDA',
    tipoModelo: 'COLABORACION_GENERAL',
    destinatarioInstitucion: '',
    numeroSiniestro: '',
    puntosSolicitud: '',
  });

  // Estado para Retiro de Denuncia (Tab 4)
  const [retiroDenunciaData, setRetiroDenunciaData] = useState<RetiroDenunciaFormData>({
    companyId: 'ANTARTIDA',
    numeroSiniestro: '',
    numeroPoliza: '',
    fechaOcurrencia: '',
    nombreCompleto: '',
    dni: '',
    domicilioCalle: '',
    domicilioLocalidad: '',
    domicilioProvincia: '',
    email: '',
    vehiculoMarca: '',
    vehiculoModelo: '',
    vehiculoDominio: '',
  });

  // Módulos independientes de carga de imágenes
  const [dniAttachments, setDniAttachments] = useState<ImageAttachment[]>([]);
  const [annexAttachments, setAnnexAttachments] = useState<ImageAttachment[]>([]);

  const handleCompanySelect = (companyId: Company['id']) => {
    const foundCompany = COMPANIES.find(c => c.id === companyId) || COMPANIES[0];
    setSelectedCompany(foundCompany);

    setFormData(prev => ({ ...prev, companyId }));
    setDeclaracionData(prev => ({ ...prev, companyId }));
    setSolicitudData(prev => ({ ...prev, companyId }));
    setRetiroDenunciaData(prev => ({ ...prev, companyId }));
  };

  const handleTemplateSelect = (templateId: string) => {
    const foundTemplate = ACTA_TEMPLATES.find(t => t.id === templateId) || ACTA_TEMPLATES[0];
    setSelectedTemplate(foundTemplate);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-[1800px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUMNA IZQUIERDA: Tab Switcher, Formulario y Módulos Independientes de Carga */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-6">
          {/* TAB SWITCHER PRINCIPAL (4 PESTAÑAS) */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('DESISTIMIENTO')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 text-[11px] font-bold rounded-xl transition ${
                activeTab === 'DESISTIMIENTO'
                  ? 'bg-verax-blue text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className={`w-3.5 h-3.5 ${activeTab === 'DESISTIMIENTO' ? 'text-verax-red' : 'text-slate-400'}`} />
              Desistimientos
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('DECLARACION')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 text-[11px] font-bold rounded-xl transition ${
                activeTab === 'DECLARACION'
                  ? 'bg-verax-blue text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileCheck2 className={`w-3.5 h-3.5 ${activeTab === 'DECLARACION' ? 'text-verax-red' : 'text-slate-400'}`} />
              Declaraciones
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('SOLICITUD')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 text-[11px] font-bold rounded-xl transition ${
                activeTab === 'SOLICITUD'
                  ? 'bg-verax-blue text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ClipboardList className={`w-3.5 h-3.5 ${activeTab === 'SOLICITUD' ? 'text-verax-red' : 'text-slate-400'}`} />
              Solicitudes
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('RETIRO_DENUNCIA')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 text-[11px] font-bold rounded-xl transition ${
                activeTab === 'RETIRO_DENUNCIA'
                  ? 'bg-verax-blue text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileX2 className={`w-3.5 h-3.5 ${activeTab === 'RETIRO_DENUNCIA' ? 'text-verax-red' : 'text-slate-400'}`} />
              Retiro Denuncia
            </button>
          </div>

          {/* Formulario Activo */}
          {activeTab === 'DESISTIMIENTO' && (
            <ActaForm
              initialValues={formData}
              onFormChange={setFormData}
              selectedCompany={selectedCompany}
              selectedTemplate={selectedTemplate}
              onCompanySelect={handleCompanySelect}
              onTemplateSelect={handleTemplateSelect}
            />
          )}

          {activeTab === 'DECLARACION' && (
            <DeclaracionForm
              initialValues={declaracionData}
              onFormChange={setDeclaracionData}
              selectedCompany={selectedCompany}
              onCompanySelect={handleCompanySelect}
            />
          )}

          {activeTab === 'SOLICITUD' && (
            <SolicitudInformeForm
              initialValues={solicitudData}
              onFormChange={setSolicitudData}
              selectedCompany={selectedCompany}
              onCompanySelect={handleCompanySelect}
            />
          )}

          {activeTab === 'RETIRO_DENUNCIA' && (
            <RetiroDenunciaForm
              initialValues={retiroDenunciaData}
              onFormChange={setRetiroDenunciaData}
              selectedCompany={selectedCompany}
              onCompanySelect={handleCompanySelect}
            />
          )}

          {/* MÓDULO DE CARGA DNI (Para Desistimientos, Declaraciones y Retiro de Denuncia) */}
          {activeTab !== 'SOLICITUD' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <ImageUploader
                title="Foto de DNI del Titular / Declarante"
                subtitle="Se estampará al pie del acta junto al campo de firma"
                attachments={dniAttachments}
                onAttachmentsChange={setDniAttachments}
                maxFiles={2}
                icon={<IdCard className="w-4 h-4 text-verax-red" />}
              />
            </div>
          )}

          {/* MÓDULO DE CARGA ANEXOS / EVIDENCIAS / CROQUIS (Para todos los módulos) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <ImageUploader
              title={activeTab === 'SOLICITUD' ? "Documentos Adjuntos / Evidencias" : "Anexos Documentales / Evidencias"}
              subtitle="Se adjuntarán en hojas adicionales al final del PDF"
              attachments={annexAttachments}
              onAttachmentsChange={setAnnexAttachments}
              icon={<Map className="w-4 h-4 text-verax-red" />}
            />
          </div>
        </div>

        {/* COLUMNA DERECHA: Visualizador PDF en Tiempo Real */}
        <div className="lg:col-span-6 xl:col-span-7 h-[calc(100vh-6rem)] sticky top-20">
          <PdfPreviewPanel
            activeTab={activeTab}
            formData={formData}
            declaracionData={declaracionData}
            solicitudData={solicitudData}
            retiroDenunciaData={retiroDenunciaData}
            dniAttachments={dniAttachments}
            annexAttachments={annexAttachments}
            selectedCompany={selectedCompany}
            selectedTemplate={selectedTemplate}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
