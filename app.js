// app.js
import dotenv from 'dotenv';
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import clientsRoutes from "./routes/clients.js";
import fournisseursRoutes from "./routes/fournisseurs.js";
import produitsRoutes from "./routes/produits.js";
import dashboardRoutes from "./routes/dashboard.js";
import authRoutes from './routes/auth.js';
import authMiddleware from './middleware/auth.js';

const app = express();

// Enable trust proxy
app.set('trust proxy', 1);

// CORS middleware
app.use(cors({
  origin: 'https://auth-iota-olive.vercel.app',
  credentials: true
}));


// Pour __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Vue EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use('/auth', authRoutes);

// Route racine - Redirection vers le dashboard
app.get("/", (req, res) => {
  res.redirect("/dashboard"); // ← Redirection simple
});

// Protected Routes
app.use("/dashboard", authMiddleware, dashboardRoutes);
app.use("/clients", authMiddleware, clientsRoutes);
app.use("/fournisseurs", authMiddleware, fournisseursRoutes);
app.use("/produits", authMiddleware, produitsRoutes);

// Route 404 simple
app.use((req, res) => {
  res.status(404).send(`
    <html>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h1 style="color: #e74c3c;">Page non trouvée</h1>
        <p>La page que vous recherchez n'existe pas.</p>
        <a href="/" style="color: #3498db;">Retour à l'accueil</a>
      </body>
    </html>
  `);
});

// Gestion d'erreurs simple
app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  res.status(500).send(`
    <html>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h1 style="color: #e74c3c;">Erreur serveur</h1>
        <p>Une erreur s'est produite. Veuillez réessayer plus tard.</p>
        <a href="/" style="color: #3498db;">Retour à l'accueil</a>
      </body>
    </html>
  `);
});



// Serveur
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé`);
});