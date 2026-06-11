import { useState, useEffect } from "react";
import type { DatosClinicos } from "../types/DatosClinicos";
import Paciente from "./Paciente";
import PlanPerfusion from "./PlanPerfusion";
import CheckList from "./CheckList";
import IntraCEC from "./IntraCEC";
import PostCEC from "./PostCEC";

/* ================= TIPOS ================= */

type Section =
  | "menu"
  | "paciente"
  | "plan"
  | "checklist"
  | "intra"
  | "post";

interface BypassProps {
  onBack: () => void;
  datos: DatosClinicos;
  setDatos: React.Dispatch<React.SetStateAction<DatosClinicos>>;
  role: string;
  uid: string;
  resetearCaso: () => void;
}

/* ================= COMPONENTE ================= */

export default function Bypass({
  onBack,
  datos,
  setDatos,
  uid,
  role,
  resetearCaso  
}: BypassProps) {
  const [section, setSection] = useState<Section>("menu");

  /* ================= CARGA SEGURA DESDE LOCALSTORAGE ================= */

  useEffect(() => {
const datosGuardados = localStorage.getItem(`datosBypass_${uid}`);

  if (datosGuardados) {
    try {
      const parsed = JSON.parse(datosGuardados);

      setDatos((prev) => ({
        ...prev,
        ...parsed,

        intraCEC: {
          ...prev.intraCEC,
          ...(parsed.intraCEC || {}),

          balanceHidrico: {
            ...prev.intraCEC.balanceHidrico,
            ...(parsed.intraCEC?.balanceHidrico || {}),
          },
        },

        planPerfusion: {
          ...prev.planPerfusion,
          ...(parsed.planPerfusion || {}),

          especificacionesCircuito: {
            ...prev.planPerfusion.especificacionesCircuito,
            ...(parsed.planPerfusion?.especificacionesCircuito || {}),
          },

          flujos: {
            ...prev.planPerfusion.flujos,
            ...(parsed.planPerfusion?.flujos || {}),
          },

          proteccionMiocardica: {
            ...prev.planPerfusion.proteccionMiocardica,
            ...(parsed.planPerfusion?.proteccionMiocardica || {}),
          },

          priming: {
            ...prev.planPerfusion.priming,
            ...(parsed.planPerfusion?.priming || {}),
          },
        },
      }));
    } catch (error) {
      console.error("Error leyendo localStorage", error);
    }
  }
}, [uid, setDatos]);

  /* ================= GUARDADO AUTOMÁTICO ================= */

  useEffect(() => {
    localStorage.setItem(`datosBypass_${uid}`, JSON.stringify(datos));
  }, [datos]);

  /* ================= ORDEN SECCIONES ================= */

  const ordenSecciones: Section[] = [
    "paciente",
    "plan",
    "checklist",
    "intra",
    "post",
  ];

  const indiceActual = ordenSecciones.indexOf(section);

  const siguienteSeccion = () => {
    if (indiceActual >= 0 && indiceActual < ordenSecciones.length - 1) {
      setSection(ordenSecciones[indiceActual + 1]);
    }
  };

  const volverSeccion = () => {
    if (indiceActual > 0) {
      setSection(ordenSecciones[indiceActual - 1]);
    }
  };

  /* ================= RENDER SECCIONES ================= */

  if (section === "paciente") {
    return (
      <>
        <Paciente
  role={role}
  onBack={() => setSection("menu")}
  datos={datos}
  setDatos={setDatos}
/>
        <BotonesNavegacion onSiguiente={siguienteSeccion} ocultarVolver />
      </>
    );
  }

  if (section === "plan") {
    return (
      <>
        <PlanPerfusion
          onBack={() => setSection("menu")}
          datos={datos}
          setDatos={setDatos}
        />
        <BotonesNavegacion
          onSiguiente={siguienteSeccion}
          onVolver={volverSeccion}
        />
      </>
    );
  }

  if (section === "checklist") {
    return (
      <>
        <div className="min-h-screen bg-slate-950 text-white p-6">
          <CheckList
            onBack={() => setSection("menu")}
            datos={datos}
            setDatos={setDatos}
          />
        </div>
        <BotonesNavegacion
          onSiguiente={siguienteSeccion}
          onVolver={volverSeccion}
        />
      </>
    );
  }

  if (section === "intra") {
    return (
      <>
        <IntraCEC
          onBack={() => setSection("menu")}
          datos={datos}
          setDatos={setDatos}
        />
        <BotonesNavegacion
          onSiguiente={siguienteSeccion}
          onVolver={volverSeccion}
        />
      </>
    );
  }

  if (section === "post") {
  return (
    <>
        <PostCEC

  role={role}

  onBack={() => setSection("menu")}

  datos={datos}

  setDatos={setDatos}

  resetearCaso={resetearCaso}

/>
        <BotonesNavegacion
          onVolver={volverSeccion}
          ocultarSiguiente
        />
      </>
    );
  }

  /* ================= MENÚ PRINCIPAL ================= */

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        padding: 48,
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          padding: "0 clamp(16px, 4vw, 40px)",
          boxSizing: "border-box",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: "none",
            color: "#5eead4",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ← Volver a Inicio
        </button>

       <h1
style={{
fontSize:28,
fontWeight:800,
textAlign:"center",
flex:1
}}
>
          Gestión de Bypass
        </h1>
      </div>

     <div
style={{

display:"grid",

gridTemplateColumns:
"repeat(auto-fit,minmax(280px,1fr))",

justifyContent:"center",

gap:"25px",

maxWidth:"900px",

margin:"60px auto 100px auto",

padding:"0 20px"

}}
>
        <BypassCard title="PACIENTE" icon="📋" color="#60a5fa" onClick={() => setSection("paciente")} />
        <BypassCard title="PLAN DE PERFUSIÓN" icon="🎯" color="#5eead4" onClick={() => setSection("plan")} />
        <BypassCard title="CHECK-LIST" icon="✅" color="#facc15" onClick={() => setSection("checklist")} />
        <BypassCard title="INTRA-CEC" icon="🫀" color="#c084fc" onClick={() => setSection("intra")} />
        <BypassCard title="POST-CEC" icon="📄" color="#fb7185" onClick={() => setSection("post")} />
      </div>
    </div>
  );
}

/* ================= BOTONES ================= */

function BotonesNavegacion({
  onSiguiente,
  onVolver,
  ocultarSiguiente,
  ocultarVolver,
}: any) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 12,
        padding: "20px clamp(16px,4vw,40px)",
        background: "#020617",
      }}
    >
      {!ocultarVolver && onVolver && (
        <button style={botonSecundario} onClick={onVolver}>
          ← Volver
        </button>
      )}

      {!ocultarSiguiente && onSiguiente && (
        <button style={botonPrimario} onClick={onSiguiente}>
          Siguiente sección →
        </button>
      )}
    </div>
  );
}

function BypassCard({
title,
icon,
color,
onClick
}:any){

return(

<div
onClick={onClick}

style={{

width:"100%",
minHeight:"260px",

background:"#0f172a",

borderRadius:"32px",

padding:"25px",

cursor:"pointer",

display:"flex",

flexDirection:"column",

justifyContent:"center",

boxShadow:
"0 10px 30px rgba(0,0,0,.35)",

border:`1px solid ${color}30`
}}
>

<div
style={{

display:"flex",

justifyContent:"center",

marginTop:"15px"
}}
>

<div
style={{

width:"clamp(70px,8vw,80px)",

height:"clamp(70px,8vw,80px)",

borderRadius:24,

background:"rgba(255,255,255,.05)",

display:"flex",

alignItems:"center",

justifyContent:"center",

fontSize:"clamp(36px,5vw,45px)"
}}
>

{icon}

</div>

</div>


<div
style={{

display:"flex",

flexDirection:"column",

alignItems:"center",

justifyContent:"center",

textAlign:"center",

width:"100%"
}}
>

<div
style={{

fontSize:"clamp(16px,2vw,20px)",

fontWeight:900,

color,

letterSpacing:1,

textAlign:"center"
}}
>
{title}
</div>

<div
style={{

marginTop:15,

fontSize:"clamp(14px,1.8vw,16px)",

color:"#94a3b8",

textAlign:"center"
}}
>
Acceder a sección
</div>

</div>

</div>

)

}

const botonPrimario: React.CSSProperties = {
  background: "#5eead4",
  border: "none",
  borderRadius: 12,
  padding: "10px 18px",
  fontWeight: 700,
  cursor: "pointer",
  color: "#020617",
};

const botonSecundario: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #334155",
  borderRadius: 12,
  padding: "10px 18px",
  fontWeight: 700,
  cursor: "pointer",
  color: "#94a3b8",
};