require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./config/db");
const OpenAI = require("openai");

// ----------------------
// Initialisation Express
// ----------------------
const app = express();
app.use(express.json());

// ----------------------
// CORS
// ----------------------
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true,
}));

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

// ----------------------
// Test CORS
// ----------------------
app.get("/test-cors", (req, res) => {
  res.json({ message: "CORS fonctionne !" });
});

// ----------------------
// Vérification PayPal
// ----------------------
if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET) {
  console.error("❌ Clés PayPal manquantes !");
} else {
  console.log("📌 Clés PayPal chargées");
}

// ----------------------
// Importation des routes
// ----------------------
app.use("/api/newsletter", require("./routes/newsletter"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/checkout", require("./routes/checkout"));
app.use("/api/addresses", require("./routes/address"));
app.use("/api/favorites", require("./routes/favorites"));
app.use("/api/users", require("./routes/users"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/products", require("./routes/products"));
app.use("/api/cart", require("./routes/cartRoutes"));

// Fichiers upload
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Test du serveur
app.get("/api/health", (req, res) =>
  res.json({ ok: true, env: process.env.NODE_ENV || "dev" })
);

// ----------------------
// Connexion MySQL
// ----------------------
db.getConnection((err, connection) => {
  if (err) return console.error("❌ Erreur de connexion MySQL :", err);
  console.log("✅ Connecté à MySQL");
  if (connection) connection.release();
});

// ----------------------
// OpenAI test
// ----------------------
app.post("/api/chat/ping-openai", async (req, res) => {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const r = await openai.responses.create({
      model: "gpt-4o-mini",
      input: "Dis juste: OK LYSÉA",
      max_output_tokens: 10,
    });
    res.json({ ok: true, text: r.output_text?.trim() });
  } catch (e) {
    console.error("🔴 OpenAI KO:", e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ----------------------
// Lancement serveur
// ----------------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
