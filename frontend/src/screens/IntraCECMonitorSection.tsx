import type { DatosClinicos } from "../types/DatosClinicos";
import type { Dispatch, SetStateAction } from "react";

import IntraCECRegistroBar from "./IntraCECRegistroBar";
import DeleteIcon from "./DeleteIcon";

interface Props {
  datos: DatosClinicos;
  setDatos: Dispatch<SetStateAction<DatosClinicos>>;
}

export default function IntraCECMonitorSection({
  datos,
  setDatos,
}: Props) {

  /* ================= CURVA HEPARINA ================= */

  const curva =
    datos.planPerfusion?.curvaHeparina || {
      peso: "",
      actBasal: "",
      dosisInicialMgKg: "2",
      dosisBomba: "",
      actPostHeparina: "",
      actObjetivo: 480,
      sensibilidadHeparina: "",
      dosisTotalMgKg: "",
      dosisTotalMg: "",
      dosisAdicionalMgKg: "",
      actPostDosisFinal: "",
    };

  /* ================= MONITOR ACT ================= */

  const monitor =
    datos.intraCEC?.monitorACT || {
      hora: "",
      redosisAdministrada: "",
      registros: [],
    };

  /* ================= DATOS CURVA ================= */

  const actBasal =
    Number(curva.actBasal || 0);

  const actPost =
    Number(curva.actPostHeparina || 0);

  const peso =
    Number(curva.peso || 0);

  const dosisInicialMgKg =
    Number(curva.dosisInicialMgKg || 2);

  /* ================= SENSIBILIDAD ================= */

  const sensibilidad =
    actPost > actBasal
      ? (
          (actPost - actBasal) /
          dosisInicialMgKg
        )
      : 0;

  /* ================= DATOS LAB ================= */

  const actActual =
    Number(
      datos.intraCEC
        ?.laboratorio
        ?.campos
        ?.act || 0
    );

  const hto =
    Number(
      datos.intraCEC
        ?.laboratorio
        ?.campos
        ?.hto || 0
    );

  const plaquetas =
    Number(
      datos.intraCEC
        ?.laboratorio
        ?.campos
        ?.plaquetas || 0
    );

  /* ================= TEMPERATURA ================= */

  const temperatura =
    Number(
      datos.intraCEC
        ?.parametros
        ?.tVenosa ??

      datos.intraCEC
        ?.parametros
        ?.tArterial ??

      datos.intraCEC
        ?.parametros
        ?.tempEsofagica ??

      0
    );

  /* ================= TIEMPO CEC ================= */

  const tiempoCEC =
    Number(
      datos.intraCEC
        ?.monitorTiempoCEC || 0
    );

  /* ================= CALCULOS ================= */

  const deficitACT =
    actActual < 480
      ? 480 - actActual
      : 0;

  const redosisMgKg =
    sensibilidad > 0
      ? deficitACT / sensibilidad
      : 0;

  const redosisMg =
    (
      redosisMgKg * peso
    ).toFixed(0);

  /* ================= HEPARINA ACUMULADA ================= */

  const heparinaAcumulada =
    (monitor.registros || []).reduce(
      (acc, r) =>
        acc +
        Number(
          r.redosisAdministrada || 0
        ),
      0
    );

  /* ================= ESTADO ACT ================= */

  let estadoACT = "";
  let colorACT = "#5eead4";

  if (actActual >= 480) {

    estadoACT =
      "✅ Anticoagulación adecuada";

    colorACT = "#22c55e";
  }

  else if (actActual >= 400) {

    estadoACT =
      "⚠️ ACT límite";

    colorACT = "#f59e0b";
  }

  else if (actActual > 0) {

    estadoACT =
      "🚨 ACT insuficiente";

    colorACT = "#ef4444";
  }

  /* ================= ALERTAS ================= */

  let alertaTemperatura = "";
  let alertaHto = "";
  let alertaPlaquetas = "";
  let alertaCEC = "";

  if (
    temperatura > 0 &&
    temperatura < 28
  ) {

    alertaTemperatura =
      "⚠️ Hipotermia puede alterar ACT";
  }

  if (
    hto > 0 &&
    hto < 22
  ) {

    alertaHto =
      "⚠️ Hemodilución severa";
  }

  if (
    plaquetas > 0 &&
    plaquetas < 100
  ) {

    alertaPlaquetas =
      "⚠️ Plaquetas bajas alteran ACT";
  }

  if (tiempoCEC > 120) {

    alertaCEC =
      "⚠️ CEC prolongada consume factores";
  }

  /* ================= AGREGAR REGISTRO ================= */

  const handleAgregar = () => {

    setDatos((prev) => ({

      ...prev,

      intraCEC: {

        ...prev.intraCEC,

        monitorACT: {

          ...(prev.intraCEC.monitorACT || {
            hora: "",
            redosisAdministrada: "",
            registros: [],
          }),

          registros: [

            ...(
              prev.intraCEC.monitorACT
                ?.registros || []
            ),

            {
              hora:
                monitor.hora,

              act:
                actActual.toString(),

              temperatura:
                temperatura.toString(),

              hto:
                hto.toString(),

              plaquetas:
                plaquetas.toString(),

              tiempoCEC:
                tiempoCEC.toString(),

              deficitACT:
                deficitACT.toString(),

              redosisSugerida:
                redosisMg.toString(),

              redosisAdministrada:
                monitor.redosisAdministrada,
            },
          ],
        },
      },
    }));
  };

  /* ================= ELIMINAR ================= */

  const eliminarRegistro = (
    index: number
  ) => {

    setDatos((prev) => ({

      ...prev,

      intraCEC: {

        ...prev.intraCEC,

        monitorACT: {

          ...(prev.intraCEC.monitorACT || {
            hora: "",
            redosisAdministrada: "",
            registros: [],
          }),

          registros:
            (
              prev.intraCEC.monitorACT
                ?.registros || []
            ).filter(
              (_, i) => i !== index
            ),
        },
      },
    }));
  };

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

        <span style={{ fontSize: 20 }}>
          🫀
        </span>

        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#5eead4",
            margin: 0,
          }}
        >
          Monitoreo ACT Intra-CEC
        </h2>

      </div>

      {/* GRID */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: 16,
        }}
      >

        <MiniCard
          titulo="ACT actual"
          valor={actActual || "--"}
          unidad="seg"
        />

        <MiniCard
          titulo="Sensibilidad"
          valor={
            sensibilidad
              ? sensibilidad.toFixed(1)
              : "--"
          }
          unidad="seg/mg/kg"
        />

        <MiniCard
          titulo="Déficit ACT"
          valor={deficitACT}
          unidad="seg"
        />

        <MiniCard
          titulo="Redosis"
          valor={redosisMg}
          unidad="mg"
        />

        <MiniCard
          titulo="Temperatura"
          valor={temperatura || "--"}
          unidad="°C"
        />

        <MiniCard
          titulo="HTO"
          valor={hto || "--"}
          unidad="%"
        />

        <MiniCard
          titulo="Plaquetas"
          valor={plaquetas || "--"}
          unidad="x1000"
        />

        <MiniCard
          titulo="Heparina acumulada"
          valor={heparinaAcumulada}
          unidad="mg"
        />

        {/* TIEMPO CEC */}

        <div>

          <label style={labelStyle}>
            Tiempo CEC al ACT
          </label>

          <input
            type="number"
            value={
              datos.intraCEC
                ?.monitorTiempoCEC || ""
            }
            onChange={(e) =>
              setDatos(
                (
                  prev: DatosClinicos
                ) => ({
                  ...prev,

                  intraCEC: {
                    ...prev.intraCEC,

                    monitorTiempoCEC:
                      e.target.value,
                  },
                })
              )
            }
            style={inputStyle}
          />

        </div>

      </div>

      {/* ESTADO */}

      <div
        style={{
          marginTop: 28,
          padding: 18,
          borderRadius: 16,
          border: `1px solid ${colorACT}`,
          color: colorACT,
          fontWeight: 800,
          textAlign: "center",
          fontSize: 18,
          background: "#020617",
        }}
      >
        {estadoACT}
      </div>

      {/* ALERTAS */}

      <div
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >

        {alertaTemperatura && (
          <AlertBox texto={alertaTemperatura} />
        )}

        {alertaHto && (
          <AlertBox texto={alertaHto} />
        )}

        {alertaPlaquetas && (
          <AlertBox texto={alertaPlaquetas} />
        )}

        {alertaCEC && (
          <AlertBox texto={alertaCEC} />
        )}

      </div>

      {/* REGISTRO */}

      <div
        style={{
          marginTop: 28,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 18,
        }}
      >


        {/* REDOSIS */}

        <div>

          <label style={labelStyle}>
            Redosis administrada
          </label>

          <input
            type="number"
            value={
              monitor.redosisAdministrada
            }
            onChange={(e) =>
              setDatos((prev) => ({

                ...prev,

                intraCEC: {

                  ...prev.intraCEC,

                  monitorACT: {

                    ...(prev.intraCEC.monitorACT || {
                      hora: "",
                      redosisAdministrada: "",
                      registros: [],
                    }),

                    redosisAdministrada:
                      e.target.value,
                  },
                },
              }))
            }
            style={inputStyle}
          />

        </div>

      </div>

      {/* BOTON */}

      <IntraCECRegistroBar
        hora={monitor.hora}
        setHora={(v) =>
          setDatos((prev) => ({

            ...prev,

            intraCEC: {

              ...prev.intraCEC,

              monitorACT: {

                ...(prev.intraCEC.monitorACT || {
                  hora: "",
                  redosisAdministrada: "",
                  registros: [],
                }),

                hora: v,
              },
            },
          }))
        }
        onAgregar={handleAgregar}
      />

      {/* REGISTROS */}

      {(monitor.registros || []).map((r, i) => (

        <div
          key={i}
          style={registroRow}
        >

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              flex: 1,
            }}
          >

            <span
              style={{
                color: "#5eead4",
                fontWeight: 800,
              }}
            >
              {r.hora}
            </span>

            <span
              style={{
                color: "#94a3b8",
                fontSize: 12,
              }}
            >
              ACT: {r.act}
              {" | "}
              Redosis: {r.redosisAdministrada} mg
              {" | "}
              Temp: {r.temperatura}°C
              {" | "}
              HTO: {r.hto}%
            </span>

          </div>

          <DeleteIcon
            onClick={() =>
              eliminarRegistro(i)
            }
          />

        </div>
      ))}

    </div>
  );
}

/* ================= MINI CARD ================= */

function MiniCard({
  titulo,
  valor,
  unidad,
}: {
  titulo: string;
  valor: string | number;
  unidad: string;
}) {

  return (

    <div style={miniCard}>

      <div style={miniTitle}>
        {titulo}
      </div>

      <div style={miniValue}>
        {valor}
      </div>

      <div style={miniUnit}>
        {unidad}
      </div>

    </div>
  );
}

/* ================= ALERT BOX ================= */

function AlertBox({
  texto,
}: {
  texto: string;
}) {

  return (

    <div
      style={{
        background: "#1e293b",
        border: "1px solid #f59e0b",
        color: "#f59e0b",
        borderRadius: 14,
        padding: 16,
        fontWeight: 700,
      }}
    >
      {texto}
    </div>
  );
}

/* ================= ESTILOS ================= */

const miniCard: React.CSSProperties = {

  background: "#020617",

  border: "1px solid #134e4a",

  borderRadius: 14,

  padding: 14,

  minHeight: 90,
};

const miniTitle: React.CSSProperties = {

  color: "#94a3b8",

  fontSize: 12,

  marginBottom: 8,
};

const miniValue: React.CSSProperties = {

  color: "#5eead4",

  fontSize: 18,

  fontWeight: 800,
};

const miniUnit: React.CSSProperties = {

  color: "#64748b",

  fontSize: 12,

  marginTop: 8,
};

const labelStyle: React.CSSProperties = {

  display: "block",

  marginBottom: 8,

  color: "#cbd5e1",

  fontSize: 13,

  fontWeight: 700,
};

const inputStyle: React.CSSProperties = {

  width: "100%",

  height: 54,

  background: "#020617",

  border: "1px solid #334155",

  borderRadius: 14,

  padding: "0 16px",

  color: "white",

  fontSize: 16,

  outline: "none",

  boxSizing: "border-box",
};

const registroRow: React.CSSProperties = {

  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",

  background: "#020617",

  border: "1px solid #334155",

  borderRadius: 12,

  padding: "10px 18px",

  marginTop: 12,
};