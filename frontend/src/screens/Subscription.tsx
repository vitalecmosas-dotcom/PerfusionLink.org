import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

interface Props {
  uid: string;
  onBack: () => void;
}

export default function Subscription({
  uid,
  onBack,
}: Props) {

  const [loading, setLoading] = useState(true);

  const [datos, setDatos] = useState<any>(null);

  useEffect(() => {

    const cargar = async () => {

      const snap = await getDoc(
        doc(db, "usuarios", uid)
      );

      if (snap.exists()) {

        setDatos(snap.data());

      }

      setLoading(false);

    };

    cargar();

  }, [uid]);

  if (loading) {

    return (

      <div
        style={{
          minHeight:"100vh",
          background:"#020617",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          color:"white"
        }}
      >

        Cargando...

      </div>

    );

  }

  return (

<div
style={{
minHeight:"100vh",
background:"#020617",
padding:30,
color:"white"
}}
>

<button
onClick={onBack}
style={{
marginBottom:25,
padding:"10px 18px",
borderRadius:10,
border:"none",
cursor:"pointer"
}}
>
← Volver
</button>

<h1
style={{
color:"#5eead4"
}}
>
Mi suscripción
</h1>

<div
style={{
background:"#0f172a",
padding:30,
borderRadius:20,
marginTop:25,
lineHeight:2
}}
>

<div>

<strong>Estado:</strong>

{" "}

{datos.subscription === "active"
? "🟢 Activa"
: "🔴 Inactiva"}

</div>

<div>

<strong>Plan:</strong>

{" "}

{datos.plan || "-"}

</div>

<div>

<strong>Proveedor:</strong>

{" "}

{datos.paymentProvider || "-"}

</div>

<div>

<strong>Activada:</strong>

{" "}

{datos.subscriptionStartedAt
? datos.subscriptionStartedAt
.toDate()
.toLocaleDateString()
: "-"}

</div>

<div>

<strong>Vence:</strong>

{" "}

{datos.subscriptionExpiresAt
? datos.subscriptionExpiresAt
.toDate()
.toLocaleDateString()
: "-"}

</div>

<div>

<strong>Último pago:</strong>

{" "}

{datos.lastPaymentDate
? datos.lastPaymentDate
.toDate()
.toLocaleDateString()
: "-"}

</div>

</div>

</div>

  );

}