import { useMemo } from "react";
import { ShieldAlert } from "lucide-react";
import type { DatosClinicos } from "../types/DatosClinicos";

interface Props {
  datos: DatosClinicos;
  setDatos: React.Dispatch<React.SetStateAction<DatosClinicos>>;
}

export default function EscalasRiesgoSection({
  datos,
  setDatos,
}: Props) {
  const trustOptions = [
    { key: "hb", label: "Hemoglobina < 13.5 g/dL" },
    { key: "peso", label: "Peso < 77 kg" },
    { key: "sexo", label: "Sexo femenino" },
    { key: "edad", label: "Edad > 65 años" },
    { key: "urgencia", label: "Cirugía no electiva" },
    { key: "creatinina", label: "Creatinina > 1.36 mg/dL" },
    { key: "previa", label: "Cirugía cardíaca previa" },
  ];

  const trust = datos.escalasRiesgo.trust;
  const vis = datos.escalasRiesgo.vis;

  const toggleTrust = (key: string) => {
    setDatos((prev) => ({
      ...prev,
      escalasRiesgo: {
        ...prev.escalasRiesgo,
        trust: {
          ...prev.escalasRiesgo.trust,
          [key]: !prev.escalasRiesgo.trust[key],
        },
      },
    }));
  };

  const updateVis = (field: keyof typeof vis, value: string) => {
    setDatos((prev) => ({
      ...prev,
      escalasRiesgo: {
        ...prev.escalasRiesgo,
        vis: {
          ...prev.escalasRiesgo.vis,
          [field]: value,
        },
      },
    }));
  };

  const trustScore = Object.values(trust).filter(Boolean).length;

  const trustLabel =
    trustScore <= 1
      ? "RIESGO BAJO"
      : trustScore <= 3
      ? "RIESGO INTERMEDIO"
      : "RIESGO ALTO";

  const visScore = useMemo(() => {
    const d = (v: string) => parseFloat(v) || 0;
    return (
      d(vis.dopamina) +
      d(vis.dobutamina) +
      100 * d(vis.adrenalina) +
      10 * d(vis.milrinona) +
      100 * d(vis.noradrenalina) +
      167 * d(vis.vasopresina)
    );
  }, [vis]);

  const visLabel =
    visScore === 0
      ? "SIN APOYO"
      : visScore <= 5
      ? "APOYO BAJO"
      : visScore <= 15
      ? "APOYO MODERADO"
      : "APOYO ALTO";

  return (
    <section style={outerCard}>
      <header style={header}>
        <ShieldAlert size={26} color="#5eead4" />
        <h2 style={title}>Escalas de Riesgo</h2>
      </header>

      <hr style={divider} />

      <div style={mainGrid}>
        {/* TRUST SCORE */}
        <div style={card}>
          <div style={cardHeader}>
            📋 <strong>TRUST SCORE</strong>
          </div>

          <div style={trustGrid}>
            {trustOptions.map((item) => (
              <label key={item.key} style={check}>
                <input
                  type="checkbox"
                  checked={!!trust[item.key]}
                  onChange={() => toggleTrust(item.key)}
                  style={checkbox}
                />
                <span style={checkText}>{item.label}</span>
              </label>
            ))}
          </div>

          <div style={scoreBox}>
            <div style={{ fontSize: 40, fontWeight: 800 }}>
              {trustScore}
            </div>
            <div style={{ fontSize: 13, color: "#5eead4", fontWeight: 700 }}>
              {trustLabel}
            </div>
          </div>
        </div>

        {/* VIS SCORE */}
        <div style={card}>
          <div style={{ ...cardHeader, color: "#c084fc" }}>
            ⚖️ <strong>VIS SCORE</strong>
          </div>

          <TwoCols>
            <Dose label="Dopamina" value={vis.dopamina} onChange={(v) => updateVis("dopamina", v)} />
            <Dose label="Dobutamina" value={vis.dobutamina} onChange={(v) => updateVis("dobutamina", v)} />
            <Dose label="Adrenalina" value={vis.adrenalina} onChange={(v) => updateVis("adrenalina", v)} />
            <Dose label="Milrinona" value={vis.milrinona} onChange={(v) => updateVis("milrinona", v)} />
            <Dose label="Noradrenalina" value={vis.noradrenalina} onChange={(v) => updateVis("noradrenalina", v)} />
            <Dose label="Vasopresina" value={vis.vasopresina} onChange={(v) => updateVis("vasopresina", v)} />
          </TwoCols>

          <div style={scoreBox}>
            <div style={{ fontSize: 40, fontWeight: 800 }}>
              {visScore.toFixed(1)}
            </div>
            <div style={{ fontSize: 13, color: "#5eead4", fontWeight: 700 }}>
              {visLabel}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* COMPONENTES EXACTAMENTE IGUALES */

function Dose({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={input} />
    </div>
  );
}

function TwoCols({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {children}
    </div>
  );
}

/* ESTILOS EXACTOS */

const outerCard: React.CSSProperties = {
  background: "#0f172a",
  borderRadius: 24,
  padding: 24,
  border: "1px solid #1e293b",
  marginTop: 15,
};

const header: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 16,
};

const title: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
  color: "#5eead4",
};

const divider: React.CSSProperties = {
  borderColor: "#1e293b",
  marginBottom: 24,
};

const mainGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 24,
};

const card: React.CSSProperties = {
  background: "#020617",
  borderRadius: 24,
  padding: 28,
  border: "1px solid #334155",
  display: "flex",
  flexDirection: "column",
  gap: 16,
  width: "100%",
  boxSizing: "border-box",
};

const cardHeader: React.CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  color: "#facc15",
};

const trustGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
  width: "100%",
};

const check: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "12px 14px",
  borderRadius: 12,
  background: "#020617",
  border: "1px solid #334155",
  cursor: "pointer",
  fontSize: 13,
  width: "100%",
  boxSizing: "border-box",
};

const checkbox: React.CSSProperties = {
  flexShrink: 0,
  width: 16,
  height: 16,
  margin: 0,
};

const checkText: React.CSSProperties = {
  flex: 1,
  textAlign: "left",
  lineHeight: 1.4,
  whiteSpace: "normal",
  overflowWrap: "break-word",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  background: "#020617",
  border: "1px solid #334155",
  color: "white",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#94a3b8",
  marginBottom: 6,
  display: "block",
};

const scoreBox: React.CSSProperties = {
  marginTop: 16,
  background: "#020617",
  borderRadius: 18,
  padding: 20,
  border: "1px solid #334155",
  textAlign: "center",
};