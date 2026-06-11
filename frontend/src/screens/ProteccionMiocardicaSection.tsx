import { useEffect } from "react";
import { Heart, Thermometer, Weight } from "lucide-react";
import type { DatosClinicos } from "../types/DatosClinicos";
import type { Dispatch, SetStateAction } from "react";

/* ================= PROPS ================= */

interface Props {
  datos: DatosClinicos;
  setDatos: Dispatch<SetStateAction<DatosClinicos>>;
}

/* ================= COMPONENTE ================= */

export default function ProteccionMiocardicaSection({
  datos,
  setDatos,
}: Props) {

  if (!datos || !setDatos) return null;

  const isMobile = window.innerWidth < 768;

  const proteccion = datos.planPerfusion.proteccionMiocardica;

  /* ================= CÁLCULOS ================= */

  const pesoNumero = parseFloat(proteccion.peso || "0");

  const refuerzo10 =
    pesoNumero > 0
      ? (pesoNumero * 10).toFixed(0)
      : "";

  const refuerzo15 =
    pesoNumero > 0
      ? (pesoNumero * 15).toFixed(0)
      : "";

  /* ================= VOLUMEN ================= */

  useEffect(() => {
    const p = parseFloat(proteccion.peso);

    if (!isNaN(p) && p > 0) {

      const volumenCalc =
        p * proteccion.dosisMlKg;

      setDatos((prev) => ({
        ...prev,
        planPerfusion: {
          ...prev.planPerfusion,
          proteccionMiocardica: {
            ...prev.planPerfusion.proteccionMiocardica,
            volumen:
              volumenCalc.toFixed(0),
          },
        },
      }));

    } else {

      setDatos((prev) => ({
        ...prev,
        planPerfusion: {
          ...prev.planPerfusion,
          proteccionMiocardica: {
            ...prev.planPerfusion.proteccionMiocardica,
            volumen: "",
          },
        },
      }));
    }

  }, [
    proteccion.peso,
    proteccion.dosisMlKg,
    setDatos,
  ]);

  /* ================= HANDLERS ================= */

  const updateField = <
    K extends keyof typeof proteccion
  >(
    field: K,
    value: typeof proteccion[K]
  ) => {

    setDatos((prev) => ({
      ...prev,
      planPerfusion: {
        ...prev.planPerfusion,
        proteccionMiocardica: {
          ...prev.planPerfusion
            .proteccionMiocardica,

          [field]: value,
        },
      },
    }));
  };

  const toggleVia = (via: string) => {

    const nuevas =
      proteccion.viasAdministracion.includes(
        via
      )
        ? proteccion.viasAdministracion.filter(
            (v) => v !== via
          )
        : [
            ...proteccion.viasAdministracion,
            via,
          ];

    updateField(
      "viasAdministracion",
      nuevas
    );
  };

  return (
    <section style={container}>
      <div style={header}>
        <Heart
          size={26}
          color="#5eead4"
        />
        <h2 style={title}>
          Protección Miocárdica
          (Cardioplegia)
        </h2>
      </div>

      <hr style={divider} />

      <div
        style={{
          ...grid,
          gridTemplateColumns:
            isMobile
              ? "1fr"
              : "1fr 1fr",
        }}
      >

        {/* IZQUIERDA */}

        <div
          style={{
            ...card,
            borderColor:
              "#fb718540",
          }}
        >
          <div style={subHeaderRed}>
            <Heart size={18}/>
            <span>
              ESTRATEGIA DE ENTREGA
            </span>
          </div>

          <label style={label}>
            TIPO DE SOLUCIÓN
          </label>

          <div style={pillGroup}>
            {[
              "ST THOMAS",
              "PLEGISOL",
              "DEL NIDO",
              "CUSTODIOL",
              "OTRA",
            ].map((tipo) => (
              <Pill
                key={tipo}
                text={tipo}
                active={
                  proteccion.tipoSolucion
                  === tipo
                }
                onClick={() =>
                  updateField(
                    "tipoSolucion",
                    tipo
                  )
                }
              />
            ))}
          </div>

          <label
            style={{
              ...label,
              marginTop:20,
            }}
          >
            VÍA DE ADMINISTRACIÓN
          </label>

          <div style={pillGroup}>
            {[
              "ANTEROGRADA",
              "RETROGRADA",
              "OSTIUM",
            ].map((via)=>(
              <Pill
                key={via}
                text={via}
                active={
                  proteccion
                  .viasAdministracion
                  .includes(via)
                }
                onClick={() =>
                  toggleVia(via)
                }
              />
            ))}
          </div>
        </div>

        {/* DERECHA */}

        <div
          style={{
            ...card,
            borderColor:
              "#38bdf840",
          }}
        >

          <div style={subHeaderBlue}>
            <Thermometer
              size={18}
            />
            <span>
              PARÁMETROS DE ENTREGA
            </span>
          </div>

          <div
            style={{
              ...grid2,
              gridTemplateColumns:
                isMobile
                  ? "1fr"
                  : "repeat(2,1fr)",
            }}
          >

            {/* PESO */}

            <div>
              <label style={label}>
                Peso (kg)
              </label>

              <div style={inputWithIcon}>
                <Weight size={16}/>

                <input
                  value={
                    proteccion.peso
                  }
                  onChange={(e)=>
                    updateField(
                      "peso",
                      e.target.value
                    )
                  }
                  placeholder="70"
                  style={
                    inputInner
                  }
                />
              </div>
            </div>

            {/* TEMPERATURA */}

            <div>
              <label style={label}>
                Temperatura objetivo
              </label>

              <input
                type="number"
                value={
                  proteccion.temperatura
                }
                onChange={(e)=>
                  updateField(
                    "temperatura",
                    e.target.value
                  )
                }
                style={input}
              />
            </div>

            {/* DOSIS INICIAL */}

            <div>
              <label style={label}>
                Dosis inicial
              </label>

              <div style={pillGroup}>
                <Pill
                  text="20 ml/kg"
                  active={
                    proteccion.dosisMlKg===20
                  }
                  onClick={()=>updateField(
                    "dosisMlKg",
                    20
                  )}
                />

                <Pill
                  text="30 ml/kg"
                  active={
                    proteccion.dosisMlKg===30
                  }
                  onClick={()=>updateField(
                    "dosisMlKg",
                    30
                  )}
                />
              </div>
            </div>

            {/* VOLUMEN */}

            <div>
              <label style={label}>
                Volumen inicial
              </label>

              <input
                value={
                  proteccion.volumen
                }
                readOnly
                style={{
                  ...input,
                  color:"#5eead4",
                  fontWeight:800
                }}
              />
            </div>

            {/* NUEVO */}

            <div>
              <label style={label}>
                Refuerzo 10 ml/kg
              </label>

              <input
                value={refuerzo10}
                readOnly
                style={{
                  ...input,
                  color:"#facc15",
                  fontWeight:800
                }}
              />
            </div>

            <div>
              <label style={label}>
                Refuerzo 15 ml/kg
              </label>

              <input
                value={refuerzo15}
                readOnly
                style={{
                  ...input,
                  color:"#fb7185",
                  fontWeight:800
                }}
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
/* ================= COMPONENTES ================= */

function Pill({
  text,
  active,
  onClick,
}: {
  text: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...pill,
        borderColor: active ? "#5eead4" : "#334155",
        color: active ? "#5eead4" : "#e5e7eb",
        background: active ? "#022c22" : "#020617",
      }}
    >
      {text}
    </button>
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
  gap: 28,
  fontSize: 14,
};

const card: React.CSSProperties = {
  background: "#020617",
  borderRadius: 20,
  padding: 24,
  border: "1px solid",
  width: "100%",
  boxSizing: "border-box",
};

const subHeaderRed: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  color: "#fb7185",
  fontWeight: 800,
  letterSpacing: 1,
  marginBottom: 20,
};

const subHeaderBlue: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  color: "#38bdf8",
  fontWeight: 800,
  letterSpacing: 1,
  marginBottom: 20,
};

const label: React.CSSProperties = {
  fontSize: 12,
  color: "#94a3b8",
  marginBottom: 8,
  display: "block",
};

const pillGroup: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginBottom: 14,
};

const pill: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 999,
  border: "1px solid #334155",
  fontSize: 10,
  fontWeight: 600,
  cursor: "pointer",
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

const inputWithIcon: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "0 12px",
  borderRadius: 12,
  background: "#020617",
  border: "1px solid #334155",
};

const inputInner: React.CSSProperties = {
  flex: 1,
  background: "transparent",
  border: "none",
  color: "white",
  padding: "12px 0",
  outline: "none",
};

const grid2: React.CSSProperties = {
  display: "grid",
  gap: 16,
};