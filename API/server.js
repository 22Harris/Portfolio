import express from "express";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, "../", "FRONT")));

// Route pour envoyer l'e-mail
app.post("/envoyer-email", async (req, res) => {
  console.log("Données reçues :", req.body);
  try {
    const { name, email, subject, message } = req.body;

    // Validation des champs
    if (!name || !email || !subject || !message) {
      return res.status(400).send({ message: "Tous les champs sont requis." });
    }

    const mailOptions = {
      from: email,
      to: "harrismartial02@gmail.com",
      subject: subject,
      text: `Email: ${email}\nMessage: ${message}`,
    };

    const info = await transporter.sendMail(mailOptions);
    res.send({ message: "E-mail envoyé avec succès", info });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail :", error);
    res.status(500).send({
      message: "Erreur lors de l'envoi de l'e-mail",
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../", "FRONT", "index.html"));
});

const PORT = process.env.PORT;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Serveur démarré sur http://127.0.0.1:${PORT}`);
});
