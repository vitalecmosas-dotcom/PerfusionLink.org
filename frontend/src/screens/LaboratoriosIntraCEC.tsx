import {
  TestTube,
  FlaskConical,
} from "lucide-react";
import React, { useEffect } from "react";
import type { DatosClinicos } from "../types/DatosClinicos";
import type { Dispatch, SetStateAction } from "react";
import IntraCECRegistroBar from "./IntraCECRegistroBar";
import DeleteIcon from "./DeleteIcon";

interface LaboratoriosIntraCECProps {
  datos: DatosClinicos;
  setDatos: Dispatch<SetStateAction<DatosClinicos>>;
}

export default function LaboratoriosIntraCEC({
  datos,
  setDatos,
}: LaboratoriosIntraCECProps) {

  const laboratorio = datos.intraCEC.laboratorio;
  const campos = laboratorio.campos;
  const registros = laboratorio.registros;
  const hora = laboratorio.hora;

const tempEsofagica =
datos.intraCEC.parametros.tempEsofagica;

const tempVenosa =
datos.intraCEC.parametros.tVenosa;

const tempArterial =
datos.intraCEC.parametros.tArterial;

const temperaturaCalculo=

tempVenosa ??

tempArterial ??

tempEsofagica ??

null;

  /* ================= HELPERS ================= */

 const getCampo = (
  key: keyof typeof campos
): number | null => {
  return campos[key] ?? null;
};

const setCampo = (
  key: keyof typeof campos,
  value: number | null
) => {
  setDatos(prev => ({
    ...prev,
    intraCEC: {
      ...prev.intraCEC,
      laboratorio: {
        ...prev.intraCEC.laboratorio,
        campos: {
          ...prev.intraCEC.laboratorio.campos,
          [key]: value,
        },
      },
    },
  }));
};

  const setHora = (value: string) => {
    setDatos(prev => ({
      ...prev,
      intraCEC: {
        ...prev.intraCEC,
        laboratorio: {
          ...prev.intraCEC.laboratorio,
          hora: value,
        },
      },
    }));
  };
/* ================= CORRECCIONES ================= */

const pesoPaciente =
  Number(datos.pesoReal || 0);

const ebActual =
  getCampo("ebA") || 0;

const sodioActual =
  getCampo("sodio") || 0;

const potasioActual =
  getCampo("potasio") || 0;

/* ===== BICARBONATO ===== */

const bicarbonatoRequerido =
  ebActual < 0
    ? Math.abs(
        ebActual *
        0.3 *
        pesoPaciente
      ).toFixed(1)
    : "0";

/* ===== POTASIO ===== */

const potasioRequerido =
  potasioActual > 0 &&
  potasioActual < 4

    ? (
        0.2 *
        pesoPaciente *
        (4 - potasioActual)
      ).toFixed(1)

    : "0";

/* ===== SODIO ===== */

const sodioRequerido =
  sodioActual > 0 &&
  sodioActual < 140

    ? (
        0.2 *
        pesoPaciente *
        (140 - sodioActual)
      ).toFixed(1)

    : "0";
  /* ================= SvO2 TEMP ACT ================= */

const calcularSvO2=(
po2:number,
ph:number,
temp:number,
pco2:number
):number|null=>{

if(
po2<=0 ||
ph<=0 ||
temp<=0 ||
pco2<=0
){
return null;
}

const P50corr=

26.6 *

Math.pow(
1.04,
temp-37
)

*

Math.pow(
10,
0.48*(7.4-ph)
)

*

Math.pow(
pco2/40,
0.06
);

const n=2.7;

const svo2=

(
Math.pow(po2,n)

/

(
Math.pow(po2,n)

+

Math.pow(
P50corr,
n
)

)

)

*100;

return Number.isFinite(
svo2
)

?Number(
svo2.toFixed(1)
)

:null;

};

const svCalcTemp=

getCampo(
"phVenosoTemp"
)!==null &&

getCampo(
"po2VenosoTemp"
)!==null &&

getCampo(
"pco2VenosoTemp"
)!==null &&

temperaturaCalculo!==null

? calcularSvO2(

getCampo(
"po2VenosoTemp"
)!,

getCampo(
"phVenosoTemp"
)!,

temperaturaCalculo,

getCampo(
"pco2VenosoTemp"
)!

)

:null;

  useEffect(() => {
    if (svCalcTemp !== null) {
      setCampo("svO2CalcTemp", svCalcTemp);
    }
  }, [svCalcTemp]);

  /* ================= REGISTROS ================= */

  const eliminarRegistro = (index: number) => {
    setDatos(prev => ({
      ...prev,
      intraCEC: {
        ...prev.intraCEC,
        laboratorio: {
          ...prev.intraCEC.laboratorio,
          registros:
            prev.intraCEC.laboratorio.registros.filter(
              (_, i) => i !== index
            ),
        },
      },
    }));
  };

  const handleAgregar = () => {
    setDatos(prev => ({
      ...prev,
      intraCEC: {
        ...prev.intraCEC,
        laboratorio: {
          ...prev.intraCEC.laboratorio,
          registros: [
            ...prev.intraCEC.laboratorio.registros,
            {
              hora,
              campos: {
                ...prev.intraCEC.laboratorio.campos,
              },
            },
          ],
        },
      },
    }));
  };

  /* ================= RENDER ================= */

  return (
  <div style={card}>
    <div style={header}>
  <TestTube size={36} />

  <div style={{ display: "flex", flexDirection: "column" }}>
    <span>Laboratorios Intra-CEC</span>

    <span
      style={{
        fontSize: 10,
        fontWeight: 400,
        color: "white",
        marginTop: 4,
        lineHeight: 1.8,
        opacity: 0.85,
      }}
    >
      (En caso de no contar con monitoreo venoso en línea usar la PO₂ a la
      temperatura actual para calcular la saturación venosa. Si cuenta con
      saturación venosa en línea no colocar PO₂, solo colocar la SvO2 en venosa temp. act.)
    </span>
  </div>
</div>

      <hr style={{ margin: "20px 0", borderColor: "#1e293b" }} />

      <div style={grid}>
        <Section title="HEMO Y METABOLISMO" color="#fb7185">
          <Field label="HB (g/dL)" value={getCampo("hb")} onChange={(v)=>setCampo("hb",v)} />
          <Field label="HTO (%)" value={getCampo("hto")} onChange={(v)=>setCampo("hto",v)} />
          <Field label="Plaquetas" value={getCampo("plaquetas")} onChange={(v)=>setCampo("plaquetas",v)} />
          <Field label="ACT (seg)" value={getCampo("act")} onChange={(v)=>setCampo("act",v)} />
          <Field label="Lactato" value={getCampo("lactato")} onChange={(v)=>setCampo("lactato",v)} />
          <Field label="Glicemia" value={getCampo("glicemia")} onChange={(v)=>setCampo("glicemia",v)} />
        </Section>

        <Section title="ARTERIAL" color="#a78bfa">
          <Field label="pH" value={getCampo("phA")} onChange={(v)=>setCampo("phA",v)} />
          <Field label="PCO₂" value={getCampo("pco2Arterial")} onChange={(v)=>setCampo("pco2Arterial",v)} />
          <Field label="PO₂" value={getCampo("po2A")} onChange={(v)=>setCampo("po2A",v)} />
          <Field label="Sat. (%)" value={getCampo("satArterial")} onChange={(v)=>setCampo("satArterial",v)} />
          <Field label="hco3A" value={getCampo("hco3A")} onChange={(v)=>setCampo("hco3A",v)} />
          <Field label="EB" value={getCampo("ebA")} onChange={(v)=>setCampo("ebA",v)} />
        </Section>

        <Section title="VENOSA TEMP ACT" color="#818cf8">
          <Field label="pH" value={getCampo("phVenosoTemp")} onChange={(v)=>setCampo("phVenosoTemp",v)} />
          <Field label="PCO₂" value={getCampo("pco2VenosoTemp")} onChange={(v)=>setCampo("pco2VenosoTemp",v)} />
          <Field label="PO₂" value={getCampo("po2VenosoTemp")} onChange={(v)=>setCampo("po2VenosoTemp",v)} />
          <CalculatedField label="SvO₂ (calc)" value={svCalcTemp} />

          <div
style={{
fontSize:10,
color:"#94a3b8",
marginTop:4
}}
>

Temp usada:

{

tempVenosa
? `Venosa ${tempVenosa}°C`

: tempArterial
? `Arterial ${tempArterial}°C`

: tempEsofagica
? `Esofágica ${tempEsofagica}°C`

: "No disponible"

}

</div>
          <Field label="SvO₂ (manual)" value={getCampo("svO2ManualTemp")} onChange={(v)=>setCampo("svO2ManualTemp",v)} />
        </Section>

        <Section title="VENOSA A 37" color="#818cf8">
          <Field label="pH" value={getCampo("phVenoso37")} onChange={(v)=>setCampo("phVenoso37",v)} />
          <Field label="PCO₂" value={getCampo("pco2Venoso37")} onChange={(v)=>setCampo("pco2Venoso37",v)} />
          <Field label="PO₂" value={getCampo("po2Venoso37")} onChange={(v)=>setCampo("po2Venoso37",v)} />
          <Field label="SvO₂" value={getCampo("svO2Calc37")} onChange={(v)=>setCampo("svO2Calc37",v)} />
          <Field label="HCO3" value={getCampo("hco3Venoso37")} onChange={(v)=>setCampo("hco3Venoso37",v)} />
          <Field label="EB" value={getCampo("ebVenoso37")} onChange={(v)=>setCampo("ebVenoso37",v)} />
        </Section>

        <Section title="ELECTROLITOS" color="#38bdf8">
  <Field label="Na⁺" value={getCampo("sodio")} onChange={(v)=>setCampo("sodio",v)} />
  <Field label="K⁺" value={getCampo("potasio")} onChange={(v)=>setCampo("potasio",v)} />
  <Field label="Cl⁻" value={getCampo("cloro")} onChange={(v)=>setCampo("cloro",v)} />
  <Field label="Ca²⁺" value={getCampo("calcio")} onChange={(v)=>setCampo("calcio",v)} />
</Section>
<Section
  title="CORRECCIONES"
  color="#f59e0b"
>

  <CalculatedField
    label="NaHCO₃ requerido (mmol)"
    value={Number(
      bicarbonatoRequerido
    )}
  />

  <CalculatedField
    label="K⁺ requerido (mEq)"
    value={Number(
      potasioRequerido
    )}
  />

  <CalculatedField
    label="Na⁺ requerido (mEq)"
    value={Number(
      sodioRequerido
    )}
  />

  <div
    style={{
      gridColumn: "1 / -1",
      fontSize: 10,
      color: "#94a3b8",
      marginTop: 8,
      lineHeight: 1.5,
    }}
  >
    Bicarbonato:
    BE × 0.3 × Kg

    <br />

    Potasio:
    0.2 × Kg × (4 - K actual)

    <br />

    Sodio:
    0.2 × Kg × (140 - Na actual)
  </div>

</Section>
      </div>

            <IntraCECRegistroBar
        hora={hora}
        setHora={setHora}
        onAgregar={handleAgregar}
      />

      {registros.map((r, i) => (
  <div key={i} style={registroRow}>
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontWeight: 700, color: "#5eead4" }}>
        {r.hora}
      </span>

      <span style={{ fontSize: 12, color: "#94a3b8" }}>
        {Object.entries(r.campos)
          .filter(([_, v]) => v !== null)
          .map(([k, v]) => `${k}: ${v}`)
          .join(" | ")}
      </span>
    </div>

    <DeleteIcon onClick={() => eliminarRegistro(i)} />
  </div>
))}

    </div>
  );
}

/* ================= SUB COMPONENTES ================= */

function Section({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ ...subCard, borderColor: `${color}40` }}>
      <div style={{ ...subHeader, color }}>
        <FlaskConical size={16} />
        {title}
      </div>
      <div style={fieldsGrid}>{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <div style={field}>
      <span style={labelStyle}>{label}</span>
      <input
        type="number"
        value={value ?? ""}
        onChange={(e)=>
          onChange(
            e.target.value === ""
              ? null
              : Number(e.target.value)
          )
        }
        style={input}
      />
    </div>
  );
}

function CalculatedField({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) {
  return (
    <div style={field}>
      <span style={labelStyle}>{label}</span>
      <input
        disabled
        value={value ?? "--"}
        style={{ ...input, fontWeight: 800, color: "#5eead4" }}
      />
    </div>
  );
}

/* ================= ESTILOS ================= */

const card = {
  background: "#1e293b",
  borderRadius: 20,
  padding: 24,
  border: "1px solid #334155",
};

const header = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  fontWeight: 800,
  fontSize: 18,
  color: "#5eead4",
  marginBottom: 24,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 24,
};

const subCard = {
  background: "#020617",
  borderRadius: 18,
  padding: 20,
  border: "1px solid",
};

const subHeader = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontWeight: 800,
  fontSize: 12,
  letterSpacing: 1,
  marginBottom: 18,
};

const fieldsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 14,
};

const field = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 6,
};

const labelStyle = {
  fontSize: 11,
  color: "#94a3b8",
};

const input = {
  background: "#020617",
  border: "1px solid #334155",
  borderRadius: 8,
  padding: "6px 8px",
  color: "white",
  width: 100,
  textAlign: "center" as const,
};


const registroRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#020617",
  border: "1px solid #334155",
  borderRadius: 12,
  padding: "10px 18px",
  marginTop: 12,
};
