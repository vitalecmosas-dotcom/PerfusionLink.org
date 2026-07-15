import { useEffect, useState } from "react";
import { confirmPayment } from "../services/payphoneService";

export default function PaymentResult() {
const [estado, setEstado] = useState<
  "loading" | "success" | "cancel" | "error"
>("loading");

const [mensaje, setMensaje] = useState(
  "Estamos verificando tu pago..."
);
 useEffect(() => {

  const confirmar = async () => {

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");
    const clientTransactionId = params.get("clientTransactionId");

    console.log("ID:", id);
    console.log("CLIENT:", clientTransactionId);

    if (!id || !clientTransactionId) {

      setEstado("error");

      setMensaje(
        "No fue posible obtener la información de la transacción."
      );

      return;

    }

    try {

      const resultado = await confirmPayment(
        Number(id),
        clientTransactionId
      );

      console.log("RESULTADO:", resultado);
    

      const statusCode =
        (resultado as any).statusCode ??
        (resultado as any).payphone?.statusCode;

      if ((resultado as any).success || statusCode === 3) {

        setEstado("success");

        setMensaje(
          "Tu suscripción Premium ya está activa."
        );

        setTimeout(() => {
          window.location.href = "/";
        }, 3000);

      } else if (statusCode === 2) {

        setEstado("cancel");

        setMensaje(
          (resultado as any).message ||
          "El pago fue cancelado."
        );

      } else {

        setEstado("error");

        setMensaje(
          (resultado as any).message ||
          "No fue posible verificar la transacción."
        );

      }

    } catch (e) {

      console.error(e);

      setEstado("error");

      setMensaje(
        "Ocurrió un error al verificar el pago."
      );

    }

  };

  confirmar();

}, []);

  return (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f4f7fb",
      fontFamily: "Arial",
      padding: 20,
    }}
  >
    <div
      style={{
        width: 460,
        maxWidth: "100%",
        background: "#fff",
        borderRadius: 20,
        padding: 50,
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
     <img
  src="/logo.png"
  alt="PerfusionLink"
  style={{
    width: 90,
    marginBottom: 20,
  }}
/>

<h1
  style={{
    color: "#0B5ED7",
    marginBottom: 10,
    fontSize: 32,
    fontWeight: "bold",
  }}
>
  PerfusionLink
</h1>

<p
  style={{
    color: "#666",
    marginBottom: 30,
  }}
>
  Plataforma inteligente para perfusión cardiovascular
</p>

      {estado === "loading" && (
        <>
          <h2
  style={{
    color: "#0B5ED7",
  }}
>
  ⏳ Verificando tu pago
</h2>

<p
  style={{
    color: "#666",
    lineHeight: 1.6,
  }}
>
  {mensaje}
</p>

<p
  style={{
    marginTop: 20,
    fontSize: 14,
    color: "#999",
  }}
>
  No cierres esta ventana.
</p>
        </>
      )}

      {estado === "success" && (
  <>
    <h2 style={{ color: "green" }}>
      ✅ Pago aprobado
    </h2>

    <p
      style={{
        lineHeight: 1.7,
        color: "#555",
      }}
    >
      {mensaje}
    </p>

    <div
      style={{
        marginTop: 25,
        background: "#F3FAF5",
        borderRadius: 12,
        padding: 18,
      }}
    >
      <strong>Plan:</strong> Premium Mensual
      <br />
      Acceso inmediato a todas las funciones.
    </div>

    <button
      onClick={() => {
        window.location.href = "/";
      }}
      style={{
        marginTop: 25,
        padding: "12px 24px",
        border: "none",
        borderRadius: 8,
        background: "#0B5ED7",
        color: "white",
        cursor: "pointer",
      }}
    >
      Ir a PerfusionLink
    </button>
  </>
)}

     {estado === "cancel" && (
  <>
    <h2 style={{ color: "#d9534f" }}>
      ❌ Pago cancelado
    </h2>

    <p
      style={{
        lineHeight: 1.7,
        color: "#555",
      }}
    >
      {mensaje}
    </p>

    <p
      style={{
        marginTop: 20,
        fontSize: 14,
        color: "#888",
      }}
    >
      Si el dinero fue debitado,
      comunícate con soporte antes de volver
      a intentar el pago.
    </p>

    <button
      onClick={() => {
        window.location.href = "/";
      }}
      style={{
        marginTop: 25,
        padding: "12px 24px",
        border: "none",
        borderRadius: 8,
        background: "#0B5ED7",
        color: "white",
        cursor: "pointer",
      }}
    >
      Volver
    </button>
  </>
)}

      {estado === "error" && (
        <>
          <h2 style={{ color: "#f0ad4e" }}>
            ⚠ Error
          </h2>

          <p>{mensaje}</p>

          <button
            onClick={() => {
              window.location.reload();
            }}
            style={{
              marginTop: 25,
              padding: "12px 24px",
              border: "none",
              borderRadius: 8,
              background: "#0B5ED7",
              color: "white",
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </>
      )}
    </div>
  </div>
);
}