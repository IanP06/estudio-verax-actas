export interface RetiroDenunciaData {
  companyId: 'ANTARTIDA' | 'ATM' | 'PROVINCIA' | 'SANCOR';
  numeroSiniestro: string;
  numeroPoliza: string;
  fechaOcurrencia: string;
  nombreCompleto: string;
  dni: string;
  domicilioCalle: string;
  domicilioLocalidad: string;
  domicilioProvincia: string;
  email: string;
  vehiculoMarca: string;
  vehiculoModelo: string;
  vehiculoDominio: string;
}

export const COMPANY_LEGAL_NAMES: Record<RetiroDenunciaData['companyId'], string> = {
  ANTARTIDA: 'ANTARTIDA COMPAÑIA ARGENTINA DE SEGUROS S.A.',
  ATM: 'ATM COMPAÑÍA DE SEGUROS',
  PROVINCIA: 'PROVINCIA SEGUROS S.A.',
  SANCOR: 'SANCOR COOP. SEGUROS LTDA.',
};

export const COMPANY_HEADER_NAMES: Record<RetiroDenunciaData['companyId'], string> = {
  ANTARTIDA: 'ANTARTIDA COMPAÑIA ARGENTINA DE SEGUROS S.A.',
  ATM: 'ATM – COMPAÑIA DE SEGUROS.',
  PROVINCIA: 'PROVINCIA SEGUROS S.A.',
  SANCOR: 'SANCOR COOPERATIVA DE SEGUROS LTDA.',
};

export function buildRetiroDenunciaContent(data: RetiroDenunciaData) {
  const companyHeader = COMPANY_HEADER_NAMES[data.companyId] || COMPANY_HEADER_NAMES.ANTARTIDA;
  const companyLegal = COMPANY_LEGAL_NAMES[data.companyId] || COMPANY_LEGAL_NAMES.ANTARTIDA;

  const encabezado = `RETIRO DE DENUNCIA\nSr. Gerente\n${companyHeader}`;
  const referencia = `Ref.: Stro. N° ${data.numeroSiniestro || '[N° SINIESTRO]'}`;

  const cuerpoTemplate = `Quien suscribe Sr./Sra. {{NOMBRE_COMPLETO}} DNI {{DNI}} con domicilio en calle {{DOMICILIO_CALLE}} de la ciudad de {{DOMICILIO_LOCALIDAD}} provincia de {{DOMICILIO_PROVINCIA}} Me dirijo a Ud. en mi carácter de asegurado, titular de la Póliza de Seguro Nº {{NUMERO_POLIZA}} la cual ampara el vehículo marca {{VEHICULO_MARCA}} modelo {{VEHICULO_MODELO}} dominio {{VEHICULO_DOMINIO}} de mi propiedad, en virtud de la denuncia realizada oportunamente en relación al hecho denunciado como ocurrido en fecha {{FECHA_OCURRENCIA}} dando origen al siniestro Nº {{NUMERO_SINIESTRO}} Dicho esto, quiero comunicarle formalmente mi decisión de DEJAR SIN EFECTO la denuncia realizada ante vuestra compañía y consecuentemente DESISTO Y RENUNCIO EXPRESAMENTE al derecho que por este pudiera corresponderme, de conformidad con lo dispuesto por el artículo 259 del Código Civil y Comercial de la Nación Argentina, por haber advertido un error material al formalizar la misma, que implicó discordancias entre lo denunciado y lo realmente ocurrido, Por lo que eximo a la Compañía de cualquier obligación indemnizatoria y renunciando a su vez a toda acción y derecho reclamatorio pasado, presente o futuro en relación al siniestro referido. El mencionado desistimiento es comprensivo de cualquier daño que pudiera corresponderle en virtud del incidente antes aludido; y no tendrá nada que reclamar en concepto de daños materiales y/o físicos y/o psíquicos, daño moral y/o cualquier otro rubro que le pudiera corresponder sea presente y/o futuro. El asegurado/conductor desvincula a ${companyLegal} de cualquier responsabilidad y/o pretensión resarcitoria propia y/o de terceros. Finalmente, en lo que respecta los eventuales honorarios del mediador interviniente, los mismos quedarán exclusivamente a cargo de la parte requirente. Se suscribe bajo firma digital con la plataforma ADOBE ACROBAT SIGN a la casilla de C.E. {{EMAIL}} en forma VOLUNTARIA (Art. 260 del CCCN), liberando de toda responsabilidad a ${companyLegal} por los hechos denunciados, no teniendo persona alguna derecho a reclamar por ningún concepto.`;

  return {
    encabezado,
    referencia,
    cuerpoTemplate,
  };
}
