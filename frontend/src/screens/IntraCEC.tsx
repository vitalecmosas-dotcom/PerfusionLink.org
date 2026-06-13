import TiemposQuirurgicos from "./TiemposQuirurgicos";
import DatosIntraCEC from "./DatosIntraCEC";
import BalanceHidricoCEC from "./BalanceHidricoCEC";
import LaboratoriosIntraCEC from "./LaboratoriosIntraCEC";
import PDGIntraCEC from "./PDGIntraCEC";
import type { Dispatch, SetStateAction } from "react";
import type { DatosClinicos } from "../types/DatosClinicos";
import PDGTendenciaChart from "./PDGTendenciaChart";
import IntraCECMonitorSection from "./IntraCECMonitorSection";

interface IntraCECProps {
  onBack: () => void;
  datos: DatosClinicos;
  setDatos: Dispatch<SetStateAction<DatosClinicos>>;
}

export default function IntraCEC({
  onBack,
  datos,
  setDatos,
}: IntraCECProps) {



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
          marginBottom: 20,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: "none",
            color: "#5eead4",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          ← Volver a Bypass
        </button>

        <span style={{ fontSize: 18, fontWeight: 700 }}>
          Módulo Intra-CEC
        </span>
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
        Circulación Extracorpórea
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        
        <TiemposQuirurgicos
          datos={datos}
          setDatos={setDatos}
        />

        <DatosIntraCEC
          datos={datos}
          setDatos={setDatos}
        />

        <BalanceHidricoCEC 
          datos={datos}
          setDatos={setDatos}
        />
        
        <LaboratoriosIntraCEC
          datos={datos}
          setDatos={setDatos}
        />

        <IntraCECMonitorSection
         datos={datos}
        setDatos={setDatos}
/>

        <PDGIntraCEC
          datos={datos}
          setDatos={setDatos}
          hb={datos.intraCEC.laboratorio.campos.hb}
          satArterial={datos.intraCEC.laboratorio.campos.satArterial}
          flujo={datos.intraCEC.parametros.flujo}
          superficieCorporal={datos.intraCEC.parametros.superficieCorporal}
          presionAtmosferica={datos.intraCEC.parametros.presionAtmosferica}

          // 37°
          svO2Calc37={datos.intraCEC.laboratorio.campos.svO2Calc37}
          pco2Venoso37={datos.intraCEC.laboratorio.campos.pco2Venoso37}

          // TEMP ACT
          svO2CalcTemp={datos.intraCEC.laboratorio.campos.svO2CalcTemp}
          svO2ManualTemp={datos.intraCEC.laboratorio.campos.svO2ManualTemp}

          sweepGas={datos.intraCEC.parametros.sweepGas}
          ePCO2={datos.intraCEC.parametros.ePCO2}
          pco2Arterial={datos.intraCEC.laboratorio.campos.pco2Arterial}
        />

        <PDGTendenciaChart
  registros={datos.intraCEC.pdg.registros}
/>


      </div>
    </div>
  );
}