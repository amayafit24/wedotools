// IA de las herramientas de tuedadreal. Cerebro: Groq (27/09/2026; antes Anthropic).
// Candado (27/09/2026): solo responde a peticiones que vienen de la propia web,
// con preguntas de tamaño normal y con las instrucciones fijas de aquí abajo.
// Las herramientas siguen funcionando igual: mandan { prompt } y reciben la
// respuesta de Anthropic tal cual.

const WEB = "https://tuedadreal.netlify.app";
const MAX_PROMPT = 2500;
const SISTEMA = "Eres una asistente de salud y bienestar de WeDo Transformations. Responde siempre en español, de forma cálida, motivadora y directa.";

// También vale para las vistas previas de Netlify (xxx--tuedadreal.netlify.app)
const esDeLaWeb = (url) => /^https:\/\/([a-z0-9-]+--)?tuedadreal\.netlify\.app(\/|$)/i.test(url || "");

const respuesta = (status, body) => ({
  statusCode: status,
  headers: { "Access-Control-Allow-Origin": WEB, "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": WEB,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }
  if (event.httpMethod !== "POST") return respuesta(405, { error: "Solo POST" });

  const h = event.headers || {};
  const origen = h.origin || h.Origin || h.referer || h.Referer || "";
  if (!esDeLaWeb(origen)) {
    console.warn(`[claude] Petición bloqueada desde fuera: "${String(origen).slice(0, 80)}"`);
    return respuesta(403, { error: "No permitido" });
  }

  let prompt = "";
  try { prompt = String(JSON.parse(event.body || "{}").prompt || ""); } catch {}
  if (!prompt || prompt.length > MAX_PROMPT) {
    console.warn(`[claude] Pregunta rechazada (longitud ${prompt.length})`);
    return respuesta(400, { error: "Pregunta no válida" });
  }

  try {
    // Cerebro: Groq (gratis) desde el 27/09/2026. Devuelve la misma forma que esperaban las herramientas.
    for (const modelo of ["openai/gpt-oss-120b", "openai/gpt-oss-20b"]) {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + process.env.GROQ_API_KEY },
        body: JSON.stringify({ model: modelo, reasoning_effort: "low", max_tokens: 1200,
          messages: [{ role: "system", content: SISTEMA }, { role: "user", content: prompt }] }),
      });
      const d = await r.json().catch(() => ({}));
      const texto = d?.choices?.[0]?.message?.content?.trim();
      if (r.ok && texto) return respuesta(200, { content: [{ type: "text", text: texto }], model: modelo });
      console.error(`[claude] ${modelo} respondió ${r.status}`);
    }
    console.error("[claude] NINGÚN modelo de Groq respondió");
    return respuesta(502, { error: "IA no disponible" });
  } catch (error) {
    console.error(`[claude] Fallo llamando a Groq: ${error.message}`);
    return respuesta(500, { error: "Error interno del servidor" });
  }
};
