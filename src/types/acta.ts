import { z } from 'zod';
import type { Company, DocumentTemplate } from '../config/templates';

export interface ImageAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string; // Base64 image representation for react-pdf
  previewUrl: string;
}

export const actaFormSchema = z.object({
  // Selección
  companyId: z.enum(['ANTARTIDA', 'ATM', 'PROVINCIA', 'SANCOR']),
  templateId: z.string().min(1, 'Seleccione un tipo de acta'),

  // Campos generales
  fecha: z.string().min(1, 'Seleccione la fecha'),
  numeroSiniestro: z.string().min(1, 'El número de siniestro es obligatorio'),
  numeroPoliza: z.string().optional(),
  ref: z.string().optional(),
  
  // Firmante
  nombreCompleto: z.string().min(3, 'El nombre completo debe tener al menos 3 caracteres'),
  dni: z.string().min(6, 'Ingrese un DNI válido'),
  email: z.string().email('Ingrese un e-mail válido'),

  // Detalle adicional
  fechaOcurrencia: z.string().optional(),
  fechaDenuncia: z.string().optional(),

  // Vehículo Asegurado (Unificado)
  vehiculoAsegurado: z.string().optional(),
  vehiculoMarca: z.string().optional(),
  vehiculoModelo: z.string().optional(),
  vehiculoDominio: z.string().optional(),

  // Causante del Daño (Campo condicional)
  causanteDano: z.string().optional(),

  // Texto / Párrafo Adicional Libre
  textoAdicional: z.string().optional(),

  // Meta
  lugarEmision: z.string().min(1),
  fechaEmision: z.string().min(1),
});

export type ActaFormData = z.infer<typeof actaFormSchema>;

export const declaracionFormSchema = z.object({
  companyId: z.enum(['ANTARTIDA', 'ATM', 'PROVINCIA', 'SANCOR']),
  condicionFirmante: z.string().min(1, 'Seleccione la condición del firmante'),
  numeroSiniestro: z.string().min(1, 'El número de siniestro es obligatorio'),
  numeroPoliza: z.string().min(1, 'El número de póliza es obligatorio'),
  numeroReferencia: z.string().optional(),
  numeroJuicio: z.string().optional(),
  nombreCompleto: z.string().min(3, 'Ingrese el nombre completo'),
  nacionalidad: z.string().optional(),
  dni: z.string().min(6, 'Ingrese un DNI válido'),
  domicilioCalle: z.string().min(2, 'Ingrese la calle y número'),
  domicilioLocalidad: z.string().min(2, 'Ingrese la localidad'),
  domicilioProvincia: z.string().min(2, 'Ingrese la provincia'),
  textoDeclaracion: z.string().min(10, 'Ingrese el cuerpo del testimonio/declaración'),
  email: z.string().email('Ingrese un e-mail válido para Adobe Sign'),
});

export type DeclaracionFormData = z.infer<typeof declaracionFormSchema>;

export const solicitudInformeFormSchema = z.object({
  companyId: z.enum(['ANTARTIDA', 'ATM', 'PROVINCIA', 'SANCOR']),
  tipoModelo: z.enum(['COLABORACION_GENERAL', 'INFORME_MEDICO']),
  destinatarioInstitucion: z.string().min(2, 'Ingrese el destinatario o la institución'),
  numeroSiniestro: z.string().min(1, 'El número de siniestro es obligatorio'),
  puntosSolicitud: z.string().optional(),

  // Campos estructurados de Informe Médico
  fechaAtencionPaciente: z.string().optional(),
  nombrePaciente: z.string().optional(),
  dniPaciente: z.string().optional(),
  nombreProfesional: z.string().optional(),
  matriculaProvincial: z.string().optional(),
  matriculaNacional: z.string().optional(),
});

export type SolicitudInformeFormData = z.infer<typeof solicitudInformeFormSchema>;

export const retiroDenunciaFormSchema = z.object({
  companyId: z.enum(['ANTARTIDA', 'ATM', 'PROVINCIA', 'SANCOR']),
  numeroSiniestro: z.string().min(1, 'El número de siniestro es obligatorio'),
  numeroPoliza: z.string().min(1, 'El número de póliza es obligatorio'),
  fechaOcurrencia: z.string().min(1, 'Seleccione la fecha de ocurrencia'),
  nombreCompleto: z.string().min(3, 'Ingrese el nombre completo'),
  dni: z.string().min(6, 'Ingrese un DNI válido'),
  domicilioCalle: z.string().min(2, 'Ingrese la calle y número'),
  domicilioLocalidad: z.string().min(2, 'Ingrese la localidad'),
  domicilioProvincia: z.string().min(2, 'Ingrese la provincia'),
  email: z.string().email('Ingrese un e-mail válido'),
  vehiculoMarca: z.string().min(1, 'Ingrese la marca del vehículo'),
  vehiculoModelo: z.string().min(1, 'Ingrese el modelo del vehículo'),
  vehiculoDominio: z.string().min(1, 'Ingrese el dominio del vehículo'),
});

export type RetiroDenunciaFormData = z.infer<typeof retiroDenunciaFormSchema>;

export interface ActaAppState {
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
