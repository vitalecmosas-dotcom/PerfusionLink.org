  import EquipoQuirurgicoSection from "./EquipoQuirurgicoSection";
  import FichaClinicaSection from "./FichaClinicaSection";
  import LaboratoriosSection from "./LaboratoriosSection";
  import EcoHemodinamicaSection from "./EcoHemodinamicaSection";
  import EscalasRiesgoSection from "./EscalasRiesgoSection";
  import type { DatosClinicos } from "../types/DatosClinicos";

  /* ================= PROPS ================= */

  interface PacienteProps {
  onBack: () => void;
  datos: DatosClinicos;
  setDatos: React.Dispatch<React.SetStateAction<DatosClinicos>>;
  role: string;
}

  /* ================= COMPONENTE ================= */

  export default function Paciente({
    onBack,
    datos,
    setDatos,
    role,
  }: PacienteProps) {
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
        {/* HEADER SUPERIOR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          {/* BOTÓN VOLVER */}
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

          {/* TÍTULO */}
          <span style={{ fontSize: 20, fontWeight: 700 }}>
            Módulo Paciente
          </span>
        </div>

        {/* TÍTULO PRINCIPAL */}
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>
          Información Clínica del Paciente
        </h1>

        
      {/* SECCIONES */}
<>
  {role === "admin" && (
    <EquipoQuirurgicoSection
      datos={datos}
      setDatos={setDatos}
    />
  )}

 <FichaClinicaSection
  role={role}
  datos={datos}
  setDatos={setDatos}
/>

  <LaboratoriosSection
    datos={datos}
    setDatos={setDatos}
  />

  <EcoHemodinamicaSection
    datos={datos}
    setDatos={setDatos}
  />

  <EscalasRiesgoSection
    datos={datos}
    setDatos={setDatos}
  />
</>

      </div>
    );
  }