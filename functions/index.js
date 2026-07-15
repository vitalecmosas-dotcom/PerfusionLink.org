const { onRequest } = require("firebase-functions/v2/https");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();
/* ================= PROMPTS ================= */

const CHAT_PROMPT = `
Eres un asistente clínico especializado en perfusión cardiovascular.

Actúas como un perfusionista cardiovascular senior.

Tus respuestas deben basarse en:

- PubMed
- AMSECT
- Journal of ExtraCorporeal Technology
- Perfusion Journal
- ELSO Guidelines
- Revisiones de expertos

REGLAS:

- Responde siempre en español
- Usa lenguaje médico profesional
- Explica fisiología
- No inventes estudios
- No inventes datos
- Usa razonamiento clínico
- No sustituyes criterio médico
`;

const ANALISIS_INTRA_CEC_PROMPT = `
Eres un perfusionista cardiovascular experto en circulación extracorpórea.

Analiza los registros intraoperatorios agregados.

Evalúa:

- tendencias
- perfusión guiada por objetivos
- DO2
- SvO2
- lactato
- balance hídrico
- equilibrio ácido base
- electrolitos
- temperatura actual
- temperatura 37°
- protección orgánica
- perfusión tisular

Debes responder:

1. Resumen clínico
2. Análisis hemodinámico
3. Análisis metabólico
4. Gasometría
5. Perfusión guiada por objetivos
6. Tendencias
7. Recomendaciones
8. Alertas

No inventes datos.
Responde en español.
`;

/* ================= FUNCTION ================= */

exports.geminiChat = onRequest(
  { secrets: ["GEMINI_API_KEY"] },
  async (req, res) => {

    cors(req, res, async () => {

      try {

        if (req.method === "OPTIONS") {
          return res.status(204).send("");
        }

        const { prompt, tipo } = req.body || {};

        if (!prompt) {
          return res
            .status(400)
            .json({ error: "Falta prompt" });
        }

        let systemPrompt = CHAT_PROMPT;

        if (tipo === "analisis_intra_cec") {
          systemPrompt = ANALISIS_INTRA_CEC_PROMPT;
        }

        const apiKey = process.env.GEMINI_API_KEY;

       const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
{
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: systemPrompt,
                    },
                    {
                      text: prompt,
                    },
                  ],
                },
              ],

              generationConfig: {
                temperature: 0.3,
                topK: 32,
                topP: 1,
                maxOutputTokens: 4096,
              },
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(data);

          return res.status(500).json({
  error: JSON.stringify(data),
});
        }

        const text =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Sin respuesta del modelo";

        return res.json({
          response: text,
        });

      } catch (error) {

        console.error(error);

        return res.status(500).json({
          error: error.message,
        });
      }

    });

  }
);
exports.testFirestore = onRequest(async (req, res) => {
  try {

    await db.collection("test").doc("conexion").set({
      mensaje: "Firestore funcionando correctamente",
      fecha: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      success: true,
      message: "Documento creado correctamente."
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
});
exports.createPaymentSession = onRequest(
  {
    secrets: ["PAYPHONE_TOKEN", "PAYPHONE_STORE_ID"],
  },
  async (req, res) => {
    cors(req, res, async () => {
      try {
        if (req.method === "OPTIONS") {
          return res.status(204).send("");
        }

        const { uid } = req.body || {};

        if (!uid) {
          return res.status(400).json({
            success: false,
            error: "UID requerido",
          });
        }

        const paymentRef = db.collection("payments").doc();

        await paymentRef.set({
          uid,
          amount: 10,
          currency: "USD",
          provider: "payphone",
          plan: "premium",
          status: "pending",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        const payphoneToken = process.env.PAYPHONE_TOKEN;
        const payphoneStoreId = process.env.PAYPHONE_STORE_ID;

        console.log("TOKEN:", payphoneToken.substring(0, 15) + "...");
        console.log("STORE:", payphoneStoreId);
        return res.json({
  success: true,
  token: payphoneToken,
  storeId: payphoneStoreId,
  clientTransactionId: paymentRef.id,
  amount: 1000,
  amountWithoutTax: 1000,
  amountWithTax: 0,
  tax: 0,
  service: 0,
  tip: 0,
  currency: "USD",
  reference: paymentRef.id,
  responseUrl: "https://perfusionlink.org/payment-result",
cancellationUrl: "https://perfusionlink.org",
});

      } catch (error) {
        console.error(error);

        return res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    });
  }
);
exports.confirmPayment = onRequest(
  {
    secrets: ["PAYPHONE_TOKEN"],
  },
  async (req, res) => {

    cors(req, res, async () => {

      try {

        if (req.method === "OPTIONS") {
          return res.status(204).send("");
        }

        const { id, clientTransactionId } = req.body;

        console.log("ID:", id);
        console.log("CLIENT:", clientTransactionId);

        const token = process.env.PAYPHONE_TOKEN;

        const response = await fetch(
          "https://paymentbox.payphonetodoesposible.com/api/confirm",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              id,
              clientTxId: clientTransactionId,
            }),
          }
        );

        const data = await response.json();

console.log(
  "RESPUESTA COMPLETA PAYPHONE:\n" +
  JSON.stringify(data, null, 2)
);
console.log("STATUS CODE:", data.statusCode);
console.log("TRANSACTION STATUS:", data.transactionStatus);
console.log("TRANSACTION ID:", data.transactionId);
// ¿El pago fue aprobado?
if (data.statusCode === 3) {

  const paymentDoc = await db
    .collection("payments")
    .doc(clientTransactionId)
    .get();

  if (!paymentDoc.exists) {

    console.log("No existe el documento de pago.");

    return res.status(404).json({
      success: false,
      error: "No existe la transacción."
    });

  }

const paymentData = paymentDoc.data();
// Evitar procesar el mismo pago dos veces
if (paymentData?.status === "approved") {

  console.log("Pago ya procesado anteriormente.");

  return res.json({
    success: true,
    message: "Pago ya confirmado anteriormente.",
    payphone: data,
  });

}
if (!paymentData?.uid) {
  return res.status(500).json({
    success: false,
    error: "La transacción no tiene UID asociado."
  });
}

const uid = paymentData.uid;

  console.log("UID:", uid);

  await db.runTransaction(async (transaction) => {

  const paymentRef = db
    .collection("payments")
    .doc(clientTransactionId);

  const userRef = db
    .collection("usuarios")
    .doc(uid);

  const paymentSnapshot =
    await transaction.get(paymentRef);

  const payment = paymentSnapshot.data();

  // Protección adicional por si dos confirmaciones llegan al mismo tiempo
  if (payment?.status === "approved") {

    console.log("La transacción ya estaba aprobada.");

    return;

  }

 // Fecha actual
const now = new Date();

// Fecha de vencimiento (+1 mes)
const expires = new Date(now);
expires.setMonth(expires.getMonth() + 1);

transaction.update(userRef, {

  subscription: "active",

  plan: "premium",

  subscriptionStartedAt:
    admin.firestore.Timestamp.fromDate(now),

  subscriptionExpiresAt:
    admin.firestore.Timestamp.fromDate(expires),

  renewal: "monthly",

  paymentProvider: "payphone",

  lastPaymentId: clientTransactionId,

  lastPaymentDate:
    admin.firestore.FieldValue.serverTimestamp(),

});

  transaction.update(paymentRef, {
    status: "approved",
    payphoneTransactionId: data.transactionId,
    authorizationCode: data.authorizationCode,
    approvedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

});

}

return res.json(data);

      } catch (error) {

        console.error(error);

        return res.status(500).json({
          success: false,
          error: error.message,
        });

      }

    });

  }
);