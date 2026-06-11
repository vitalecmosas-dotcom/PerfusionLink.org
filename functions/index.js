const { onRequest } = require("firebase-functions/v2/https");
const cors = require("cors")({ origin: true });

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