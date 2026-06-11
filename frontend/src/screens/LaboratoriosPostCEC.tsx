import { TestTube, FlaskConical } from "lucide-react";
import type { DatosClinicos } from "../types/DatosClinicos";
import type { Dispatch, SetStateAction } from "react";
import { exportarReporteExcel } from "../utils/exportarExcel";
/* ================= COMPONENTE ================= */

export default function LaboratoriosPostCEC({
  onFinalizarCaso,
  datos,
  setDatos,
  role, 
}: {
  onFinalizarCaso: () => void;
  datos: DatosClinicos;
  setDatos: Dispatch<SetStateAction<DatosClinicos>>;
  role: string;
}) {
  const isMobile = window.innerWidth < 768;

  /* 🔥 FALLBACK SEGURO (CAMBIO MÍNIMO) */
  const lab = datos.postCEC?.laboratorios ?? {
    hb: "",
    hto: "",
    plaquetas: "",
    leucocitos: "",
    act: "",
    urea: "",
    creatinina: "",
    lactato: "",
    glicemia: "",
    tgo: "",
    tgp: "",
    bbd: "",
    bbt: "",
    na: "",
    k: "",
    ca: "",
    phA: "",
    pco2A: "",
    po2A: "",
    satA: "",  
    hco3A: "",
    phV: "",
    pco2V: "",
    po2V: "",
    satV: "",  
    hco3V: "",
    dopamina: "",
    dobutamina: "",
    epinefrina: "",
    norepinefrina: "",
    milrinona: "",
    vasopresina: "",
  };

  const setCampo = (key: string, value: string) => {
    setDatos((prev) => ({
      ...prev,
      postCEC: {
        ...prev.postCEC,
        laboratorios: {
          ...prev.postCEC?.laboratorios,
          [key]: value,
        },
      },
    }));
  };

  /* ===== CÁLCULO VIS ===== */
  const calcularVIS = () => {
    const dopa = Number(lab.dopamina) || 0;
    const dobu = Number(lab.dobutamina) || 0;
    const epi = Number(lab.epinefrina) || 0;
    const norepi = Number(lab.norepinefrina) || 0;
    const milri = Number(lab.milrinona) || 0;
    const vaso = Number(lab.vasopresina) || 0;

    const vis =
      dopa +
      dobu +
      epi * 100 +
      norepi * 100 +
      milri * 10 +
      vaso * 167;

    return vis > 0 ? vis.toFixed(1) : "";
  };

  return (
    <div style={card}>
      <div style={header}>
        <TestTube size={20} />
        Laboratorios Post-CEC
      </div>

      <hr style={{ margin: "20px 0", borderColor: "#1e293b" }} />

      <div
        style={{
          ...grid,
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
        }}
      >
        <Section title="HEMATOLOGÍA Y COAGULACIÓN" color="#fb7185">
          <Field label="HB (g/dL)" value={lab.hb} setValue={(v:string)=>setCampo("hb",v)} />
          <Field label="HTO (%)" value={lab.hto} setValue={(v:string)=>setCampo("hto",v)} />
          <Field label="Plaquetas" value={lab.plaquetas} setValue={(v:string)=>setCampo("plaquetas",v)} />
          <Field label="Leucocitos" value={lab.leucocitos} setValue={(v:string)=>setCampo("leucocitos",v)} />
          <Field label="ACT (seg)" value={lab.act} setValue={(v:string)=>setCampo("act",v)} full />
        </Section>

        <Section title="FUNCIÓN RENAL Y METABÓLICA" color="#5eead4">
          <Field label="Urea" value={lab.urea} setValue={(v:string)=>setCampo("urea",v)} />
          <Field label="Creatinina" value={lab.creatinina} setValue={(v:string)=>setCampo("creatinina",v)} />
          <Field label="Lactato" value={lab.lactato} setValue={(v:string)=>setCampo("lactato",v)} />
          <Field label="Glicemia" value={lab.glicemia} setValue={(v:string)=>setCampo("glicemia",v)} />
        </Section>

        <Section title="FUNCIÓN HEPÁTICA Y ELECTROLITOS" color="#facc15">
          <Field label="TGO / AST" value={lab.tgo} setValue={(v:string)=>setCampo("tgo",v)} />
          <Field label="TGP / ALT" value={lab.tgp} setValue={(v:string)=>setCampo("tgp",v)} />
          <Field label="BBD (Dir)" value={lab.bbd} setValue={(v:string)=>setCampo("bbd",v)} />
          <Field label="BBT (Total)" value={lab.bbt} setValue={(v:string)=>setCampo("bbt",v)} />
          <Field label="Na⁺" value={lab.na} setValue={(v:string)=>setCampo("na",v)} />
          <Field label="K⁺" value={lab.k} setValue={(v:string)=>setCampo("k",v)} />
          <Field label="Ca⁺⁺" value={lab.ca} setValue={(v:string)=>setCampo("ca",v)} />
        </Section>

        <Section title="GASOMETRÍA ARTERIAL POST" color="#38bdf8">

  <Field label="pH" value={lab.phA} setValue={(v:string)=>setCampo("phA",v)} />

  <Field label="PCO₂" value={lab.pco2A} setValue={(v:string)=>setCampo("pco2A",v)} />

  <Field label="PO₂" value={lab.po2A} setValue={(v:string)=>setCampo("po2A",v)} />

  <Field

    label="Sat Arterial (%)"

    value={lab.satA}

    setValue={(v:string)=>setCampo("satA",v)}

  />

  <Field label="HCO₃" value={lab.hco3A} setValue={(v:string)=>setCampo("hco3A",v)} />

  <Field label="EB" value={lab.ebA} setValue={(v:string)=>setCampo("ebA",v)} />

</Section>

        <Section title="GASOMETRÍA VENOSA POST" color="#c084fc">

  <Field label="pH" value={lab.phV} setValue={(v:string)=>setCampo("phV",v)} />

  <Field label="PCO₂" value={lab.pco2V} setValue={(v:string)=>setCampo("pco2V",v)} />

  <Field label="PO₂" value={lab.po2V} setValue={(v:string)=>setCampo("po2V",v)} />

  <Field

    label="Sat Venosa (%)"

    value={lab.satV}

    setValue={(v:string)=>setCampo("satV",v)}

  />

  <Field label="HCO₃" value={lab.hco3V} setValue={(v:string)=>setCampo("hco3V",v)} />

  <Field label="EB" value={lab.ebV} setValue={(v:string)=>setCampo("ebV",v)} />

</Section>

        <Section title="VIS SCORE" color="#f97316">
          <Field label="Dopamina" value={lab.dopamina} setValue={(v:string)=>setCampo("dopamina",v)} />
          <Field label="Dobutamina" value={lab.dobutamina} setValue={(v:string)=>setCampo("dobutamina",v)} />
          <Field label="Epinefrina" value={lab.epinefrina} setValue={(v:string)=>setCampo("epinefrina",v)} />
          <Field label="Norepinefrina" value={lab.norepinefrina} setValue={(v:string)=>setCampo("norepinefrina",v)} />
          <Field label="Milrinona" value={lab.milrinona} setValue={(v:string)=>setCampo("milrinona",v)} />
          <Field label="Vasopresina" value={lab.vasopresina} setValue={(v:string)=>setCampo("vasopresina",v)} />
          <Field label="VIS Total" value={calcularVIS()} setValue={()=>{}} full />
        </Section>
      </div>
            {/* CONDICIÓN SALIDA */}

      <div style={salidaCard}>

        <div style={salidaTitle}>

          CONDICIÓN DE SALIDA

        </div>

        <select

          value={datos.postCEC.condicionSalida}

          onChange={(e)=>

            setDatos(prev=>({

              ...prev,

              postCEC:{

                ...prev.postCEC,

                condicionSalida:e.target.value

              }

            }))

          }

          style={selectSalida}

        >

          <option value="">Seleccionar</option>

          <option value="Intubado">Intubado</option>

          <option value="Extubado">Extubado</option>

          <option value="BCIA">BCIA</option>

          <option value="ECMO">ECMO</option>

          <option value="Futilidad">Futilidad</option>

        </select>

      </div>

     <div
  style={{
    display: "flex",
    justifyContent: isMobile ? "center" : "flex-end",
    gap: 10,
    marginTop: 24,
  }}
>
  <button style={dangerButton} onClick={onFinalizarCaso}>
    Finalizar caso
  </button>

  {role === "admin" ? (
    <button
      style={primaryButton}
      onClick={() => exportarReporteExcel(datos)}
    >
      Descargar reporte
    </button>
  ) : null}
</div>

    </div>
  );
}

/* ===== SUBCOMPONENTES Y ESTILOS (SIN CAMBIOS) ===== */

function Section({ title, color, children }: any) {
  return (
    <div style={{ ...section, borderColor: `${color}40` }}>
      <div style={{ ...sectionTitle, color }}>
        <FlaskConical size={16} />
        {title}
      </div>
      <div style={fieldsGrid}>{children}</div>
    </div>
  );
}

function Field({ label, value, setValue, full }: any) {
  const esVIS = label === "VIS Total";
  const visNumero = Number(value);

  let visColor="#5eead4";
  let visBackground="#020617";

  if (esVIS && !isNaN(visNumero)) {
    if (visNumero<=10){visColor="#22c55e";visBackground="rgba(34,197,94,0.15)"}
    else if (visNumero<=20){visColor="#facc15";visBackground="rgba(250,204,21,0.15)"}
    else if (visNumero<=40){visColor="#f97316";visBackground="rgba(249,115,22,0.15)"}
    else {visColor="#ef4444";visBackground="rgba(239,68,68,0.15)"}
  }

  return (
    <div style={{ ...field, gridColumn: full ? "1 / -1" : undefined }}>
      <span style={labelStyle}>{label}</span>
      <input
        value={value}
        onChange={(e)=>setValue(e.target.value)}
        disabled={esVIS}
        style={{
          ...input,
          ...(esVIS && { fontSize:20,fontWeight:800,color:visColor,background:visBackground,border:`1px solid ${visColor}`}),
        }}
      />
    </div>
  );
}

/* ===== ESTILOS ===== */

const card={background:"#1e293b",borderRadius:20,padding:24,border:"1px solid #334155"};
const header={display:"flex",alignItems:"center",gap:10,fontWeight:800,fontSize:18,color:"#5eead4",marginBottom:24};
const grid={display:"grid",gap:24};
const section={background:"#020617",borderRadius:18,padding:20,border:"1px solid"};
const sectionTitle={display:"flex",alignItems:"center",gap:8,fontWeight:800,fontSize:13,letterSpacing:1,marginBottom:16};
const fieldsGrid={display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14};
const field={display:"flex",flexDirection:"column" as const,gap:6};
const labelStyle={fontSize:11,color:"#94a3b8"};
const input={background:"#020617",border:"1px solid #334155",borderRadius:10,padding:"8px 10px",color:"white",textAlign:"center" as const};
const dangerButton={background:"#020617",border:"1px solid #334155",borderRadius:10,padding:"6px 12px",color:"#fb7185",fontWeight:700};
const primaryButton={background:"#020617",border:"1px solid #334155",borderRadius:10,padding:"6px 12px",color:"#5eead4",fontWeight:700};
const salidaCard = {
  background:"#020617",
  border:"1px solid #334155",
  borderRadius:18,
  padding:20,
  marginTop:24,
};

const salidaTitle = {
  fontWeight:800,
  fontSize:13,
  color:"#5eead4",
  marginBottom:12,
};

const selectSalida = {
  width:"100%",
  background:"#020617",
  border:"1px solid #334155",
  borderRadius:10,
  padding:"10px",
  color:"white",
};