import { useMemo } from "react";
import {
  Timer,
  Play,
  Square,
  RotateCcw,
  Activity,
  Brain,
  Heart,
  ArrowDown,
  AlertTriangle,
} from "lucide-react";

import type { DatosClinicos } from "../types/DatosClinicos";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  datos: DatosClinicos;
  setDatos: Dispatch<SetStateAction<DatosClinicos>>;
}

export default function TiemposQuirurgicos({
  datos,
  setDatos,
}: Props) {

  if (!datos || !setDatos) return null;

  const isMobile = window.innerWidth < 768;

const { tiempos } =
datos.intraCEC.tiemposQuirurgicos;

  const filas = [
    { key:"cec",label:"INICIO / FIN CEC",icon:<Play size={16}/>,color:"#5eead4"},
    { key:"clampeo",label:"CLAMPEO",icon:<Square size={16}/>,color:"#fb7185"},
    { key:"reperfusion",label:"REPERFUSIÓN",icon:<RotateCcw size={16}/>,color:"#22c55e"},
    { key:"parada",label:"PARADA CIRC.",icon:<Activity size={16}/>,color:"#60a5fa"},
    { key:"cerebral",label:"PERF. CEREBRAL",icon:<Brain size={16}/>,color:"#a78bfa"},
    { key:"miocardica",label:"MIOCÁRDICA",icon:<Heart size={16}/>,color:"#f87171"},
    { key:"distal",label:"DISTAL",icon:<ArrowDown size={16}/>,color:"#fb923c"},
    { key:"evento",label:"EVENTO",icon:<AlertTriangle size={16}/>,color:"#facc15"},
  ];

  const calcularMinutos=(inicio:string,fin:string)=>{

    if(!inicio||!fin)return 0;

    const[h1,m1]=inicio.split(":").map(Number);
    const[h2,m2]=fin.split(":").map(Number);

    return Math.max(
      h2*60+m2-(h1*60+m1),
      0
    );

  };

  const totalCEC=useMemo(
    ()=>calcularMinutos(
      tiempos.cec.inicio,
      tiempos.cec.fin
    ),
    [tiempos]
  );

const updateTiempo=(
key:string,
field:string,
value:string
)=>{

setDatos(prev=>({

...prev,

intraCEC:{
...prev.intraCEC,

tiemposQuirurgicos:{
...prev.intraCEC.tiemposQuirurgicos,

tiempos:{
...prev.intraCEC.tiemposQuirurgicos.tiempos,

[key]:{

...prev.intraCEC
.tiemposQuirurgicos
.tiempos[
key as keyof typeof tiempos
],

[field]:value

}

}

}

}

}))

}

return(

<div style={card}>

<div style={header}>

<div style={headerLeft}>
<Timer size={20}/>
Tiempos Quirúrgicos
</div>

<div style={badge}>
CEC: {totalCEC} MIN
</div>

</div>

<hr
style={{
margin:"20px 0",
borderColor:"#1e293b"
}}
/>

{filas.map((f)=>{

const minutos=
f.key!=="evento"
?
calcularMinutos(
tiempos[
f.key as Exclude<
keyof typeof tiempos,
"evento"
>
].inicio,

tiempos[
f.key as Exclude<
keyof typeof tiempos,
"evento"
>
].fin
)
:0

return(

<div
key={f.key}
style={{
...row,
gridTemplateColumns:
isMobile
?"1fr 1fr"
:"220px 1fr 1fr 80px"
}}
>

<div
style={{
...label,
color:f.color
}}
>
{f.icon}
{f.label}
</div>

{f.key!=="evento"&&(
<>
<input
type="time"
value={
tiempos[
f.key as Exclude<
keyof typeof tiempos,
"evento"
>
].inicio
}
onChange={(e)=>
updateTiempo(
f.key,
"inicio",
e.target.value
)
}
style={timeInputStyle}
/>

<input
type="time"
value={
tiempos[
f.key as Exclude<
keyof typeof tiempos,
"evento"
>
].fin
}
onChange={(e)=>
updateTiempo(
f.key,
"fin",
e.target.value
)
}
style={timeInputStyle}
/>
</>
)}

<div
style={{
...minutes,
color:f.color
}}
>
{minutos>0?minutos:"--"}
</div>

{f.key==="evento"&&(

<div
style={{
gridColumn:"1/-1",
display:"flex",
flexDirection:"column",
gap:12,
marginTop:10
}}
>

<div
style={{
display:"grid",
gridTemplateColumns:
isMobile
?"1fr"
:"120px 1fr auto",
gap:10
}}
>

<input
type="time"
value={tiempos.evento?.hora || ""}
onChange={(e)=>
updateTiempo(
"evento",
"hora",
e.target.value
)
}
style={timeInputStyle}
/>

<input
placeholder="Describa el evento..."
value={tiempos.evento?.descripcion || ""}
onChange={(e)=>
updateTiempo(
"evento",
"descripcion",
e.target.value
)
}
style={{
...timeInputStyle,
color:"white"
}}
/>

<button
onClick={()=>{

if(
!tiempos.evento?.hora ||
!tiempos.evento?.descripcion
)return;

setDatos(prev=>({

...prev,

intraCEC:{
...prev.intraCEC,

tiemposQuirurgicos:{
...prev.intraCEC.tiemposQuirurgicos,

tiempos:{
...prev.intraCEC.tiemposQuirurgicos.tiempos,

evento:{

...prev.intraCEC
.tiemposQuirurgicos
.tiempos
.evento,

registros:[

...(prev.intraCEC
.tiemposQuirurgicos
.tiempos
.evento
?.registros || []),

{
hora:tiempos.evento.hora,
descripcion:
tiempos.evento.descripcion
}

],

hora:"",
descripcion:""

}

}

}

}

}))

}}

style={{
background:"#5eead4",
border:"none",
borderRadius:10,
padding:"10px",
fontWeight:700,
cursor:"pointer"
}}
>
Registrar
</button>

</div>

{(
tiempos.evento?.registros || []
).map((item:any,i:number)=>(

<div
key={i}
style={{
padding:12,
borderRadius:10,
background:"#020617",
border:"1px solid #334155",
display:"flex",
gap:12
}}
>

<div
style={{
fontWeight:800,
color:"#5eead4",
minWidth:60
}}
>
{item.hora}
</div>

<div style={{color:"white"}}>
{item.descripcion}
</div>

</div>

))}

</div>

)}

</div>

)

})}

</div>

)

}

const card={background:"#1e293b",borderRadius:20,padding:24,border:"1px solid #334155"};

const header={display:"flex",justifyContent:"space-between",marginBottom:20,fontWeight:800,color:"#5eead4"};

const headerLeft={display:"flex",gap:10,alignItems:"center"};

const badge={background:"#020617",padding:"6px 14px",borderRadius:999,fontSize:13};

const row={display:"grid",gap:12,alignItems:"center",marginBottom:14};

const label={display:"flex",alignItems:"center",gap:8,fontWeight:700,fontSize:11};

const minutes={fontSize:20,fontWeight:900};

const timeInputStyle={

background:"#020617",
border:"1px solid #334155",
borderRadius:10,
padding:"8px 10px",
color:"#5eead4",
fontWeight:700,
fontSize:13,
colorScheme:"dark" as const,

};