const mysql = require("mysql2"); 
require("dotenv").config();
// ⚠️ Les identifiants réels sont stockés dans un fichier .env (non public)

host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASS,
database: process.env.DB_NAME,
port: process.env.DB_PORT,


db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Erreur de connexion à MySQL :", err);
        return;
    }
    console.log("✅ Connecté à la base de données MySQL !");
    connection.release(); 
});

module.exports = db;
