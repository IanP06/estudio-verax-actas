import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { ActaForm } from './components/forms/ActaForm';
import { DeclaracionForm } from './components/forms/DeclaracionForm';
import { ImageUploader } from './components/attachments/ImageUploader';
import { PdfPreviewPanel } from './components/pdf/PdfPreviewPanel';
import { COMPANIES, ACTA_TEMPLATES } from './config/templates';
import { CONDICIONES_FIRMANTE } from './config/templateDeclaracion';
import type { Company, DocumentTemplate } from './config/templates';
import type { ActaFormData, DeclaracionFormData, ImageAttachment } from './types/acta';
import { FileText, FileCheck2, IdCard, Map } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'DESISTIMIENTO' | 'DECLARACION'>('DESISTIMIENTO');

  const [selectedCompany, setSelectedCompany] = useState<Company>(COMPANIES[0]);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate>(ACTA_TEMPLATES[0]);

  const today = new Date().toISOString().split('T')[0];

  // Estado para Actas de Desistimiento
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

  // Estado para Actas de Declaración
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

  // Módulos independientes de carga de imágenes
  const [dniAttachments, setDniAttachments] = useState<ImageAttachment[]>([]);
  const [annexAttachments, setAnnexAttachments] = useState<ImageAttachment[]>([]);

  const handleCompanySelect = (companyId: Company['id']) => {
    const foundCompany = COMPANIES.find(c => c.id === companyId) || COMPANIES[0];
    setSelectedCompany(foundCompany);

    setFormData(prev => ({ ...prev, companyId }));
    setDeclaracionData(prev => ({ ...prev, companyId }));
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
          {/* TAB SWITCHER PRINCIPAL */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('DESISTIMIENTO')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition ${
                activeTab === 'DESISTIMIENTO'
                  ? 'bg-verax-blue text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className={`w-4 h-4 ${activeTab === 'DESISTIMIENTO' ? 'text-verax-red' : 'text-slate-400'}`} />
              Acta de Desistimiento
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('DECLARACION')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition ${
                activeTab === 'DECLARACION'
                  ? 'bg-verax-blue text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileCheck2 className={`w-4 h-4 ${activeTab === 'DECLARACION' ? 'text-verax-red' : 'text-slate-400'}`} />
              Acta de Declaración
            </button>
          </div>

          {/* Formulario Activo */}
          {activeTab === 'DESISTIMIENTO' ? (
            <ActaForm
              initialValues={formData}
              onFormChange={setFormData}
              selectedCompany={selectedCompany}
              selectedTemplate={selectedTemplate}
              onCompanySelect={handleCompanySelect}
              onTemplateSelect={handleTemplateSelect}
            />
          ) : (
            <DeclaracionForm
              initialValues={declaracionData}
              onFormChange={setDeclaracionData}
              selectedCompany={selectedCompany}
              onCompanySelect={handleCompanySelect}
            />
          )}

          {/* MÓDULO 1 DE CARGA DEDICADA: Foto de DNI del Declarante */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <ImageUploader
              title="Foto de DNI del Declarante / Firmante"
              subtitle="Se adjuntará al pie del acta junto al campo de firma"
              attachments={dniAttachments}
              onAttachmentsChange={setDniAttachments}
              maxFiles={2}
              icon={<IdCard className="w-4 h-4 text-verax-red" />}
            />
          </div>

          {/* MÓDULO 2 DE CARGA DEDICADA: Anexos Documentales / Croquis / Evidencias */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <ImageUploader
              title="Anexos Documentales / Croquis / Evidencias"
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
