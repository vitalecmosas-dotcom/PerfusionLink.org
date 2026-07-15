import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

interface HeaderProps {
  uid: string;
  onLogout: () => void;
}

export default function Header({
  uid,
  onLogout,
}: HeaderProps) {

  const [open, setOpen] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {

    const cargar = async () => {

      const snap = await getDoc(
        doc(db, "usuarios", uid)
      );

      if (snap.exists()) {
        setUsuario(snap.data());
      }

    };

    cargar();

  }, [uid]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1500,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "40px",
        boxSizing: "border-box",
      }}
    >
      {/* LOGO */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <img
          src="/icon.png"
          alt="PerfusionLink"
          style={{
            width: 36,
            borderRadius: 10,
          }}
        />

        <span
          style={{
            fontSize: 22,
            fontWeight: 800,
          }}
        >
          <span style={{ color: "white" }}>Perfusion</span>
          <span style={{ color: "#5eead4" }}>Link</span>
        </span>

      </div>

      {/* CUENTA */}

      <div
        style={{
          position: "relative",
        }}
      >

        <button
          onClick={() => setOpen(!open)}
          style={{
            background: "transparent",
            border: "none",
            color: "#5eead4",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          👤 Mi cuenta
        </button>

        {open && usuario && (

          <div
  style={{
    position: "absolute",
    top: 60,
    right: 0,

    width: 420,
minWidth: 420,

    background: "#101827",

    border: "1px solid rgba(255,255,255,.12)",

    borderRadius: 28,

    padding: "30px 32px",

    boxShadow: "0 25px 60px rgba(0,0,0,.45)",

    zIndex: 999,
    boxSizing: "border-box",
overflow: "hidden",
}}
>

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    }}
  >

    <div
      style={{
        width: 90,
        height: 90,
        borderRadius: "50%",
        background: "#172554",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 42,
        marginBottom: 18,
      }}
    >
      👤
    </div>

    <div
      style={{
       fontSize: 20,
fontWeight: 800,
lineHeight: 1.3,
        color: "white",
      }}
    >
      {usuario.nombre} {usuario.apellido}
    </div>

    <div
      style={{
        color:"#94a3b8",
fontSize:16,
marginTop:10,
marginBottom:30,
      }}
    >
      {usuario.email}
    </div>

  </div>

  <hr
    style={{
      borderColor: "#1e293b",
      marginBottom: 22,
    }}
  />

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      marginBottom: 18,
    }}
  >
    <span style={{ fontSize: 26 }}>🩺</span>

    <span
      style={{
        fontSize:17,
fontWeight:500,
        color: "white",
      }}
    >
      {usuario.profesion}
    </span>
  </div>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      marginBottom: 26,
    }}
  >
    <span style={{ fontSize: 26 }}>🌎</span>

    <span
      style={{
        fontSize:17,
fontWeight:500,
        color: "white",
      }}
    >
      {usuario.pais}
    </span>
  </div>

  <hr
    style={{
      borderColor: "#1e293b",
      marginBottom: 22,
    }}
  />

  <div
  style={{
      background: "#102432",
      border: "1px solid rgba(94,234,212,.25)",
      borderRadius: 18,
      padding: "18px 20px",
      marginBottom: 24,
      display: "flex",
      flexDirection: "column",
      gap: 8,
  }}
>

    <div
      style={{
        color: "#5eead4",
        fontWeight: 700,
        fontSize: 20,
      }}
    >
      ⭐ PREMIUM
    </div>

    <div
      style={{
        marginTop: 10,
        color:
          usuario.subscription === "active"
            ? "#22c55e"
            : "#ef4444",
        fontWeight: 600,
    
      }}
    >
      {usuario.subscription === "active"
        ? "● Suscripción activa"
        : "● Suscripción inactiva"}
    </div>

  </div>

  <button
    onClick={onLogout}
    style={{
      width: "100%",
      height: 52, 
      borderRadius: 14,
      border: "none",
      background: "#dc2626",
      color: "white",
      fontWeight: 700,
      fontSize: 17,
      cursor: "pointer",
    }}
  >
    🚪 Cerrar sesión
  </button>

          </div>
        )}

      </div>

    </div>

  );
}
