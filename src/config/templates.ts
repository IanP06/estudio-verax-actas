export interface Company {
  id: 'ANTARTIDA' | 'ATM' | 'PROVINCIA' | 'SANCOR';
  name: string;
  logoUrl: string;
  primaryColor: string;
}

export interface DocumentTemplate {
  id: string;
  companyId: Company['id'];
  title: string;
  type: 'TITULAR' | 'TERCERO' | 'TERCERO_NO_SEGURO' | 'USO_COMERCIAL';
  bodyTemplate: string;
  fields: string[];
}

export const COMPANIES: Company[] = [
  { id: 'ANTARTIDA', name: 'Antártida Compañía Argentina de Seguros S.A.', logoUrl: '/assets/logos/antartida.png', primaryColor: '#384969' },
  { id: 'ATM', name: 'ATM Compañía de Seguros S.A.', logoUrl: '/assets/logos/atm.png', primaryColor: '#B53B3A' },
  { id: 'PROVINCIA', name: 'Provincia Seguros S.A.', logoUrl: '/assets/logos/provincia.png', primaryColor: '#384969' },
  { id: 'SANCOR', name: 'Sancor Cooperativa de Seguros Ltda.', logoUrl: '/assets/logos/sancor.png', primaryColor: '#B53B3A' },
];

export const ACTA_TEMPLATES: DocumentTemplate[] = [
  // ==================== ANTÁRTIDA ====================
  {
    id: 'ANTARTIDA_TITULAR',
    companyId: 'ANTARTIDA',
    title: 'Desiste de la Acción y del Derecho - Asegurado/a',
    type: 'TITULAR',
    fields: ['FECHA', 'NUMERO_SINIESTRO', 'NUMERO_POLIZA', 'NOMBRE_COMPLETO', 'FECHA_OCURRENCIA', 'EMAIL', 'DNI'],
    bodyTemplate: `DESISTE DE LA ACCIÓN Y DEL DERECHO.
FECHA: {{FECHA}}
SINIESTRO: {{NUMERO_SINIESTRO}}
PÓLIZA: {{NUMERO_POLIZA}}
NOMBRE: {{NOMBRE_COMPLETO}}

En mi carácter de asegurado/a de ANTARTIDA COMPAÑIA ARGENTINA DE SEGUROS S.A., comunico a Ud. por medio de la presente, mi decisión irrevocable de desistir de cualquier acción y/o derecho contra esa empresa aseguradora, con motivo del hecho denunciado con fecha {{FECHA_OCURRENCIA}}, y que motivara la apertura del siniestro N° {{NUMERO_SINIESTRO}}-

Se suscribe bajo firma digital con la plataforma ADOBE ACROBAT SIGN a la casilla de C.E. {{EMAIL}} en forma VOLUNTARIA (Art. 260 del CCCN), liberando de toda responsabilidad a ANTARTIDA COMPAÑIA ARGENTINA DE SEGUROS S.A  por los hechos denunciados, no teniendo persona alguna derecho a reclamar por ningún concepto.`
  },
  {
    id: 'ANTARTIDA_TERCERO',
    companyId: 'ANTARTIDA',
    title: 'Desiste de la Acción y del Derecho - Tercero',
    type: 'TERCERO',
    fields: ['FECHA', 'NUMERO_SINIESTRO', 'NOMBRE_COMPLETO', 'DATOS_VEHICULO_ASEGURADO', 'EMAIL', 'DNI'],
    bodyTemplate: `DESISTE DE LA ACCIÓN Y DEL DERECHO.
FECHA: {{FECHA}}
SINIESTRO: {{NUMERO_SINIESTRO}}
NOMBRE: {{NOMBRE_COMPLETO}}

En mi carácter de tercero reclamante en el siniestro N° {{NUMERO_SINIESTRO}}, comunico a Ud. mi decisión irrevocable de desistir de cualquier acción y/o derecho contra ANTARTIDA COMPAÑIA ARGENTINA DE SEGUROS S.A., y/o contra vuestro asegurado, y/o conductor del vehículo {{DATOS_VEHICULO_ASEGURADO}}, con motivo del reclamo que oportunamente formalizara en el referido siniestro.

Se suscribe bajo firma digital con la plataforma ADOBE ACROBAT SIGN a la casilla de C.E. {{EMAIL}} en forma VOLUNTARIA (Art. 260 del CCCN), liberando de toda responsabilidad a ANTARTIDA COMPAÑIA ARGENTINA DE SEGUROS S.A  por los hechos denunciados, no teniendo persona alguna derecho a reclamar por ningún concepto.`
  },
  {
    id: 'ANTARTIDA_TERCERO_NO_SEGURO',
    companyId: 'ANTARTIDA',
    title: 'Desiste de la Acción y del Derecho - Tercero Sin Seguro',
    type: 'TERCERO_NO_SEGURO',
    fields: ['FECHA', 'NUMERO_SINIESTRO', 'NOMBRE_COMPLETO', 'DATOS_VEHICULO_ASEGURADO', 'CAUSANTE_DANO', 'EMAIL', 'DNI'],
    bodyTemplate: `DESISTE DE LA ACCIÓN Y DEL DERECHO.
FECHA: {{FECHA}}
SINIESTRO: {{NUMERO_SINIESTRO}}
NOMBRE: {{NOMBRE_COMPLETO}}

En mi carácter de tercero reclamante en el siniestro N° {{NUMERO_SINIESTRO}}, comunico a Ud. mi decisión irrevocable de desistir de cualquier acción y/o derecho contra ANTARTIDA COMPAÑIA ARGENTINA DE SEGUROS S.A., en relación con el siniestro ocurrido con el vehículo asegurado {{DATOS_VEHICULO_ASEGURADO}}, respecto del reclamo oportunamente formulado en dicho expediente. Y se reserva el derecho de accionar civil y penalmente contra el causante del daño, Sr. {{CAUSANTE_DANO}}, quien al momento del siniestro carecía de póliza vigente en vuestra compañía.

Se suscribe bajo firma digital con la plataforma ADOBE ACROBAT SIGN a la casilla de C.E. {{EMAIL}} en forma VOLUNTARIA (Art. 260 del CCCN), liberando de toda responsabilidad a ANTARTIDA COMPAÑIA ARGENTINA DE SEGUROS S.A  por los hechos denunciados, no teniendo persona alguna derecho a reclamar por ningún concepto.`
  },
  {
    id: 'ANTARTIDA_USO_COMERCIAL',
    companyId: 'ANTARTIDA',
    title: 'Desiste de la Acción y del Derecho - Uso Comercial',
    type: 'USO_COMERCIAL',
    fields: ['FECHA', 'NUMERO_SINIESTRO', 'NUMERO_POLIZA', 'NOMBRE_COMPLETO', 'FECHA_OCURRENCIA', 'EMAIL', 'DNI'],
    bodyTemplate: `DESISTE DE LA ACCIÓN Y DEL DERECHO.
FECHA: {{FECHA}}
SINIESTRO: {{NUMERO_SINIESTRO}}
PÓLIZA: {{NUMERO_POLIZA}}
NOMBRE: {{NOMBRE_COMPLETO}}

En mi carácter de asegurado/a de ANTARTIDA COMPAÑIA ARGENTINA DE SEGUROS S.A., comunico a Ud. por medio de la presente, mi decisión irrevocable de desistir de cualquier acción y/o derecho contra esa empresa aseguradora, con motivo del hecho denunciado con fecha {{FECHA_OCURRENCIA}}, y que motivara la apertura del siniestro N° {{NUMERO_SINIESTRO}},  ello por haber advertido un riesgo no amparado en la póliza contratada-

Se suscribe bajo firma digital con la plataforma ADOBE ACROBAT SIGN a la casilla de C.E. {{EMAIL}} en forma VOLUNTARIA (Art. 260 del CCCN), liberando de toda responsabilidad a ANTARTIDA COMPAÑIA ARGENTINA DE SEGUROS S.A  por los hechos denunciados habiendo advertido un agravamiento del riesgo, no teniendo persona alguna derecho a reclamar por ningún concepto.`
  },

  // ==================== ATM ====================
  {
    id: 'ATM_TITULAR',
    companyId: 'ATM',
    title: 'Desiste de la Acción y del Derecho - Asegurado/a',
    type: 'TITULAR',
    fields: ['FECHA', 'NUMERO_SINIESTRO', 'NUMERO_POLIZA', 'NOMBRE_COMPLETO', 'FECHA_OCURRENCIA', 'EMAIL', 'DNI'],
    bodyTemplate: `DESISTE DE LA ACCIÓN Y DEL DERECHO.
FECHA: {{FECHA}}
SINIESTRO: {{NUMERO_SINIESTRO}}
PÓLIZA: {{NUMERO_POLIZA}}
NOMBRE: {{NOMBRE_COMPLETO}}

En mi carácter de asegurado/a de ATM COMPAÑÍA DE SEGUROS S.A., comunico a Ud. por medio de la presente, mi decisión irrevocable de desistir de cualquier acción y/o derecho contra esa empresa aseguradora, con motivo del hecho denunciado con fecha {{FECHA_OCURRENCIA}}, y que motivara la apertura del siniestro N° {{NUMERO_SINIESTRO}}.-

Se suscribe bajo firma digital con la plataforma ADOBE ACROBAT SIGN a la casilla de C.E. {{EMAIL}} en forma VOLUNTARIA (Art. 260 del CCCN), liberando de toda responsabilidad a ATM COMPAÑÍA DE SEGUROS S.A. por los hechos denunciados, no teniendo persona alguna derecho a reclamar por ningún concepto.`
  },
  {
    id: 'ATM_TERCERO',
    companyId: 'ATM',
    title: 'Desiste de la Acción y del Derecho - Tercero',
    type: 'TERCERO',
    fields: ['FECHA', 'NUMERO_SINIESTRO', 'NOMBRE_COMPLETO', 'DATOS_VEHICULO_ASEGURADO', 'EMAIL', 'DNI'],
    bodyTemplate: `DESISTE DE LA ACCIÓN Y DEL DERECHO.
FECHA: {{FECHA}}
SINIESTRO: {{NUMERO_SINIESTRO}}
NOMBRE: {{NOMBRE_COMPLETO}}

En mi carácter de tercero reclamante en el siniestro N° {{NUMERO_SINIESTRO}}, comunico a Ud. mi decisión irrevocable de desistir de cualquier acción y/o derecho contra ATM COMPAÑÍA DE SEGUROS S.A., y/o contra vuestro asegurado, y/o conductor del vehículo {{DATOS_VEHICULO_ASEGURADO}}, con motivo del reclamo que oportunamente formalizara en el referido siniestro.

Se suscribe bajo firma digital con la plataforma ADOBE ACROBAT SIGN a la casilla de C.E. {{EMAIL}} en forma VOLUNTARIA (Art. 260 del CCCN), liberando de toda responsabilidad a ATM COMPAÑÍA DE SEGUROS S.A. por los hechos denunciados, no teniendo persona alguna derecho a reclamar por ningún concepto.`
  },
  {
    id: 'ATM_TERCERO_NO_SEGURO',
    companyId: 'ATM',
    title: 'Desiste de la Acción y del Derecho - Tercero Sin Seguro',
    type: 'TERCERO_NO_SEGURO',
    fields: ['FECHA', 'NUMERO_SINIESTRO', 'NOMBRE_COMPLETO', 'DATOS_VEHICULO_ASEGURADO', 'CAUSANTE_DANO', 'EMAIL', 'DNI'],
    bodyTemplate: `DESISTE DE LA ACCIÓN Y DEL DERECHO.
FECHA: {{FECHA}}
SINIESTRO: {{NUMERO_SINIESTRO}}
NOMBRE: {{NOMBRE_COMPLETO}}

En mi carácter de tercero reclamante en el siniestro N° {{NUMERO_SINIESTRO}}, comunico a Ud. mi decisión irrevocable de desistir de cualquier acción y/o derecho contra ATM COMPAÑÍA DE SEGUROS S.A., en relación con el siniestro ocurrido con el vehículo asegurado {{DATOS_VEHICULO_ASEGURADO}}, respecto del reclamo oportunamente formulado en dicho expediente. Y se reserva el derecho de accionar civil y penalmente contra el causante del daño, Sr. {{CAUSANTE_DANO}}, quien al momento del siniestro carecía de póliza vigente en vuestra compañía.

Se suscribe bajo firma digital con la plataforma ADOBE ACROBAT SIGN a la casilla de C.E. {{EMAIL}} en forma VOLUNTARIA (Art. 260 del CCCN), liberando de toda responsabilidad a ATM COMPAÑÍA DE SEGUROS S.A. por los hechos denunciados, no teniendo persona alguna derecho a reclamar por ningún concepto.`
  },
  {
    id: 'ATM_USO_COMERCIAL',
    companyId: 'ATM',
    title: 'Desiste de la Acción y del Derecho - Uso Comercial',
    type: 'USO_COMERCIAL',
    fields: ['FECHA', 'NUMERO_SINIESTRO', 'NUMERO_POLIZA', 'NOMBRE_COMPLETO', 'FECHA_OCURRENCIA', 'EMAIL', 'DNI'],
    bodyTemplate: `DESISTE DE LA ACCIÓN Y DEL DERECHO.
FECHA: {{FECHA}}
SINIESTRO: {{NUMERO_SINIESTRO}}
PÓLIZA: {{NUMERO_POLIZA}}
NOMBRE: {{NOMBRE_COMPLETO}}

En mi carácter de asegurado/a de ATM COMPAÑÍA DE SEGUROS S.A., comunico a Ud. por medio de la presente, mi decisión irrevocable de desistir de cualquier acción y/o derecho contra esa empresa aseguradora, con motivo del hecho denunciado con fecha {{FECHA_OCURRENCIA}}, y que motivara la apertura del siniestro N° {{NUMERO_SINIESTRO}}, ello por haber advertido un riesgo no amparado en la póliza contratada-

Se suscribe bajo firma digital con la plataforma ADOBE ACROBAT SIGN a la casilla de C.E. {{EMAIL}} en forma VOLUNTARIA (Art. 260 del CCCN), liberando de toda responsabilidad a ATM COMPAÑÍA DE SEGUROS S.A. por los hechos denunciados habiendo advertido un agravamiento del riesgo, no teniendo persona alguna derecho a reclamar por ningún concepto.`
  },

  // ==================== PROVINCIA ====================
  {
    id: 'PROVINCIA_TITULAR',
    companyId: 'PROVINCIA',
    title: 'Desiste de la Acción y del Derecho - Asegurado/a',
    type: 'TITULAR',
    fields: ['FECHA', 'NUMERO_SINIESTRO', 'NUMERO_POLIZA', 'NOMBRE_COMPLETO', 'FECHA_OCURRENCIA', 'EMAIL', 'DNI'],
    bodyTemplate: `DESISTE DE LA ACCIÓN Y DEL DERECHO.
FECHA: {{FECHA}}
SINIESTRO: {{NUMERO_SINIESTRO}}
PÓLIZA: {{NUMERO_POLIZA}}
NOMBRE: {{NOMBRE_COMPLETO}}

En mi carácter de asegurado/a de Provincia Seguros S.A., comunico a Ud. por medio de la presente, mi decisión irrevocable de desistir de cualquier acción y/o derecho contra esa empresa aseguradora, con motivo del hecho denunciado con fecha {{FECHA_OCURRENCIA}} y que motivara la apertura del siniestro N° {{NUMERO_SINIESTRO}} .-

Se suscribe bajo firma digital con la plataforma ADOBE SIGN a la casilla de C.E. {{EMAIL}} en forma VOLUNTARIA (Art. 260 del CCCN), liberando de toda responsabilidad a PROVINCIA SEGUROS S.A. por los hechos denunciados, no teniendo persona alguna derecho a reclamar por ningún concepto.`
  },
  {
    id: 'PROVINCIA_TERCERO',
    companyId: 'PROVINCIA',
    title: 'Desiste de la Acción y del Derecho - Tercero',
    type: 'TERCERO',
    fields: ['FECHA', 'NUMERO_SINIESTRO', 'NOMBRE_COMPLETO', 'DATOS_VEHICULO_ASEGURADO', 'EMAIL', 'DNI'],
    bodyTemplate: `DESISTE DE LA ACCIÓN Y DEL DERECHO.
FECHA: {{FECHA}}
SINIESTRO: {{NUMERO_SINIESTRO}}
NOMBRE: {{NOMBRE_COMPLETO}}

En mi carácter de tercero reclamante en el siniestro N° {{NUMERO_SINIESTRO}}, comunico a Ud. mi decisión irrevocable de desistir de cualquier acción y/o derecho contra PROVINCIA SEGUROS S.A., y/o contra vuestro asegurado, y/o conductor del vehículo {{DATOS_VEHICULO_ASEGURADO}}, con motivo del reclamo que oportunamente formalizara en el referido siniestro.

Se suscribe bajo firma digital con la plataforma ADOBE ACROBAT SIGN a la casilla de C.E. {{EMAIL}} en forma VOLUNTARIA (Art. 260 del CCCN), liberando de toda responsabilidad a PROVINCIA SEGUROS S.A. por los hechos denunciados, no teniendo persona alguna derecho a reclamar por ningún concepto.`
  },
  {
    id: 'PROVINCIA_TERCERO_NO_SEGURO',
    companyId: 'PROVINCIA',
    title: 'Desiste de la Acción y del Derecho - Tercero Sin Seguro',
    type: 'TERCERO_NO_SEGURO',
    fields: ['FECHA', 'NUMERO_SINIESTRO', 'NOMBRE_COMPLETO', 'DATOS_VEHICULO_ASEGURADO', 'CAUSANTE_DANO', 'EMAIL', 'DNI'],
    bodyTemplate: `DESISTE DE LA ACCIÓN Y DEL DERECHO.
FECHA: {{FECHA}}
SINIESTRO: {{NUMERO_SINIESTRO}}
NOMBRE: {{NOMBRE_COMPLETO}}

En mi carácter de tercero reclamante en el siniestro N° {{NUMERO_SINIESTRO}}, comunico a Ud. mi decisión irrevocable de desistir de cualquier acción y/o derecho contra PROVINCIA SEGUROS S.A., en relación con el siniestro ocurrido con el vehículo asegurado {{DATOS_VEHICULO_ASEGURADO}}, respecto del reclamo oportunamente formulado en dicho expediente. Y se reserva el derecho de accionar civil y penalmente contra el causante del daño, Sr. {{CAUSANTE_DANO}}, quien al momento del siniestro carecía de póliza vigente en vuestra compañía.

Se suscribe bajo firma digital con la plataforma ADOBE ACROBAT SIGN a la casilla de C.E. {{EMAIL}} en forma VOLUNTARIA (Art. 260 del CCCN), liberando de toda responsabilidad a PROVINCIA SEGUROS S.A. por los hechos denunciados, no teniendo persona alguna derecho a reclamar por ningún concepto.`
  },
  {
    id: 'PROVINCIA_USO_COMERCIAL',
    companyId: 'PROVINCIA',
    title: 'Desiste de la Acción y del Derecho - Uso Comercial',
    type: 'USO_COMERCIAL',
    fields: ['FECHA', 'NUMERO_SINIESTRO', 'NUMERO_POLIZA', 'NOMBRE_COMPLETO', 'FECHA_OCURRENCIA', 'EMAIL', 'DNI'],
    bodyTemplate: `DESISTE DE LA ACCIÓN Y DEL DERECHO.
FECHA: {{FECHA}}
SINIESTRO: {{NUMERO_SINIESTRO}}
PÓLIZA: {{NUMERO_POLIZA}}
NOMBRE: {{NOMBRE_COMPLETO}}

En mi carácter de asegurado/a de Provincia Seguros S.A., comunico a Ud. por medio de la presente, mi decisión irrevocable de desistir de cualquier acción y/o derecho contra esa empresa aseguradora, con motivo del hecho denunciado con fecha {{FECHA_OCURRENCIA}} y que motivara la apertura del siniestro N° {{NUMERO_SINIESTRO}}, ello por haber advertido un riesgo no amparado en la póliza contratada-.-

Se suscribe bajo firma digital con la plataforma ADOBE SIGN a la casilla de C.E. {{EMAIL}} en forma VOLUNTARIA (Art. 260 del CCCN), liberando de toda responsabilidad a PROVINCIA SEGUROS S.A. por los hechos denunciados habiendo advertido un agravamiento del riesgo, no teniendo persona alguna derecho a reclamar por ningún concepto.`
  },

  // ==================== SANCOR ====================
  {
    id: 'SANCOR_TITULAR',
    companyId: 'SANCOR',
    title: 'Desiste de la Acción y del Derecho - Asegurado/a',
    type: 'TITULAR',
    fields: ['FECHA', 'NUMERO_SINIESTRO', 'NUMERO_POLIZA', 'REF', 'NOMBRE_COMPLETO', 'FECHA_OCURRENCIA', 'EMAIL', 'DNI'],
    bodyTemplate: `DESISTE DE LA ACCIÓN Y DEL DERECHO.
FECHA: {{FECHA}}
SINIESTRO: {{NUMERO_SINIESTRO}}
PÓLIZA: {{NUMERO_POLIZA}}
REF: {{REF}}
NOMBRE: {{NOMBRE_COMPLETO}}

En mi carácter de asegurado/a de SANCOR COOP. LTDA, comunico a Ud. por medio de la presente, mi decisión irrevocable de desistir de cualquier acción y/o derecho contra esa empresa aseguradora, con motivo del hecho denunciado con fecha {{FECHA_OCURRENCIA}}, y que motivara la apertura del siniestro N° {{NUMERO_SINIESTRO}}.-

Se suscribe bajo firma digital con la plataforma ADOBE ACROBAT SIGN a la casilla de C.E. {{EMAIL}} en forma VOLUNTARIA (Art. 260 del CCCN), liberando de toda responsabilidad a SANCOR COOP. LTDA por los hechos denunciados, no teniendo persona alguna derecho a reclamar por ningún concepto.`
  },
  {
    id: 'SANCOR_TERCERO',
    companyId: 'SANCOR',
    title: 'Desiste de la Acción y del Derecho - Tercero',
    type: 'TERCERO',
    fields: ['FECHA', 'NUMERO_SINIESTRO', 'NOMBRE_COMPLETO', 'DATOS_VEHICULO_ASEGURADO', 'EMAIL', 'DNI'],
    bodyTemplate: `DESISTE DE LA ACCIÓN Y DEL DERECHO.
FECHA: {{FECHA}}
SINIESTRO: {{NUMERO_SINIESTRO}}
NOMBRE: {{NOMBRE_COMPLETO}}

En mi carácter de tercero reclamante en el siniestro N° {{NUMERO_SINIESTRO}}, comunico a Ud. mi decisión irrevocable de desistir de cualquier acción y/o derecho contra SANCOR COOP. LTDA S.A., y/o contra vuestro asegurado, y/o conductor del vehículo {{DATOS_VEHICULO_ASEGURADO}}, con motivo del reclamo que oportunamente formalizara en el referido siniestro.

Se suscribe bajo firma digital con la plataforma ADOBE ACROBAT SIGN a la casilla de C.E. {{EMAIL}} en forma VOLUNTARIA (Art. 260 del CCCN), liberando de toda responsabilidad a SANCOR COOP. LTDA por los hechos denunciados, no teniendo persona alguna derecho a reclamar por ningún concepto.`
  },
  {
    id: 'SANCOR_TERCERO_NO_SEGURO',
    companyId: 'SANCOR',
    title: 'Desiste de la Acción y del Derecho - Tercero Sin Seguro',
    type: 'TERCERO_NO_SEGURO',
    fields: ['FECHA', 'NUMERO_SINIESTRO', 'NOMBRE_COMPLETO', 'DATOS_VEHICULO_ASEGURADO', 'CAUSANTE_DANO', 'EMAIL', 'DNI'],
    bodyTemplate: `DESISTE DE LA ACCIÓN Y DEL DERECHO.
FECHA: {{FECHA}}
SINIESTRO: {{NUMERO_SINIESTRO}}
NOMBRE: {{NOMBRE_COMPLETO}}

En mi carácter de tercero reclamante en el siniestro N° {{NUMERO_SINIESTRO}}, comunico a Ud. mi decisión irrevocable de desistir de cualquier acción y/o derecho contra SANCOR COOP. LTDA S.A., en relación con el siniestro ocurrido con el vehículo asegurado {{DATOS_VEHICULO_ASEGURADO}}, respecto del reclamo oportunamente formulado en dicho expediente. Y se reserva el derecho de accionar civil y penalmente contra el causante del daño, Sr. {{CAUSANTE_DANO}}, quien al momento del siniestro carecía de póliza vigente en vuestra compañía.

Se suscribe bajo firma digital con la plataforma ADOBE ACROBAT SIGN a la casilla de C.E. {{EMAIL}} en forma VOLUNTARIA (Art. 260 del CCCN), liberando de toda responsabilidad a SANCOR COOP. LTDA por los hechos denunciados, no teniendo persona alguna derecho a reclamar por ningún concepto.`
  },
  {
    id: 'SANCOR_USO_COMERCIAL',
    companyId: 'SANCOR',
    title: 'Desiste de la Acción y del Derecho - Uso Comercial',
    type: 'USO_COMERCIAL',
    fields: ['FECHA', 'NUMERO_SINIESTRO', 'NUMERO_POLIZA', 'REF', 'NOMBRE_COMPLETO', 'FECHA_OCURRENCIA', 'EMAIL', 'DNI'],
    bodyTemplate: `DESISTE DE LA ACCIÓN Y DEL DERECHO.
FECHA: {{FECHA}}
SINIESTRO: {{NUMERO_SINIESTRO}}
PÓLIZA: {{NUMERO_POLIZA}}
REF: {{REF}}
NOMBRE: {{NOMBRE_COMPLETO}}

En mi carácter de asegurado/a de SANCOR COOP. LTDA, comunico a Ud. por medio de la presente, mi decisión irrevocable de desistir de cualquier acción y/o derecho contra esa empresa aseguradora, con motivo del hecho denunciado con fecha {{FECHA_OCURRENCIA}}, y que motivara la apertura del siniestro N° {{NUMERO_SINIESTRO}}, ello por haber advertido un riesgo no amparado en la póliza contratada-

Se suscribe bajo firma digital con la plataforma ADOBE ACROBAT SIGN a la casilla de C.E. {{EMAIL}} en forma VOLUNTARIA (Art. 260 del CCCN), liberando de toda responsabilidad a SANCOR COOP. LTDA por los hechos denunciados habiendo advertido un agravamiento del riesgo, no teniendo persona alguna derecho a reclamar por ningún concepto.`
  }
];
