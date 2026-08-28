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
  Calendar,
  Car,
  RotateCcw
} from 'lucide-react';
import { COMPANIES } from '../../config/templates';
import type { Company } from '../../config/templates';
import { retiroDenunciaFormSchema } from '../../types/acta';
import type { RetiroDenunciaFormData } from '../../types/acta';

interface RetiroDenunciaFormProps {
  initialValues: RetiroDenunciaFormData;
  onFormChange: (data: RetiroDenunciaFormData) => void;
  selectedCompany: Company;
  onCompanySelect: (companyId: Company['id']) => void;
}

export const RetiroDenunciaForm: React.FC<RetiroDenunciaFormProps> = ({
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
  } = useForm<RetiroDenunciaFormData>({
    resolver: zodResolver(retiroDenunciaFormSchema),
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
  };

  return (
    <form className="space-y-6">
      {/* 1. SELECCIÓN DE COMPAÑÍA ASEGURADORA */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-verax-red" />
            1. Compañía Aseguradora
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
      </div>

      {/* 2. DATOS DEL SINIESTRO Y PÓLIZA */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldAlert className="w-4 h-4 text-verax-red" />
          2. Datos del Siniestro y Póliza
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* N° Siniestro */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Número de Siniestro *
            </label>
            <input
              type="text"
              tabIndex={2}
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
              tabIndex={3}
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

          {/* Fecha de Ocurrencia */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Fecha de Ocurrencia *
            </label>
            <input
              type="date"
              tabIndex={4}
              {...register('fechaOcurrencia')}
              className={`w-full px-3.5 py-2 text-sm border rounded-xl outline-none focus:ring-2 transition ${
                errors.fechaOcurrencia
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                  : 'border-slate-300 focus:ring-verax-blue/20 focus:border-verax-blue'
              }`}
            />
            {errors.fechaOcurrencia && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">
                {errors.fechaOcurrencia.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. DATOS DEL TITULAR / ASEGURADO */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <User className="w-4 h-4 text-verax-red" />
          3. Datos del Titular / Asegurado
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
              tabIndex={5}
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

          {/* DNI */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              DNI N° *
            </label>
            <input
              type="text"
              tabIndex={6}
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

          {/* Email */}
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Correo Electrónico *
            </label>
            <input
              type="email"
              tabIndex={7}
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

          {/* Domicilio (3 inputs en línea) */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Calle y N° *
              </label>
              <input
                type="text"
                tabIndex={8}
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
                tabIndex={9}
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
                tabIndex={10}
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

      {/* 4. DATOS DEL VEHÍCULO ASEGURADO (3 inputs en línea) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <Car className="w-4 h-4 text-verax-red" />
          4. Datos del Vehículo Asegurado
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Marca *
            </label>
            <input
              type="text"
              tabIndex={11}
              placeholder=""
              {...register('vehiculoMarca')}
              className={`w-full px-3.5 py-2 text-sm border rounded-xl outline-none focus:ring-2 transition ${
                errors.vehiculoMarca
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                  : 'border-slate-300 focus:ring-verax-blue/20 focus:border-verax-blue'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Modelo *
            </label>
            <input
              type="text"
              tabIndex={12}
              placeholder=""
              {...register('vehiculoModelo')}
              className={`w-full px-3.5 py-2 text-sm border rounded-xl outline-none focus:ring-2 transition ${
                errors.vehiculoModelo
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                  : 'border-slate-300 focus:ring-verax-blue/20 focus:border-verax-blue'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Dominio / Patente *
            </label>
            <input
              type="text"
              tabIndex={13}
              placeholder=""
              {...register('vehiculoDominio')}
              className={`w-full px-3.5 py-2 text-sm border rounded-xl outline-none focus:ring-2 uppercase transition ${
                errors.vehiculoDominio
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                  : 'border-slate-300 focus:ring-verax-blue/20 focus:border-verax-blue'
              }`}
            />
          </div>
        </div>
      </div>
    </form>
  );
};
