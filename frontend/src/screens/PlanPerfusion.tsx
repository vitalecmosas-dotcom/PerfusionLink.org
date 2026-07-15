import EspecificacionesCircuitoSection from "./EspecificacionesCircuitoSection";
import TemperaturaEstrategiasSection from "./TemperaturaEstrategiasSection";
import CalculoFlujosSection from "./CalculoFlujosSection";
import ProteccionMiocardicaSection from "./ProteccionMiocardicaSection";
import PrimingHtoSection from "./PrimingHtoSection";
import PerfusionSelectivaSection from "./PerfusionSelectivaSection";
import type { DatosClinicos } from "../types/DatosClinicos";
import type { Dispatch, SetStateAction } from "react";
import HemoadsorcionSection from "../screens/HemoadsorcionSection";
import CurvaHeparinaSection from "./CurvaHeparinaSection";

/* ================= PROPS ================= */

interface PlanPerfusionProps {
  onBack: () => void;
  datos: DatosClinicos;
  setDatos: Dispatch<SetStateAction<DatosClinicos>>;
  role: string;
}

/* ================= COMPONENTE ================= */

export default function PlanPerfusion({
  onBack,
  datos,
  setDatos,
  role,
}: PlanPerfusionProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        padding: 32,
        color: "white",
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: "none",
            color: "#5eead4",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ← Volver a Bypass
        </button>

        <span style={{ fontSize: 20, fontWeight: 700 }}>
          Módulo Plan de Perfusión
        </span>
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 800 }}>
        Planificación de Perfusión
      </h1>

      {/* TARJETAS */}
      {role === "admin" && (

  <EspecificacionesCircuitoSection

    datos={datos}

    setDatos={setDatos}

  />

)}

      {role === "admin" && (

  <TemperaturaEstrategiasSection

    datos={datos}

    setDatos={setDatos}

  />

)}

      <CalculoFlujosSection
        datos={datos}
        setDatos={setDatos}
      />

      <ProteccionMiocardicaSection
        datos={datos}
        setDatos={setDatos}
      />
      {role === "admin" && (

  <HemoadsorcionSection
    datos={datos}
    setDatos={setDatos}
  />

)}
<CurvaHeparinaSection
  datos={datos}
  setDatos={setDatos}
/>

      <PrimingHtoSection
        datos={datos}
        setDatos={setDatos}
      />

      {role === "admin" && (

  <PerfusionSelectivaSection
    datos={datos}
    setDatos={setDatos}
  />

)}
    </div>
  );
}