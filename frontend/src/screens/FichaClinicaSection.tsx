import { useEffect, useRef } from "react";
import { Calendar } from "lucide-react";
import type { DatosClinicos } from "../types/DatosClinicos";

/* ================= PROPS ================= */

interface FichaClinicaProps {
  datos: DatosClinicos;
  setDatos: React.Dispatch<React.SetStateAction<DatosClinicos>>;
  role: string;
}

/* ================= COMPONENTE ================= */

export default function FichaClinicaSection({
  datos,
  setDatos,
  role,
}: FichaClinicaProps) {
  const {
    pesoReal,
    talla,
    imc,
    pesoIdeal,
    pesoAjustado,
    scReal,
    scIdeal,
    scAjustada,
    nutricion,
  } = datos;

  /* ================= CÁLCULOS ================= */

  useEffect(() => {
    const p = parseFloat(pesoReal);
    const t = parseFloat(talla);

    if (!pesoReal || !talla || isNaN(p) || isNaN(t)) {
      setDatos((prev) => ({
        ...prev,
        pesoIdeal: "0.00",
        pesoAjustado: "0.00",
        scReal: "0.00",
        scIdeal: "0.00",
        scAjustada: "0.00",
        nutricion: "",
      }));
      return;
    }

    const tallaM = t / 100;

   const scRealCalc =
  Math.sqrt((p * t) / 3600);

/* PESO IDEAL IMC 25 */

const pesoIdealCalc =
  25 * tallaM * tallaM;

/* SC IDEAL */

const scIdealCalc =
  Math.sqrt(
    (pesoIdealCalc * t) / 3600
  );

/* LEAN FLOW / PESO AJUSTADO */

const excesoPeso =
  p - pesoIdealCalc;

const pesoAjustadoCalc =
  pesoIdealCalc +
  0.25 * excesoPeso;

/* SC AJUSTADA */

const scAjustadaCalc =
  Math.sqrt(
    (pesoAjustadoCalc * t) / 3600
  );

   const imcCalc = p / (tallaM * tallaM);

let nutricion = "";

if (imcCalc < 18.5)
  nutricion = "Bajo peso";
else if (imcCalc < 25)
  nutricion = "Normal";
else if (imcCalc < 30)
  nutricion = "Sobrepeso";
else
  nutricion = "Obesidad";

    setDatos((prev) => ({
      ...prev,
      imc:imcCalc.toFixed(1),
      pesoIdeal: pesoIdealCalc.toFixed(1),
      pesoAjustado: pesoAjustadoCalc.toFixed(1),
      scReal: scRealCalc.toFixed(2),
      scIdeal: scIdealCalc.toFixed(2),
      scAjustada: scAjustadaCalc.toFixed(2),
      nutricion,
    }));
  }, [pesoReal, talla, setDatos]);

  /* ================= UI ================= */

  return (
    <div style={container}>
      <header style={header}>
        <span style={{ fontSize: 22 }}>📋</span>
        <h2 style={title}>Ficha Clínica del Paciente</h2>
      </header>

      <hr style={divider} />

      <div style={card}>
        <div style={grid4}>

  {role === "admin" && (
    <>
      <DateField
        label="Fecha proc."
        value={datos.fechaProcedimiento}
        onChange={(v) =>
          setDatos((prev) => ({
            ...prev,
            fechaProcedimiento: v,
          }))
        }
      />

      <Field
        label="ID / Historia"
        value={datos.historiaClinica}
        onChange={(v) =>
          setDatos((prev) => ({
            ...prev,
            historiaClinica: v,
          }))
        }
      />

      <Field
        label="Nombre completo"
        value={datos.nombreCompleto}
        onChange={(v) =>
          setDatos((prev) => ({
            ...prev,
            nombreCompleto: v,
          }))
        }
      />
    </>
  )}

  <Field
    label="Edad"
    value={datos.edad}
    onChange={(v) =>
      setDatos((prev) => ({
        ...prev,
        edad: v,
      }))
    }
  />

</div>

       <div style={grid3}>

  <Select
    label="Género"
    options={["Masculino", "Femenino"]}
    value={datos.genero}
    onChange={(v) =>
      setDatos((prev) => ({
        ...prev,
        genero: v,
      }))
    }
  />

  {role === "admin" && (
    <>
      <Select
        label="Grupo sanguíneo"
        options={["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]}
        value={datos.grupoSanguineo}
        onChange={(v) =>
          setDatos((prev) => ({
            ...prev,
            grupoSanguineo: v,
          }))
        }
      />

      <Textarea
        label="Diagnóstico actual"
        value={datos.diagnosticoActual}
        onChange={(v) =>
          setDatos((prev) => ({
            ...prev,
            diagnosticoActual: v,
          }))
        }
      />
    </>
  )}

</div>
        <div style={grid3}>
          <Input
            label="Peso real (kg)"
            value={pesoReal}
            onChange={(v) =>
              setDatos((prev) => ({ ...prev, pesoReal: v }))
            }
          />

          <Input
            label="Talla (cm)"
            value={talla}
            onChange={(v) =>
              setDatos((prev) => ({ ...prev, talla: v }))
            }
          />
{role === "admin" && (
          <Textarea
            label="Antecedentes de importancia"
            value={datos.antecedentes}
            onChange={(v) =>
              setDatos((prev) => ({
                ...prev,
                antecedentes: v,
              }))
              
            }
          />
          )}
        </div>
        {role === "admin" && (
<div style={grid3}>

  <div>
    <label style={labelStyle}>
      Tipo cirugía
    </label>

    <input
      value={datos.tipoCirugia}
      onChange={(e) =>
        setDatos((prev) => ({
          ...prev,
          tipoCirugia: e.target.value,
        }))
      }
      placeholder="Ej: Revascularización coronaria"
      style={input}
    />
  </div>


  <div>
    <label style={labelStyle}>
      Prioridad cirugía
    </label>

    <select
      value={datos.prioridadCirugia}
      onChange={(e) =>
        setDatos((prev) => ({
          ...prev,
          prioridadCirugia: e.target.value,
        }))
      }
      style={input}
    >
      <option value="">
        Seleccionar
      </option>

      <option value="Electiva">
        Electiva
      </option>

      <option value="Urgencia">
        Urgencia
      </option>

      <option value="Emergencia">
        Emergencia
      </option>

    </select>
  </div>


  <div>
    <label style={labelStyle}>
      Estado ingreso
    </label>

    <select
      value={datos.estadoIngreso}
      onChange={(e) =>
        setDatos((prev) => ({
          ...prev,
          estadoIngreso: e.target.value,
        }))
      }
      style={input}
    >
      <option value="">
        Seleccionar
      </option>

      <option value="Estable">
        Estable
      </option>

      <option value="Intubado">
        Intubado
      </option>

      <option value="BCIA">
        BCIA
      </option>

      <option value="ECMO">
        ECMO
      </option>

    </select>
  </div>

</div>
)}
        <div style={metrics}>
          <Metric label="SC Real (m²)" value={scReal} />
          <Metric label="SC Ideal (m²)" value={scIdeal} />
          <Metric label="SC Ajustada (m²)" value={scAjustada} />
          <Metric label="Peso ideal (kg)" value={pesoIdeal} />
          <Metric label="Peso ajustado (kg)" value={pesoAjustado} />
          <Metric label="IMC" value={imc} />
          <Metric label="Nutrición" value={nutricion} />
        </div>
      </div>
    </div>
  );
}

/* ================= SUBCOMPONENTES ================= */

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={input}
      />
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label style={labelStyle}>{label}</label>

      <div style={dateWrapper}>
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={dateInput}
        />

        <Calendar
          size={18}
          style={calendarIcon}
          onClick={() => inputRef.current?.showPicker()}
        />
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={input}
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={textarea}
      />
    </div>
  );
}

function Select({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={input}
      >
        <option value="">Seleccionar...</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  let color = "#5eead4";

  if (label === "Nutrición") {
    if (value === "Bajo peso") color = "#60a5fa";
    else if (value === "Normal") color = "#22c55e";
    else if (value === "Sobrepeso") color = "#facc15";
    else if (value === "Obesidad") color = "#ef4444";
    else color = "#94a3b8";
  }

  return (
    <div style={metric}>
      <div style={{ fontSize: 12, color: "#94a3b8" }}>
        {label}
      </div>
      <div
        style={{ fontSize: 18, fontWeight: 800, color }}
      >
        {value || "--"}
      </div>
    </div>
  );
}

/* ================= ESTILOS ================= */

const container: React.CSSProperties = {
  background: "#0f172a",
  borderRadius: 20,
  padding: 20,
  border: "1px solid #1e293b",
  marginTop: 15,
};

const header: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 20,
};

const title: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
  color: "#5eead4",
};

const card: React.CSSProperties = {
  background: "#0f172a",
  borderRadius: 20,
  padding: 10,
};

const grid4: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
  marginBottom: 20,
};

const grid3: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
  marginBottom: 20,
};

const metrics: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(140px, 1fr))",
  gap: 12,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#94a3b8",
  marginBottom: 6,
  display: "block",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  background: "#020617",
  border: "1px solid #334155",
  color: "white",
};

const textarea: React.CSSProperties = {
  width: "100%",
  height: 90,
  padding: 12,
  borderRadius: 10,
  background: "#020617",
  border: "1px solid #334155",
  color: "white",
};

const metric: React.CSSProperties = {
  background: "#020617",
  borderRadius: 12,
  padding: 12,
  border: "1px solid #334155",
  textAlign: "center",
};

const divider: React.CSSProperties = {
  borderColor: "#1e293b",
  marginBottom: 28,
};

const dateWrapper: React.CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
};

const dateInput: React.CSSProperties = {
  ...input,
  paddingRight: 36,
};

const calendarIcon: React.CSSProperties = {
  position: "absolute",
  right: 10,
  color: "#5eead4",
  cursor: "pointer",
};