import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Building2, 
  FileText, 
  User, 
  CreditCard, 
  Mail, 
  ShieldAlert, 
  Calendar, 
  Car,
  AlertTriangle,
  RotateCcw,
  Tag,
  FileEdit
} from 'lucide-react';
import { COMPANIES, ACTA_TEMPLATES } from '../../config/templates';
import type { Company, DocumentTemplate } from '../../config/templates';
import { actaFormSchema } from '../../types/acta';
import type { ActaFormData } from '../../types/acta';

interface ActaFormProps {
  initialValues: ActaFormData;
  onFormChange: (data: ActaFormData) => void;
  selectedCompany: Company;
  selectedTemplate: DocumentTemplate;
  onCompanySelect: (companyId: Company['id']) => void;
  onTemplateSelect: (templateId: string) => void;
}

export const ActaForm: React.FC<ActaFormProps> = ({
  initialValues,
  onFormChange,
  selectedCompany,
  selectedTemplate,
  onCompanySelect,
  onTemplateSelect,
}) => {
  const {
    register,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ActaFormData>({
    resolver: zodResolver(actaFormSchema),
    defaultValues: initialValues,
    mode: 'onChange',
  });

  const formValues = watch();

  useEffect(() => {
    onFormChange(formValues);
  }, [JSON.stringify(formValues)]);

  const availableTemplates = ACTA_TEMPLATES.filter(
    t => t.companyId === selectedCompany.id
  );

  const activeFields = selectedTemplate.fields || [];
  const hasField = (field: string) => activeFields.includes(field);

  const handleCompanyChange = (companyId: Company['id']) => {
    onCompanySelect(companyId);
    setValue('companyId', companyId);
    const firstMatching = ACTA_TEMPLATES.find(t => t.companyId === companyId);
    if (firstMatching) {
      onTemplateSelect(firstMatching.id);
      setValue('templateId', firstMatching.id);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    onTemplateSelect(templateId);
    setValue('templateId', templateId);
  };

  const handleClearForm = () => {
    const today = new Date().toISOString().split('T')[0];
    reset({
      companyId: selectedCompany.id,
      templateId: selectedTemplate.id,
      registroInterno: '',
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
  };

  return (
    <form className="space-y-6">
      {/* 1. SELECCIÓN DE COMPAÑÍA Y TIPO DE ACTA */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-verax-red" />
            1. Aseguradora y Modelo (16 Plantillas)
          </h2>
          <button
            type="button"
            onClick={handleClearForm}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-verax-red bg-slate-100 hover:bg-rose-50 border border-slate-200 rounded-lg transition"
            title="Limpiar formulario"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Limpiar
          </button>
        </div>

        {/* Grid de Selección de Compañía */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">
            Seleccionar Compañía Aseguradora
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {COMPANIES.map(company => {
              const isSelected = company.id === selectedCompany.id;
              return (
                <button
                  key={company.id}
                  type="button"
                  onClick={() => handleCompanyChange(company.id)}
                  tabIndex={1}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-verax-red bg-slate-50 ring-2 ring-verax-red/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="w-12 h-10 mb-1.5 flex items-center justify-center">
                    <img
                      src={company.logoUrl}
                      alt={company.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? 'text-verax-red' : 'text-slate-700'
                    }`}
                  >
                    {company.id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selector de Tipo de Acta */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Modelo de Acta de Desistimiento
          </label>
          <select
            value={selectedTemplate.id}
            onChange={e => handleTemplateChange(e.target.value)}
            tabIndex={2}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-verax-blue/20 focus:border-verax-blue outline-none transition font-medium text-slate-800"
          >
            {availableTemplates.map(tmpl => (
              <option key={tmpl.id} value={tmpl.id}>
                {tmpl.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. DATOS DEL FIRMANTE */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <User className="w-4 h-4 text-verax-red" />
          2. DATOS DEL FIRMANTE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre Completo */}
          {hasField('NOMBRE_COMPLETO') && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Nombre Completo *
              </label>
              <input
                type="text"
                tabIndex={3}
                placeholder=""
                {...register('nombreCompleto')}
                className={`w-full px-3.5 py-2 text-sm border rounded-xl outline-none focus:ring-2 transition ${
                  errors.nombreCompleto
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                    : 'border-slate-300 focus:ring-verax-blue/20 focus:border-verax-blue'
                }`}
              />
              {errors.nombreCompleto && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">
                  {errors.nombreCompleto.message}
                </p>
              )}
            </div>
          )}

          {/* DNI */}
          {hasField('DNI') && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                DNI N° *
              </label>
              <input
                type="text"
                tabIndex={4}
                placeholder=""
                {...register('dni')}
                className={`w-full px-3.5 py-2 text-sm border rounded-xl outline-none focus:ring-2 transition ${
                  errors.dni
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                    : 'border-slate-300 focus:ring-verax-blue/20 focus:border-verax-blue'
                }`}
              />
              {errors.dni && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">
                  {errors.dni.message}
                </p>
              )}
            </div>
          )}

          {/* Email */}
          {hasField('EMAIL') && (
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Correo Electrónico (Casilla C.E. para Adobe Sign) *
              </label>
              <input
                type="email"
                tabIndex={5}
                placeholder=""
                {...register('email')}
                className={`w-full px-3.5 py-2 text-sm border rounded-xl outline-none focus:ring-2 transition ${
                  errors.email
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                    : 'border-slate-300 focus:ring-verax-blue/20 focus:border-verax-blue'
                }`}
              />
              {errors.email && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. DATOS DEL SINIESTRO Y PÓLIZA */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldAlert className="w-4 h-4 text-verax-red" />
          3. Datos del Siniestro y Póliza
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* N° de Registro Interno */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              N° de Registro Interno
            </label>
            <input
              type="text"
              tabIndex={6}
              placeholder=""
              {...register('registroInterno')}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-verax-blue/20 focus:border-verax-blue transition"
            />
          </div>

          {/* Fecha del Acta */}
          {hasField('FECHA') && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Fecha del Acta *
              </label>
              <input
                type="date"
                tabIndex={7}
                {...register('fecha')}
                className={`w-full px-3.5 py-2 text-sm border rounded-xl outline-none focus:ring-2 transition ${
                  errors.fecha
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                    : 'border-slate-300 focus:ring-verax-blue/20 focus:border-verax-blue'
                }`}
              />
            </div>
          )}

          {/* Número de Siniestro */}
          {hasField('NUMERO_SINIESTRO') && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Número de Siniestro *
              </label>
              <input
                type="text"
                tabIndex={8}
                placeholder=""
                {...register('numeroSiniestro')}
                className={`w-full px-3.5 py-2 text-sm border rounded-xl outline-none focus:ring-2 transition ${
                  errors.numeroSiniestro
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                    : 'border-slate-300 focus:ring-verax-blue/20 focus:border-verax-blue'
                }`}
              />
              {errors.numeroSiniestro && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">
                  {errors.numeroSiniestro.message}
                </p>
              )}
            </div>
          )}

          {/* Número de Póliza */}
          {hasField('NUMERO_POLIZA') && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Número de Póliza
              </label>
              <input
                type="text"
                tabIndex={9}
                placeholder=""
                {...register('numeroPoliza')}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-verax-blue/20 focus:border-verax-blue transition"
              />
            </div>
          )}

          {/* Fecha de Ocurrencia */}
          {(hasField('FECHA_OCURRENCIA') || hasField('FECHA_DENUNCIA')) && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Fecha de Ocurrencia
              </label>
              <input
                type="date"
                tabIndex={10}
                {...register('fechaOcurrencia')}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-verax-blue/20 focus:border-verax-blue transition"
              />
            </div>
          )}

          {/* Referencia (REF) para Sancor */}
          {hasField('REF') && (
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Referencia (REF)
              </label>
              <input
                type="text"
                tabIndex={11}
                placeholder=""
                {...register('ref')}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-verax-blue/20 focus:border-verax-blue transition"
              />
            </div>
          )}
        </div>
      </div>

      {/* 4. DATOS DEL VEHÍCULO ASEGURADO (UNIFICADO EN 1 SOLO CAMPO) */}
      {hasField('DATOS_VEHICULO_ASEGURADO') && (
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-verax-blue uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2.5">
            <Car className="w-4 h-4 text-verax-red" />
            4. Datos del Vehículo Asegurado
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vehículo Asegurado (Marca, Modelo, Dominio)
            </label>
            <input
              type="text"
              tabIndex={12}
              placeholder=""
              {...register('vehiculoAsegurado')}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-verax-blue/20 focus:border-verax-blue transition"
            />
          </div>
        </div>
      )}

      {/* 5. CAUSANTE DEL DAÑO */}
      {hasField('CAUSANTE_DANO') && (
        <div className="bg-rose-50/40 p-5 rounded-2xl border border-rose-200/80 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-rose-900 uppercase tracking-wider flex items-center gap-2 border-b border-rose-200/60 pb-2.5">
            <AlertTriangle className="w-4 h-4 text-verax-red" />
            5. CAUSANTE DEL DAÑO
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nombre Completo del Causante del Daño *
            </label>
            <input
              type="text"
              tabIndex={13}
              placeholder=""
              {...register('causanteDano')}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-verax-red/20 focus:border-verax-red transition"
            />
          </div>
        </div>
      )}

      {/* 6. TEXTO / PÁRRAFO ADICIONAL (OPCIONAL) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <FileEdit className="w-4 h-4 text-verax-red" />
          Texto / Párrafo Adicional (Opcional)
        </h2>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Texto personalizado que se anexará al final del párrafo principal del PDF
          </label>
          <textarea
            rows={3}
            tabIndex={14}
            placeholder=""
            {...register('textoAdicional')}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-verax-blue/20 focus:border-verax-blue transition"
          />
        </div>
      </div>
    </form>
  );
};
