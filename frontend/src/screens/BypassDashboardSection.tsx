type View =
  | "dashboard"
  | "equipo"
  | "ficha"
  | "laboratorios"
  | "eco"
  | "riesgo";

interface Props {
  onNavigate: (view: View) => void;
}

export default function BypassDashboardSection({ onNavigate }: Props) {
  return (
    <div
      style={{
        background: "#0f172a",
        borderRadius: 24,
        padding: 32,
        border: "1px solid #1e293b",
      }}
    >
      <h2 style={{ marginBottom: 24 }}>Gestión de Bypass</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 24,
        }}
      >
        <Card title="Equipo" onClick={() => onNavigate("equipo")} />
        <Card title="Ficha Clínica" onClick={() => onNavigate("ficha")} />
        <Card title="Laboratorios" onClick={() => onNavigate("laboratorios")} />
        <Card title="Eco" onClick={() => onNavigate("eco")} />
        <Card title="Escalas de Riesgo" onClick={() => onNavigate("riesgo")} />
      </div>
    </div>
  );
}

/* ---------- CARD ---------- */

function Card({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: 28,
        borderRadius: 20,
        background: "#020617",
        border: "1px solid #1e293b",
        cursor: "pointer",
        textAlign: "center",
        fontWeight: 700,
        transition: "transform 0.15s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-4px)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "translateY(0)")
      }
    >
      {title}
    </div>
  );
}