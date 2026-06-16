require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "*", methods: ["GET","POST"], allowedHeaders: ["Content-Type"] }));
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an ATA Carnet billing assistant for Film Logic, an international freight company specializing in film production logistics.

When given an email or shipment description, extract the details and return ONLY a valid JSON object — no markdown, no explanation, nothing else.

Return this exact JSON shape:
{
  "client": "",
  "production": "",
  "carnetNumber": "",
  "commodity": "",
  "pieces": "",
  "weightKg": "",
  "value": "",
  "dimPieces": [{ "l": "", "w": "", "h": "", "qty": "1" }],
  "origin": "",
  "destAirport": "",
  "deliveryMiles": "20",
  "direction": "import",
  "hasLiftGate": false,
  "hasOvertime": false,
  "hasSpecialMessenger": false,
  "hasAirlineRecovery": false,
  "includeCarnetIssuance": false,
  "hasExpediteCarnet": false,
  "notes": "",
  "weightSummary": {
    "actualKg": 0,
    "dimKg": 0,
    "chargeableKg": 0,
    "basis": "actual"
  }
}

origin options: europe, canada, mexico, asia, aus_nz, me, latam
destAirport options: lax, jfk, ewr, sfo, ord, atl, bos, mia, las, iad
direction options: import, import_outport, return
Return ONLY the JSON object.`;

app.post("/api/parse-email", async (req, res) => {
  const { emailBody } = req.body;
  if (!emailBody || !emailBody.trim()) {
    return res.status(400).json({ error: "emailBody is required" });
  }
  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: emailBody }],
    });
    const raw = message.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim()
      .replace(/```json|```/g, "")
      .trim();
    const parsed = JSON.parse(raw);
    return res.json({ success: true, data: parsed });
  } catch (err) {
    console.error("Parse error:", err.message);
    return res.status(500).json({ error: "Failed to parse email", detail: err.message });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Film Logic ATA Carnet Agent", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Film Logic ATA Carnet Agent running on port ${PORT}`);
});
