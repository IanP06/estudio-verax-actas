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
  MapPin,
  Globe,
  RotateCcw,
  Tag,
  Gavel,
  MessageSquareText
} from 'lucide-react';
import { COMPANIES } from '../../config/templates';
import type { Company } from '../../config/templates';
import { CONDICIONES_FIRMANTE } from '../../config/templateDeclaracion';
import { declaracionFormSchema } from '../../types/acta';
import type { DeclaracionFormData } from '../../types/acta';

interface DeclaracionFormProps {
  initialValues: DeclaracionFormData;
  onFormChange: (data: DeclaracionFormData) => void;
  selectedCompany: Company;
  onCompanySelect: (companyId: Company['id']) => void;
}

export const DeclaracionForm: React.FC<DeclaracionFormProps> = ({
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
  } = useForm<DeclaracionFormData>({
    resolver: zodResolver(declaracionFormSchema),
    defaultValues: {
      ...initialValues,
      nacionalidad: initialValues.nacionalidad || '',
    },
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
      condicionFirmante: CONDICIONES_FIRMANTE[0],
      registroInterno: '',
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
  };

  const isSancor = formValues.companyId === 'SANCOR';

  return (
    <form className="space-y-6">
      {/* 1. COMPAÑÍA ASEGURADORA */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-verax-red" />
            1. Aseguradora
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

        {/* Condición del Firmante */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Condición del Firmante *
          </label>
          <select
            tabIndex={2}
            {...register('condicionFirmante')}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-verax-blue/20 focus:border-verax-blue outline-none transition font-medium text-slate-800"
          >
            {CONDICIONES_FIRMANTE.map(cond => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. DATOS DEL EXPEDIENTE */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldAlert className="w-4 h-4 text-verax-red" />
          2. Datos del Expediente
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* N° de Registro Interno */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              N° de Registro Interno
            </label>
            <input
              type="text"
              tabIndex={3}
              placeholder=""
              {...register('registroInterno')}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-verax-blue/20 focus:border-verax-blue transition"
            />
          </div>

          {/* N° Siniestro */}
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

          {/* N° Póliza */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Número de Póliza *
            </label>
            <input
              type="text"
              tabIndex={5}
              placeholder=""
              {...register('numeroPoliza')}
              className={`w-full px-3.5 py-2 text-sm border rounded-xl outline-none focus:ring-2 transition ${
                errors.numeroPoliza
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                  : 'border-slate-300 focus:ring-verax-blue/20 focus:border-verax-blue'
              }`}
            />
            {errors.numeroPoliza && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">
                {errors.numeroPoliza.message}
              </p>
            )}
          </div>

          {/* Referencia y Juicio (Campos Condicionales exclusivos de SANCOR) */}
          {isSancor && (
            <>
              <div className="md:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-verax-blue mb-1 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-verax-red" />
                    Número de Referencia (Exclusivo SANCOR)
                  </label>
                  <input
                    type="text"
                    tabIndex={6}
                    placeholder=""
                    {...register('numeroReferencia')}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-verax-blue/20 focus:border-verax-blue transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-verax-blue mb-1 flex items-center gap-1">
                    <Gavel className="w-3.5 h-3.5 text-verax-red" />
                    Número de Juicio (Exclusivo SANCOR - Afectación Judicial)
                  </label>
                  <input
                    type="text"
                    tabIndex={7}
                    placeholder=""
                    {...register('numeroJuicio')}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-verax-blue/20 focus:border-verax-blue transition"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3. DATOS DEL DECLARANTE */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <User className="w-4 h-4 text-verax-red" />
          3. Datos del Declarante
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Nombre Completo */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Nombre Completo *
            </label>
            <input
              type="text"
              tabIndex={8}
              placeholder=""
              {...register('nombreCompleto')}
              className={`w-full px-3.5 py-2 text-sm border rounded-xl outline-none focus:ring-2 uppercase transition ${
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

          {/* Nacionalidad (Inicialmente vacía) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              Nacionalidad *
            </label>
            <input
              type="text"
              tabIndex={9}
              placeholder=""
              {...register('nacionalidad')}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-verax-blue/20 focus:border-verax-blue uppercase transition"
            />
          </div>

          {/* DNI */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              DNI N° *
            </label>
            <input
              type="text"
              tabIndex={10}
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

          {/* Email (Etiqueta exact: "Correo Electrónico *") */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Correo Electrónico *
            </label>
            <input
              type="email"
              tabIndex={11}
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

          {/* Domicilio (3 campos en línea) */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Calle y N° *
              </label>
              <input
                type="text"
                tabIndex={12}
                placeholder=""
                {...register('domicilioCalle')}
                className={`w-full px-3.5 py-2 text-sm border rounded-xl outline-none focus:ring-2 transition ${
                  errors.domicilioCalle
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                    : 'border-slate-300 focus:ring-verax-blue/20 focus:border-verax-blue'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Localidad *
              </label>
              <input
                type="text"
                tabIndex={13}
                placeholder=""
                {...register('domicilioLocalidad')}
                className={`w-full px-3.5 py-2 text-sm border rounded-xl outline-none focus:ring-2 transition ${
                  errors.domicilioLocalidad
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                    : 'border-slate-300 focus:ring-verax-blue/20 focus:border-verax-blue'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Provincia *
              </label>
              <input
                type="text"
                tabIndex={14}
                placeholder=""
                {...register('domicilioProvincia')}
                className={`w-full px-3.5 py-2 text-sm border rounded-xl outline-none focus:ring-2 transition ${
                  errors.domicilioProvincia
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                    : 'border-slate-300 focus:ring-verax-blue/20 focus:border-verax-blue'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. CUERPO DEL TESTIMONIO */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <MessageSquareText className="w-4 h-4 text-verax-red" />
          4. Cuerpo de la Declaración / Testimonio
        </h2>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Declaración detallada sobre las circunstancias de tiempo, modo y lugar del hecho (Sin límite de palabras) *
          </label>
          <textarea
            rows={10}
            tabIndex={15}
            placeholder=""
            {...register('textoDeclaracion')}
            className={`w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none focus:ring-2 transition leading-relaxed ${
              errors.textoDeclaracion
                ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                : 'border-slate-300 focus:ring-verax-blue/20 focus:border-verax-blue'
            }`}
          />
          {errors.textoDeclaracion && (
            <p className="text-[11px] text-rose-600 mt-1 font-medium">
              {errors.textoDeclaracion.message}
            </p>
          )}
        </div>
      </div>
    </form>
  );
};
