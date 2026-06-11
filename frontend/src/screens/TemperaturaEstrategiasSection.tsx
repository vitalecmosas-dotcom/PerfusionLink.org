import type { DatosClinicos } from "../types/DatosClinicos";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  datos: DatosClinicos;
  setDatos: Dispatch<SetStateAction<DatosClinicos>>;
}

const estrategiasAhorro = [
  "RAP (Autologous Priming)",
  "HAR (Hemo. Autóloga)",
  "HNA (Hemod. Normovol.)",
  "DVAV (Drenaje vacío)",
  "Retorno venoso",
  "Miniaturización",
  "MIECC (Circuitos)",
  "CUF (Conv. Ultrafil.)",
  "MUF (Mod. Ultrafil.)",
  "ZBUF (Zero Balance)",
  "CellSaver",
];

export default function TemperaturaEstrategiasSection({
  datos,
  setDatos,
}: Props) {

  function toggleEstrategia(item: string) {
    setDatos((prev) => ({
      ...prev,
      planPerfusion: {
        ...prev.planPerfusion,
        estrategiasAhorro: prev.planPerfusion.estrategiasAhorro.includes(item)
          ? prev.planPerfusion.estrategiasAhorro.filter((e) => e !== item)
          : [...prev.planPerfusion.estrategiasAhorro, item],
      },
    }));
  }

  return (
    <section style={outerCard}>
      {/* HEADER */}
      <header style={header}>
        <span style={{ fontSize: 26 }}>🌡️</span>
        <h2 style={title}>Temperatura y Ahorro Sanguíneo</h2>
      </header>

      <hr style={divider} />

      <div style={twoColumns}>
        {/* ===== TEMPERATURA ===== */}
        <div style={innerCard}>
          <h3 style={sectionTitle}>Gestión de temperatura</h3>

          <div style={infoBox}>
            <div><strong>Hipotermia leve:</strong> 34 – 32 °C</div>
            <div><strong>Hipotermia moderada:</strong> 32 – 28 °C</div>
            <div><strong>Hipotermia profunda:</strong> &lt; 28 °C</div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={labelStyle}>Estrategia térmica sistémica</label>
            <select
              style={input}
              value={datos.planPerfusion.temperaturaEstrategia}
              onChange={(e) =>
                setDatos((prev) => ({
                  ...prev,
                  planPerfusion: {
                    ...prev.planPerfusion,
                    temperaturaEstrategia: e.target.value,
                  },
                }))
              }
            >
              <option value="">Seleccionar...</option>
              <option>Normotermia</option>
              <option>Hipotermia leve</option>
              <option>Hipotermia moderada</option>
              <option>Hipotermia profunda</option>
            </select>
          </div>
        </div>

        {/* ===== AHORRO SANGUÍNEO ===== */}
        <div style={innerCard}>
          <h3 style={sectionTitle}>Estrategias de ahorro sanguíneo</h3>

          <ul style={listaAhorro}>
            {estrategiasAhorro.map((item) => (
              <li key={item} style={filaAhorro}>
                <label style={labelAhorro}>
                  <input
                    type="checkbox"
                    checked={datos.planPerfusion.estrategiasAhorro.includes(item)}
                    onChange={() => toggleEstrategia(item)}
                    style={checkbox}
                  />
                  <span style={textoAhorro}>{item}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ================= ESTILOS ================= */

const outerCard: React.CSSProperties = {
  background: "#0f172a",
  borderRadius: 24,
  padding: 24,
  border: "1px solid #1e293b",
  marginTop: 15,
  boxSizing: "border-box",
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

const twoColumns: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
  gap: 24,
};

const innerCard: React.CSSProperties = {
  background: "#020617",
  borderRadius: 20,
  padding: 24,
  border: "1px solid #1e293b",
  width: "90%",
  boxSizing: "border-box",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 800,
  color: "#60a5fa",
  marginBottom: 16,
};

const infoBox: React.CSSProperties = {
  background: "#020617",
  border: "1px solid #334155",
  borderRadius: 12,
  padding: 14,
  fontSize: 13,
  color: "#cbd5f5",
  display: "flex",
  flexDirection: "column",
  gap: 6,
  width: "100%",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
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
  boxSizing: "border-box",
};

const listaAhorro: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 14,
  width: "100%",
  boxSizing: "border-box",
};

const filaAhorro: React.CSSProperties = {
  width: "100%",
};

const labelAhorro: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid #334155",
  background: "#020617",
  cursor: "pointer",
  width: "100%",
  boxSizing: "border-box",
};

const checkbox: React.CSSProperties = {
  width: 16,
  height: 16,
  flexShrink: 0,
};

const textoAhorro: React.CSSProperties = {
  fontSize: 14,
  color: "#e5e7eb",
  lineHeight: 1.4,
  textAlign: "left",
  flex: 1,
};