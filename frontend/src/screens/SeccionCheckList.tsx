import { useMemo } from "react";
import {
  User,
  Sparkles,
  Zap,
  Plug,
  HeartPulse,
  Wind,
  ShieldCheck,
  Activity,
  FlaskConical,
  LifeBuoy,
  CheckCircle2,
  Circle,
} from "lucide-react";
import type { DatosClinicos } from "../types/DatosClinicos";
import type { Dispatch, SetStateAction } from "react";

/* ================= PROPS ================= */

interface Props {
  datos: DatosClinicos;
  setDatos: Dispatch<SetStateAction<DatosClinicos>>;
}

/* ================= COMPONENTE ================= */

export default function SeccionCheckList({
  datos,
  setDatos,
}: Props) {

  const isMobile = window.innerWidth < 768;

  const categorias = datos.checklist.categorias;

  /* ================= TOGGLE ================= */

  const toggleItem = (cIndex: number, iIndex: number) => {
    setDatos((prev) => ({
      ...prev,
      checklist: {
        categorias: prev.checklist.categorias.map((cat, ci) =>
          ci !== cIndex
            ? cat
            : {
                ...cat,
                items: cat.items.map((item, ii) =>
                  ii !== iIndex
                    ? item
                    : { ...item, checked: !item.checked }
                ),
              }
        ),
      },
    }));
  };

  /* ================= PORCENTAJE ================= */

  const porcentaje = useMemo(() => {
    const total = categorias.reduce(
      (acc, cat) => acc + cat.items.length,
      0
    );

    const completados = categorias.reduce(
      (acc, cat) =>
        acc + cat.items.filter((i) => i.checked).length,
      0
    );

    if (total === 0) return 0;

    return Math.round((completados / total) * 100);
  }, [categorias]);

  /* ================= UI ================= */

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>
        Sistema de Verificación (Checklist Completo)
      </h1>

      <h1 style={{ fontSize: 15, fontWeight: 500 }}>
        (AmSECT)
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: 20,
        }}
      >
        {categorias.map((cat, cIndex) => (
          <section key={cat.titulo} style={card}>
            <div style={header}>
              {getIcon(cat.titulo)}
              <span>{cat.titulo}</span>
            </div>

            {cat.items.map((item, iIndex) => (
              <button
                key={item.label}
                onClick={() => toggleItem(cIndex, iIndex)}
                style={{
                  ...itemRow,
                  borderColor: item.checked ? "#5eead4" : "#1e293b",
                  color: item.checked ? "#e5e7eb" : "#94a3b8",
                }}
              >
                {item.checked ? (
                  <CheckCircle2 size={16} color="#5eead4" />
                ) : (
                  <Circle size={16} />
                )}

                <span style={{ flex: 1 }}>
                  {item.label}
                </span>
              </button>
            ))}
          </section>
        ))}
      </div>

      {/* ================= BARRA ================= */}

      <div style={barraContainer}>
        <div style={barraHeader}>
          <span>Cumplimiento total del Check List</span>
          <span>{porcentaje}%</span>
        </div>

        <div style={barraFondo}>
          <div
            style={{
              ...barraProgreso,
              width: `${porcentaje}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ================= ICONOS ================= */

function getIcon(titulo: string) {
  const icons: Record<string, React.ReactNode> = {
    PACIENTE: <User size={18} />,
    "ESTERILIDAD / LIMPIEZA": <Sparkles size={18} />,
    BOMBA: <Zap size={18} />,
    ELÉCTRICO: <Plug size={18} />,
    CARDIOPLEJÍA: <HeartPulse size={18} />,
    "SUMINISTRO DE GASES": <Wind size={18} />,
    "MECANISMOS DE SEGURIDAD": <ShieldCheck size={18} />,
    MONITORIZACIÓN: <Activity size={18} />,
    ANTICOAGULACIÓN: <FlaskConical size={18} />,
    RESPALDO: <LifeBuoy size={18} />,
  };

  return icons[titulo] || null;
}

/* ================= ESTILOS ================= */

const card: React.CSSProperties = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: 16,
  padding: 10,
};

const header: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  fontWeight: 800,
  color: "#5eead4",
  marginBottom: 12,
  fontSize: 15,
  letterSpacing: 1,
};

const itemRow: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid #1e293b",
  background: "#020617",
  cursor: "pointer",
  textAlign: "left",
  marginBottom: 6,
  fontSize: 13,
};

const barraContainer: React.CSSProperties = {
  marginTop: 30,
  padding: 20,
  background: "#0f172a",
  borderRadius: 16,
  border: "1px solid #1e293b",
};

const barraHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 10,
  fontWeight: 700,
  fontSize: 14,
};

const barraFondo: React.CSSProperties = {
  width: "100%",
  height: 14,
  background: "#1e293b",
  borderRadius: 8,
  overflow: "hidden",
};

const barraProgreso: React.CSSProperties = {
  height: "100%",
  background: "#5eead4",
  borderRadius: 8,
  transition: "width 0.3s ease",
};