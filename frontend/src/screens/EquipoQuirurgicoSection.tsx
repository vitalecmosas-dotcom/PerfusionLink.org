import type { ReactNode } from "react";
import { Users, Stethoscope, Activity, Zap } from "lucide-react";

import type { DatosClinicos } from "../types/DatosClinicos";

interface Props {
  datos: DatosClinicos;
  setDatos: React.Dispatch<React.SetStateAction<DatosClinicos>>;
}

export default function EquipoQuirurgicoSection({
  datos,
  setDatos,
}: Props) {
  return (
    <section
      style={{
        background: "#0f172a",
        borderRadius: 20,
        padding: 24,
        border: "1px solid #1e293b",
      }}
    >
      {/* HEADER */}
      <header style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Users size={28} color="#5eead4" />
        <h2 style={{ color: "#5eead4", fontSize: 24, margin: 0 }}>
          Equipo Quirúrgico
        </h2>
      </header>

      <hr style={{ margin: "20px 0", borderColor: "#1e293b" }} />

      {/* CONTENEDOR DE TARJETAS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
        }}
      >
        {/* 🔴 CIRUGÍA */}
        <Card
          title="CIRUGÍA"
          icon={<Stethoscope size={16} />}
          color="#fb7185"
        >
          <Input
  label="Cirujano principal"
  value={datos.equipoQuirurgico.cirujanoPrincipal}
  onChange={(v) =>
    setDatos((prev) => ({
      ...prev,
      equipoQuirurgico: {
        ...prev.equipoQuirurgico,
        cirujanoPrincipal: v,
      },
    }))
  }
/>

<Input
  label="Cirujano asistente"
  value={datos.equipoQuirurgico.cirujanoAsistente}
  onChange={(v) =>
    setDatos((prev) => ({
      ...prev,
      equipoQuirurgico: {
        ...prev.equipoQuirurgico,
        cirujanoAsistente: v,
      },
    }))
  }
/>

<Input
  label="Segundo asistente"
  value={datos.equipoQuirurgico.segundoAsistente}
  onChange={(v) =>
    setDatos((prev) => ({
      ...prev,
      equipoQuirurgico: {
        ...prev.equipoQuirurgico,
        segundoAsistente: v,
      },
    }))
  }
/>
        </Card>

        {/* 🔵 ANESTESIA */}
        <Card
          title="ANESTESIA"
          icon={<Activity size={16} />}
          color="#60a5fa"
        >
          <Input
  label="Anestesiólogo principal"
  value={datos.equipoQuirurgico.anestesiologoPrincipal}
  onChange={(v) =>
    setDatos((prev) => ({
      ...prev,
      equipoQuirurgico: {
        ...prev.equipoQuirurgico,
        anestesiologoPrincipal: v,
      },
    }))
  }
/>

<Input
  label="Segundo anestesiólogo"
  value={datos.equipoQuirurgico.segundoAnestesiologo}
  onChange={(v) =>
    setDatos((prev) => ({
      ...prev,
      equipoQuirurgico: {
        ...prev.equipoQuirurgico,
        segundoAnestesiologo: v,
      },
    }))
  }
/>
        </Card>

        {/* 🟢 PERFUSIÓN */}
        <Card
          title="PERFUSIÓN"
          icon={<Zap size={16} />}
          color="#5eead4"
        >
          <Input
  label="Perfusionista principal"
  value={datos.equipoQuirurgico.perfusionistaPrincipal}
  onChange={(v) =>
    setDatos((prev) => ({
      ...prev,
      equipoQuirurgico: {
        ...prev.equipoQuirurgico,
        perfusionistaPrincipal: v,
      },
    }))
  }
/>

<Input
  label="Segundo perfusionista"
  value={datos.equipoQuirurgico.segundoPerfusionista}
  onChange={(v) =>
    setDatos((prev) => ({
      ...prev,
      equipoQuirurgico: {
        ...prev.equipoQuirurgico,
        segundoPerfusionista: v,
      },
    }))
  }
/>
        </Card>
      </div>
    </section>
  );
}

/* ================= COMPONENTES INTERNOS ================= */

function Card({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: ReactNode;
  color: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        background: "#020617",
        borderRadius: 16,
        padding: 20,
        border: `1px solid ${color}40`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color,
          fontWeight: 700,
          marginBottom: 16,
          letterSpacing: 1,
          fontSize: 14,
        }}
      >
        {icon}
        {title}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {children}
      </div>
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
      <label
        style={{
          fontSize: 11,
          color: "#64748b",
          marginBottom: 4,
          display: "block",
        }}
      >
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 10,
          background: "#020617",
          border: "1px solid #1e293b",
          color: "white",
          outline: "none",
        }}
      />
    </div>
  );
}