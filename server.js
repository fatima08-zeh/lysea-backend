require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./config/db");
const bcrypt = require("bcryptjs");

// ⚠️ Ne JAMAIS logger les secrets en production
// console.log("PAYPAL_CLIENT_ID:", process.env.PAYPAL_CLIENT_ID);

const app = express();
app.use(express.json());

// ---- CORS propre (dev + prod) ----
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  process.env.CORS_ORIGIN,          // ex: https://lysea.vercel.app
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Autorise les outils (Postman) sans origin + toutes origins listées
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","X-Requested-With","Accept"],
  credentials: true,
}));

// Preflight OPTIONS géré par cors automatiquement, inutile de dupliquer:
// app.options("*", cors());

// ---- Healthcheck ----
app.get("/api/health", (req,res)=>res.json({ ok:true, env:process.env.NODE_ENV||"dev" }));

// ---- Static ----
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// ---- Routes ----
const addressRoutes    = require("./routes/address");
const usersRoutes      = require("./routes/users");
const productsRoutes   = require("./routes/products");
const ordersRoutes     = require("./routes/orders");
const checkoutRoutes   = require("./routes/checkout");
const cartRoutes       = require("./routes/cartRoutes");
const chatRoutes       = require("./routes/chat");
const favoritesRoutes  = require("./routes/favorites");
const newsletterRoutes = require("./routes/newsletter");

app.use("/api/addresses",  addressRoutes);
app.use("/api/users",      usersRoutes);
app.use("/api/products",   productsRoutes);
app.use("/api/orders",     ordersRoutes);
app.use("/api/checkout",   checkoutRoutes);
app.use("/api/cart",       cartRoutes);
app.use("/api/chat",       chatRoutes);
app.use("/api/favorites",  favoritesRoutes);
app.use("/api/newsletter", newsletterRoutes);

// ---- DB ping ----
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Erreur MySQL :", err);
  } else {
    if (connection) connection.release();
    console.log("✅ Connecté à MySQL");
  }
});

// ---- Admin par défaut ----
async function createDefaultAdmin() {
  try {
    const [rows] = await db.promise().query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
    if (!rows.length) {
      const hash = await bcrypt.hash("2002", 10);
      await db.promise().query(
        `INSERT INTO users (nom, email, telephone, mot_de_passe, role, is_connected, is_blocked)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ["fatima","fatima@example.com","4388603575",hash,"admin",0,0]
      );
      console.log("✅ Admin par défaut créé");
    } else {
      console.log("ℹ️ Admin déjà existant");
    }
  } catch (e) {
    console.error("❌ Création admin KO:", e.message);
  }
}
createDefaultAdmin();

// ---- (Option) Ping OpenAI si clé présente ----
if (process.env.OPENAI_API_KEY) {
  const OpenAI = require("openai");
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
      console.error("🔴 OpenAI KO:", e?.response?.data || e.message);
      res.status(500).json({ ok: false, where: "openai", error: e.message });
    }
  });
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
