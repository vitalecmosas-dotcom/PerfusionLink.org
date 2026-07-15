import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import type { DatosClinicos } from "../types/DatosClinicos";


/* ================= EXPORTAR EXCEL ================= */

export function exportarReporteExcel(datos: DatosClinicos) {
  const wb = XLSX.utils.book_new();

  /* ======================================================
     HOJA PACIENTE (ORDEN CLÍNICO REAL)
  ====================================================== */

  const trustScore = Object.values(
    datos.escalasRiesgo.trust || {}
  ).filter(Boolean).length;

  const vis = datos.escalasRiesgo.vis;

  const visScore =
    (Number(vis.dopamina) || 0) +
    (Number(vis.dobutamina) || 0) +
    100 * (Number(vis.adrenalina) || 0) +
    10 * (Number(vis.milrinona) || 0) +
    100 * (Number(vis.noradrenalina) || 0) +
    167 * (Number(vis.vasopresina) || 0);

  const pacienteRows = [
    { Seccion: "=== FICHA CLÍNICA ===", Campo: "", Valor: "" },

    { Seccion: "", Campo: "Peso real", Valor: datos.pesoReal },
    { Seccion: "", Campo: "Talla", Valor: datos.talla },
    { Seccion: "", Campo: "Peso ideal", Valor: datos.pesoIdeal },
    { Seccion: "", Campo: "Peso ajustado", Valor: datos.pesoAjustado },
    { Seccion: "", Campo: "SC real", Valor: datos.scReal },
    { Seccion: "", Campo: "SC ideal", Valor: datos.scIdeal },
    { Seccion: "", Campo: "SC ajustada", Valor: datos.scAjustada },
    { Seccion: "", Campo: "Nutrición", Valor: datos.nutricion },

    { Seccion: "=== EQUIPO QUIRÚRGICO ===", Campo: "", Valor: "" },

    { Seccion: "", Campo: "Cirujano principal", Valor: datos.equipoQuirurgico.cirujanoPrincipal },
    { Seccion: "", Campo: "Cirujano asistente", Valor: datos.equipoQuirurgico.cirujanoAsistente },
    { Seccion: "", Campo: "Segundo asistente", Valor: datos.equipoQuirurgico.segundoAsistente },
    { Seccion: "", Campo: "Anestesiólogo principal", Valor: datos.equipoQuirurgico.anestesiologoPrincipal },
    { Seccion: "", Campo: "Segundo anestesiólogo", Valor: datos.equipoQuirurgico.segundoAnestesiologo },
    { Seccion: "", Campo: "Perfusionista principal", Valor: datos.equipoQuirurgico.perfusionistaPrincipal },
    { Seccion: "", Campo: "Segundo perfusionista", Valor: datos.equipoQuirurgico.segundoPerfusionista },

    { Seccion: "=== LABORATORIOS PRE ===", Campo: "", Valor: "" },

    ...Object.entries(datos.laboratoriosPre).map(([k, v]) => ({
      Seccion: "",
      Campo: k,
      Valor: v,
    })),

    { Seccion: "=== ECO HEMODINAMIA ===", Campo: "", Valor: "" },

    ...Object.entries(datos.ecoHemodinamica).map(([k, v]) => ({
      Seccion: "",
      Campo: k,
      Valor: v,
    })),

    { Seccion: "=== ESCALAS DE RIESGO ===", Campo: "", Valor: "" },

{ Seccion: "", Campo: "TRUST SCORE", Valor: trustScore },

{ Seccion: "", Campo: "VIS SCORE", Valor: visScore.toFixed(1) },

{ 
  Seccion: "", 
  Campo: "EUROSCORE II", 
  Valor: datos.escalasRiesgo.euroscore.score || "" 
},

{ 
  Seccion: "", 
  Campo: "RIESGO EUROSCORE", 
  Valor: datos.escalasRiesgo.euroscore.riesgo || "" 
},

{ 
  Seccion: "", 
  Campo: "Edad EuroScore", 
  Valor: datos.escalasRiesgo.euroscore.edad || "" 
},

{ 
  Seccion: "", 
  Campo: "Sexo EuroScore", 
  Valor: datos.escalasRiesgo.euroscore.sexo || "" 
},

{ 
  Seccion: "", 
  Campo: "Creatinina EuroScore", 
  Valor: datos.escalasRiesgo.euroscore.creatinina || "" 
},

{ 
  Seccion: "", 
  Campo: "FEVI EuroScore", 
  Valor: datos.escalasRiesgo.euroscore.fevi || "" 
},

{ 
  Seccion: "", 
  Campo: "NYHA", 
  Valor: datos.escalasRiesgo.euroscore.nyha || "" 
},

{ 
  Seccion: "", 
  Campo: "Cirugía urgente", 
  Valor: datos.escalasRiesgo.euroscore.cirugiaUrgente ? "SI" : "NO" 
},

{ 
  Seccion: "", 
  Campo: "Cirugía aórtica", 
  Valor: datos.escalasRiesgo.euroscore.cirugiaAortica ? "SI" : "NO" 
},

{ 
  Seccion: "", 
  Campo: "Endocarditis", 
  Valor: datos.escalasRiesgo.euroscore.endocarditis ? "SI" : "NO" 
},

{ 
  Seccion: "", 
  Campo: "Estado crítico", 
  Valor: datos.escalasRiesgo.euroscore.estadoCritico ? "SI" : "NO" 
},

...Object.entries(vis).map(([k, v]) => ({
  Seccion: "",
  Campo: k,
  Valor: v,
})),
  ];

  const pacienteSheet = XLSX.utils.json_to_sheet(pacienteRows);

  XLSX.utils.book_append_sheet(wb, pacienteSheet, "Paciente");

/* ===== PLAN PERFUSIÓN (VERTICAL) ===== */

const plan = datos.planPerfusion;

const planRows: any[] = [];

/* ===== ESPECIFICACIONES ===== */

planRows.push({
  Seccion: "=== ESPECIFICACIONES CIRCUITO ===",
  Campo: "",
  Valor: "",
});

planRows.push(
  { Seccion:"", Campo:"Tipo Circuito", Valor: plan.especificacionesCircuito?.tipoCircuito ?? "" },
  { Seccion:"", Campo:"Bomba Principal", Valor: plan.especificacionesCircuito?.bombaPrincipal ?? "" },
  { Seccion:"", Campo:"Modelo Oxigenador", Valor: plan.especificacionesCircuito?.modeloOxigenador ?? "" },
  { Seccion:"", Campo:"Cánula Arterial", Valor: plan.especificacionesCircuito?.canulaArterial ?? "" },
  { Seccion:"", Campo:"Cánula Venosa", Valor: plan.especificacionesCircuito?.canulaVenosa ?? "" },
  { Seccion:"", Campo:"Línea Venosa", Valor: plan.especificacionesCircuito?.lineaVenosa ?? "" },
  { Seccion:"", Campo:"Línea Arterial", Valor: plan.especificacionesCircuito?.lineaArterial ?? "" },
);

/* ===== TEMPERATURA ===== */

planRows.push({
  Seccion: "=== TEMPERATURA ===",
  Campo: "",
  Valor: "",
});

planRows.push({
  Seccion:"",
  Campo:"Estrategia",
  Valor: plan.temperaturaEstrategia ?? "",
});

(plan.estrategiasAhorro ?? []).forEach((e:any)=>{
  planRows.push({
    Seccion:"",
    Campo:"Estrategia ahorro",
    Valor:e,
  });
});

/* ===== FLUJOS ===== */

planRows.push({
  Seccion:"=== FLUJOS ===",
  Campo:"",
  Valor:"",
});

planRows.push(
  { Seccion:"", Campo:"Estrategia Peso", Valor: plan.flujos?.estrategiaPeso ?? "" },
  { Seccion:"", Campo:"Índice Cardíaco", Valor: plan.flujos?.indiceCardiaco ?? "" },
);

/* ===== PROTECCIÓN MIOCÁRDICA ===== */

planRows.push({
  Seccion:"=== PROTECCIÓN MIOCÁRDICA ===",
  Campo:"",
  Valor:"",
});

planRows.push(
  { Seccion:"", Campo:"Peso", Valor: plan.proteccionMiocardica?.peso ?? "" },
  { Seccion:"", Campo:"Volumen", Valor: plan.proteccionMiocardica?.volumen ?? "" },
  { Seccion:"", Campo:"Tipo Solución", Valor: plan.proteccionMiocardica?.tipoSolucion ?? "" },
  { Seccion:"", Campo:"Dosis", Valor: plan.proteccionMiocardica?.dosisMlKg ?? "" },
  { Seccion:"", Campo:"Temperatura", Valor: plan.proteccionMiocardica?.temperatura ?? "" },
);

(plan.proteccionMiocardica?.viasAdministracion ?? []).forEach((v:any)=>{
  planRows.push({
    Seccion:"",
    Campo:"Vía administración",
    Valor:v,
  });
});

/* ===== PRIMING ===== */

planRows.push({
  Seccion:"=== PRIMING ===",
  Campo:"",
  Valor:"",
});

Object.entries(plan.priming?.primingItems ?? {}).forEach(([k,v])=>{
  planRows.push({
    Seccion:"",
    Campo:k,
    Valor:v,
  });
});

/* ===== PERFUSIÓN SELECTIVA ===== */

planRows.push({
  Seccion:"=== PERFUSIÓN SELECTIVA ===",
  Campo:"",
  Valor:"",
});

Object.entries(plan.perfusionSelectiva ?? {}).forEach(([k,v])=>{
  planRows.push({
    Seccion:"",
    Campo:k,
    Valor:v as any,
  });
});

/* ===== CREAR HOJA ===== */

const planSheet = XLSX.utils.json_to_sheet(planRows);

XLSX.utils.book_append_sheet(
  wb,
  planSheet,
  "Plan Perfusion"
);

 /* ===== CHECKLIST ===== */

const categoriasChecklist = datos.checklist?.categorias ?? [];

/* ===== FILAS DETALLADAS ===== */
const checklistRows = categoriasChecklist.flatMap((cat) =>
  cat.items.map((item) => ({
    Categoria: cat.titulo,
    Item: item.label,
    Completado: item.checked ? "SI" : "NO",
  }))
);

/* ===== PORCENTAJE TOTAL ===== */
const totalItems = categoriasChecklist.reduce(
  (acc, cat) => acc + cat.items.length,
  0
);

const completados = categoriasChecklist.reduce(
  (acc, cat) =>
    acc + cat.items.filter((i) => i.checked).length,
  0
);

const porcentaje =
  totalItems > 0
    ? Math.round((completados / totalItems) * 100)
    : 0;

/* ===== AGREGAR RESUMEN FINAL ===== */
checklistRows.push({
  Categoria: "RESUMEN",
  Item: "Cumplimiento total",
  Completado: `${porcentaje}%`,
});

const checklistSheet = XLSX.utils.json_to_sheet(checklistRows);

XLSX.utils.book_append_sheet(
  wb,
  checklistSheet,
  "Checklist"
);

/* ================= INTRA CEC ================= */

const intraRows: any[] = [];

/* ===== TIEMPOS QUIRÚRGICOS ===== */

intraRows.push({
  Seccion: "=== TIEMPOS QUIRÚRGICOS ===",
  Hora: "",
  Dato: "",
  Valor: "",
});

(datos.intraCEC?.tiemposQuirurgicos?.registros ?? []).forEach((r:any)=>{
  intraRows.push({
    Seccion: "",
    Hora: r.hora,
    Dato: "Total CEC",
    Valor: r.totalCEC,
  });
});

/* ===== DATOS INTRA CEC ===== */

intraRows.push({
  Seccion: "=== DATOS INTRA CEC ===",
  Hora: "",
  Dato: "",
  Valor: "",
});

(datos.intraCEC?.datosIntraCEC?.registros ?? []).forEach((r:any)=>{
  Object.entries(r.valores ?? {}).forEach(([k,v])=>{
    intraRows.push({
      Seccion:"",
      Hora:r.hora,
      Dato:k,
      Valor:v,
    });
  });
});

/* ===== LABORATORIOS ===== */

intraRows.push({
  Seccion: "=== LABORATORIOS ===",
  Hora: "",
  Dato: "",
  Valor: "",
});

(datos.intraCEC?.laboratorio?.registros ?? []).forEach((r:any)=>{
  Object.entries(r.campos ?? {}).forEach(([k,v])=>{
    intraRows.push({
      Seccion:"",
      Hora:r.hora,
      Dato:k,
      Valor:v,
    });
  });
});

/* ===== BALANCE HÍDRICO ===== */

intraRows.push({
  Seccion: "=== BALANCE HÍDRICO ===",
  Hora: "",
  Dato: "",
  Valor: "",
});

(datos.intraCEC?.balanceHidrico?.registros ?? []).forEach((r:any)=>{
  intraRows.push({
    Seccion:"",
    Hora:r.hora,
    Dato:"Balance",
    Valor:`Ing:${r.ingresos} | Eg:${r.egresos} | Bal:${r.balance}`,
  });
});

/* ===== PDG ===== */

intraRows.push({
  Seccion: "=== PDG ===",
  Hora: "",
  Dato: "",
  Valor: "",
});

((datos.intraCEC as any)?.pdg?.registros ?? []).forEach((r:any)=>{
  Object.entries(r.valores ?? {}).forEach(([k,v])=>{
    intraRows.push({
      Seccion:"",
      Hora:r.hora,
      Dato:k,
      Valor:v,
    });
  });
});

const intraSheet = XLSX.utils.json_to_sheet(intraRows);

XLSX.utils.book_append_sheet(wb,intraSheet,"Intra CEC");
  /* ======================================================
   /* ================= POST CEC ================= */

const postRows: any[] = [];

const lab = datos.postCEC?.laboratorios ?? {};

/* ===== HEMATOLOGÍA ===== */

postRows.push({
  Seccion: "=== HEMATOLOGÍA Y COAGULACIÓN ===",
  Campo: "",
  Valor: "",
});

[
  ["HB", lab.hb],
  ["HTO", lab.hto],
  ["Plaquetas", lab.plaquetas],
  ["Leucocitos", lab.leucocitos],
  ["ACT", lab.act],
].forEach(([campo, valor]) => {
  postRows.push({
    Seccion: "",
    Campo: campo,
    Valor: valor ?? "",
  });
});

/* ===== FUNCIÓN RENAL ===== */

postRows.push({
  Seccion: "=== FUNCIÓN RENAL Y METABÓLICA ===",
  Campo: "",
  Valor: "",
});

[
  ["Urea", lab.urea],
  ["Creatinina", lab.creatinina],
  ["Lactato", lab.lactato],
  ["Glicemia", lab.glicemia],
].forEach(([campo, valor]) => {
  postRows.push({
    Seccion: "",
    Campo: campo,
    Valor: valor ?? "",
  });
});

/* ===== HEPÁTICA Y ELECTROLITOS ===== */

postRows.push({
  Seccion: "=== HEPÁTICA Y ELECTROLITOS ===",
  Campo: "",
  Valor: "",
});

[
  ["TGO", lab.tgo],
  ["TGP", lab.tgp],
  ["BBD", lab.bbd],
  ["BBT", lab.bbt],
  ["Na", lab.na],
  ["K", lab.k],
  ["Ca", lab.ca],
].forEach(([campo, valor]) => {
  postRows.push({
    Seccion: "",
    Campo: campo,
    Valor: valor ?? "",
  });
});

/* ===== GASOMETRÍA ARTERIAL ===== */

postRows.push({
  Seccion: "=== GASOMETRÍA ARTERIAL ===",
  Campo: "",
  Valor: "",
});

[
  ["pH", lab.phA],
  ["PCO2", lab.pco2A],
  ["PO2", lab.po2A],
  ["HCO3", lab.hco3A],
].forEach(([campo, valor]) => {
  postRows.push({
    Seccion: "",
    Campo: campo,
    Valor: valor ?? "",
  });
});

/* ===== GASOMETRÍA VENOSA ===== */

postRows.push({
  Seccion: "=== GASOMETRÍA VENOSA ===",
  Campo: "",
  Valor: "",
});

[
  ["pH", lab.phV],
  ["PCO2", lab.pco2V],
  ["PO2", lab.po2V],
  ["HCO3", lab.hco3V],
].forEach(([campo, valor]) => {
  postRows.push({
    Seccion: "",
    Campo: campo,
    Valor: valor ?? "",
  });
});

/* ===== VIS SCORE ===== */

postRows.push({
  Seccion: "=== VIS SCORE ===",
  Campo: "",
  Valor: "",
});

[
  ["Dopamina", lab.dopamina],
  ["Dobutamina", lab.dobutamina],
  ["Epinefrina", lab.epinefrina],
  ["Norepinefrina", lab.norepinefrina],
  ["Milrinona", lab.milrinona],
  ["Vasopresina", lab.vasopresina],
].forEach(([campo, valor]) => {
  postRows.push({
    Seccion: "",
    Campo: campo,
    Valor: valor ?? "",
  });
});

/* ===== CREAR HOJA ===== */

const postSheet = XLSX.utils.json_to_sheet(postRows);

XLSX.utils.book_append_sheet(
  wb,
  postSheet,
  "Post CEC"
);

  /* ======================================================
     EXPORTAR
  ====================================================== */

  const excelBuffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, "Reporte_Perfusion.xlsx");
}