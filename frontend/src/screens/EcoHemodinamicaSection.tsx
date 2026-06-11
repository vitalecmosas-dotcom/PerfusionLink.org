import { useEffect, useState } from "react";
import { Waves } from "lucide-react";
import type { DatosClinicos } from "../types/DatosClinicos";

interface Props {
  datos: DatosClinicos;
  setDatos: React.Dispatch<React.SetStateAction<DatosClinicos>>;
}

export default function EcoHemodinamicaSection({
  datos,
  setDatos,
}: Props) {
  const eco = datos.ecoHemodinamica;

  const [gc, setGc] = useState("0.00");
  const [rvs, setRvs] = useState("0");
  const [power, setPower] = useState("0.00");
  const [vs, setVs] = useState("0");

  /* ================= CÁLCULOS AUTOMÁTICOS ================= */

useEffect(() => {
  const FC = parseFloat(eco.fc || "0");
  const PAM = parseFloat(eco.pam || "0");
  const PVC = parseFloat(eco.pvc || "0");
  const VSV = parseFloat(eco.vsv || "0");
  const VDVI = parseFloat(eco.vdvi || "0");

  // 🔹 Volumen Sistólico
  if (!isNaN(VDVI) && !isNaN(VSV)) {

    const vsCalc = VDVI - VSV;

    setVs(vsCalc.toFixed(0));

    // 🔹 Gasto cardíaco
    if (FC > 0 && vsCalc > 0) {

      const gasto = (FC * vsCalc) / 1000;

      setGc(gasto.toFixed(2));

      // 🔹 RVS
      if (PAM > 0 && gasto > 0) {

        const rvsCalc =
          ((PAM - PVC) / gasto) * 80;

        setRvs(rvsCalc.toFixed(0));

        // 🔹 Poder cardíaco
        const powerCalc =
          (gasto * PAM) / 451;

        setPower(powerCalc.toFixed(2));
      }

    } else {
      setGc("0.00");
      setRvs("0");
      setPower("0.00");
    }

  } else {
    setVs("0");
    setGc("0.00");
    setRvs("0");
    setPower("0.00");
  }

}, [eco]);

  const update = (field: keyof typeof eco, value: string) => {
    setDatos((prev) => ({
      ...prev,
      ecoHemodinamica: {
        ...prev.ecoHemodinamica,
        [field]: value,
      },
    }));
  };

  return (
    <section style={outerCard}>
      <header style={header}>
        <Waves size={28} color="#5eead4" />
        <h2 style={title}>Ecocardiografía y Hemodinámica</h2>
      </header>

      <hr style={divider} />

      <div style={grid}>
        {/* FUNCIÓN VENTRICULAR */}
        <Card title="FUNCIÓN VENTRICULAR IZQ." color="#60a5fa">
          <Input
            label="FEVI (%)"
            value={eco.fevi}
            onChange={(v) => update("fevi", v)}
          />
          <TwoCols>
            <Input
              label="VDVI (ml)"
              value={eco.vdvi}
              onChange={(v) => update("vdvi", v)}
            />
            <Input
              label="VSVI (ml)"
              value={eco.vsv}
              onChange={(v) => update("vsv", v)}
            />
          </TwoCols>
          <Metric label="Volumen Sistólico (ml)" value={vs} />
        </Card>

        {/* SIGNOS VITALES */}
        <Card title="SIGNOS VITALES PRE" color="#5eead4">
          <TwoCols>
            <Input
              label="FC (lpm)"
              value={eco.fc}
              onChange={(v) => update("fc", v)}
            />
            <Input
              label="PAM (mmHg)"
              value={eco.pam}
              onChange={(v) => update("pam", v)}
            />
          </TwoCols>
          <Input
            label="PVC (mmHg)"
            value={eco.pvc}
            onChange={(v) => update("pvc", v)}
          />
          <Metric label="Gasto Cardíaco (L/min)" value={gc} />
        </Card>

        {/* CÁLCULO HEMODINÁMICO */}
        <Card title="CÁLCULO HEMODINÁMICO" color="#c084fc">
          <Metric label="RVS (dyn·s/cm⁵)" value={rvs} />
          <Metric label="Poder Cardíaco (W)" value={power} />
        </Card>
      </div>
    </section>
  );
}

/* ================= COMPONENTES ================= */

function Card({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#020617",
        borderRadius: 20,
        padding: 24,
        border: `1px solid ${color}40`,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontWeight: 700, color }}>{title}</div>
      {children}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        style={input}
      />
    </div>
  );
}

function TwoCols({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 12,
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={metric}>
      <div style={{ fontSize: 12, color: "#94a3b8" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#5eead4" }}>
        {value}
      </div>
    </div>
  );
}

/* ================= ESTILOS ================= */

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

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 24,
  fontSize: 14,
  width: "100%",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#94a3b8",
  marginBottom: 6,
  display: "block",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  background: "#020617",
  border: "1px solid #334155",
  color: "white",
};

const metric: React.CSSProperties = {
  background: "#020617",
  borderRadius: 14,
  padding: 14,
  border: "1px solid #334155",
  textAlign: "center",
};