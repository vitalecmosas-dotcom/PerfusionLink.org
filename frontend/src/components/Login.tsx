import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getDoc, setDoc, doc, updateDoc, } from "firebase/firestore";
import { auth, db } from "../services/firebase";

interface LoginProps {

 onLogin?: (
  username: string,
  role: string,
  subscription: string,
  uid: string
) => void;
}


export default function Login({ onLogin }: LoginProps) {
  const [modoRegistro, setModoRegistro] = useState(false);

  // login paciencia paciencia
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // registro
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [pais, setPais] = useState("");
  const [profesion, setProfesion] = useState("");

 /* ================= LOGIN ================= */

const login = async () => {
  if (!email || !password) {
    alert("Completa los campos");
    return;
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);

console.log("UID autenticado:", cred.user.uid);

const snap = await getDoc(doc(db, "usuarios", cred.user.uid));
if (snap.exists()) {

  const data = snap.data();

  if (
    data.subscription === "active" &&
    data.subscriptionExpiresAt
  ) {

    const now = new Date();

    const expiration =
      data.subscriptionExpiresAt.toDate();

    if (expiration < now) {

      await updateDoc(
        doc(db, "usuarios", cred.user.uid),
        {
          subscription: "inactive",
        }
      );

      data.subscription = "inactive";

    }

  }

}
console.log("EXISTE DOC:", snap.exists());
console.log("UID buscado:", cred.user.uid);
let nombreUsuario = email;
let role = "user";
let subscription = "inactive";

if (snap.exists()) {

  const data = snap.data();

  console.log("Datos Firestore:", data);

  nombreUsuario =
    (data.nombre || "") +
    (data.apellido ? " " + data.apellido : "");

  role = data.role || "user";

  subscription = data.subscription || "inactive";

  // Verificar si la suscripción ya venció
  if (
    subscription === "active" &&
    data.subscriptionExpiresAt
  ) {

    const expiration =
      data.subscriptionExpiresAt.toDate();

    const now = new Date();

    if (expiration <= now) {

      console.log("Suscripción vencida.");

      subscription = "inactive";

    }

  }

}
console.log("ROL FINAL:", role); // ✅ AQUÍ
console.log("Nombre enviado al Home:", nombreUsuario);

// 🔥 guardar rol global
localStorage.setItem("userRole", role);
localStorage.setItem(
  "subscription",
  subscription
);
if (onLogin) {
  onLogin(
  nombreUsuario,
  role,
  subscription,
  cred.user.uid
);
}
  } catch (error: any) {
    alert(error.code + " - " + error.message);
  }
};

  /* ================= REGISTRO ================= */

  const registrarUsuario = async () => {
    if (!nombre || !apellido || !pais || !profesion || !email || !password) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

     await setDoc(doc(db, "usuarios", cred.user.uid), {

  nombre,

  apellido,

  pais,

  profesion,

  email,

  role: "user",

  subscription: "inactive",

  creado: new Date(),

});

      alert("Cuenta creada correctamente");

      setModoRegistro(false);
      setPassword("");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        alert("Este correo ya está registrado. Inicia sesión.");
      } else {
        alert("Error al registrar: " + error.message);
      }
    }
  };

  /* ================= UI ================= */

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          background: "#0f172a",
          borderRadius: 24,
          padding: "40px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
          border: "1px solid #1e293b",
        }}
      >
        {/* ICONO */}
        <img
          src="/icon.png"
          alt="PerfusionLink icon"
          style={{
            width: 90,
            height: 90,
            margin: "0 auto 16px auto",
            display: "block",
            borderRadius: 20,
            boxShadow: "0 12px 40px rgba(94,234,212,0.35)",
          }}
        />

        {/* TÍTULO */}
        <h1
          style={{
            fontSize: 36,
            fontWeight: 800,
            margin: 0,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          <span style={{ color: "white" }}>Perfusion</span>
          <span style={{ color: "#5eead4" }}>Link</span>
        </h1>

        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#64748b",
            marginBottom: 8,
          }}
        >
          Acceso exclusivo para personal clínico
        </p>

        {modoRegistro ? (
          <>
            <input
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={inputStyle}
            />

            <input
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              style={inputStyle}
            />

            <input
              placeholder="País"
              value={pais}
              onChange={(e) => setPais(e.target.value)}
              style={inputStyle}
            />

            <input
              placeholder="Profesión"
              value={profesion}
              onChange={(e) => setProfesion(e.target.value)}
              style={inputStyle}
            />

            <input
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />

            <button onClick={registrarUsuario} style={primaryButton}>
              Crear cuenta
            </button>

            <button
              onClick={() => setModoRegistro(false)}
              style={secondaryButton}
            >
              Volver a iniciar sesión
            </button>
          </>
        ) : (
          <>
            <input
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />

            <button onClick={login} style={primaryButton}>
              Iniciar sesión
            </button>

            <button
              onClick={() => setModoRegistro(true)}
              style={secondaryButton}
            >
              Registrarse
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ================= ESTILOS ================= */

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 14,
  background: "#020617",
  border: "1px solid #1e293b",
  color: "white",
  outline: "none",
  fontSize: 14,
};

const primaryButton: React.CSSProperties = {
  marginTop: 8,
  padding: "14px 0",
  borderRadius: 14,
  background: "#5eead4",
  color: "#020617",
  fontWeight: 800,
  fontSize: 14,
  border: "none",
  cursor: "pointer",
  boxShadow: "0 10px 30px rgba(94,234,212,0.35)",
};

const secondaryButton: React.CSSProperties = {
  padding: "12px 0",
  borderRadius: 14,
  background: "transparent",
  color: "#5eead4",
  fontWeight: 700,
  fontSize: 14,
  border: "1px solid #334155",
  cursor: "pointer",
};