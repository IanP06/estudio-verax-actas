export type TipoSolicitudInforme = 'COLABORACION_GENERAL' | 'INFORME_MEDICO';

export interface SolicitudInformeData {
  companyId: 'ANTARTIDA' | 'ATM' | 'PROVINCIA' | 'SANCOR';
  tipoModelo: TipoSolicitudInforme;
  destinatarioInstitucion: string;
  numeroSiniestro: string;
  puntosSolicitud?: string;

  // Campos estructurados para Informe Médico
  fechaAtencionPaciente?: string;
  nombrePaciente?: string;
  dniPaciente?: string;
  nombreProfesional?: string;
  matriculaProvincial?: string;
  matriculaNacional?: string;
}

export const MODELOS_SOLICITUD: { id: TipoSolicitudInforme; title: string; description: string }[] = [
  { 
    id: 'COLABORACION_GENERAL', 
    title: 'Solicitud de Colaboración General',
    description: 'Requerimiento pericial a instituciones públicas, privadas o comisarías' 
  },
  { 
    id: 'INFORME_MEDICO', 
    title: 'Solicitud de Informe Médico / Nosocomio',
    description: 'Requerimiento con reserva legal de Ley de Derechos del Paciente (No requiere historia clínica)' 
  },
];

export const COMPANY_LEGAL_NAMES: Record<SolicitudInformeData['companyId'], string> = {
  ANTARTIDA: 'ANTARTIDA COMPAÑIA ARGENTINA DE SEGUROS S.A.',
  ATM: 'ATM COMPAÑÍA DE SEGUROS S.A.',
  PROVINCIA: 'PROVINCIA SEGUROS S.A.',
  SANCOR: 'SANCOR COOP. SEGUROS LTDA.',
};

/**
 * Genera la plantilla de los 4 puntos de Informe Médico con tokens parametrizados
 */
export function buildPuntosInformeMedicoTemplate(): string {
  return `1- Si el día {{FECHA_ATENCION}}, {{NOMBRE_PACIENTE}}, {{DNI_PACIENTE}}, recibió algún tipo de atención en ese nosocomio, en cuyo caso se solicita horario de atención y servicio por el que fuera asistido.

2- Si las copias digitales de las constancias de atención de fecha {{FECHA_ATENCION}} extendido a nombre de los mencionados y que se adjunta al presente resultan fidedignas y se corresponden con los registros de ese nosocomio.

3- Si el profesional que rubrica, Dr/a. {{NOMBRE_PROFESIONAL}}, M.P. {{MATRICULA_PROVINCIAL}} y M.N. {{MATRICULA_NACIONAL}}, pertenece al staff médico.

4- Si la firma y sello del profesional se corresponden al mismo.`;
}

export function buildSolicitudInformeTemplateParts(data: SolicitudInformeData): {
  encabezado: string;
  cuerpoSuperiorTemplate: string;
  puntosTemplate: string;
  cierreLegal: string;
} {
  // 1. Encabezado superior según modelo
  let encabezado = '';
  if (data.tipoModelo === 'INFORME_MEDICO') {
    encabezado = `SE PRESENTA – MANIFIESTA – SOLICITA SE INFORME\n\n`;
  }
  encabezado += `A: ${data.destinatarioInstitucion || '[DESTINATARIO / INSTITUCIÓN]'}`;

  // 2. Cuerpo inicial común verbatim con tokens
  const cuerpoSuperiorTemplate = `Cesar H. PERICH, por designación de {{NOMBRE_ASEGURADORA}} en los términos del Art. 46 de la Ley de Seguros 17418 y Resolución 39327/2015 de la Superintendencia de Seguros de la Nación, Cel. 221-6160777, ante Ud. respetuosamente me presento y solicito su colaboración:\n\nQue conforme a lo establecido por la Resolución 38.477/2014 de la Superintendencia De Seguros De La Nación (Normas Sobre Políticas, Procedimientos y Controles Internos Para Combatir el Fraude), vengo por el presente y en el marco del relevamiento del Siniestro Nº {{NUMERO_SINIESTRO}} de dicha Aseguradora, a solicitarle quiera tener a bien disponer por donde corresponda se haga saber lo siguiente:`;

  // 3. Puntos de la solicitud
  const puntosTemplate = data.tipoModelo === 'INFORME_MEDICO' 
    ? buildPuntosInformeMedicoTemplate() 
    : (data.puntosSolicitud || '[PUNTOS SOLICITADOS]');

  // 4. Cierre legal verbatim según modelo
  let cierreLegal = '';
  if (data.tipoModelo === 'COLABORACION_GENERAL') {
    cierreLegal = `Se deja constancia la presente se efectúa en los términos del Art. 46 cuarto párrafo de la Ley 17418: “El asegurador puede examinar las actuaciones administrativas o judiciales motivadas o relacionadas con la investigación del siniestro....”\n\nSin otro particular, lo saludo muy atte.`;
  } else {
    cierreLegal = `Se deja constancia la presente se efectúa en los términos del Art. 46 cuarto párrafo de la Ley 17418, solicitándose únicamente se informe si los causantes fueron asistidos en ese nosocomio y no se solicita historia clínica, en cumplimiento de lo dispuesto por la Ley de Derechos del Paciente en su Relación con los Profesionales e Instituciones de la Salud.\n\nArt. 46, 4° Párrafo Ley 17418: “El asegurador puede examinar las actuaciones administrativas o judiciales motivadas o relacionadas con la investigación del siniestro....”\n\nSin otro particular, lo saludo muy atte.`;
  }

  return {
    encabezado,
    cuerpoSuperiorTemplate,
    puntosTemplate,
    cierreLegal,
  };
}
