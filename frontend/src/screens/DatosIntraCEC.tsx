import {
  Activity,
  Wind,
  Thermometer,
  Brain,
} from "lucide-react";
import { useState } from "react";
import type { DatosClinicos } from "../types/DatosClinicos";
import type { Dispatch, SetStateAction } from "react";
import IntraCECRegistroBar from "../screens/IntraCECRegistroBar";
import DeleteIcon from "./DeleteIcon";

/* ================= PROPS ================= */

interface DatosIntraCECProps {
  datos: DatosClinicos;
  setDatos: Dispatch<SetStateAction<DatosClinicos>>;
}

/* ================= COMPONENTE ================= */

export default function DatosIntraCEC({
  datos,
  setDatos,
}: DatosIntraCECProps) {

  const isMobile = window.innerWidth < 768;

  const [hora, setHora] = useState("");

  const registros =
    datos?.intraCEC?.datosIntraCEC?.registros ?? [];

  const handleAgregar = () => {
    const inputs = Array.from(
      document.querySelectorAll<HTMLInputElement>(
        '[data-datos-intracec="true"]'
      )
    );

    const valores: Record<string, string> = {};
    inputs.forEach((i) => {
      valores[i.name] = i.value;
    });

    setDatos((prev) => ({
      ...prev,
      intraCEC: {
        ...prev.intraCEC,
        datosIntraCEC: {
          ...prev.intraCEC.datosIntraCEC,
          registros: [
            ...prev.intraCEC.datosIntraCEC.registros,
            {
              hora,
              valores,
            },
          ],
        },
      },
    }));
  };

  const eliminarRegistro = (index: number) => {
    setDatos((prev) => ({
      ...prev,
      intraCEC: {
        ...prev.intraCEC,
        datosIntraCEC: {
          ...prev.intraCEC.datosIntraCEC,
          registros: prev.intraCEC.datosIntraCEC.registros.filter(
            (_, i) => i !== index
          ),
        },
      },
    }));
  };

  return (
    <div style={card}>
      <div style={header}>
        <Activity size={20} />
        Datos Intra-CEC
      </div>

      <hr style={{ margin: "20px 0", borderColor: "#1e293b" }} />

      <div
        style={{
          ...grid,
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        <SubCard
          isMobile={isMobile}
          title="PRESIONES Y FLUJO"
          color="#fb7185"
          icon={<Activity size={18} />}
          fields={[
            "Flujo sangre (L/min)",
            "PAM (mmHg)",
            "PVC (mmHg)",
            "IRVS (dyn·s·m²/cm⁵)",
            "SC",
          ]}
          datos={datos}
          setDatos={setDatos}
        />

        <SubCard
          isMobile={isMobile}
          title="GESTIÓN DE GASES"
          color="#60a5fa"
          icon={<Wind size={18} />}
          fields={[
            "Sweep gas (L/min)",
            "FiO₂ (%)",
            "Exhaust CO₂ (mmHg)",
            "Presión Atmosférica",
           
          ]}
          datos={datos}
          setDatos={setDatos}
        />

        <SubCard
          isMobile={isMobile}
          title="TERMOMETRÍA"
          color="#facc15"
          icon={<Thermometer size={18} />}
          fields={[
            "T. Esofágica (°C)",
            "T. Venosa",
            "T. Arterial",
          ]}
          datos={datos}
          setDatos={setDatos}
        />

        <SubCard
          isMobile={isMobile}
          title="MONITORIZACIÓN"
          color="#a78bfa"
          icon={<Brain size={18} />}
          fields={["QCON", "QNOX", "NIRS D", "NIRS I"]}
          datos={datos}
          setDatos={setDatos}
        />
      </div>

      {/* ===== HORA ===== */}
      <IntraCECRegistroBar
  hora={hora}
  setHora={(v) => setHora(v)}
  onAgregar={handleAgregar}
/>

      {registros.map((r, i) => (
  <div key={i} style={registroRow}>
    <span style={{ color: "#5eead4", fontWeight: 900 }}>
      {r.hora}
    </span>

    <span style={registroTexto}>
      {Object.entries(r.valores)
        .filter(([, v]) => v !== "" && v !== undefined)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" | ")}
    </span>

    <DeleteIcon onClick={() => eliminarRegistro(i)} />
  </div>
))}
    </div>
  );
}

/* ================= SUBCARD ================= */

function SubCard({ isMobile, ...props }: any) {
  const { title, icon, color, fields, datos, setDatos } = props;

  const parametros = datos.intraCEC.parametros;
  /* ===== CALCULO IRVS ===== */

const irvsCalc = (() => {
  const pam = Number(parametros.pam);
  const flujo = Number(parametros.flujo);

  if (!isNaN(pam) && !isNaN(flujo) && flujo !== 0) {
    return ((pam * 80) / flujo).toFixed(0);
  }

  return "";
})();

  const updateParametro = (f: string, val: number | null) => {
    setDatos((prev: DatosClinicos) => ({
      ...prev,
      intraCEC: {
        ...prev.intraCEC,
        parametros: {
          ...prev.intraCEC.parametros,
          flujo:
            f === "Flujo sangre (L/min)"
              ? val
              : prev.intraCEC.parametros.flujo,
          superficieCorporal:
            f === "SC"
              ? val
              : prev.intraCEC.parametros.superficieCorporal,
          sweepGas:
            f === "Sweep gas (L/min)"
              ? val
              : prev.intraCEC.parametros.sweepGas,
          ePCO2:
            f === "Exhaust CO₂ (mmHg)"
              ? val
              : prev.intraCEC.parametros.ePCO2,
          tempEsofagica:
            f === "T. Esofágica (°C)"
              ? val
              : prev.intraCEC.parametros.tempEsofagica,
              pam:
            f === "PAM (mmHg)"
            ? val
            : prev.intraCEC.parametros.pam,
            presionAtmosferica:
  f === "Presión Atmosférica"
    ? val
    : prev.intraCEC.parametros.presionAtmosferica,
     pvc:
    f === "PVC (mmHg)"
      ? val
      : prev.intraCEC.parametros.pvc,

  fio2:
    f === "FiO₂ (%)"
      ? val
      : prev.intraCEC.parametros.fio2,

  tVenosa:
    f === "T. Venosa"
      ? val
      : prev.intraCEC.parametros.tVenosa,

  tArterial:
    f === "T. Arterial"
      ? val
      : prev.intraCEC.parametros.tArterial,
      qcon:
  f === "QCON"
    ? val
    : prev.intraCEC.parametros.qcon,

qnox:
  f === "QNOX"
    ? val
    : prev.intraCEC.parametros.qnox,

nirsD:
  f === "NIRS D"
    ? val
    : prev.intraCEC.parametros.nirsD,

nirsI:
  f === "NIRS I"
    ? val
    : prev.intraCEC.parametros.nirsI,
              
        },
      },
    }));
  };

  return (
    <div style={{ ...subCard, borderColor: `${color}40` }}>
      <div style={{ ...subHeader, color }}>
        {icon}
        {title}
      </div>

      <div style={fieldsGrid}>
        {fields.map((f: string) => (
          <div key={f} style={field}>
            <span style={label}>{f}</span>

            <input
  type="number"
  name={f}
  data-datos-intracec="true"
  value={
  f === "Flujo sangre (L/min)"
    ? parametros.flujo ?? ""
  : f === "PAM (mmHg)"
    ? parametros.pam ?? ""
  : f === "PVC (mmHg)"
    ? parametros.pvc ?? ""
  : f === "SC"
    ? parametros.superficieCorporal ?? ""
  : f === "Sweep gas (L/min)"
    ? parametros.sweepGas ?? ""
  : f === "FiO₂ (%)"
    ? parametros.fio2 ?? ""
  : f === "Exhaust CO₂ (mmHg)"
    ? parametros.ePCO2 ?? ""
  : f === "Presión Atmosférica"
    ? parametros.presionAtmosferica ?? ""
  : f === "T. Esofágica (°C)"
    ? parametros.tempEsofagica ?? ""
  : f === "T. Venosa"
    ? parametros.tVenosa ?? ""
  : f === "T. Arterial"
    ? parametros.tArterial ?? ""
  : f === "IRVS (dyn·s·m²/cm⁵)"
    ? irvsCalc
  : undefined   // 👈 ESTA LINEA ES LA CLAVE
  }
  defaultValue={
f === "QCON"
  ? parametros.qcon ?? ""
: f === "QNOX"
  ? parametros.qnox ?? ""
: f === "NIRS D"
  ? parametros.nirsD ?? ""
: f === "NIRS I"
  ? parametros.nirsI ?? ""
    : undefined
}

  disabled={f === "IRVS (dyn·s·m²/cm⁵)"}
  onChange={(e) =>
    updateParametro(
      f,
      e.target.value === "" ? null : Number(e.target.value)
    )
  }
  style={{ ...input, width: isMobile ? "100%" : 120 }}
/>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ================= ESTILOS ================= */

const card = {
  background: "#1e293b",
  borderRadius: 20,
  padding: 24,
  border: "1px solid #334155",
};

const header = {
  display: "flex",
  gap: 10,
  fontWeight: 800,
  fontSize: 18,
  color: "#5eead4",
};

const grid = { display: "grid", gap: 24 };

const subCard = {
  background: "#020617",
  borderRadius: 18,
  padding: 20,
  border: "1px solid",
};

const subHeader = {
  display: "flex",
  gap: 8,
  fontWeight: 800,
  fontSize: 12,
  marginBottom: 16,
};

const fieldsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2,1fr)",
  gap: 14,
};

const field = { display: "flex", flexDirection: "column" as const, gap: 6 };

const label = { fontSize: 11, color: "#94a3b8" };

const input = {
  background: "#020617",
  border: "1px solid #334155",
  borderRadius: 10,
  padding: "8px 10px",
  color: "white",
};


const registroRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#020617",
  border: "1px solid #334155",
  borderRadius: 12,
  padding: "10px 18px",
  marginTop: 12,
  fontSize: 12,
};

const registroTexto = {
  flex: 1,
  fontSize: 12,
  color: "#94a3b8",
  fontWeight: 500,
};
