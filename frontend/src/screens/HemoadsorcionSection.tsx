import type { DatosClinicos } from "../types/DatosClinicos";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  datos: DatosClinicos;
  setDatos: Dispatch<SetStateAction<DatosClinicos>>;
}

export default function HemoadsorcionSection({
  datos,
  setDatos,
}: Props) {

  const terapia =
    datos.planPerfusion.terapiaHemoadsorcion ?? {
      usar:false,
      tipo:"",
    };

  const update = (
    campo:"usar"|"tipo",
    valor:boolean|string
  ) => {

    setDatos((prev)=>({

      ...prev,

      planPerfusion:{

        ...prev.planPerfusion,

        terapiaHemoadsorcion:{

          ...prev.planPerfusion
          .terapiaHemoadsorcion,

          [campo]:valor,
        },
      },
    }));
  };

  return (

    <section style={container}>

      <div style={header}>
        🩸 Terapia de Hemoadsorción
      </div>

      <div style={subTitle}>
        ¿Usar terapia?
      </div>

      <div style={pillGroup}>

        <Pill
          text="SÍ"
          active={terapia.usar===true}
          onClick={()=>
            update(
              "usar",
              true
            )
          }
        />

        <Pill
          text="NO"
          active={terapia.usar===false}
          onClick={()=>{
            update(
              "usar",
              false
            );

            update(
              "tipo",
              ""
            );
          }}
        />

      </div>

      {terapia.usar && (

        <div style={pillGroup}>

          <Pill
            text="CYTOSORB"
            active={
              terapia.tipo==="CYTOSORB"
            }
            onClick={()=>
              update(
                "tipo",
                "CYTOSORB"
              )
            }
          />

          <Pill
            text="HA60 JAFRON"
            active={
              terapia.tipo==="HA60 JAFRON"
            }
            onClick={()=>
              update(
                "tipo",
                "HA60 JAFRON"
              )
            }
          />

        </div>

      )}

    </section>
  );
}

function Pill({
  text,
  active,
  onClick,
}:{
  text:string
  active:boolean
  onClick:()=>void
}){

  return(

    <button
      onClick={onClick}
      style={{
        padding:"10px 16px",
        borderRadius:999,
        border:`1px solid ${
          active
          ? "#5eead4"
          : "#334155"
        }`,
        background:
          active
          ? "#022c22"
          : "#020617",
        color:
          active
          ? "#5eead4"
          : "white",
        cursor:"pointer",
        fontWeight:700,
      }}
    >
      {text}
    </button>
  );
}

const container:React.CSSProperties={
 background:"#0f172a",
 borderRadius:24,
 padding:24,
 border:"1px solid #1e293b",
};

const header:React.CSSProperties={
 fontWeight:800,
 color:"#5eead4",
 marginBottom:20,
 fontSize:18,
};

const subTitle:React.CSSProperties={
 color:"#94a3b8",
 fontSize:12,
 marginBottom:10,
};

const pillGroup:React.CSSProperties={
 display:"flex",
 gap:10,
 flexWrap:"wrap",
 marginTop:10,
};