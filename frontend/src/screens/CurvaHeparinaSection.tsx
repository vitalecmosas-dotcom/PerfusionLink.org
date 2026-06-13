import type { DatosClinicos } from "../types/DatosClinicos";
import type { Dispatch, SetStateAction } from "react";
import CurvaBullChart from "./CurvaBullChart";

interface Props {
  datos: DatosClinicos;
  setDatos: Dispatch<SetStateAction<DatosClinicos>>;
}

export default function CurvaHeparinaSection({
  datos,
  setDatos,
}: Props) {

  const curva =
    datos.planPerfusion.curvaHeparina;

  /* ================= CÁLCULOS ================= */

  const actBasal =
    Number(curva.actBasal);

  const actPost =
    Number(curva.actPostHeparina);

  const peso =
    Number(curva.peso);

  const dosisInicialMgKg =
    Number(curva.dosisInicialMgKg || 2);

  const dosisInicial =
    peso
      ? (
          peso *
          dosisInicialMgKg
        ).toFixed(0)
      : "";

  const actFinal =
    Number(curva.actPostDosisFinal);

  const sensibilidad =
    actPost > actBasal
      ? (
          (actPost - actBasal) /
          dosisInicialMgKg
        ).toFixed(1)
      : "";

  const dosisNecesaria =
    sensibilidad
      ? (
          (480 - actBasal) /
          Number(sensibilidad)
        ).toFixed(1)
      : "";

  const dosisTotal =
    peso && dosisNecesaria
      ? (
          peso *
          Number(dosisNecesaria)
        ).toFixed(0)
      : "";

  const diferenciaHeparina =
    dosisTotal && dosisInicial
      ? (
          Number(dosisTotal) -
          Number(dosisInicial)
        ).toFixed(0)
      : "";

  const resistenciaHeparina =
    Number(sensibilidad) > 0 &&
    Number(sensibilidad) < 80;

  /* ================= MENSAJES ================= */

  let mensajeClinico = "";
  let colorMensaje = "#5eead4";

  let mensajeHeparina = "";
  let colorHeparina = "#5eead4";

  /* ===== MENSAJE ACT ===== */

  if (actFinal > 0) {

    if (actFinal >= 480) {

      mensajeClinico =
        "✅ Anticoagulación adecuada";

      colorMensaje = "#22c55e";
    }

    else if (actFinal >= 400) {

      mensajeClinico =
        "⚠️ ACT aceptable pero menor al objetivo";

      colorMensaje = "#f59e0b";
    }

    else {

      mensajeClinico =
        "🚨 ACT insuficiente para CEC";

      colorMensaje = "#ef4444";
    }
  }

  /* ===== MENSAJE HEPARINA ===== */

  if (Number(diferenciaHeparina) > 0) {

    mensajeHeparina =
      `Faltan ${diferenciaHeparina} mg de heparina`;

    colorHeparina = "#f59e0b";
  }

  else if (Number(diferenciaHeparina) < 0) {

    mensajeHeparina =
      `Exceso de ${Math.abs(Number(diferenciaHeparina))} mg de heparina`;

    colorHeparina = "#ef4444";
  }

  else if (Number(diferenciaHeparina) === 0) {

    mensajeHeparina =
      "Dosis exacta para ACT objetivo";

    colorHeparina = "#22c55e";
  }

  /* ================= RENDER ================= */

  return (

    <div
      style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: 28,
        padding: 28,
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 28,
        }}
      >
        <span
          style={{
            fontSize: 20,
          }}
        >
          📈
        </span>

        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#5eead4",
            margin: 0,
          }}
        >
          Curva Dosis-Respuesta Heparina
        </h2>
      </div>

      <div
        style={{
          marginTop: 8,
          marginBottom: 16,
          borderTop: "1px solid #334155",
          width: "100%",
        }}
      />

      {/* LAYOUT PRINCIPAL */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(0,2.2fr) minmax(260px,0.9fr)",
          gap: 24,
          alignItems: "start",
        }}
      >

        {/* COLUMNA IZQUIERDA */}

        <div>

          {/* CAMPOS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(180px,1fr))",
              gap: 16,
              alignItems: "start",
            }}
          >

            {/* PESO */}

            <div>
              <label style={labelStyle}>
                Peso (kg)
              </label>

              <input
                type="number"
                value={curva.peso}
                onChange={(e) =>
                  setDatos((prev) => ({
                    ...prev,

                    planPerfusion: {
                      ...prev.planPerfusion,

                      curvaHeparina: {
                        ...prev.planPerfusion.curvaHeparina,

                        peso:
                          e.target.value,
                      },
                    },
                  }))
                }
                style={inputStyle}
              />
            </div>

            {/* ACT BASAL */}

            <div>
              <label style={labelStyle}>
                ACT Basal
              </label>

              <input
                type="number"
                value={curva.actBasal}
                onChange={(e) =>
                  setDatos((prev) => ({
                    ...prev,

                    planPerfusion: {
                      ...prev.planPerfusion,

                      curvaHeparina: {
                        ...prev.planPerfusion.curvaHeparina,

                        actBasal:
                          e.target.value,
                      },
                    },
                  }))
                }
                style={inputStyle}
              />
            </div>

            {/* DOSIS INICIAL */}

            <div>

              <label style={labelStyle}>
                Dosis inicial
              </label>

              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginBottom: 8,
                }}
              >

                {[2,3,4].map((valor) => (

                  <button
                    key={valor}
                    onClick={() =>
                      setDatos((prev) => ({
                        ...prev,

                        planPerfusion: {
                          ...prev.planPerfusion,

                          curvaHeparina: {
                            ...prev.planPerfusion.curvaHeparina,

                            dosisInicialMgKg:
                              valor.toString(),
                          },
                        },
                      }))
                    }

                    style={{
                      flex: 1,
                      height: 36,
                      borderRadius: 10,

                      border:
                        Number(
                          curva.dosisInicialMgKg
                        ) === valor
                          ? "1px solid #14b8a6"
                          : "1px solid #334155",

                      background:
                        Number(
                          curva.dosisInicialMgKg
                        ) === valor
                          ? "#0f766e"
                          : "#020617",

                      color: "white",

                      cursor: "pointer",

                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    {valor} mg/kg
                  </button>
                ))}
              </div>

              <div
                style={{
                  ...inputStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  color: "#5eead4",
                  border: "1px solid #134e4a",
                }}
              >
                {dosisInicial || "--"} mg
              </div>
            </div>

            {/* HEPARINA PRIMING */}

            <div>

              <label style={labelStyle}>
                Heparina Priming (mg)
              </label>

              <input
                type="number"
                value={curva.dosisBomba || ""}
                onChange={(e) =>
                  setDatos((prev) => ({
                    ...prev,

                    planPerfusion: {
                      ...prev.planPerfusion,

                      curvaHeparina: {
                        ...prev.planPerfusion.curvaHeparina,

                        dosisBomba:
                          e.target.value,
                      },
                    },
                  }))
                }
                style={{
                  ...inputStyle,
                  border: "1px solid #134e4a",
                  color: "#5eead4",
                  fontWeight: 700,
                }}
              />
            </div>

            {/* ACT POST */}

            <div>

              <label style={labelStyle}>
                ACT Post Heparina
              </label>

              <input
                type="number"
                value={curva.actPostHeparina}
                onChange={(e) =>
                  setDatos((prev) => ({
                    ...prev,

                    planPerfusion: {
                      ...prev.planPerfusion,

                      curvaHeparina: {
                        ...prev.planPerfusion.curvaHeparina,

                        actPostHeparina:
                          e.target.value,
                      },
                    },
                  }))
                }
                style={inputStyle}
              />
            </div>

            {/* ACT OBJETIVO */}

            <div>

              <label style={labelStyle}>
                ACT Objetivo
              </label>

              <input
                type="number"
                value={curva.actObjetivo}
                readOnly
                style={{
                  ...inputStyle,
                  opacity: 0.8,
                }}
              />
            </div>

          </div>

          {/* GRÁFICA */}

          <div
            style={{
              marginTop: 28,
              width: "100%",
            }}
          >
            <CurvaBullChart
              actBasal={actBasal}
              actPost={actPost}
              actObjetivo={480}
              dosisInicial={dosisInicialMgKg}
              dosisNecesaria={
                Number(dosisNecesaria)
              }
              actFinal={actFinal}
            />
          </div>

        </div>

        {/* COLUMNA DERECHA */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >

          <ResultadoCard
            titulo="Sensibilidad"
            valor={sensibilidad || "--"}
            unidad="seg/mg/kg"
          />

          <ResultadoCard
            titulo="Dosis requerida"
            valor={dosisNecesaria || "--"}
            unidad="mg/kg"
          />

          <ResultadoCard
            titulo="Dosis total"
            valor={dosisTotal || "--"}
            unidad="mg"
          />

          <ResultadoCard
            titulo="Diferencia"
            valor={
              diferenciaHeparina || "--"
            }
            unidad="mg"
          />

          {/* ACT FINAL */}

          <div
            style={{
              ...cardStyle,
              padding: 14,
            }}
          >

            <label
              style={{
                ...labelStyle,
                marginBottom: 10,
              }}
            >
              ACT Post Dosis Final
            </label>

            <input
              type="number"
              value={curva.actPostDosisFinal}
              onChange={(e) =>
                setDatos((prev) => ({
                  ...prev,

                  planPerfusion: {
                    ...prev.planPerfusion,

                    curvaHeparina: {
                      ...prev.planPerfusion.curvaHeparina,

                      actPostDosisFinal:
                        e.target.value,
                    },
                  },
                }))
              }
              style={inputStyle}
            />

            {/* MENSAJE ACT */}

            {mensajeClinico && (

              <div
                style={{
                  marginTop: 16,
                  padding: 14,
                  borderRadius: 12,
                  background: "#020617",
                  border:
                    `1px solid ${colorMensaje}`,
                  color: colorMensaje,
                  fontWeight: 700,
                  fontSize: 15,
                  textAlign: "center",
                }}
              >
                {mensajeClinico}
              </div>
            )}

            {/* MENSAJE HEPARINA */}

            {mensajeHeparina && (

              <div
                style={{
                  marginTop: 12,
                  padding: 14,
                  borderRadius: 12,
                  background: "#020617",
                  border: `1px solid ${colorHeparina}`,
                  color: colorHeparina,
                  fontWeight: 700,
                  textAlign: "center",
                  fontSize: 14,
                }}
              >
                {mensajeHeparina}
              </div>
            )}

            {/* RESISTENCIA */}

            {resistenciaHeparina && (

              <div
                style={{
                  marginTop: 12,
                  padding: 14,
                  borderRadius: 12,
                  background: "#1e293b",
                  border: "1px solid #f59e0b",
                  color: "#f59e0b",
                  fontWeight: 700,
                  textAlign: "center",
                  fontSize: 14,
                }}
              >
                ⚠️ Posible resistencia a heparina
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

/* ================= RESULTADO CARD ================= */

function ResultadoCard({
  titulo,
  valor,
  unidad,
}: {
  titulo: string;
  valor: string;
  unidad: string;
}) {

  return (

    <div
      style={{
        background: "#020617",
        border: "1px solid #134e4a",
        borderRadius: 14,
        padding: 14,
        minHeight: 92,

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >

      <div
        style={{
          color: "#94a3b8",
          fontSize: 11,
          marginBottom: 8,
          fontWeight: 600,
        }}
      >
        {titulo}
      </div>

      <div
        style={{
          color: "#5eead4",
          fontSize: 18,
          fontWeight: 800,
          lineHeight: 1,
        }}
      >
        {valor}
      </div>

      <div
        style={{
          color: "#64748b",
          fontSize: 11,
          marginTop: 6,
        }}
      >
        {unidad}
      </div>

    </div>
  );
}

/* ================= ESTILOS ================= */

const cardStyle: React.CSSProperties = {

  background: "#020617",

  border: "1px solid #134e4a",

  borderRadius: 16,

  padding: 18,
};

const labelStyle: React.CSSProperties = {

  display: "block",

  marginBottom: 8,

  color: "#cbd5e1",

  fontSize: 12,

  fontWeight: 700,
};

const inputStyle: React.CSSProperties = {

  width: "100%",

  height: 46,

  background: "#020617",

  border: "1px solid #334155",

  borderRadius: 12,

  padding: "0 14px",

  color: "white",

  fontSize: 14,

  outline: "none",

  boxSizing: "border-box",
};