import LaboratoriosPostCEC from "./LaboratoriosPostCEC";
import type { DatosClinicos } from "../types/DatosClinicos";
import type { Dispatch, SetStateAction } from "react";
import PostCECProtaminaSection from "./PostCECProtaminaSection";
interface PostCECProps {
  onBack: () => void;
  datos: DatosClinicos;
  setDatos: Dispatch<SetStateAction<DatosClinicos>>;
  role: string;
  resetearCaso:()=>void;
}

/* ================= COMPONENTE ================= */

export default function PostCEC({
  onBack,
  datos,
  setDatos,
  role,
  resetearCaso
}: PostCECProps) {

 const finalizarCaso=()=>{

resetearCaso();

onBack();

};

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        padding: 32,
        color: "white",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: "none",
            color: "#5eead4",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ← Volver a Bypass
        </button>

        <span style={{ fontSize: 18, fontWeight: 700 }}>
          Módulo Post CEC
        </span>
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>
        Post-CEC
      </h1>

      <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: 36,
    width: "100%",
  }}
>

  <PostCECProtaminaSection
    datos={datos}
    setDatos={setDatos}
  />

  <LaboratoriosPostCEC
    role={role}
    onFinalizarCaso={finalizarCaso}
    datos={datos}
    setDatos={setDatos}
  />

</div>
      </div>
  );
}
