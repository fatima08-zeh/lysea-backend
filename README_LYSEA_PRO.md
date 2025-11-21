🖥️ README Backend – Lysea

📌 Description générale
Le backend de la boutique Lysea est développé avec Node.js et Express. Il expose une API REST complète et sécurisée permettant de gérer les utilisateurs, les produits, les commandes, le panier, les favoris, le paiement PayPal ainsi qu’un chatbot intelligent basé sur l’API OpenAI. L’ensemble des données est stocké dans une base MySQL, assurant performance et fiabilité.

📂 Structure du projet
lysea-backend/
config/
db.js – Connexion MySQL sécurisée via variables d’environnement
models/ – Modèles SQL (User, Product, Order, etc.)
routes/ – Routes API (produits, panier, favoris, commandes, checkout...)
public/uploads/ – Images uploadées (produits)
server.js – Point d’entrée serveur Express
.gitignore – Ignore .env, node_modules, dossiers de build
package.json
README_BACKEND.md

🔐 Configuration du fichier .env
Créer un fichier .env à la racine du backend contenant au minimum :
PORT=5001
CORS_ORIGIN=http://localhost:3000

DB_HOST=xxxx
DB_USER=xxxx
DB_PASS=xxxx
DB_NAME=xxxx
DB_PORT=3306
PAYPAL_CLIENT_ID=xxxx
PAYPAL_SECRET=xxxx
PAYPAL_ENV=sandbox
OPENAI_API_KEY=xxxx

⚙️ Installation locale

Se placer dans le dossier backend :
cd lysea-backend

Installer les dépendances :
npm install

Lancer le serveur :
node server.js
Le serveur écoute par défaut sur http://localhost:5001
.

🚀 Déploiement sur Render
Sur Render, configurer les variables d’environnement suivantes :
DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT
PAYPAL_CLIENT_ID, PAYPAL_SECRET, PAYPAL_ENV
OPENAI_API_KEY
CORS_ORIGIN=https://lysea-frontend.vercel.app

Le service doit être déployé en mode Web Service Node.js.

👩‍💻 Auteur
Fatima Ez-Zehmad
Développeuse Web & Mobile & IA
