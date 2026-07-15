import type {
  ReactNode,
  CSSProperties,
} from "react";

import type {
  DatosClinicos,
} from "../types/DatosClinicos";

interface Props {
  datos: DatosClinicos;

  setDatos: React.Dispatch<
    React.SetStateAction<DatosClinicos>
  >;

  role: string;
}

export default function LaboratoriosSection({
  datos,
  setDatos,
  role,
}: Props) {

  const lab =
    datos.laboratoriosPre as any;

  if (!lab) return null;

  /* ================= TFG ================= */

  const edad =
    Number(datos.edad || 0);

  const peso =
    Number(datos.pesoReal || 0);

  const creatinina =
    Number(lab.creatinina || 0);

  const sexo =
    datos.genero || "";

  let tfg = 0;

  let clasificacionTFG = "";

  let colorTFG = "#5eead4";

  /* ===== COCKCROFT-GAULT ===== */

  if (
    edad > 0 &&
    peso > 0 &&
    creatinina > 0
  ) {

    tfg =
      (
        ((140 - edad) * peso) /
        (72 * creatinina)
      );

    if (sexo === "Femenino") {

      tfg =
        tfg * 0.85;
    }

    /* ===== CLASIFICACIÓN ===== */

    if (tfg >= 90) {

      clasificacionTFG =
        "Normal";

      colorTFG =
        "#22c55e";
    }

    else if (tfg >= 60) {

      clasificacionTFG =
        "Leve disminución";

      colorTFG =
        "#84cc16";
    }

    else if (tfg >= 30) {

      clasificacionTFG =
        "Moderada";

      colorTFG =
        "#facc15";
    }

    else if (tfg >= 15) {

      clasificacionTFG =
        "Severa";

      colorTFG =
        "#f97316";
    }

    else {

      clasificacionTFG =
        "Falla renal";

      colorTFG =
        "#ef4444";
    }
  }

  return (

    <section style={container}>

      <header style={header}>

        <span
          style={{
            fontSize: 26,
          }}
        >
          🧪
        </span>

        <h2 style={title}>
          Laboratorios pre
        </h2>

      </header>

      <hr style={divider} />

      <div style={grid}>

        {/* ================= HEMATOLOGÍA ================= */}
{role === "admin" && (
        <Card
          title="Hematología y Coagulación"
          color="#fb7185"
          icon="🩸"
        >

          <TwoCols>

            <Input
              label="HB (g/dL)"
              value={lab.hb ?? ""}
              onChange={(v) =>
                update("hb", v)
              }
            />

            <Input
              label="HTO (%)"
              value={lab.hto ?? ""}
              onChange={(v) =>
                update("hto", v)
              }
            />

            <Input
              label="Plaquetas"
              value={lab.plaquetas ?? ""}
              onChange={(v) =>
                update("plaquetas", v)
              }
            />

            <Input
              label="ACT pre (seg)"
              value={lab.actPre ?? ""}
              onChange={(v) =>
                update("actPre", v)
              }
            />

            <Input
              label="Leucocitos"
              value={lab.leucocitos ?? ""}
              onChange={(v) =>
                update("leucocitos", v)
              }
            />

            <Input
              label="TP (seg)"
              value={lab.tp ?? ""}
              onChange={(v) =>
                update("tp", v)
              }
            />

          </TwoCols>

          <Input
            label="TPT (seg)"
            value={lab.tpt ?? ""}
            onChange={(v) =>
              update("tpt", v)
            }
          />

        </Card>
)}
        {/* ================= PERFIL METABÓLICO ================= */}
{role === "admin" && (
        <Card
          title="Perfil Metabólico"
          color="#facc15"
          icon="⚗️"
        >

          <Input
            label="Glucemia (mg/dL)"
            value={lab.glucemia ?? ""}
            onChange={(v) =>
              update("glucemia", v)
            }
          />

          <Input
            label="HbA1c (%)"
            value={lab.hbA1c ?? ""}
            onChange={(v) =>
              update("hbA1c", v)
            }
          />

          <Input
            label="Lactato (mmol/L)"
            value={lab.lactato ?? ""}
            onChange={(v) =>
              update("lactato", v)
            }
          />

          <StatusBox
            label="Estado glucémico"
            value="Normal"
          />

        </Card>
)}
        {/* ================= FUNCIÓN ÓRGANOS ================= */}

        <Card
          title="Función de Órganos"
          color="#5eead4"
          icon="🫀"
        >

          <SectionTitle text="Función renal" />

          <TwoCols>

            <Input
              label="Creatinina"
              value={lab.creatinina ?? ""}
              onChange={(v) =>
                update("creatinina", v)
              }
            />

            <Input
              label="Urea"
              value={lab.urea ?? ""}
              onChange={(v) =>
                update("urea", v)
              }
            />

          </TwoCols>

          <div>

            <CalculatedInput
              label="TFG estimada"
              value={
                tfg > 0
                  ? `${tfg.toFixed(1)} mL/min`
                  : "--"
              }
            />

            {tfg > 0 && (

              <div
                style={{
                  marginTop: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  color: colorTFG,
                }}
              >
                {clasificacionTFG}
              </div>

            )}

          </div>

          <Input
            label="Diuresis pre"
            value={lab.diuresisPre ?? ""}
            onChange={(v) =>
              update("diuresisPre", v)
            }
          />
{role === "admin" && (

  <>

    <SectionTitle text="Función hepática" />

    <TwoCols>

      <Input
        label="TGO / AST"
        value={lab.tgo ?? ""}
        onChange={(v) =>
          update("tgo", v)
        }
      />

      <Input
        label="TGP / ALT"
        value={lab.tgp ?? ""}
        onChange={(v) =>
          update("tgp", v)
        }
      />

      <Input
        label="Bilirrubina total"
        value={
          lab.bilirrubinaTotal ?? ""
        }
        onChange={(v) =>
          update(
            "bilirrubinaTotal",
            v
          )
        }
      />

      <Input
        label="Bilirrubina directa"
        value={
          lab.bilirrubinaDirecta ?? ""
        }
        onChange={(v) =>
          update(
            "bilirrubinaDirecta",
            v
          )
        }
      />

    </TwoCols>

  </>

)}
</Card>
        {/* ================= GASOMETRÍA ARTERIAL ================= */}
{role === "admin" && (
        <Card
          title="Gasometría Arterial"
          color="#38bdf8"
          icon="🫁"
        >

          <TwoCols>

            <Input
              label="pH"
              value={lab.phA ?? ""}
              onChange={(v) =>
                update("phA", v)
              }
            />

            <Input
              label="pCO₂ (mmHg)"
              value={lab.pco2A ?? ""}
              onChange={(v) =>
                update("pco2A", v)
              }
            />

            <Input
              label="pO₂ (mmHg)"
              value={lab.po2A ?? ""}
              onChange={(v) =>
                update("po2A", v)
              }
            />

            <Input
              label="HCO₃⁻"
              value={lab.hco3A ?? ""}
              onChange={(v) =>
                update("hco3A", v)
              }
            />

            <Input
              label="BE"
              value={lab.beA ?? ""}
              onChange={(v) =>
                update("beA", v)
              }
            />

            <Input
              label="SaO₂ (%)"
              value={lab.sao2A ?? ""}
              onChange={(v) =>
                update("sao2A", v)
              }
            />

          </TwoCols>

        </Card>
)}
        {/* ================= GASOMETRÍA VENOSA ================= */}
{role === "admin" && (
        <Card
          title="Gasometría Venosa"
          color="#818cf8"
          icon="🩸"
        >

          <TwoCols>

            <Input
              label="pH"
              value={lab.phV ?? ""}
              onChange={(v) =>
                update("phV", v)
              }
            />

            <Input
              label="pCO₂ (mmHg)"
              value={lab.pco2V ?? ""}
              onChange={(v) =>
                update("pco2V", v)
              }
            />

            <Input
              label="pO₂ (mmHg)"
              value={lab.po2V ?? ""}
              onChange={(v) =>
                update("po2V", v)
              }
            />

            <Input
              label="HCO₃⁻"
              value={lab.hco3V ?? ""}
              onChange={(v) =>
                update("hco3V", v)
              }
            />

            <Input
              label="BE"
              value={lab.beV ?? ""}
              onChange={(v) =>
                update("beV", v)
              }
            />

            <Input
              label="SvO₂ (%)"
              value={lab.svo2 ?? ""}
              onChange={(v) =>
                update("svo2", v)
              }
            />

          </TwoCols>

        </Card>
)}
      </div>

    </section>
  );

  /* ================= UPDATE ================= */

  function update(
    field: string,
    value: string
  ) {

    setDatos((prev) => ({

      ...prev,

      laboratoriosPre: {

        ...prev.laboratoriosPre,

        [field]: value,
      },
    }));
  }
}

/* ================= COMPONENTES ================= */

function Card({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: string;
  color: string;
  children: ReactNode;
}) {

  return (

    <div
      style={{
        background: "#020617",
        borderRadius: 24,
        padding: 28,
        border: `1px solid ${color}40`,
        boxShadow: `0 0 0 1px ${color}20`,
        display: "flex",
        flexDirection: "column",
        gap: 18,
        width: "100%",
        boxSizing: "border-box",
      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >

        <span
          style={{
            fontSize: 20,
          }}
        >
          {icon}
        </span>

        <h3
          style={{
            margin: 0,
            fontSize: 14,
            color,
            letterSpacing: 1,
          }}
        >
          {title.toUpperCase()}
        </h3>

      </div>

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
  onChange: (v: string) => void;
}) {

  return (

    <div>

      <label style={labelStyle}>
        {label}
      </label>

      <input
        style={input}
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />

    </div>
  );
}

function CalculatedInput({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (

    <div>

      <label style={labelStyle}>
        {label}
      </label>

      <input
        disabled
        value={value}
        style={{
          ...input,
          color: "#5eead4",
          fontWeight: 700,
        }}
      />

    </div>
  );
}

function TwoCols({
  children,
}: {
  children: ReactNode;
}) {

  return (

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(2, minmax(0, 1fr))",
        gap: 14,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  text,
}: {
  text: string;
}) {

  return (

    <div
      style={{
        fontSize: 13,
        color: "#5eead4",
        fontWeight: 700,
      }}
    >
      {text.toUpperCase()}
    </div>
  );
}

function StatusBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (

    <div
      style={{
        background: "#020617",
        borderRadius: 14,
        padding: 16,
        border: "1px solid #334155",
        textAlign: "center",
      }}
    >

      <div
        style={{
          fontSize: 12,
          color: "#94a3b8",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 16,
          fontWeight: 800,
        }}
      >
        {value}
      </div>

    </div>
  );
}

/* ================= ESTILOS ================= */

const container: CSSProperties = {
  background: "#0f172a",
  borderRadius: 20,
  padding: 20,
  border: "1px solid #1e293b",
  marginTop: 15,
};

const header: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 16,
};

const title: CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
  color: "#5eead4",
};

const divider: CSSProperties = {
  borderColor: "#1e293b",
  marginBottom: 28,
};

const grid: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
  width: "100%",
  boxSizing: "border-box",
};

const labelStyle: CSSProperties = {
  fontSize: 11,
  color: "#94a3b8",
  marginBottom: 6,
  display: "block",
};

const input: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  background: "#020617",
  border: "1px solid #334155",
  color: "white",
};