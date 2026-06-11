import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

interface IAProps {
  onBack: () => void;
}

type Message = {
  role: "assistant" | "user";
  text: string;
};

export default function IA({ onBack }: IAProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  /* 👋 SALUDO AUTOMÁTICO */
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        text:
          "Hola. Soy tu asistente especializado en perfusión. ¿En qué puedo ayudarte hoy?",
      },
    ]);
  }, []);

  /* 🧠 ENVIAR PREGUNTA A GEMINI */
  const enviarPregunta = async () => {
  if (!input.trim() || loading) return;

  const pregunta = input;
  setInput("");
  setLoading(true);

  setMessages((prev) => [
    ...prev,
    { role: "user", text: pregunta },
  ]);

  try {
    const res = await fetch(
      "https://us-central1-gemini-backend-eliana-62ea3.cloudfunctions.net/geminiChat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          prompt: pregunta,
        }),
      }
    );

    console.log("STATUS:", res.status);

    const data = await res.json();

    console.log("RESPUESTA GEMINI:", data);

    if (!res.ok) {
      throw new Error(
        data?.error || "Error del servidor"
      );
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",

        text:
          data.response ||
          data.text ||
          data.message ||
          "No hubo respuesta",
      },
    ]);
  } catch (error) {
    console.error(error);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text:
          "No se pudo obtener respuesta del asistente en este momento.",
      },
    ]);
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        padding: 32,
        color: "white",
      }}
    >
      {/* HEADER */}
      <button
        onClick={onBack}
        style={{
          background: "transparent",
          border: "none",
          color: "#5eead4",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        ← Volver a Home
      </button>

      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 20 }}>
        🤖 Asistente de Perfusión
      </h1>

      {/* CHAT */}
      <div
        style={{
          background: "#020617",
          border: "1px solid #334155",
          borderRadius: 16,
          padding: 20,
          maxWidth: 900,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {messages.map((m, i) => (
           <div
  key={i}
  style={{
    alignSelf: m.role === "user" ? "flex-end" : "flex-start",
    background:
      m.role === "user" ? "#0f766e" : "#1e293b",
    padding: "10px 14px",
    borderRadius: 12,
    maxWidth: "80%",
    whiteSpace: "pre-wrap",
  }}
>
  <ReactMarkdown>
    {m.text}
  </ReactMarkdown>
</div>
          ))}
        </div>

        {/* INPUT */}
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta clínica..."
            onKeyDown={(e) => e.key === "Enter" && enviarPregunta()}
            style={{
              flex: 1,
              background: "#020617",
              border: "1px solid #334155",
              borderRadius: 10,
              padding: "10px 12px",
              color: "white",
            }}
          />

          <button
            onClick={enviarPregunta}
            disabled={loading}
            style={{
              background: "#020617",
              border: "1px solid #334155",
              borderRadius: 10,
              padding: "10px 16px",
              color: "#5eead4",
              fontWeight: 700,
              cursor: "pointer",
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? "..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}