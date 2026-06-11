import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface Props {
  registros: {
    hora: string;
    valores: Record<string, string>;
  }[];
}

export default function PDGTendenciaChart({ registros }: Props) {

  const safeNumber = (value: any): number | undefined => {
    if (!value || value === "--") return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const data = registros.map((r) => ({
    hora: r.hora ?? "",

    // TRANSPORTE
    DO2i: safeNumber(r.valores["DO₂i"]),
    VO2i: safeNumber(r.valores["VO₂i"]),
    VCO2i: safeNumber(r.valores["VCO₂i"]),

    // RELACIONES
    DO2i_VO2i: safeNumber(r.valores["DO₂i / VO₂i"]),
    VO2i_DO2i: safeNumber(r.valores["VO₂i / DO₂i"]),
    VCO2i_VO2i: safeNumber(r.valores["VCO₂i / VO₂i"]),
    DeltaVACO2: safeNumber(r.valores["Δ V-A CO₂"]),
  }));

  if (!registros.length) return null;

  return (
    <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 40 }}>

      {/* ================= TRANSPORTE ================= */}
      <div
        style={{
          background: "#1e293b",
          borderRadius: 20,
          padding: 24,
          border: "1px solid #334155",
        }}
      >
        <h3 style={{ color: "#5eead4", fontWeight: 800, marginBottom: 20 }}>
          Transporte de Oxígeno
        </h3>

        <LineChart width={900} height={320} data={data}>
          <CartesianGrid stroke="#334155" />
          <XAxis dataKey="hora" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Legend />

          {/* ORDEN: DO2i → VO2i → VCO2i */}
          <Line type="monotone" dataKey="DO2i" stroke="#5eead4" strokeWidth={3} connectNulls />
          <Line type="monotone" dataKey="VO2i" stroke="#60a5fa" strokeWidth={3} connectNulls />
          <Line type="monotone" dataKey="VCO2i" stroke="#fb7185" strokeWidth={3} connectNulls />
        </LineChart>
      </div>

      {/* ================= METABOLISMO ================= */}
      <div
        style={{
          background: "#1e293b",
          borderRadius: 20,
          padding: 24,
          border: "1px solid #334155",
        }}
      >
        <h3 style={{ color: "#5eead4", fontWeight: 800, marginBottom: 20 }}>
          Relaciones Metabólicas
        </h3>

        <LineChart width={900} height={320} data={data}>
          <CartesianGrid stroke="#334155" />
          <XAxis dataKey="hora" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Legend />

          {/* ORDEN: DO2i/VO2i → VO2i/DO2i → VCO2i/VO2i → Δ V-A CO2 */}
          <Line type="monotone" dataKey="DO2i_VO2i" stroke="#22c55e" strokeWidth={3} connectNulls />
          <Line type="monotone" dataKey="VO2i_DO2i" stroke="#facc15" strokeWidth={3} connectNulls />
          <Line type="monotone" dataKey="VCO2i_VO2i" stroke="#a78bfa" strokeWidth={3} connectNulls />
          <Line type="monotone" dataKey="DeltaVACO2" stroke="#34d399" strokeWidth={3} connectNulls />
        </LineChart>
      </div>

    </div>
  );
}