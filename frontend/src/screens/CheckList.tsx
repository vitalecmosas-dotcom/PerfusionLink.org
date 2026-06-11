import SeccionCheckList from "./SeccionCheckList";
import type { DatosClinicos } from "../types/DatosClinicos";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  onBack: () => void;
  datos: DatosClinicos;
  setDatos: Dispatch<SetStateAction<DatosClinicos>>;
}

export default function CheckList({
  onBack,
  datos,
  setDatos,
}: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        padding: "clamp(16px, 4vw, 32px)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        gap: 32,
        boxSizing: "border-box",
      }}
    >
      {/* ===== HEADER ===== */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
          flexWrap: "wrap",
          gap: 10,
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

        <span
          style={{
            fontSize: 20,
            fontWeight: 700,
            textAlign: "right",
          }}
        >
          Módulo Check List
        </span>
      </div>

      {/* ===== CONTENIDO ===== */}
      <SeccionCheckList
        datos={datos}
        setDatos={setDatos}
      />
    </div>
  );
}