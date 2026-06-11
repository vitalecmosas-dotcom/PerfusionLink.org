import { Brain } from "lucide-react";
import { useState } from "react";
import type { CSSProperties } from "react";

/* ================= PROPS ================= */

interface AnalisisIAProps {
  registrosIntraCEC?: {
    hora: string;
    valores: Record<string, string>;
  }[];

  registrosLaboratorio?: {
    hora: string;
    campos: Record<string, any>;
  }[];

  registrosPDG?: {
    hora: string;
    valores: Record<string, string>;
  }[];
}

/* ================= COMPONENTE ================= */

export default function AnalisisIAIntraCEC({
  registrosIntraCEC = [],
  registrosLaboratorio = [],
  registrosPDG = [],
}: AnalisisIAProps) {

  const [analisis, setAnalisis] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= PROMPT CLÍNICO ================= */

  const construirContextoClinico = () => {

    return `

Actúa como PERFUSIONISTA CARDIOVASCULAR SENIOR experto en:

AMSECT
ELSO
Goal Directed Perfusion
Perfusion Journal
PubMed
Circulación extracorpórea
Monitorización metabólica
Fisiología cardiovascular
Perfusión guiada por objetivos


NO INVENTES DATOS.

Analiza exclusivamente datos recibidos.

Si falta información dilo explícitamente.


================================================
REGISTROS INTRA CEC
================================================

${registrosIntraCEC.map((r,i)=>`

REGISTRO ${i+1}

Hora: ${r.hora}

${Object.entries(r.valores)
.map(([k,v])=>`${k}: ${v}`)
.join("\n")}

`).join("\n")}


================================================
LABORATORIOS
================================================

${registrosLaboratorio.map((r,i)=>`

LAB ${i+1}

Hora:${r.hora}

${Object.entries(r.campos)
.map(([k,v])=>`${k}: ${v ?? "N/D"}`)
.join("\n")}

`).join("\n")}


================================================
PDG
================================================

${registrosPDG.map((r,i)=>`

PDG ${i+1}

Hora:${r.hora}

${Object.entries(r.valores)
.map(([k,v])=>`${k}: ${v}`)
.join("\n")}

`).join("\n")}


================================================
ANÁLISIS OBLIGATORIO
================================================

Realiza análisis INTEGRADO utilizando:

FLUJO:

Flujo bomba

Índice cardíaco

PAM

PVC

QCON

QNOX

IRVS


TEMPERATURA:

Temperatura esofágica

Temperatura arterial

Temperatura venosa


GASES ARTERIALES:

pH arterial

PO2 arterial

PCO2 arterial

Sat arterial

HCO3 arterial

EB arterial


GASES VENOSOS TEMPERATURA ACTUAL:

pH venoso actual

PCO2 venoso actual

PO2 venoso actual

SvO2 calculada actual

SvO2 manual actual


GASES VENOSOS CORREGIDOS A 37°C:

pH venoso 37

PCO2 venoso 37

PO2 venoso 37

SvO2 37

HCO3 venoso 37

EB venoso 37


PERFUSIÓN GUIADA POR OBJETIVOS:

DO2i

VO2i

OER

ERO2

DO2 crítico

VCO2

VCO2/DO2

VCO2/VO2

ePCO2

ΔPCO2

CaO2

CvO2

SvO2

IRVS


LABORATORIOS:

Hb

Hto

Lactato

Sodio

Potasio

Calcio

Cloro


================================================
INSTRUCCIONES IMPORTANTES
================================================

NO omitas ninguna variable disponible.

Debes analizar TODAS las variables PDG individualmente.

Si un valor existe debes mencionarlo explícitamente.

Nunca omitir:

DO2i

VO2i

OER

ERO2

VCO2i

DO2i/VCO2i

VCO2i/VO2i

ePCO2

ΔPCO2

QCON

QNOX

IRVS

CaO2

CvO2

SvO2

DO2 crítico


================================================
ANÁLISIS AVANZADO PDG OBLIGATORIO
================================================

DO2i:

Indicar valor exacto.

Interpretar si está:

insuficiente

óptimo

supranormal

Relacionar con:

Hb

Hto

Flujo

Índice cardíaco

PAM

Temperatura


VO2i:

Indicar valor exacto.

Explicar requerimiento metabólico.

Relacionarlo con:

temperatura

reperfusión

estado inflamatorio


OER:

Indicar valor exacto.

Interpretar compensación metabólica.

Relacionar con:

SvO2

lactato

DO2


ERO2:

Analizar extracción tisular.

Explicar significado fisiológico.


VCO2:

Indicar valor exacto.

Explicar producción metabólica de CO2.

Relacionar con:

temperatura

VO2

metabolismo

estado inflamatorio

perfusión


VCO2/DO2:

Indicar valor exacto.

Interpretar:

<0.8 adecuado

0.8–1 vigilancia

>1 metabolismo anaerobio probable

Explicar fisiología.


VCO2/VO2:

Indicar valor exacto.

Relacionar:

lactato

DO2

VO2

SvO2

extracción O2

Explicar desacople metabólico.


ΔPCO2:

Indicar valor exacto.

Interpretar:

<6 adecuado

6–8 vigilancia

>8 hipoperfusión probable

Relacionar con:

flujo efectivo

microcirculación

estado perfusional


ePCO2:

Indicar valor exacto.

Relacionar con:

Sweep

eliminación CO2

oxigenador


IRVS:

Relacionar:

PAM

flujo

vasoplejia

respuesta inflamatoria


QCON:

Explicar entrega convectiva.

Relacionarlo con flujo.


QNOX:

Explicar capacidad oxigenadora.

Relacionarlo con:

PO2

SatO2

DO2


CaO2:

Relacionar:

Hb

PO2

Sat arterial


CvO2:

Relacionar:

SvO2

extracción

VO2


SvO2:

Comparar:

temperatura actual

temperatura corregida 37°

Explicar implicaciones fisiológicas.


================================================
RELACIONES OBLIGATORIAS
================================================

Relacionar SIEMPRE:

DO2i + Hb + Hto + Flujo

VO2 + Temperatura

Lactato + OER + SvO2

VCO2 + ΔPCO2

ePCO2 + Sweep

IRVS + PAM

CaO2 + PO2 + Hb

QCON + flujo

QNOX + oxigenación

SvO2 actual vs SvO2 37°

VCO2/DO2 + lactato

VCO2/VO2 + metabolismo anaerobio


NO decir:

"normal"

"adecuado"

"estable"

sin explicación fisiológica.


Debes explicar:

qué significa

por qué ocurre

implicación clínica

riesgo potencial


NO describir datos uno por uno.

Interpretar tendencias.

Ejemplo:

"El incremento progresivo de lactato junto con aumento de VCO2/DO2 puede sugerir metabolismo anaerobio temprano pese a SvO2 conservada."

"Una ΔPCO2 elevada puede indicar alteración microcirculatoria incluso con DO2 aparentemente suficiente."

"El desacople entre VO2 y VCO2 puede sugerir alteración metabólica."


================================================
FORMATO OBLIGATORIO
================================================

Debes completar TODAS las secciones.

NO puedes omitir ninguna sección.

Si una sección tiene datos insuficientes debes escribir:

"Información insuficiente para análisis completo"

pero la sección debe aparecer.


Texto plano.

Sin markdown.

Sin asteriscos.

Sin listas.

Sin viñetas.


RESUMEN CLÍNICO:

ANÁLISIS HEMODINÁMICO:

ANÁLISIS TISULAR:

En esta sección analizar obligatoriamente:

DO2i

VO2i

SvO2 actual

SvO2 37°

OER

ERO2

Lactato

Hb

Hto

VCO2

VCO2/DO2

VCO2/VO2

ΔPCO2

microcirculación

extracción tisular

desacople DO2/VO2

riesgo anaerobio

perfusión regional


Explicar si existe:

hipoperfusión oculta

alteración microcirculatoria

consumo aumentado

problema distributivo

desacople metabólico


ANÁLISIS METABÓLICO:

ANÁLISIS GASOMÉTRICO:

ANÁLISIS AVANZADO PDG:

ANÁLISIS TEMPERATURA ACTUAL:

ANÁLISIS CORREGIDO A 37°C:

RELACIÓN ENTRE VARIABLES:

TENDENCIAS:

ALERTAS:

RECOMENDACIONES:


Cada sección debe contener mínimo 4–6 líneas.

No terminar el análisis hasta completar TODAS las secciones.

No resumir.

Mínimo 1000 palabras.


Finalizar EXACTAMENTE con:

Análisis generado por IA. No sustituye criterio clínico del perfusionista responsable.
`;
  };

  /* ================= GENERAR IA ================= */

  const generarAnalisis = async () => {

    if (
      registrosPDG.length === 0 &&
      registrosLaboratorio.length === 0 &&
      registrosIntraCEC.length === 0
    ) {
      setAnalisis(
        "No hay registros disponibles para analizar."
      );
      return;
    }

    setLoading(true);
    setAnalisis("");

    const prompt = construirContextoClinico();

    try {

      const res = await fetch(
        "https://us-central1-gemini-backend-eliana-62ea3.cloudfunctions.net/geminiChat",
        {
          method: "POST",

          headers: {
            "Content-Type":"application/json",
          },

          body: JSON.stringify({
            tipo:"analisis_intra_cec",
            prompt,
          }),
        }
      );

      const data = await res.json();

      setAnalisis(
        data.response ??
        "No se pudo generar el análisis."
      );

    } catch {

      setAnalisis(
        "Error al generar análisis IA."
      );

    } finally {

      setLoading(false);

    }

  };

  /* ================= RENDER ================= */

  return (

    <div style={card}>

      <div style={header}>
        <Brain size={20}/>
        Análisis IA
      </div>

      <hr
        style={{
          margin:"20px 0",
          borderColor:"#1e293b"
        }}
      />

      <div
        style={{
          display:"flex",
          justifyContent:"flex-end"
        }}
      >

        <button
          onClick={generarAnalisis}
          style={buttonStyle}
        >

          {
            loading
            ? "Analizando..."
            : "Generar análisis"
          }

        </button>

      </div>

      {analisis && (

        <div style={resultado}>
          {analisis}
        </div>

      )}

    </div>

  );
}

/* ================= ESTILOS ================= */

const card:CSSProperties={
  background:"#1e293b",
  borderRadius:20,
  padding:24,
  border:"1px solid #334155",
  marginTop:20,
};

const header:CSSProperties={
  display:"flex",
  alignItems:"center",
  gap:10,
  fontWeight:800,
  fontSize:18,
  color:"#5eead4",
};

const buttonStyle:CSSProperties={
  background:"#020617",
  border:"1px solid #334155",
  borderRadius:10,
  padding:"8px 14px",
  color:"#5eead4",
  fontWeight:700,
  fontSize:16,
  cursor:"pointer",
};

const resultado:CSSProperties={
  background:"#020617",
  border:"1px solid #334155",
  borderRadius:14,
  padding:16,
  marginTop:16,
  color:"#cbd5f5",
  whiteSpace:"pre-wrap",
};