import Header from "../components/Header";
import React, { useState, useEffect } from "react";
import Bypass from "./Bypass";
import IA from "./IA";
import type { DatosClinicos } from "../types/DatosClinicos";
const ADMIN_UID="ALYj0ATi6OgXyrHwtYWEjyuHdRx1";


interface HomeProps {
  user: string;
  role: string;
  uid: string; // 🔥 NUEVO
  onLogout: () => void;
}

type View = "home" | "bypass" | "ia";

/* ================= DATOS INICIALES ================= */
/* 🔥 IMPORTANTE: fuera del componente */

const datosIniciales: DatosClinicos = {
  fechaProcedimiento: "",
  historiaClinica: "",
  nombreCompleto: "",
  edad: "",
  genero: "",
  grupoSanguineo: "",
  diagnosticoActual: "",
  antecedentes: "",
  tipoCirugia:"",
  prioridadCirugia:"",
  estadoIngreso:"",
  pesoReal: "",
  talla: "",
  imc:"",
  pesoIdeal: "",
  pesoAjustado: "",
  scReal: "",
  scIdeal: "",
  scAjustada: "",
  nutricion: "",

  equipoQuirurgico: {
    cirujanoPrincipal: "",
    cirujanoAsistente: "",
    segundoAsistente: "",
    anestesiologoPrincipal: "",
    segundoAnestesiologo: "",
    perfusionistaPrincipal: "",
    segundoPerfusionista: "",
  },

  laboratoriosPre: {
    hb: "",
    hto: "",
    plaquetas: "",
    actPre: "",
    leucocitos: "",
    tp: "",
    tpt: "",
    glucemia: "",
    hbA1c: "",
    lactato: "",
    creatinina: "",
    urea: "",
    diuresisPre: "",
    tgo: "",
    tgp: "",
    bilirrubinaTotal: "",
    bilirrubinaDirecta: "",
    phA: "",
    paO2: "",
    paCO2: "",
    hco3A: "",
    beA: "",
    saO2: "",
    phV: "",
    pvO2: "",
    pvCO2: "",
    hco3V: "",
    beV: "",
    svO2: "",
    sodio: "",
    potasio: "",
    calcio: "",
    cloro: "",
    magnesio: "",
    fosforo: "",
  },

  ecoHemodinamica: {
    fevi: "",
    vdvi: "",
    vsv: "",
    fc: "",
    pam: "",
    pvc: "",
  },

  escalasRiesgo: {
    trust: {},
    vis: {
      dopamina: "",
      dobutamina: "",
      adrenalina: "",
      milrinona: "",
      noradrenalina: "",
      vasopresina: "",
    },
  },
  checklist: {
    categorias: [
      {
        titulo: "PACIENTE",
        items: [
          { label: "Identidad del paciente confirmada", checked: false },
          { label: "Procedimiento confirmado", checked: false },
          { label: "Tipo sanguíneo y anticuerpos confirmados", checked: false },
          { label: "Alergias comprobadas", checked: false },
          { label: "Número de banco de sangre confirmado", checked: false },
          { label: "Número de historia clínica confirmado", checked: false },
          { label: "Historial revisado", checked: false },
        ],
      },
      {
        titulo: "ESTERILIDAD / LIMPIEZA",
        items: [
          { label: "Componentes con integridad y caducidad verificadas", checked: false },
          { label: "Equipo limpio", checked: false },
          { label: "Intercambiador de calor sin fugas", checked: false },
        ],
      },
      {
        titulo: "BOMBA",
        items: [
          { label: "Oclusiones establecidas", checked: false },
          { label: "Controles de velocidad operativos", checked: false },
          { label: "Flujómetro calibrado y dirección correcta", checked: false },
          { label: "Rodillos giran libremente", checked: false },
          { label: "Rotación suave y silenciosa", checked: false },
          { label: "Soportes seguros", checked: false },
          { label: "Conexiones servoreguladas comprobadas", checked: false },
        ],
      },
      {
        titulo: "ELÉCTRICO",
        items: [
          { label: "Cables de alimentación seguros", checked: false },
          { label: "Baterías cargadas y operativas", checked: false },
        ],
      },
      {
        titulo: "CARDIOPLEJÍA",
        items: [
          { label: "Sistema desburbujeado", checked: false },
          { label: "Sistema sin fugas", checked: false },
          { label: "Soluciones comprobadas", checked: false },
        ],
      },
      {
        titulo: "SUMINISTRO DE GASES",
        items: [
          { label: "Líneas de gas seguras", checked: false },
          { label: "Escape de gas sin obstrucciones", checked: false },
          { label: "Flujómetro/mezclador operativo", checked: false },
          { label: "Mangueras sin fugas", checked: false },
        ],
      },
      {
        titulo: "MECANISMOS DE SEGURIDAD",
        items: [
          { label: "Alarmas activas y audibles", checked: false },
          { label: "Filtro arterial desburbujeado", checked: false },
          { label: "Reservorios ventilados", checked: false },
          { label: "Oclusores calibrados", checked: false },
        ],
      },
      {
        titulo: "MONITORIZACIÓN",
        items: [
          { label: "Sondas de temperatura colocadas", checked: false },
          { label: "Transductores calibrados", checked: false },
          { label: "Analizador de oxígeno calibrado", checked: false },
        ],
      },
      {
        titulo: "ANTICOAGULACIÓN",
        items: [
          { label: "Tiempo y dosis de heparina confirmados", checked: false },
          { label: "Anticoagulación comprobada", checked: false },
        ],
      },
      {
        titulo: "RESPALDO",
        items: [
          { label: "Manivelas disponibles", checked: false },
          { label: "Tanque de oxígeno de respaldo disponible", checked: false },
          { label: "Iluminación de emergencia disponible", checked: false },
          { label: "Hielo disponible", checked: false },
        ],
      },
    ],
  },


  planPerfusion: {
  especificacionesCircuito: {
    tipoCircuito: "",
    bombaPrincipal: "",
    modeloOxigenador: "",
    canulaArterial: "",
    canulaVenosa: "",
    lineaVenosa: "",
    lineaArterial: "",
    flujoPulsatil: "",
  },

  temperaturaEstrategia: "",
  estrategiasAhorro: [],

  flujos: {
    estrategiaPeso: "real",
    indiceCardiaco: 0,
  },

  proteccionMiocardica: {
    peso: "",
    volumen: "",
    tipoSolucion: null,
    viasAdministracion: [],
    dosisMlKg: 20,
    temperatura: "",
  },

  priming: {
    peso: "",
    htoPre: "",
    anestesia: "",
    cardioplejia: "",
    primingItems: {
      lactatoRinger: "",
      salina: "",
      plasmalyte: "",
      polielectrolitica: "",
      gelatina: "",
      albumina: "",
      manitol: "",
      tranexamico: "",
      bicarbonato: "",
      heparina: "",
      magnesio: "",
    },
  },
   terapiaHemoadsorcion:{
 usar:false,
 tipo:""
},
curvaHeparina: {
  peso: "",
  actBasal: "",
  dosisInicialMgKg: "2",
  dosisBomba: "",
  actPostHeparina: "",
  actObjetivo: 480,

  sensibilidadHeparina: "",
  dosisTotalMgKg: "",
  dosisTotalMg: "",
  dosisAdicionalMgKg: "",

  actPostDosisFinal: "",
},

  perfusionSelectiva: {
    pesoCerebral: "",
    factorCerebral: "",
    viaCerebral: "",
    flujoCerebral: "",

    cerebralActiva: false,
    miocardicaActiva: false,
    distalActiva: false,

    flujoMiocardico: "",
    presionMiocardica: "",

    canulaDistal: "",
    flujoDistal: "",
  },
},

  intraCEC: {

  monitorACT: {
    hora: "",
    redosisAdministrada: "",
    registros: [],
  },

  monitorTiempoCEC: "",

  tiemposQuirurgicos: {
      hora: "",
      registros: [],
      ritmoDesclampeo:"",
  juliesDesfibrilacion:"",
  tiempoReperfusion:"",
  hotShot:false,
  temperaturaDesclampeo:"",
      tiempos: {
        cec: { inicio: "", fin: "" },
        clampeo: { inicio: "", fin: "" },
        reperfusion: { inicio: "", fin: "" },
        parada: { inicio: "", fin: "" },
        cerebral: { inicio: "", fin: "" },
        miocardica: { inicio: "", fin: "" },
        distal: { inicio: "", fin: "" },
       evento:{
 hora:"",
 descripcion:"",
 registros:[]
},
      },
    },
    datosIntraCEC: { registros: [] },
laboratorio: {
  hora: "",
campos: {
  // 🔴 HEMO Y METABOLISMO
  hb: null,
  hto: null,
  plaquetas: null,
  act: null,
  lactato: null,
  glicemia: null,

  // ⚡ ELECTROLITOS
sodio: null,
potasio: null,
cloro: null,
calcio: null,

// 🟣 ARTERIAL
phA: null,
pco2Arterial: null,
po2A: null,
satArterial: null,
hco3A: null,
ebA: null,

  // 🔵 VENOSA TEMP ACT
  phVenosoTemp: null,
  pco2VenosoTemp: null,
  po2VenosoTemp: null,
  svO2CalcTemp: null,
  svO2ManualTemp: null,


  // 🔵 VENOSA 37°
  phVenoso37: null,
  pco2Venoso37: null,
  po2Venoso37: null,
  svO2Calc37: null,
 hco3Venoso37: null,
ebVenoso37: null,
},
  registros: [],
},
    parametros: {
      flujo: null,
      superficieCorporal: null,
      sweepGas: null,
      ePCO2: null,
      tempEsofagica: null,
      pam: null,
      presionAtmosferica: null,
      pvc: null,
fio2: null,
tVenosa: null,  
tArterial: null,
qcon: null,
qnox: null,
nirsD: null,
nirsI: null,

      
    },
    
    balanceHidrico: {
  hora: "",
  registros: [],
  ingresos: { Priming: "", Cardioplegia: "" },

  cristaloides: {
    Ringer: "",
    Salina: "",
    Plasmalyte: "",
  },

  coloides: {
    Albumina: "",
    Gelatina: "",
  },

  medicamentos: {
    Heparina: "",
    Manitol: "",
    Bicarbonato: "",
    Tranexámico: "",
    Magnesio: "",
    Potasio: "",
    Calcio: "",
    Furosemida: "",
  },

  hemoderivados: {
    GlobulosRojos: "",
    Plasma: "",
  },

  egresos: {
    Diuresis: "",
    Ultrafiltrado: "",
    Sangrado: "",
    circuito: "",
  },
},
 pdg: {
    registros: [],
  },
},

 postCEC: {
  condicionSalida:"",

  laboratorios: {
    hb: "",
    hto: "",
    plaquetas: "",
    leucocitos: "",
    act: "",

    urea: "",
    creatinina: "",
    lactato: "",
    glicemia: "",

    tgo: "",
    tgp: "",
    bbd: "",
    bbt: "",

    na: "",
    k: "",
    ca: "",

    phA: "",
    pco2A: "",
    po2A: "",
    satA:"",
    hco3A: "",
    ebA: "",

    phV: "",
    pco2V: "",
    po2V: "",
    satV:"",
    hco3V: "",
    ebV: "",

    dopamina: "",
    dobutamina: "",
    epinefrina: "",
    norepinefrina: "",
    milrinona: "",
    vasopresina: "",
  },
},
};

/* ================= COMPONENTE ================= */

export default function Home({
  user,
  role,
  uid,
  onLogout,
}: HomeProps) {

  const [view, setView] =
    useState<View>("home");

  const [datos, setDatos] =
    useState<DatosClinicos>(datosIniciales);

  useEffect(() => {
  console.log("UID actual:", uid);
    if (!uid) return;

    if (uid !== ADMIN_UID) {

      alert(
        "PerfusionLink se encuentra temporalmente en acceso restringido."
      );

      onLogout();

    }

  }, [uid, onLogout]);

   // 🔹 Cargar datos guardados al iniciar
 useEffect(() => {
   if (!uid) return;

  const guardado = localStorage.getItem(`datosClinicos_${uid}`);

  if (guardado) {
    setDatos(JSON.parse(guardado));
  } else {
    setDatos(datosIniciales);
  }
 }, [uid]);

  // 🔹 Guardar cada vez que datos cambien
  useEffect(() => {
   if (!uid) return;

  localStorage.setItem(
    `datosClinicos_${uid}`,
    JSON.stringify(datos)
  );
}, [datos, uid]);
 const resetearCaso = () => {

const confirmar=window.confirm(
"¿Desea finalizar el caso y borrar todos los datos?"
);

if(!confirmar)return;

setDatos(datosIniciales);

/* BORRAR LOCAL STORAGE */

localStorage.removeItem(
`datosClinicos_${uid}`
);

};
if(false && uid!==ADMIN_UID){

return(

<div
style={{
minHeight:"100vh",
background:"#020617",
display:"flex",
justifyContent:"center",
alignItems:"center",
padding:30,
color:"white"
}}
>

<div
style={{
background:"#1e293b",
padding:40,
borderRadius:20,
border:"1px solid #334155",
textAlign:"center",
maxWidth:500
}}
>

<h2 style={{color:"#5eead4"}}>
PerfusionLink
</h2>

<p>
La plataforma se encuentra temporalmente
en acceso restringido.
</p>

<p
style={{
marginTop:15,
fontSize:12,
color:"#94a3b8"
}}
>
Acceso exclusivo para administrador.
</p>

</div>

</div>

)

}
  if (view === "bypass") {
    return (
<Bypass

role={role}

uid={uid}

onBack={() => {

  setView("home");

}}

datos={datos}

setDatos={setDatos}

resetearCaso={resetearCaso}

/>
    );
  }

  if (view === "ia") {
    return <IA onBack={() => setView("home")} />;
  }

  return (

<div
style={{
minHeight:"100vh",
background:"#020617",
display:"flex",
flexDirection:"column"
}}
>

<Header onLogout={onLogout}/>

<div
style={{
padding:"30px 20px",
maxWidth:900,
width:"100%",
margin:"0 auto"
}}
>

{/* BIENVENIDA */}

<div
style={{
marginBottom:40,
display:"flex",
flexDirection:"column",
alignItems:"center",
textAlign:"center"
}}
>

<div
style={{
fontSize:25,
color:"#64748b",
marginBottom:10
}}
>
Bienvenido
</div>

<div
style={{
fontSize:42,
fontWeight:900,
color:"#5eead4"
}}
>
{user}
</div>

<div
style={{
color:"#94a3b8",
marginTop:10
}}
>
Plataforma de gestión de datos y análisis clínico
</div>

</div>


{/* GRID */}

<div style={dashboardGrid}>

<Card
icon="🫀"
title="Gestión Bypass"
onClick={()=>setView("bypass")}
/>

<Card
icon="🧑🏻‍⚕️"
title="Asistente de Perfusión"
onClick={()=>setView("ia")}
/>

</div>

</div>


{/* MENU INFERIOR */}

<div style={bottomBar}>

<div style={bottomItem}>
🏠
<div>Inicio</div>
</div>

<div style={bottomItem}>
📁
<div>Casos</div>
</div>

<div style={bottomItem}>
⭐
<div>Favoritos</div>
</div>

<div style={bottomItem}>
🚨
<div>Alertas</div>
</div>

</div>

</div>
);

}

/* ================= CARD ================= */

function Card({
icon,
title,
onClick
}:{
icon:string
title:string
onClick?:()=>void
}){

return(

<div
onClick={onClick}
style={cardStyle}
>

<div
style={{

width:"clamp(70px,8vw,85px)",

height:"clamp(70px,8vw,85px)",

borderRadius:"24px",

background:"rgba(255,255,255,.05)",

display:"flex",

alignItems:"center",

justifyContent:"center",

fontSize:"clamp(36px,5vw,48px)"
}}
>

{icon}

</div>

<div
style={{

fontSize:"clamp(18px,3vw,28px)",

fontWeight:500,

color:"white",

textAlign:"center"

}}
>
{title}
</div>

</div>

)

}
const dashboardGrid:React.CSSProperties={

display:"grid",

gridTemplateColumns:
"repeat(auto-fit,minmax(280px,1fr))",

justifyContent:"center",

gap:"25px",

maxWidth:"750px",

margin:"40px auto",

padding:"0 20px"

}


const cardStyle:React.CSSProperties={

width:"100%",

minHeight:"250px",

background:
"linear-gradient(135deg,#020617,#0f172a)",

border:"1px solid #5eead430",

borderRadius:"30px",

padding:"25px",

display:"flex",

flexDirection:"column",

justifyContent:"center",

alignItems:"center",

gap:"30px",

cursor:"pointer",

boxShadow:
"0 15px 30px rgba(0,0,0,.35)"

}


const bottomBar={

position:"fixed" as const,

bottom:0,

left:0,

right:0,

height:80,

background: "#020617",

display:"flex",

justifyContent:"space-around",

alignItems:"center",

boxShadow:
"0 -4px 20px rgba(0,0,0,.1)"

}


const bottomItem:React.CSSProperties={

display:"flex",

flexDirection:"column",

alignItems:"center",

fontSize:12,

fontWeight:700,

color:"#5eead4",

gap:5
}