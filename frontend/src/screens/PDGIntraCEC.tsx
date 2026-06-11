import { Target} from "lucide-react";
import { useState } from "react";
import type { DatosClinicos } from "../types/DatosClinicos";
import type { Dispatch, SetStateAction } from "react";
import IntraCECRegistroBar from "../screens/IntraCECRegistroBar";
import DeleteIcon from "./DeleteIcon";

/* ================= VALORES NORMALES ================= */

const valoresNormales: Record<string, string> = {
  "CaO₂": "🎯VN.16–22",
  "CvO₂": "🎯VN.12–16",
  "Δ A-V O₂": "🎯VN.4–6",
  "DO₂i": "🎯VN.272–300 ml/min/m²",
  "VO₂i": "🎯VN.<60 ml/min/m²",
  "DO₂i / VO₂i": "🎯VN.>5",
  "VO₂i / DO₂i": "🎯VN.0.2–0.3",
  "VCO₂i": "🎯VN.<60 ml/min/m²",
  "DO₂i / VCO₂i": "🎯VN.>5",
  "VCO₂i / VO₂i": "🎯VN.0.8–1",
  "Δ V-A CO₂": "🎯VN.<6",
};

/* ================= PROPS ================= */

interface PDGIntraCECProps {
  datos: DatosClinicos;
  setDatos: Dispatch<SetStateAction<DatosClinicos>>;

  hb: number | null;
  satArterial: number | null;
  flujo: number | null;
  superficieCorporal: number | null;
  sweepGas: number | null;
  ePCO2: number | null;
  presionAtmosferica: number | null;

  pco2Arterial?: number | null;

  svO2Calc37?: number | null;
  pco2Venoso37?: number | null;

  svO2CalcTemp?: number | null;
  svO2ManualTemp?: number | null;
}

/* ================= COMPONENTE ================= */

export default function PDGIntraCEC({
  datos,
  setDatos,
  hb,
  satArterial,
  flujo,
  superficieCorporal,
  sweepGas,
  ePCO2,
  presionAtmosferica,
  pco2Arterial,
  svO2Calc37,
  pco2Venoso37,
  svO2CalcTemp,
  svO2ManualTemp,
}: PDGIntraCECProps) {
  const [hora, setHora] = useState("");
  const registros = datos.intraCEC.pdg.registros;
console.log("DEBUG VCO2:", {
  sweepGas,
  ePCO2,
  superficieCorporal,
  presionAtmosferica,
});
console.log("PDG COMPONENT RENDERING");
  const svo2Temp = svO2ManualTemp ?? svO2CalcTemp ?? null;
  const svo2_37 = svO2Calc37 ?? null;
  const pco2Ven_37 = pco2Venoso37 ?? null;

  /* ================= CÁLCULOS BASE ================= */

  const calcularCaO2 = () =>
    hb == null || satArterial == null
      ? "--"
      : (hb * 1.36 * (satArterial / 100)).toFixed(2);

  const calcularCvO2 = (temp: boolean) => {
    const svo2 = temp ? svo2Temp : svo2_37;
    return hb == null || svo2 == null
      ? "--"
      : (hb * 1.36 * (svo2 / 100)).toFixed(2);
  };

  const calcularDeltaAVO2 = (temp: boolean) => {
    const a = calcularCaO2();
    const v = calcularCvO2(temp);
    return a === "--" || v === "--"
      ? "--"
      : (Number(a) - Number(v)).toFixed(2);
  };

  const calcularDO2i = () => {
  if (
    hb == null ||
    satArterial == null ||
    flujo == null ||
    superficieCorporal == null ||
    superficieCorporal === 0
  )
    return "--";

  return (
    (hb * 1.36 * (satArterial / 100) * 10 * flujo) /
    superficieCorporal
  ).toFixed(1);
};

  const calcularVO2i = (temp: boolean) => {
    if (
    flujo == null ||
    superficieCorporal == null ||
    superficieCorporal === 0
  )
    return "--";

    const delta = calcularDeltaAVO2(temp);
    if (delta === "--") return "--";

    return ((Number(delta) * flujo * 10) / superficieCorporal).toFixed(1);
  };

 const calcularVCO2i = () => {
  console.log("DEBUG VCO2:", {
    sweepGas,
    ePCO2,
    superficieCorporal,
    presionAtmosferica,
  });

  const sweep = Number(sweepGas);
  const pco2 = Number(ePCO2);
  const sc = Number(superficieCorporal);
  const patm = Number(presionAtmosferica);

  if (!sweep || !pco2 || !sc || !patm) return "--";

  const vco2 = (sweep * pco2 * 1000) / (patm * sc);

  return Number.isFinite(vco2) ? vco2.toFixed(1) : "--";
};

  /* ================= RELACIONES EXPLÍCITAS ================= */

  const calcularDO2_VO2 = (temp: boolean) => {
    const DO2 = calcularDO2i();
    const VO2 = calcularVO2i(temp);
    return DO2 === "--" || VO2 === "--" || Number(VO2) === 0
      ? "--"
      : (Number(DO2) / Number(VO2)).toFixed(2);
  };

  const calcularVO2_DO2 = (temp: boolean) => {
    const DO2 = calcularDO2i();
    const VO2 = calcularVO2i(temp);
    return DO2 === "--" || VO2 === "--" || Number(DO2) === 0
      ? "--"
      : (Number(VO2) / Number(DO2)).toFixed(2);
  };

  const calcularDO2_VCO2 = () => {
    const DO2 = calcularDO2i();
    const VCO2 = calcularVCO2i();
    return DO2 === "--" || VCO2 === "--" || Number(VCO2) === 0
      ? "--"
      : (Number(DO2) / Number(VCO2)).toFixed(2);
  };

  const calcularVCO2_VO2 = (temp: boolean) => {
    const VCO2 = calcularVCO2i();
    const VO2 = calcularVO2i(temp);
    return VCO2 === "--" || VO2 === "--" || Number(VO2) === 0
      ? "--"
      : (Number(VCO2) / Number(VO2)).toFixed(2);
  };

  const calcularDeltaVACO2 = () =>
    pco2Ven_37 == null || pco2Arterial == null
      ? "--"
      : (pco2Ven_37 - pco2Arterial).toFixed(1);

  /* ================= REGISTROS ================= */

const agregarRegistro = () => {
  if (!hora) return;

  const valores = {
    "CaO₂": calcularCaO2(),
    "CvO₂": calcularCvO2(true),
    "Δ A-V O₂": calcularDeltaAVO2(true),
    "DO₂i": calcularDO2i(),
    "VO₂i": calcularVO2i(true),
    "DO₂i / VO₂i": calcularDO2_VO2(true),
    "VO₂i / DO₂i": calcularVO2_DO2(true),
    "VCO₂i": calcularVCO2i(),
    "DO₂i / VCO₂i": calcularDO2_VCO2(),
    "VCO₂i / VO₂i": calcularVCO2_VO2(true),
    "Δ V-A CO₂": calcularDeltaVACO2(),
  };

  setDatos((prev) => ({
    ...prev,
    intraCEC: {
      ...prev.intraCEC,
      pdg: {
        ...prev.intraCEC.pdg,
        registros: [
          ...prev.intraCEC.pdg.registros,
          {
            hora,
            valores,
          },
        ],
      },
    },
  }));

  setHora("");
};


  const eliminarRegistro = (index: number) => {
    setDatos((prev) => ({
      ...prev,
      intraCEC: {
        ...prev.intraCEC,
        pdg: {
          ...prev.intraCEC.pdg,
          registros: prev.intraCEC.pdg.registros.filter(
            (_, i) => i !== index
          ),
        },
      },
    }));
  };

  /* ================= RENDER ================= */

  return (
    <div style={card}>
      <div style={header}>
        <Target size={20} />
        Perfusión guiada por objetivo (PDG)
      </div>

      <div style={grid}>
        <PDGField label="CaO₂" value={calcularCaO2()} />
        <PDGDoubleField label="CvO₂" value37={calcularCvO2(false)} valueTemp={calcularCvO2(true)} />
        <PDGDoubleField label="Δ A-V O₂" value37={calcularDeltaAVO2(false)} valueTemp={calcularDeltaAVO2(true)} />
        <PDGField label="DO₂i" value={calcularDO2i()} />
        <PDGDoubleField label="VO₂i" value37={calcularVO2i(false)} valueTemp={calcularVO2i(true)} />
        <PDGDoubleField label="DO₂i / VO₂i" value37={calcularDO2_VO2(false)} valueTemp={calcularDO2_VO2(true)} />
        <PDGDoubleField label="VO₂i / DO₂i" value37={calcularVO2_DO2(false)} valueTemp={calcularVO2_DO2(true)} />
        <PDGField label="VCO₂i" value={calcularVCO2i()} />
        <PDGField label="DO₂i / VCO₂i" value={calcularDO2_VCO2()} />
        <PDGDoubleField label="VCO₂i / VO₂i" value37={calcularVCO2_VO2(false)} valueTemp={calcularVCO2_VO2(true)} />
        <PDGField label="Δ V-A CO₂" value={calcularDeltaVACO2()} />
      </div>

      <IntraCECRegistroBar
        hora={hora}
        setHora={setHora}
        onAgregar={agregarRegistro}
      />

      {/* REGISTROS */}
{registros.map((r, i) => (
  <div key={i} style={registroRow}>
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontWeight: 700, color: "#5eead4" }}>
        {r.hora}
      </span>

      <span style={{ fontSize: 12, color: "#94a3b8" }}>
        {Object.entries(r.valores)
  .filter(([_, v]) => v && v !== "--")
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

/* ================= SUBCOMPONENTES ================= */

function PDGField({ label, value }: { label: string; value?: string }) {
  const rango = valoresNormales[label] ? label : "";

  return (
    <div style={{ ...field, position: "relative" }}>
      {rango && <span style={vnStyle}>{valoresNormales[rango]}</span>}
      <span style={fieldLabel}>{label}</span>
      <input style={fieldInput} value={value ?? "--"} disabled />
    </div>
  );
}

function PDGDoubleField({
  label,
  value37,
  valueTemp,
}: {
  label: string;
  value37?: string;
  valueTemp?: string;
}) {
  const rango = valoresNormales[label] ? label : "";

  return (
    <div style={{ ...field, position: "relative" }}>
      {rango && <span style={vnStyle}>{valoresNormales[rango]}</span>}
      <span style={fieldLabel}>{label}</span>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    width: "100%",
  }}
>
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
    }}
  >
    <span
      style={{
        fontSize: 10,
        color: "#94a3b8",
        fontWeight: 700,
      }}
    >
      37°
    </span>

    <input
      style={{
        ...fieldInput,
        width: "100%",
      }}
      value={value37 ?? "--"}
      disabled
    />
  </div>

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
    }}
  >
    <span
      style={{
        fontSize: 10,
        color: "#5eead4",
        fontWeight: 700,
      }}
    >
      TEMP
    </span>

    <input
      style={{
        ...fieldInput,
        width: "100%",
        borderColor: "#5eead4",
        color: "#5eead4",
      }}
      value={valueTemp ?? "--"}
      disabled
    />
  </div>
</div>
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
  alignItems: "center",
  gap: 10,
  fontWeight: 800,
  fontSize: 18,
  color: "#5eead4",
  marginBottom: 20,
};

const grid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",

  gap: 18,

  width: "100%",

  alignItems: "stretch",

  justifyContent: "stretch",
};

const field = {
  background: "#020617",
  border: "1px solid #334155",
  borderRadius: 14,

  padding: 20,

  width: "100%",

  minHeight: 165,

  boxSizing: "border-box" as const,

  display: "flex",
  flexDirection: "column" as const,

  justifyContent: "center",

  alignItems: "center",

  gap: 10,
};

const fieldLabel = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 1,
  color: "#94a3b8",
};

const fieldInput = {
  background: "#020617",
  border: "1px solid #334155",
  borderRadius: 10,
  padding: "8px 10px",
  width: 80,
  textAlign: "center" as const,
  color: "white",
  fontSize: 14,
  fontWeight: 700,
};

const vnStyle = {
  position: "absolute" as const,
  top: 8,
  right: 10,
  fontSize: 8,
  color: "#94a3b8",
  fontWeight: 700,
};

const registroRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#020617",
  borderRadius: 12,
  padding: "10px 18px",
  marginTop: 14,
  border: "1px solid #334155",
};
