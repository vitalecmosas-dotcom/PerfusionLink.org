const API_URL =
  "https://us-central1-gemini-backend-eliana-62ea3.cloudfunctions.net/createPaymentSession";

const CONFIRM_URL =
  "https://us-central1-gemini-backend-eliana-62ea3.cloudfunctions.net/confirmPayment";

export async function createPaymentSession(uid: string) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uid,
    }),
  });

  if (!response.ok) {
    throw new Error("No fue posible crear la sesión de pago.");
  }

  const data = await response.json();

  console.log("DATOS PAYPHONE:", data);

  return data;
}

export async function confirmPayment(
  id: number,
  clientTransactionId: string
) {
  const response = await fetch(CONFIRM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      clientTransactionId,
    }),
  });

  if (!response.ok) {
    throw new Error("No fue posible confirmar el pago.");
  }

  return await response.json();
}
