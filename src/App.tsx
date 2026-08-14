import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { ActaForm } from './components/forms/ActaForm';
import { ImageUploader } from './components/attachments/ImageUploader';
import { PdfPreviewPanel } from './components/pdf/PdfPreviewPanel';
import { COMPANIES, ACTA_TEMPLATES } from './config/templates';
import type { Company, DocumentTemplate } from './config/templates';
import type { ActaFormData, ImageAttachment } from './types/acta';

export function App() {
  const [selectedCompany, setSelectedCompany] = useState<Company>(COMPANIES[0]);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate>(ACTA_TEMPLATES[0]);

  const today = new Date().toISOString().split('T')[0];

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

  const [attachments, setAttachments] = useState<ImageAttachment[]>([]);

  const handleCompanySelect = (companyId: Company['id']) => {
    const foundCompany = COMPANIES.find(c => c.id === companyId) || COMPANIES[0];
    setSelectedCompany(foundCompany);
  };

  const handleTemplateSelect = (templateId: string) => {
    const foundTemplate = ACTA_TEMPLATES.find(t => t.id === templateId) || ACTA_TEMPLATES[0];
    setSelectedTemplate(foundTemplate);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-[1800px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUMNA IZQUIERDA: Formulario Adaptativo y Anexos */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-6">
          {/* Formulario Adaptativo */}
          <ActaForm
            initialValues={formData}
            onFormChange={setFormData}
            selectedCompany={selectedCompany}
            selectedTemplate={selectedTemplate}
            onCompanySelect={handleCompanySelect}
            onTemplateSelect={handleTemplateSelect}
          />

          {/* Módulo de Anexos Documentales */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <ImageUploader
              attachments={attachments}
              onAttachmentsChange={setAttachments}
            />
          </div>
        </div>

        {/* COLUMNA DERECHA: Visualizador PDF en Tiempo Real (Live Split View) */}
        <div className="lg:col-span-6 xl:col-span-7 h-[calc(100vh-6rem)] sticky top-20">
          <PdfPreviewPanel
            formData={formData}
            attachments={attachments}
            selectedCompany={selectedCompany}
            selectedTemplate={selectedTemplate}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
