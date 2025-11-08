import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import nodemailer from "nodemailer";
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔹 Configurar transporte de correo (para enviar las cotizaciones)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔹 Endpoint del chatbot (respuestas IA)
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Eres el asistente virtual de Puerto Sur, una empresa chilena B2B que vende ropa de seguridad y ofrece bordado y estampado. Responde con amabilidad y profesionalismo.",
        },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("❌ Error en el chatbot:", error);
    res.status(500).json({
      reply: "⚠️ Error del servidor. Intenta nuevamente más tarde.",
    });
  }
});

// 🔹 Endpoint para guardar y enviar cotizaciones por correo
app.post("/send-quote", async (req, res) => {
  const quote = req.body;
  const filePath = "./cotizaciones.json"; // ✅ Corregido (ya no crea /server/server)

  // Leer archivo existente o crear uno nuevo
  let data = [];
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  // Agregar nueva cotización con fecha
  data.push({ ...quote, fecha: new Date().toLocaleString("es-CL") });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

  // Crear contenido del correo
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Se envía a la empresa
    subject: "📩 Nueva Cotización - Puerto Sur",
    text: `
Se ha recibido una nueva solicitud de cotización:

👤 Nombre: ${quote.nombre}
🏢 Empresa: ${quote.empresa}
👕 Producto: ${quote.producto}
🔢 Cantidad: ${quote.cantidad}
🎨 Servicio: ${quote.servicio}

📅 Fecha: ${new Date().toLocaleString("es-CL")}

Por favor, revisa esta solicitud y contacta al cliente a la brevedad.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Cotización enviada por correo:", quote);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error al enviar correo:", err);
    res.status(500).json({ success: false });
  }
});

// 🔹 Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Servidor del chatbot activo en puerto ${PORT}`)
);


