import { useEffect } from "react";

import { Activity } from "lucide-react";

import type { DatosClinicos } from "../types/DatosClinicos";

import type { Dispatch, SetStateAction } from "react";

/* ================= PROPS ================= */

interface Props {

  datos: DatosClinicos;

  setDatos: Dispatch<SetStateAction<DatosClinicos>>;

}

/* ================= COMPONENTE ================= */

export default function PerfusionSelectivaSection({

  datos,

  setDatos,

}: Props) {

  if (!datos || !setDatos) return null;

  const perfusion = datos.planPerfusion.perfusionSelectiva;

  /* ================= CÁLCULO ================= */

  useEffect(() => {

    const p = parseFloat(perfusion.pesoCerebral);

    const factor = Number(perfusion.factorCerebral);

    if (!isNaN(p) && p > 0 && !isNaN(factor)) {

      const flujo = p * factor;

      setDatos((prev) => ({

        ...prev,

        planPerfusion: {

          ...prev.planPerfusion,

          perfusionSelectiva: {

            ...prev.planPerfusion.perfusionSelectiva,

            flujoCerebral: flujo.toFixed(0),

          },

        },

      }));

    } else {

      setDatos((prev) => ({

        ...prev,

        planPerfusion: {

          ...prev.planPerfusion,

          perfusionSelectiva: {

            ...prev.planPerfusion.perfusionSelectiva,

            flujoCerebral: "0",

          },

        },

      }));

    }

  }, [

    perfusion.pesoCerebral,

    perfusion.factorCerebral,

    setDatos,

  ]);

  /* ================= HELPERS ================= */

  const updateField = (

    field: keyof typeof perfusion,

    value: any

  ) => {

    setDatos((prev) => ({

      ...prev,

      planPerfusion: {

        ...prev.planPerfusion,

        perfusionSelectiva: {

          ...prev.planPerfusion.perfusionSelectiva,

          [field]: value,

        },

      },

    }));

  };

  /* ================= UI ================= */

  return (

    <section style={container}>

      <div style={header}>

        <Activity size={26} color="#5eead4" />

        <h2 style={title}>Perfusión Regional y Selectiva</h2>

      </div>

      <hr style={divider} />

      <div style={grid}>

        {/* CEREBRAL */}

        <div style={cardBlue}>

          <div style={subHeaderRow}>

            <div style={subHeaderBlue}>

              🧠 CEREBRAL SELECTIVA

            </div>

            <YesNo

              active={perfusion.cerebralActiva}

              setActive={(v) =>

                updateField("cerebralActiva", v)

              }

            />

          </div>

          <label style={label}>PESO (kg)</label>

          <input

            value={perfusion.pesoCerebral}

            onChange={(e) =>

              updateField(

                "pesoCerebral",

                e.target.value

              )

            }

            style={input}

          />

          <label

            style={{

              ...label,

              marginTop: 16,

            }}

          >

            DOSIS (mL/kg)

          </label>

          <select

            value={

              perfusion.factorCerebral ?? ""

            }

            onChange={(e) =>

              updateField(

                "factorCerebral",

                e.target.value

              )

            }

            style={input}

          >

            <option value="">

              Seleccionar…

            </option>

            <option value="6">

              6 mL/kg

            </option>

            <option value="8">

              8 mL/kg

            </option>

            <option value="10">

              10 mL/kg

            </option>

          </select>

          <label

            style={{

              ...label,

              marginTop: 16,

            }}

          >

            VÍA DE PERFUSIÓN

          </label>

          <select

            value={perfusion.viaCerebral}

            onChange={(e) =>

              updateField(

                "viaCerebral",

                e.target.value

              )

            }

            style={input}

          >

            <option value="">

              Seleccionar…

            </option>

            <option value="anterograda">

              Anterógrada

            </option>

            <option value="retrograda">

              Retrógrada

            </option>

          </select>

          <label

            style={{

              ...label,

              marginTop: 20,

            }}

          >

            FLUJO CEREBRAL (mL/min)

          </label>

          <input

            value={

              perfusion.flujoCerebral

            }

            readOnly

            style={{

              ...input,

              fontWeight: 900,

              color: "#5eead4",

              fontSize: 18,

            }}

          />

        </div>

        {/* MIOCÁRDICA */}

        <div style={cardRed}>

          <div style={subHeaderRow}>

            <div style={subHeaderRed}>

              ❤️ MIOCÁRDICA

            </div>

            <YesNo

              active={

                perfusion.miocardicaActiva

              }

              setActive={(v) =>

                updateField(

                  "miocardicaActiva",

                  v

                )

              }

            />

          </div>

          <label style={label}>

            FLUJO (mL/min)

          </label>

          <input

            value={

              perfusion.flujoMiocardico

            }

            onChange={(e) =>

              updateField(

                "flujoMiocardico",

                e.target.value

              )

            }

            style={input}

          />

          <label

            style={{

              ...label,

              marginTop: 16,

            }}

          >

            PRESIÓN (mmHg)

          </label>

          <input

            value={

              perfusion.presionMiocardica

            }

            onChange={(e) =>

              updateField(

                "presionMiocardica",

                e.target.value

              )

            }

            style={input}

          />

        </div>

        {/* DISTAL */}

        <div style={cardOrange}>

          <div style={subHeaderRow}>

            <div style={subHeaderOrange}>

              🦵 PERFUSIÓN DISTAL

            </div>

            <YesNo

              active={perfusion.distalActiva}

              setActive={(v) =>

                updateField(

                  "distalActiva",

                  v

                )

              }

            />

          </div>

          <label style={label}>

            CÁNULA (Fr)

          </label>

          <input

            value={

              perfusion.canulaDistal

            }

            onChange={(e) =>

              updateField(

                "canulaDistal",

                e.target.value

              )

            }

            style={input}

          />

          <label

            style={{

              ...label,

              marginTop: 16,

            }}

          >

            FLUJO (L/min)

          </label>

          <input

            value={

              perfusion.flujoDistal

            }

            onChange={(e) =>

              updateField(

                "flujoDistal",

                e.target.value

              )

            }

            style={input}

          />

        </div>

      </div>

    </section>

  );

}


/* ================= COMPONENTES ================= */

function YesNo({
  active,
  setActive,
}: {
  active: boolean;
  setActive: (v: boolean) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      <button
        onClick={() => setActive(true)}
        style={{
          ...toggle,
          background: active ? "#5eead4" : "#020617",
          color: active ? "#020617" : "#94a3b8",
        }}
      >
        SÍ
      </button>
      <button
        onClick={() => setActive(false)}
        style={{
          ...toggle,
          background: !active ? "#fb7185" : "#020617",
          color: !active ? "#020617" : "#94a3b8",
        }}
      >
        NO
      </button>
    </div>
  );
}

/* ================= ESTILOS (SIN CAMBIOS VISUALES) ================= */

const container: React.CSSProperties = {
  background: "#0f172a",
  borderRadius: 24,
  padding: 24,
  border: "1px solid #1e293b",
  boxSizing: "border-box",
};

const header: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const title: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  color: "#5eead4",
};

const divider: React.CSSProperties = {
  borderColor: "#1e293b",
  margin: "20px 0 28px",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 28,
};

const cardBase: React.CSSProperties = {
  background: "#020617",
  borderRadius: 20,
  padding: 24,
  border: "1px solid",
  width: "100%",
  boxSizing: "border-box",
};

const cardBlue = { ...cardBase, borderColor: "#38bdf840" };
const cardRed = { ...cardBase, borderColor: "#fb718540" };
const cardOrange = { ...cardBase, borderColor: "#fb923c40" };

const subHeaderRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
  fontSize: 14,
};

const subHeaderBlue = { color: "#38bdf8", fontWeight: 800 };
const subHeaderRed = { color: "#fb7185", fontWeight: 800 };
const subHeaderOrange = { color: "#fb923c", fontWeight: 800 };

const label: React.CSSProperties = {
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
  boxSizing: "border-box",
};

const toggle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 10,
  border: "1px solid #334155",
  fontSize: 12,
  fontWeight: 800,
  cursor: "pointer",
};