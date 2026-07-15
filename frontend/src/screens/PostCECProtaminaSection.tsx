import type { DatosClinicos } from "../types/DatosClinicos";
import type { Dispatch, SetStateAction } from "react";
import React from "react";
interface Props {
  datos: DatosClinicos;
  setDatos: Dispatch<SetStateAction<DatosClinicos>>;
}

export default function PostCECProtaminaSection({
  datos,
  setDatos,
}: Props){

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

  const peso =
    Number(curva.peso || 0);

  const dosisInicialMgKg =
    Number(
      curva.dosisInicialMgKg || 2
    );

  const actBasal =
    Number(curva.actBasal || 0);

  /* ================= HEPARINA INICIAL ================= */

  const heparinaInicial =
    peso * dosisInicialMgKg;

  /* ================= HEPARINA PRIMING ================= */

  const heparinaPrimingMg =
    Number(curva.dosisBomba || 0);

  /* ================= REDOSIS ================= */

  const registrosACT =
    datos.intraCEC.monitorACT
      ?.registros || [];

  const totalRedosis =
    registrosACT.reduce(
      (acc, r) =>
        acc +
        Number(
          r.redosisAdministrada || 0
        ),
      0
    );

  /* ================= HEPARINA TOTAL ================= */

  const heparinaTotal =
    heparinaInicial +
    heparinaPrimingMg +
    totalRedosis;

/* ================= ACT OBJETIVO ================= */

const actObjetivoReversion =
  actBasal > 120
    ? 120
    : actBasal;

/* ================= FACTOR REVERSIÓN ================= */

/*
  Si ACT basal es normal:
  reversión 1:1

  Si ACT basal es alto:
  reducir protamina
*/

const relacionProtamina =
  datos.postCEC?.relacionProtamina || "1:1";

let factorReversion = 1;

if (relacionProtamina === "0.8:1") {
  factorReversion = 0.8;
}

if (relacionProtamina === "0.7:1") {
  factorReversion = 0.7;
}

/* ================= PROTAMINA ================= */

const protaminaCalculada =
  heparinaTotal *
  factorReversion;

const protaminaSugerida =
  protaminaCalculada.toFixed(0);

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
          marginBottom: 24,
        }}
      >

        <span style={{ fontSize: 20 }}>
          💉
        </span>

        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#5eead4",
            margin: 0,
          }}
        >
          Reversión con Protamina
        </h2>

      </div>

      {/* GRID */}

<div
  style={{
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxWidth: 240,
  }}
>

  <label
    style={{
      color: "#94a3b8",
      fontSize: 12,
      fontWeight: 600,
    }}
  >
    Relación Protamina / Heparina
  </label>

  <select
    value={relacionProtamina}
    onChange={(e) =>
      setDatos((prev) => ({
        ...prev,
        postCEC: {
          ...prev.postCEC,
          relacionProtamina: e.target.value,
        },
      }))
    }
    style={{
      background: "#020617",
      border: "1px solid #334155",
      borderRadius: 10,
      padding: 10,
      color: "white",
    }}
  >
    <option value="1:1">1 : 1</option>
    <option value="0.8:1">0.8 : 1</option>
    <option value="0.7:1">0.7 : 1</option>
  </select>

</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: 16,
        }}
      >

        <MiniCard
          titulo="Heparina inicial"
          valor={heparinaInicial.toFixed(0)}
          unidad="mg"
        />

        <MiniCard
          titulo="Priming"
          valor={heparinaPrimingMg.toFixed(0)}
          unidad="mg"
        />

        <MiniCard
          titulo="Redosis"
          valor={totalRedosis.toFixed(0)}
          unidad="mg"
        />

        <MiniCard
          titulo="Heparina total"
          valor={heparinaTotal.toFixed(0)}
          unidad="mg"
        />

        <MiniCard
          titulo="ACT objetivo"
          valor={actObjetivoReversion}
          unidad="seg"
        />

        <MiniCard
          titulo="Protamina"
          valor={protaminaSugerida}
          unidad="mg"
        />

      </div>

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

/* ================= ESTILOS ================= */

const miniCard: React.CSSProperties = {

  background: "#020617",

  border: "1px solid #134e4a",

  borderRadius: 14,

  padding: 14,
};

const miniTitle: React.CSSProperties = {

  color: "#94a3b8",

  fontSize: 12,

  marginBottom: 8,
};

const miniValue: React.CSSProperties = {

  color: "#5eead4",

  fontSize: 20,

  fontWeight: 800,
};

const miniUnit: React.CSSProperties = {

  color: "#64748b",

  fontSize: 12,

  marginTop: 8,
};