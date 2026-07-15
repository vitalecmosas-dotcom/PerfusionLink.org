import { useEffect, useState } from "react";
import SplashLogin from "./screens/SplashLogin";
import Login from "./components/Login";
import Home from "./screens/Home";
declare const PPaymentButtonBox: any;
import { createPaymentSession } from "./services/payphoneService";
import PaymentResult from "./screens/PaymentResult";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./services/firebase";
/* ADMINS */

export default function App() {
  const path = window.location.pathname;

if (path === "/pago") {
  return <PaymentResult />;
}
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [role, setRole] = useState<string>("user");
  const [subscription, setSubscription] =useState<string>("inactive");
  const [showWelcome, setShowWelcome] = useState(false);
  
  /* ===========================
   ESCUCHAR CAMBIOS DEL USUARIO
=========================== */
  const activarSuscripcion = async () => {
  try {
    const data = await createPaymentSession(uid!);

console.log(data);

new PPaymentButtonBox({
  token: data.token,
  clientTransactionId: data.clientTransactionId,

  amount: data.amount,
  amountWithoutTax: data.amountWithoutTax,
  amountWithTax: data.amountWithTax,
  tax: data.tax,
  service: data.service,
  tip: data.tip,

  currency: data.currency,
  storeId: data.storeId,
  reference: data.reference,

  responseUrl: data.responseUrl,
  cancellationUrl: data.cancellationUrl,

  lang: "es",
  defaultMethod: "card",
}).render("pp-button");

  } catch (error) {
    console.error(error);

    alert("Error al crear la sesión de pago");
  }
};
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);   
    return () => clearTimeout(timer);
  }, []);
useEffect(() => {

  if (!uid) return;

  const unsubscribe = onSnapshot(

    doc(db, "usuarios", uid),

    (snapshot) => {

      if (!snapshot.exists()) return;

      const data = snapshot.data();

      console.log("Usuario actualizado:", data);

     if (data.subscription === "active" && subscription !== "active") {
  setSubscription("active");
  setShowWelcome(true);

  setTimeout(() => {
    setShowWelcome(false);
  }, 5000);

} else {
  setSubscription(data.subscription);
}

    }

  );

  return () => unsubscribe();

}, [uid, subscription]);
 

  // 1️⃣ Splash
  if (showSplash) {
    return <SplashLogin />;
  }

  // 2️⃣ Login (si no hay usuario o UID)
  if (!user || !uid) {
    return (
      <Login
        onLogin={(
  username: string,
  userRole: string,
  userSubscription: string,
  userUid: string
) => {
          console.log("LOGIN UID:", userUid); // 🔍 debug útil

          setUser(username);
          setRole(userRole);
          setSubscription(userSubscription);
          setUid(userUid);
        }}
      />
    );
  }
/* 🔒 BLOQUEO SUSCRIPCIÓN */

if (
  role !== "admin" &&
  subscription !== "active"
) {

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        padding: 30,
        textAlign: "center",
      }}
    >

      <div
        style={{
          background: "#0f172a",
          padding: 40,
          borderRadius: 24,
          border: "1px solid #1e293b",
          maxWidth: 420,
        }}
      >

        <h1
          style={{
            color: "#5eead4",
            marginBottom: 20,
          }}
        >
          Suscripción requerida
        </h1>

        <p
          style={{
            color: "#94a3b8",
            lineHeight: 1.6,
          }}
        >
          Tu cuenta aún no tiene una suscripción activa
          para acceder a PerfusionLink.
        </p>

        <button
  onClick={activarSuscripcion}
  style={{
    marginTop: 24,
    background: "#5eead4",
    color: "#020617",
    border: "none",
    borderRadius: 12,
    padding: "14px 22px",
    fontWeight: 800,
    cursor: "pointer",
  }}
>
  
  Activar suscripción
</button>
<div
  id="pp-button"
  style={{
    marginTop: 20,
  }}
></div>
<div
  id="pp-button"
  style={{
    marginTop: 20,
  }}
></div>
      </div>

    </div>
  );
}
  // 3️⃣ Home
  return (
  <Home
  user={user}
  role={role}
  isAdmin={role === "admin"}
  uid={uid}
  welcome={showWelcome}
  onLogout={() => {
 
    setUser(null);
    setRole("user");
    setUid(null);
    setSubscription("inactive");
  }}
/>
);
}