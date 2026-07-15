export interface DatosClinicos {

  /* ========= PACIENTE ========= */
  fechaProcedimiento: string;
  historiaClinica: string;
  nombreCompleto: string;
  edad: string;
  genero: string;
  grupoSanguineo: string;
  diagnosticoActual: string;
  antecedentes: string;
  tipoCirugia:string;
  prioridadCirugia:string;
  estadoIngreso:string;
  pesoReal: string;
  talla: string;
  imc:string;
  pesoIdeal: string;
  pesoAjustado: string;
  scReal: string;
  scIdeal: string;
  scAjustada: string;
  nutricion: string;

  /* ========= EQUIPO QUIRÚRGICO ========= */
  equipoQuirurgico: {
    cirujanoPrincipal: string;
    cirujanoAsistente: string;
    segundoAsistente: string;
    anestesiologoPrincipal: string;
    segundoAnestesiologo: string;
    perfusionistaPrincipal: string;
    segundoPerfusionista: string;
  };

  /* ========= LABORATORIOS PRE ========= */
laboratoriosPre: {
  hb: string;
  hto: string;
  plaquetas: string;
  actPre: string;
  leucocitos: string;
  tp: string;
  tpt: string;

  glucemia: string;
  hbA1c: string;
  lactato: string;

  creatinina: string;
  urea: string;
  diuresisPre: string;

  tgo: string;
  tgp: string;
  bilirrubinaTotal: string;
  bilirrubinaDirecta: string;

  phA: string;
  paO2: string;
  paCO2: string;
  hco3A: string;
  beA: string;
  saO2: string;

  phV: string;
  pvO2: string;
  pvCO2: string;
  hco3V: string;
  beV: string;
  svO2: string;

  sodio: string;
  potasio: string;
  calcio: string;
  cloro: string;
  magnesio: string;
  fosforo: string;
};

/* ========= ECO HEMODINÁMICA ========= */
ecoHemodinamica: {
  fevi: string;
  vdvi: string;
  vsv: string;
  fc: string;
  pam: string;
  pvc: string;
};

/* ========= ESCALAS DE RIESGO ========= */
escalasRiesgo: {
  trust: Record<string, boolean>;
  vis: {
    dopamina: string;
    dobutamina: string;
    adrenalina: string;
    milrinona: string;
    noradrenalina: string;
    vasopresina: string;
  };
  euroscore: {
  edad: string;
  sexo: string;
  creatinina: string;
  fevi: string;
  nyha: string;

  cirugiaUrgente: boolean;
  cirugiaAortica: boolean;
  endocarditis: boolean;
  estadoCritico: boolean;

  score: string;
  riesgo: string;
};
};
/* ========= PLAN PERFUSION ========= */
planPerfusion: {
  especificacionesCircuito: {
    tipoCircuito: string;
    bombaPrincipal: string;
    modeloOxigenador: string;
    canulaArterial: string;
    canulaVenosa: string;
    lineaVenosa: string;
    lineaArterial: string;
    flujoPulsatil: string;
  };

  temperaturaEstrategia: string;

  estrategiasAhorro: string[];
  volumenRetornoVenoso: string;
volumenZBUF: string;
volumenHemofiltracion: string;

  flujos: {
    estrategiaPeso: string;
    indiceCardiaco: number;
  };

  proteccionMiocardica: {
    peso: string;
    volumen: string;
    tipoSolucion: string | null;
    viasAdministracion: string[];
    dosisMlKg: number;
    temperatura: string;
  };

  priming: {
    peso: string;
    htoPre: string;
    anestesia: string;
    cardioplejia: string;

    primingItems: {
      lactatoRinger: string;
      salina: string;
      plasmalyte: string;
      polielectrolitica: string;
      gelatina: string;
      albumina: string;
      manitol: string;
      tranexamico: string;
      bicarbonato: string;
      heparina: string;
      magnesio: string;
    };
  };

 terapiaHemoadsorcion:{
usar:boolean
tipo:string
}
curvaHeparina: {
  peso: string;
  actBasal: string;
  dosisInicialMgKg: string;
  dosisBomba: string;
  actPostHeparina: string;
  actObjetivo: number;

  sensibilidadHeparina: string;
  dosisTotalMgKg: string;
  dosisTotalMg: string;
  dosisAdicionalMgKg: string;

  actPostDosisFinal: string;
};

  perfusionSelectiva: {
    pesoCerebral: string;
    factorCerebral: string;
    viaCerebral: string;
    flujoCerebral: string;

    cerebralActiva: boolean;
    miocardicaActiva: boolean;
    distalActiva: boolean;

    flujoMiocardico: string;
    presionMiocardica: string;

    canulaDistal: string;
    flujoDistal: string;
  };
};
 /* ========= CHECKLIST ========= */
  checklist: {
    categorias: {
      titulo: string;
      items: {
        label: string;
        checked: boolean;
      }[];
    }[];
  };
/* ========= INTRA CEC ========= */

intraCEC: {
monitorACT: {
  hora: string;
  redosisAdministrada: string;

  registros: {
    hora: string;
    act: string;
    temperatura: string;
    hto: string;
    plaquetas: string;
    tiempoCEC: string;
    deficitACT: string;
    redosisSugerida: string;
    redosisAdministrada: string;
  }[];
};

  monitorTiempoCEC: string;
  tiemposQuirurgicos: {
    hora: string;
    ritmoDesclampeo: string;
juliesDesfibrilacion: string;



tiempoReperfusion: string;
hotShot: boolean;
temperaturaDesclampeo: string;

    registros: {
      hora: string;
      totalCEC: number;
    }[];

    tiempos: {
      cec: { inicio: string; fin: string };
      clampeo: { inicio: string; fin: string };
      reperfusion: { inicio: string; fin: string };
      parada: { inicio: string; fin: string };
      cerebral: { inicio: string; fin: string };
      miocardica: { inicio: string; fin: string };
      distal: { inicio: string; fin: string };
      evento:{
 hora:string
 descripcion:string
 registros:{
   hora:string
   descripcion:string
 }[]
}
    };
  };

  datosIntraCEC: {
    registros: {
      hora: string;
      valores: Record<string, string>;
    }[];
  };

  laboratorio: {
  hora: string;

 campos: {
  hb: number | null;
  hto: number | null;
  plaquetas: number | null;
  act: number | null;
  lactato: number | null;
  glicemia: number | null;

  // ELECTROLITOS
sodio: number | null;
potasio: number | null;
cloro: number | null;
calcio: number | null;

  // 🟣 ARTERIAL
  phA: number | null;
  pco2Arterial: number | null;
  po2A: number | null;
  satArterial: number | null;
  hco3A: number | null;
  ebA: number | null;

  // 🔵 VENOSA TEMP ACT
  phVenosoTemp: number | null;
  pco2VenosoTemp: number | null;
  po2VenosoTemp: number | null;
  svO2CalcTemp: number | null;
  svO2ManualTemp: number | null;


  // 🔵 VENOSA 37°
phVenoso37: number | null;
pco2Venoso37: number | null;
po2Venoso37: number | null;
svO2Calc37: number | null;
hco3Venoso37: number | null;
ebVenoso37: number | null;
};

  registros: {
    hora: string;
    campos: {
      hb: number | null;
      hto: number | null;
      plaquetas: number | null;
      act: number | null;
      lactato: number | null;
      glicemia: number | null;

      // 🟣 ARTERIAL
      phA: number | null;
      pco2Arterial: number | null;
      po2A: number | null;
      satArterial: number | null;
      hco3A: number | null;
      ebA: number | null;

      // 🔵 VENOSA TEMP ACT
      phVenosoTemp: number | null;
      pco2VenosoTemp: number | null;
      po2VenosoTemp: number | null;
      svO2CalcTemp: number | null;
      svO2ManualTemp: number | null;

      // 🔵 VENOSA 37°
      phVenoso37: number | null;
      pco2Venoso37: number | null;
      po2Venoso37: number | null;
      svO2Calc37: number | null;
      hco3Venoso37: number | null;
      ebVenoso37: number | null;
    };
  }[];
};

  parametros: {
    flujo: number | null;
    superficieCorporal: number | null;
    sweepGas: number | null;
    ePCO2: number | null;
    tempEsofagica: number | null;
    pam: number | null;
    presionAtmosferica: number | null;
    pvc: number | null;
fio2: number | null;
tVenosa: number | null;
tArterial: number | null;
 qcon: number | null;
  qnox: number | null;
  nirsD: number | null;
  nirsI: number | null;
  };
  balanceHidrico: {
  hora: string;

  registros: {
    hora: string;
    ingresos: number;
    egresos: number;
    balance: number;

    detalleIngresos: Record<string, string>;
    detalleCristaloides: Record<string, string>;
    detalleColoides: Record<string, string>;
    detalleMedicamentos: Record<string, string>;
    detalleHemoderivados: Record<string, string>;
    detalleEgresos: Record<string, string>;
  }[];

  ingresos: Record<string, string>;
  cristaloides: Record<string, string>;
  coloides: Record<string, string>;
  medicamentos: Record<string, string>;
  hemoderivados: Record<string, string>;
  egresos: Record<string, string>;
};


  /* 👇 AQUI ADENTRO */
 pdg: {
  registros: {
    hora: string;
    valores: Record<string, string>;
  }[];
};
};

/* ========= POST CEC ========= */

postCEC: {

  relacionProtamina: string;
  condicionSalida:string;

  laboratorios: {
    hb: string;
    hto: string;
    plaquetas: string;
    leucocitos: string;
    act: string;

    urea: string;
    creatinina: string;
    lactato: string;
    glicemia: string;

    tgo: string;
    tgp: string;
    bbd: string;
    bbt: string;

    na: string;
    k: string;
    ca: string;

    phA: string;
    pco2A: string;
    po2A: string;
    satA:string;
    hco3A: string;
    ebA: string;

    phV: string;
    pco2V: string;
    po2V: string;
    satV:string;
    hco3V: string;
    ebV: string;

    dopamina: string;
    dobutamina: string;
    epinefrina: string;
    norepinefrina: string;
    milrinona: string;
    vasopresina: string;
  };
  
};
}