// Importar dependencias
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// Configurar app
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Ruta para enviar formulario
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  if (!name || !email || !service || !message) {
    return res.status(400).json({ message: "Faltan campos obligatorios." });
  }

  // Configurar conexión SMTP (Titan Mail / Hostinger)
 const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465, // usa SSL
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // soporte@weblycr.com
    pass: process.env.EMAIL_PASS, // tu contraseña real
  },
  tls: {
    rejectUnauthorized: false,
  },
});


  const mailOptions = {
    from: `"Formulario Webly" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `Nuevo mensaje desde Webly - ${service}`,
    html: `
      <h2>Nuevo mensaje desde el formulario de contacto</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Correo:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${phone || "No indicado"}</p>
      <p><strong>Servicio:</strong> ${service}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Correo enviado correctamente");
    res.status(200).json({ message: "Correo enviado correctamente." });
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
    res.status(500).json({ message: "Error al enviar el correo." });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
