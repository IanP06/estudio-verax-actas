import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Building2, 
  FileText, 
  ShieldAlert, 
  RotateCcw,
  Building,
  ListOrdered,
  Calendar,
  User,
  CreditCard,
  UserCheck,
  Award
} from 'lucide-react';
import { COMPANIES } from '../../config/templates';
import type { Company } from '../../config/templates';
import { MODELOS_SOLICITUD } from '../../config/templateSolicitudInforme';
import { solicitudInformeFormSchema } from '../../types/acta';
import type { SolicitudInformeFormData } from '../../types/acta';

interface SolicitudInformeFormProps {
  initialValues: SolicitudInformeFormData;
  onFormChange: (data: SolicitudInformeFormData) => void;
  selectedCompany: Company;
  onCompanySelect: (companyId: Company['id']) => void;
}

export const SolicitudInformeForm: React.FC<SolicitudInformeFormProps> = ({
  initialValues,
  onFormChange,
  selectedCompany,
  onCompanySelect,
}) => {
  const {
    register,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<SolicitudInformeFormData>({
    resolver: zodResolver(solicitudInformeFormSchema),
    defaultValues: initialValues,
    mode: 'onChange',
  });

  const formValues = watch();

  useEffect(() => {
    onFormChange(formValues);
  }, [JSON.stringify(formValues)]);

  const handleCompanyChange = (companyId: Company['id']) => {
    onCompanySelect(companyId);
    setValue('companyId', companyId);
  };

  const handleClearForm = () => {
    reset({
      companyId: selectedCompany.id,
      tipoModelo: 'COLABORACION_GENERAL',
      destinatarioInstitucion: '',
      numeroSiniestro: '',
      puntosSolicitud: '',
      fechaAtencionPaciente: '',
      nombrePaciente: '',
      dniPaciente: '',
      nombreProfesional: '',
      matriculaProvincial: '',
      matriculaNacional: '',
    });
  };

  const isMedico = formValues.tipoModelo === 'INFORME_MEDICO';

  return (
    <form className="space-y-6">
      {/* 1. COMPAÑÍA ASEGURADORA Y TIPO DE SOLICITUD */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-verax-red" />
            1. Aseguradora y Modelo de Requerimiento
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

        {/* Modelo de Solicitud */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Modelo de Requerimiento / Solicitud *
          </label>
          <select
            tabIndex={2}
            {...register('tipoModelo')}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-verax-blue/20 focus:border-verax-blue outline-none transition font-medium text-slate-800"
          >
            {MODELOS_SOLICITUD.map(modelo => (
              <option key={modelo.id} value={modelo.id}>
                {modelo.title}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            {MODELOS_SOLICITUD.find(m => m.id === formValues.tipoModelo)?.description}
          </p>
        </div>
      </div>

      {/* 2. DATOS DEL ENCABEZADO Y SINIESTRO */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldAlert className="w-4 h-4 text-verax-red" />
          2. Destinatario y Datos del Siniestro
        </h2>

        <div className="space-y-4">
          {/* Destinatario / Institución */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              Destinatario / Institución (Ej: PRESENCIA MEDICA – Servicio de Emergencias) *
            </label>
            <input
              type="text"
              tabIndex={3}
              placeholder=""
              {...register('destinatarioInstitucion')}
              className={`w-full px-3.5 py-2 text-sm border rounded-xl outline-none focus:ring-2 transition ${
                errors.destinatarioInstitucion
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                  : 'border-slate-300 focus:ring-verax-blue/20 focus:border-verax-blue'
              }`}
            />
            {errors.destinatarioInstitucion && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">
                {errors.destinatarioInstitucion.message}
              </p>
            )}
          </div>

          {/* Número de Siniestro */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Número de Siniestro *
            </label>
            <input
              type="text"
              tabIndex={4}
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
        </div>
      </div>

      {/* 3. PUNTOS SOLICITADOS / DETALLE DEL REQUERIMIENTO */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <ListOrdered className="w-4 h-4 text-verax-red" />
          {isMedico ? '3. Datos del Paciente y Profesional (Formato de 4 Puntos)' : '3. Puntos Solicitados'}
        </h2>

        {isMedico ? (
          /* FORMULARIO ESTRUCTURADO DE INFORME MÉDICO */
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-verax-blue uppercase tracking-wider">
                A) Datos del Paciente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Fecha de Atención
                  </label>
                  <input
                    type="date"
                    tabIndex={5}
                    {...register('fechaAtencionPaciente')}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-verax-blue/20 focus:border-verax-blue transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Nombre Completo Paciente
                  </label>
                  <input
                    type="text"
                    tabIndex={6}
                    placeholder=""
                    {...register('nombrePaciente')}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-verax-blue/20 focus:border-verax-blue uppercase transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    DNI Paciente
                  </label>
                  <input
                    type="text"
                    tabIndex={7}
                    placeholder=""
                    {...register('dniPaciente')}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-verax-blue/20 focus:border-verax-blue transition"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-verax-blue uppercase tracking-wider">
                B) Datos del Profesional Médico
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    Nombre del Profesional (Dr/a.)
                  </label>
                  <input
                    type="text"
                    tabIndex={8}
                    placeholder=""
                    {...register('nombreProfesional')}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-verax-blue/20 focus:border-verax-blue uppercase transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    Matrícula Provincial (M.P.)
                  </label>
                  <input
                    type="text"
                    tabIndex={9}
                    placeholder=""
                    {...register('matriculaProvincial')}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-verax-blue/20 focus:border-verax-blue transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    Matrícula Nacional (M.N.)
                  </label>
                  <input
                    type="text"
                    tabIndex={10}
                    placeholder=""
                    {...register('matriculaNacional')}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-verax-blue/20 focus:border-verax-blue transition"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* PUNTOS LIBRES PARA COLABORACIÓN GENERAL */
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Indique los puntos a requerir (Ej: 1- Si en fecha XX asistieron al Sr. YY... 2- Nómina de lesionados...) *
            </label>
            <textarea
              rows={8}
              tabIndex={5}
              placeholder=""
              {...register('puntosSolicitud')}
              className={`w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none focus:ring-2 transition leading-relaxed ${
                errors.puntosSolicitud
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                  : 'border-slate-300 focus:ring-verax-blue/20 focus:border-verax-blue'
              }`}
            />
            {errors.puntosSolicitud && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">
                {errors.puntosSolicitud.message}
              </p>
            )}
          </div>
        )}
      </div>
    </form>
  );
};
