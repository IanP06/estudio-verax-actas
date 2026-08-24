export interface DeclaracionData {
  companyId: 'ANTARTIDA' | 'ATM' | 'PROVINCIA' | 'SANCOR';
  condicionFirmante: string;
  numeroSiniestro: string;
  numeroPoliza: string;
  numeroReferencia?: string;
  numeroJuicio?: string;
  nombreCompleto: string;
  nacionalidad: string;
  dni: string;
  domicilioCalle: string;
  domicilioLocalidad: string;
  domicilioProvincia: string;
  textoDeclaracion: string;
  email: string;
  hasCroquis: boolean;
}

export const CONDICIONES_FIRMANTE = [
  'ASEGURADO',
  'TERCERO/RECLAMANTE',
  'CONDUCTOR DEL VEHICULO ASEGURADO',
  'CONDUCTOR DEL VEHICULO TERCERO',
  'PASAJERO TRANSPORTADO',
  'PASAJERO VEHICULO TERCERO',
  'TESTIGO',
] as const;

export const COMPANY_LEGAL_NAMES = {
  ANTARTIDA: 'ANTARTIDA COMPAÑIA ARGENTINA DE SEGUROS S.A.',
  ATM: 'ATM COMPAÑÍA DE SEGUROS S.A.',
  PROVINCIA: 'PROVINCIA SEGUROS S.A.',
  SANCOR: 'SANCOR COOP. SEGUROS LTDA',
};

/**
 * Retorna la plantilla con tokens {{TOKEN}} parametrizados para poder
 * formatear e intercalar nodos React-PDF en NEGRITA y MAYÚSCULAS.
 */
export function buildDeclaracionLegalTemplate(data: DeclaracionData): string {
  // Construcción condicional del bloque póliza / referencia / juicio
  let bloquePoliza = '';
  if (data.companyId === 'SANCOR' && data.numeroReferencia && data.numeroReferencia.trim() !== '') {
    bloquePoliza += `Referencia N°: {{NUMERO_REFERENCIA}} `;
  }
  bloquePoliza += `Póliza N°: {{NUMERO_POLIZA}}`;
  if (data.companyId === 'SANCOR' && data.numeroJuicio && data.numeroJuicio.trim() !== '') {
    bloquePoliza += `, afectada al Juicio N° {{NUMERO_JUICIO}}`;
  }

  // Cláusula condicional de croquis
  const lineaCroquis = data.hasCroquis
    ? 'A fin de ilustrar gráficamente lo descrito y el lugar de ocurrencia, ratifico la recreación aquí detallada. '
    : '';

  return `Personal del Estudio VERAX, procede a realizar conexión vía Google Meet, a efectos de entrevistar al {{CONDICION_FIRMANTE}}, a quien se le notifica que la empresa referida ha sido designada para relevar y analizar el siniestro Nº {{NUMERO_SINIESTRO}} de {{NOMBRE_ASEGURADORA}}, respecto a la póliza ${bloquePoliza}, en el marco de las facultades normadas en el Art. 46 párrafo 2do de la Ley 17418 que expresa “…El asegurado está obligado a suministrar al asegurador, a su pedido, la información necesaria para verificar el siniestro o la extensión de la prestación a su cargo y a permitirle las indagaciones necesarias a tal fin…” y en concordancia con lo determinado el Art. 48 del texto legal precitado. La persona entrevistada presta su conformidad para el acto a desarrollarse, habiendo sido anoticiado que la misma será grabada para resguardo de su declaración y que a preguntas relacionadas con su identidad, vehículo asegurado, y el hecho que se investiga, refiere y/o dirá cuanto sepa acerca de las circunstancias de tiempo, modo que los mismos ocurrieron, por lo que manifiesta: Llamarse: {{NOMBRE_COMPLETO}}, ser de nacionalidad {{NACIONALIDAD}}, DNI {{DNI}}, que se domicilia en la calle {{DOMICILIO_CALLE}} -  localidad {{DOMICILIO_LOCALIDAD}} provincia, {{DOMICILIO_PROVINCIA}}, Seguidamente se lo invita a que exprese las circunstancias y detalles del hecho investigado, en forma verbal y detallada EXPONE: {{TEXTO_DECLARACION}} ${lineaCroquis}ES TODO, LEIDO, SE RATIFICA DE TODO SU CONTENIDO Y EN CONFORMIDAD FIRMANDO AL PIE COMO CONSTANCIA. Se suscribe bajo firma digital con la plataforma ADOBE SIGN a la casilla de C.E. {{EMAIL}} en forma VOLUNTARIA (Art. 260 del CCCN)`;
}
