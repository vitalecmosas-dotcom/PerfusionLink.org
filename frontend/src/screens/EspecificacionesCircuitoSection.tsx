import { Cpu, Anchor, Layers } from "lucide-react";
import type { DatosClinicos } from "../types/DatosClinicos";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  datos: DatosClinicos;
  setDatos: Dispatch<SetStateAction<DatosClinicos>>;
}

export default function EspecificacionesCircuitoSection({
  datos,
  setDatos,
}: Props) {
  const ec = datos.planPerfusion.especificacionesCircuito;

  const actualizar = (campo: keyof typeof ec, valor: string) => {
    setDatos((prev) => ({
      ...prev,
      planPerfusion: {
        ...prev.planPerfusion,
        especificacionesCircuito: {
          ...prev.planPerfusion.especificacionesCircuito,
          [campo]: valor,
        },
      },
    }));
  };

  return (
    <section style={outerCard}>
      <header style={header}>
        <Layers size={26} color="#5eead4" />
        <h2 style={title}>Especificaciones del Circuito</h2>
      </header>

      <hr style={divider} />

      <div style={grid}>
        {/* Consola y Oxigenador */}
        <Card
          title="Consola y Oxigenador"
          color="#5eead4"
          icon={<Cpu size={18} />}
        >
          <Select
            label="Tipo de circuito"
            value={ec.tipoCircuito}
            onChange={(v) => actualizar("tipoCircuito", v)}
            options={["Adulto", "Pediátrico"]}
          />

          <Select
            label="Bomba principal"
            value={ec.bombaPrincipal}
            onChange={(v) => actualizar("bombaPrincipal", v)}
            options={["Rodillo", "Centrífuga"]}
          />

          {/* NUEVO */}
          <Select
            label="Flujo"
            value={ec.flujoPulsatil ?? ""}
            onChange={(v) =>
              actualizar("flujoPulsatil", v)
            }
            options={[
              "Lineal",
              "Pulsátil",
            ]}
          />

          <Input
            label="Modelo oxigenador"
            value={ec.modeloOxigenador}
            onChange={(v) => actualizar("modeloOxigenador", v)}
            placeholder="Ej: Affinity NT"
          />
        </Card>

        {/* CANULACIÓN */}
        <Card
          title="Canulación"
          color="#60a5fa"
          icon={<Anchor size={18} />}
        >
          <Input
            label="Cánula arterial"
            value={ec.canulaArterial}
            onChange={(v) => actualizar("canulaArterial", v)}
            placeholder="Fr / Modelo"
          />

          <Input
            label="Cánula venosa"
            value={ec.canulaVenosa}
            onChange={(v) => actualizar("canulaVenosa", v)}
            placeholder="Fr / Tipo"
          />
        </Card>

        {/* LÍNEAS Y DIÁMETROS */}
        <Card
          title="Líneas y Diámetros"
          color="#c084fc"
          icon={<Layers size={18} />}
        >
          <Select
            label="Línea venosa (pulg.)"
            value={ec.lineaVenosa}
            onChange={(v) => actualizar("lineaVenosa", v)}
            options={["1/2", "3/8"]}
          />

          <Select
            label="Línea arterial (pulg.)"
            value={ec.lineaArterial}
            onChange={(v) => actualizar("lineaArterial", v)}
            options={["3/8", "1/4"]}
          />
        </Card>
      </div>
    </section>
  );
}

/* ================= COMPONENTES ================= */

function Card({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#0f172a",
        borderRadius: 24,
        padding: 24,
        border: `1px solid ${color}40`,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, color }}>
        {icon}
        <strong
          style={{
            letterSpacing: 1,
            fontSize: 15,
            fontWeight: 900,
          }}
        >
          {title.toUpperCase()}
        </strong>
      </div>

      {children}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select
        style={input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Seleccionar...</option>

        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={input}
      />
    </div>
  );
}

/* ================= ESTILOS ================= */

const outerCard: React.CSSProperties = {
  background: "#0f172a",
  borderRadius: 24,
  padding: 24,
  border: "1px solid #1e293b",
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
  marginBottom: 28,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 24,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#94a3b8",
  marginBottom: 6,
  display: "block",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 14,
  background: "#020617",
  border: "1px solid #334155",
  color: "white",
};