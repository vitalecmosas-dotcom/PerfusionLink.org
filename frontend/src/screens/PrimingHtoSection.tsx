import { useMemo } from "react";
import { Droplet, Activity } from "lucide-react";
import type { DatosClinicos } from "../types/DatosClinicos";
import type { Dispatch, SetStateAction } from "react";

/* ================= PROPS ================= */

interface Props {
  datos: DatosClinicos;
  setDatos: Dispatch<SetStateAction<DatosClinicos>>;
}

/* ================= COMPONENTE ================= */

export default function PrimingHtoSection({
  datos,
  setDatos,
}: Props) {
  if (!datos?.planPerfusion?.priming) return null;
console.log(datos.planPerfusion);
  const priming = datos.planPerfusion.priming;
const defaultPrimingItems = {
  lactatoRinger: "",
  salina: "",
  plasmalyte: "",
  polielectrolitica: "",
  gelatina: "",
  albumina: "",
  manitol: "",
  tranexamico: "",
  bicarbonato: "",
  heparina: "",
  magnesio: "",
  sangre: "",
};

const primingItems: Record<string, string> = {
  ...defaultPrimingItems,
  ...(priming.primingItems ?? {}),
};

  const isMobile = window.innerWidth < 768;

  /* ===== CÁLCULO VOLEMIA ===== */
  const volemia = useMemo(() => {
    const p = parseFloat(priming.peso);
    if (!isNaN(p) && p > 0) {
      return (p * 70).toFixed(0);
    }
    return "0";
  }, [priming.peso]);

  /* ===== SUMA AUTOMÁTICA DEL PRIMING ===== */
  const primingTotal = useMemo(() => {
    const total = Object.values(primingItems).reduce(
      (acc, val) => acc + (parseFloat(val) || 0),
      0
    );
    return total.toFixed(0);
  }, [primingItems]);

  /* ===== HTO HEMODILUCIONAL ===== */
  const htoHemodilucional = useMemo(() => {
    const hto = parseFloat(priming.htoPre);
    const vol = parseFloat(volemia);
    const p = parseFloat(primingTotal);
    const a = parseFloat(priming.anestesia);
    const c = parseFloat(priming.cardioplejia);

    if (
      !isNaN(hto) &&
      !isNaN(vol) &&
      !isNaN(p) &&
      !isNaN(a) &&
      !isNaN(c) &&
      vol > 0
    ) {
      const resultado = (hto * vol) / (vol + p + a + c);
      return resultado.toFixed(1);
    }

    return "—";
  }, [
    priming.htoPre,
    volemia,
    primingTotal,
    priming.anestesia,
    priming.cardioplejia,
  ]);

  /* ===== UPDATE HELPERS ===== */

  const updateField = (
    field: keyof typeof priming,
    value: string
  ) => {
    setDatos((prev) => ({
      ...prev,
      planPerfusion: {
        ...prev.planPerfusion,
        priming: {
          ...prev.planPerfusion.priming,
          [field]: value,
        },
      },
    }));
  };

  const updateItem = (
    key: keyof typeof primingItems,
    value: string
  ) => {
    setDatos((prev) => ({
      ...prev,
      planPerfusion: {
        ...prev.planPerfusion,
        priming: {
          ...prev.planPerfusion.priming,
          primingItems: {
            ...prev.planPerfusion.priming.primingItems,
            [key]: value,
          },
        },
      },
    }));
  };

  return (
    <section style={container}>
      {/* HEADER */}
      <div style={header}>
        <Droplet size={26} color="#5eead4" />
        <h2 style={title}>Priming y Hto Hemodilucional</h2>
      </div>

      <hr style={divider} />

      <div
        style={{
          ...grid,
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        }}
      >
        {/* COLUMNA IZQUIERDA */}
        <div style={{ ...card, borderColor: "#5eead440" }}>
          <div style={subHeaderGreen}>
            <Activity size={18} />
            <span>CÁLCULO HEMODILUCIONAL</span>
          </div>

          <Input
            label="Peso (kg)"
            value={priming.peso}
            onChange={(v) => updateField("peso", v)}
          />

          <Info label="Volemia estimada (ml)" value={volemia} />

          <Input
            label="Hto preoperatorio (%)"
            value={priming.htoPre}
            onChange={(v) => updateField("htoPre", v)}
          />

          <Info label="Volumen priming total (ml)" value={primingTotal} />

          <Input
            label="Volumen anestesia (ml)"
            value={priming.anestesia}
            onChange={(v) => updateField("anestesia", v)}
          />

          <Input
            label="Volumen cardioplejía (ml)"
            value={priming.cardioplejia}
            onChange={(v) => updateField("cardioplejia", v)}
          />

          <Info
            label="Hto hemodilucional estimado (%)"
            value={htoHemodilucional}
            highlight
          />
        </div>

        {/* COLUMNA DERECHA – PRIMING */}
        <div style={{ ...card, borderColor: "#22d3ee40" }}>
          <div style={subHeaderCyan}>
            🧪 <span>PRIMING (ml)</span>
          </div>

          <div style={primingGrid}>
            {Object.entries(PRIMING_LABELS).map(
              ([key, label]) => (
                <PrimingInput
                  key={key}
                  label={label}
                  value={
                    primingItems[
                      key as keyof typeof primingItems
                    ]
                  }
                  onChange={(v) =>
                    updateItem(
                      key as keyof typeof primingItems,
                      v
                    )
                  }
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= CONSTANTES ================= */

const PRIMING_LABELS = {
  lactatoRinger: "Lactato Ringer",
  salina: "Solución salina",
  plasmalyte: "Plasmalyte",
  polielectrolitica: "Polielectrolítica",
  gelatina: "Gelatina",
  albumina: "Albúmina",
  manitol: "Manitol",
  tranexamico: "Ácido tranexámico",
  bicarbonato: "Bicarbonato sodio",
  heparina: "Heparina",
  magnesio: "Sulfato de magnesio",
};

/* ================= COMPONENTES ================= */

function Input({
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
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={input}
      />
    </div>
  );
}

function Info({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div style={infoBox}>
      <div style={{ fontSize: 12, color: "#94a3b8" }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 900,
          color: highlight ? "#5eead4" : "white",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function PrimingInput({
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
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ml"
        style={input}
      />
    </div>
  );
}

/* ================= ESTILOS ================= */

const container: React.CSSProperties = {
  background: "#0f172a",
  borderRadius: 24,
  padding: 24,
  border: "1px solid #1e293b",
  boxSizing: "border-box",
};

const header = { display: "flex", alignItems: "center", gap: 12 };
const title = { fontSize: 22, fontWeight: 800, color: "#5eead4" };
const divider = { borderColor: "#1e293b", margin: "20px 0 28px" };

const grid: React.CSSProperties = {
  display: "grid",
  gap: 28,
};

const card: React.CSSProperties = {
  background: "#020617",
  borderRadius: 20,
  padding: 24,
  border: "1px solid",
  width: "100%",
  boxSizing: "border-box",
};

const subHeaderGreen = {
  display: "flex",
  gap: 10,
  color: "#5eead4",
  fontWeight: 800,
  marginBottom: 20,
  fontSize: 14,
};

const subHeaderCyan = {
  display: "flex",
  gap: 10,
  color: "#22d3ee",
  fontWeight: 800,
  marginBottom: 20,
  fontSize: 14,
};

const labelStyle = {
  fontSize: 12,
  color: "#94a3b8",
  marginBottom: 6,
  display: "block",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  background: "#020617",
  border: "1px solid #334155",
  color: "white",
  marginBottom: 14,
  boxSizing: "border-box",
};

const infoBox: React.CSSProperties = {
  background: "#020617",
  borderRadius: 14,
  padding: 16,
  border: "1px solid #334155",
  textAlign: "center",
  marginTop: 10,
};

const primingGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
};