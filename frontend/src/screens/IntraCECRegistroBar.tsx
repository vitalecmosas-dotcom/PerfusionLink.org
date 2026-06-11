interface Props {
  hora: string;
  setHora: (v: string) => void;
  onAgregar: () => void;
}

export default function IntraCECRegistroBar({
  hora,
  setHora,
  onAgregar,
}: Props) {
  return (
    <div style={container}>
      <input
        type="time"
        value={hora}
        onChange={(e) => setHora(e.target.value)}
        style={horaStyle}
      />

      <button onClick={onAgregar} style={buttonStyle}>
        + Agregar registro
      </button>
    </div>
  );
}

const container = {
  display: "flex",
  gap: 12,
  marginTop: 20,
};

const horaStyle = {
  background: "#020617",
  border: "1px solid #334155",
  borderRadius: 10,
  padding: "10px 16px",
  color: "#5eead4",
  fontWeight: 700,
  width: 110,
   colorScheme: "dark" as const,
  appearance: "auto" as const,
};

const buttonStyle = {
  background: "#020617",
  border: "1px solid #334155",
  borderRadius: 10,
  padding: "10px 16px",
  color: "#5eead4",
  fontWeight: 700,
  cursor: "pointer",
};