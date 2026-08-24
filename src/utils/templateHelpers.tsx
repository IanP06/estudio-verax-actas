import React from 'react';
import { Text } from '@react-pdf/renderer';
import type { ActaFormData } from '../types/acta';

/**
 * Formatea un número de DNI agregando puntos separadores de miles (ej: 40123456 -> 40.123.456)
 */
export function formatDniWithDots(dniStr?: string): string {
  if (!dniStr) return '';
  const cleanDigits = dniStr.replace(/\D/g, '');
  if (!cleanDigits) return dniStr;
  return cleanDigits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Normaliza las fechas del formato YYYY-MM-DD a DD/MM/YYYY para documentos legales argentinos
 */
export function formatDateToArgentine(dateStr?: string): string {
  if (!dateStr) return '';
  if (dateStr.includes('/')) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

/**
 * Reemplaza de forma dinámica los placeholders {{VARIABLE}} en las plantillas legalmente tipificadas
 */
export function interpolateTemplate(rawTemplate: string, data: ActaFormData): string {
  if (!rawTemplate) return '';

  let fullTemplate = rawTemplate;
  if (data.textoAdicional && data.textoAdicional.trim()) {
    const extra = data.textoAdicional.trim();
    if (fullTemplate.includes('Se suscribe bajo')) {
      fullTemplate = fullTemplate.replace(/(\n\n)?(Se suscribe bajo)/, `\n\n${extra}\n\n$2`);
    } else {
      fullTemplate = `${fullTemplate}\n\n${extra}`;
    }
  }

  const fechaFormatted = formatDateToArgentine(data.fecha || data.fechaEmision);
  const fechaOcurrenciaFormatted = formatDateToArgentine(data.fechaOcurrencia || data.fechaDenuncia);
  const dniFormatted = formatDniWithDots(data.dni);

  const datosVehiculo = data.vehiculoAsegurado 
    ? data.vehiculoAsegurado 
    : (data.vehiculoMarca || data.vehiculoModelo || data.vehiculoDominio)
      ? `marca ${data.vehiculoMarca || '—'}, modelo ${data.vehiculoModelo || '—'}, dominio ${data.vehiculoDominio ? data.vehiculoDominio.toUpperCase() : '—'}`
      : '[DATOS DEL VEHÍCULO ASEGURADO]';

  return fullTemplate
    .replace(/{{FECHA}}/g, fechaFormatted || '[FECHA]')
    .replace(/{{NUMERO_SINIESTRO}}/g, data.numeroSiniestro || '[N° SINIESTRO]')
    .replace(/{{NUMERO_POLIZA}}/g, data.numeroPoliza || '[N° PÓLIZA]')
    .replace(/{{REF}}/g, data.ref || '[REF]')
    .replace(/{{NOMBRE_COMPLETO}}/g, data.nombreCompleto ? data.nombreCompleto.toUpperCase() : '[NOMBRE COMPLETO]')
    .replace(/{{FECHA_OCURRENCIA}}/g, fechaOcurrenciaFormatted || '[FECHA OCURRENCIA]')
    .replace(/{{FECHA_DENUNCIA}}/g, fechaOcurrenciaFormatted || '[FECHA OCURRENCIA]')
    .replace(/{{DATOS_VEHICULO_ASEGURADO}}/g, datosVehiculo)
    .replace(/{{VEHICULO_MARCA}}/g, data.vehiculoMarca || '[MARCA]')
    .replace(/{{VEHICULO_MODELO}}/g, data.vehiculoModelo || '[MODELO]')
    .replace(/{{VEHICULO_DOMINIO}}/g, data.vehiculoDominio ? data.vehiculoDominio.toUpperCase() : '[DOMINIO]')
    .replace(/{{CAUSANTE_DANO}}/g, data.causanteDano ? data.causanteDano.toUpperCase() : '[CAUSANTE DEL DAÑO]')
    .replace(/{{EMAIL}}/g, data.email || '[EMAIL]')
    .replace(/{{DNI}}/g, dniFormatted || '[DNI]');
}

/**
 * Genera fragmentos React-PDF para que todos los campos completos (variables) se muestren en NEGRITA (Helvetica-Bold).
 * Devuelve strings planos para texto sin formato para EVITAR anidamiento excesivo de nodos <Text> en @react-pdf/renderer.
 */
export function renderBoldBodyText(rawTemplate: string, data: ActaFormData): React.ReactNode[] {
  if (!rawTemplate) return [];

  let fullTemplate = rawTemplate;
  if (data.textoAdicional && data.textoAdicional.trim()) {
    const extra = data.textoAdicional.trim();
    if (fullTemplate.includes('Se suscribe bajo')) {
      fullTemplate = fullTemplate.replace(/(\n\n)?(Se suscribe bajo)/, `\n\n${extra}\n\n$2`);
    } else {
      fullTemplate = `${fullTemplate}\n\n${extra}`;
    }
  }

  const fechaFormatted = formatDateToArgentine(data.fecha || data.fechaEmision);
  const fechaOcurrenciaFormatted = formatDateToArgentine(data.fechaOcurrencia || data.fechaDenuncia);
  const dniFormatted = formatDniWithDots(data.dni);

  const datosVehiculo = data.vehiculoAsegurado 
    ? data.vehiculoAsegurado 
    : (data.vehiculoMarca || data.vehiculoModelo || data.vehiculoDominio)
      ? `marca ${data.vehiculoMarca || '—'}, modelo ${data.vehiculoModelo || '—'}, dominio ${data.vehiculoDominio ? data.vehiculoDominio.toUpperCase() : '—'}`
      : '[DATOS DEL VEHÍCULO ASEGURADO]';

  const getVarValue = (varName: string): string => {
    switch (varName) {
      case 'FECHA':
        return fechaFormatted || '[FECHA]';
      case 'NUMERO_SINIESTRO':
        return data.numeroSiniestro || '[N° SINIESTRO]';
      case 'NUMERO_POLIZA':
        return data.numeroPoliza || '[N° PÓLIZA]';
      case 'REF':
        return data.ref || '[REF]';
      case 'NOMBRE_COMPLETO':
        return data.nombreCompleto ? data.nombreCompleto.toUpperCase() : '[NOMBRE COMPLETO]';
      case 'FECHA_OCURRENCIA':
      case 'FECHA_DENUNCIA':
        return fechaOcurrenciaFormatted || '[FECHA OCURRENCIA]';
      case 'DATOS_VEHICULO_ASEGURADO':
        return datosVehiculo;
      case 'VEHICULO_MARCA':
        return data.vehiculoMarca || '[MARCA]';
      case 'VEHICULO_MODELO':
        return data.vehiculoModelo || '[MODELO]';
      case 'VEHICULO_DOMINIO':
        return data.vehiculoDominio ? data.vehiculoDominio.toUpperCase() : '[DOMINIO]';
      case 'CAUSANTE_DANO':
        return data.causanteDano ? data.causanteDano.toUpperCase() : '[CAUSANTE DEL DAÑO]';
      case 'EMAIL':
        return data.email || '[EMAIL]';
      case 'DNI':
        return dniFormatted || '[DNI]';
      default:
        return `[${varName}]`;
    }
  };

  const parts = fullTemplate.split(/({{[A-Z_]+}})/g);

  return parts.map((part, index) => {
    const match = part.match(/^{{([A-Z_]+)}}$/);
    if (match) {
      const varName = match[1];
      const val = getVarValue(varName);
      return (
        <Text key={index} style={{ fontFamily: 'Helvetica-Bold' }}>
          {val}
        </Text>
      );
    }
    return part; // Devuelve la cadena directamente sin envolver en <Text>
  });
}

/**
 * Devuelve datos iniciales de prueba vacíos o limpios
 */
export function getSampleFormData(): ActaFormData {
  const today = new Date().toISOString().split('T')[0];

  return {
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
  };
}
