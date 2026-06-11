import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import type { DatosClinicos } from "../types/DatosClinicos";

/* ================= PROPS ================= */

interface CalculoFlujosProps {
  datos: DatosClinicos;
  setDatos: React.Dispatch<React.SetStateAction<DatosClinicos>>;
}

/* ================= COMPONENTE ================= */

export default function CalculoFlujosSection({
  datos,
  setDatos,
}: CalculoFlujosProps) {

  const [flujoTeorico, setFlujoTeorico] = useState("0.00");

  const isMobile = window.innerWidth < 768;

  /* ================= CÁLCULO ================= */

  useEffect(() => {
    let sc = 0;

    const estrategia = datos.planPerfusion.flujos.estrategiaPeso;
    const indice = datos.planPerfusion.flujos.indiceCardiaco;

    if (estrategia === "real") {
      sc = parseFloat(datos.scReal || "0");
    }
    if (estrategia === "ideal") {
      sc = parseFloat(datos.scIdeal || "0");
    }
    if (estrategia === "ajustado") {
      sc = parseFloat(datos.scAjustada || "0");
    }

    if (sc > 0 && indice > 0) {
      const flujo = sc * indice;
      setFlujoTeorico(flujo.toFixed(2));
    } else {
      setFlujoTeorico("0.00");
    }
  }, [
    datos.planPerfusion.flujos.estrategiaPeso,
    datos.planPerfusion.flujos.indiceCardiaco,
    datos.scReal,
    datos.scIdeal,
    datos.scAjustada,
  ]);

  const indices = [2.0, 2.2, 2.4, 2.6, 2.8, 3.0];

  return (
    <section
      style={{
        background: "#0f172a",
        borderRadius: 24,
        padding: 28,
        border: "1px solid #1e293b",
        marginTop: 15,
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <Activity size={26} color="#5eead4" />
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#5eead4" }}>
          Cálculo de Flujos y Presiones Objetivo
        </h2>
      </div>

      <hr style={divider} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 32,
          width: "100%",
        }}
      >
        {/* COLUMNA IZQUIERDA */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          
          {/* ESTRATEGIA PESO */}
          <div>
            <div style={label}>Estrategia de peso</div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: 10,
              }}
            >
              {(["real", "ideal", "ajustado"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() =>
                    setDatos((prev) => ({
                      ...prev,
                      planPerfusion: {
                        ...prev.planPerfusion,
                        flujos: {
                          ...prev.planPerfusion.flujos,
                          estrategiaPeso: opt,
                        },
                      },
                    }))
                  }
                  style={boton(
                    datos.planPerfusion.flujos.estrategiaPeso === opt
                  )}
                >
                  {opt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* ÍNDICE CARDÍACO */}
          <div>
            <div style={label}>
              Índice cardíaco target (L/min/m²)
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 10,
              }}
            >
              {indices.map((ic) => (
                <button
                  key={ic}
                  onClick={() =>
                    setDatos((prev) => ({
                      ...prev,
                      planPerfusion: {
                        ...prev.planPerfusion,
                        flujos: {
                          ...prev.planPerfusion.flujos,
                          indiceCardiaco: ic,
                        },
                      },
                    }))
                  }
                  style={boton(
                    datos.planPerfusion.flujos.indiceCardiaco === ic
                  )}
                >
                  {ic.toFixed(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RESULTADO */}
        <div
          style={{
            background: "#020617",
            borderRadius: 20,
            padding: 24,
            border: "1px solid #334155",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 13, color: "#94a3b8" }}>
            Flujo teórico total
          </div>

          <div
            style={{
              fontSize: isMobile ? 36 : 42,
              fontWeight: 900,
              color: "#5eead4",
            }}
          >
            {flujoTeorico}
          </div>

          <div style={{ fontSize: 14, color: "#94a3b8" }}>
            L / min
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= ESTILOS ================= */

const label: React.CSSProperties = {
  fontSize: 12,
  color: "#94a3b8",
  marginBottom: 10,
};

const boton = (activo: boolean): React.CSSProperties => ({
  padding: "10px 14px",
  borderRadius: 12,
  border: activo ? "1px solid #5eead4" : "1px solid #334155",
  background: activo ? "#5eead420" : "#020617",
  color: activo ? "#5eead4" : "#94a3b8",
  fontWeight: 700,
  cursor: "pointer",
  width: "100%",
  boxSizing: "border-box",
});

const divider: React.CSSProperties = {
  borderColor: "#1e293b",
  marginBottom: 24,
};