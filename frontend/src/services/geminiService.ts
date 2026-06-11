export async function enviarPromptAGemini(prompt: string) {
  const response = await fetch(
    "http://127.0.0.1:5001/gemini-backend-eliana-62ea3/us-central1/geminiChat",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    }
  );

  if (!response.ok) {
    throw new Error("Error al conectar con Gemini");
  }

  return response.json();
}
