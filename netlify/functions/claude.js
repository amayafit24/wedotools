// IA de las herramientas de tuedadreal (Anthropic, cuenta de Amaya).
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
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 800,
        system: SISTEMA,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await r.json();
    if (!r.ok) console.error(`[claude] Anthropic respondió ${r.status}: ${JSON.stringify(data).slice(0, 200)}`);
    return respuesta(200, data);
  } catch (error) {
    console.error(`[claude] Fallo llamando a Anthropic: ${error.message}`);
    return respuesta(500, { error: "Error interno del servidor" });
  }
};
