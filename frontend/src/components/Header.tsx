interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "50px clamp(20px, 4vw, 40px)",
boxSizing: "border-box",
      }}
    >
      {/* IZQUIERDA: ICONO + TEXTO */}
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
            height: 36,
            borderRadius: 10,
            boxShadow: "0 6px 20px rgba(94,234,212,0.35)",
          }}
        />

        <span style={{ fontSize: 20, fontWeight: 800 }}>
          <span style={{ color: "white" }}>Perfusion</span>
          <span style={{ color: "#5eead4" }}>Link</span>
        </span>
      </div>

      {/* DERECHA: LOGOUT */}
      <button
        onClick={onLogout}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "transparent",
          border: "none",
          color: "#94a3b8",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        <span style={{ fontSize: 16 }}>⏻</span>
        Finalizar sesión
      </button>
    </div>
  );
}