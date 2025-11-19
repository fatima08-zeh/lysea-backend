const mysql = require("mysql2"); 
require("dotenv").config();

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "cosmetiquequebec",
    port: 3307,
});


db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Erreur de connexion à MySQL :", err);
        return;
    }
    console.log("✅ Connecté à la base de données MySQL !");
    connection.release(); 
});

module.exports = db;
