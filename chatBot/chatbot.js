document.addEventListener("DOMContentLoaded", () => {
  // Solo insertar el HTML del chatbot si no existe
  if (!document.getElementById("chatbot-container")) {
    fetch("../chatBot/chatbot.html")
      .then(response => response.text())
      .then(html => {
        document.body.insertAdjacentHTML("beforeend", html);

        const openBtn = document.getElementById("open-chatbot");
        const closeBtn = document.getElementById("close-chatbot");
        const container = document.getElementById("chatbot-container");
        const input = document.getElementById("chatbot-input");
        const sendBtn = document.getElementById("send-chatbot");
        const messages = document.getElementById("chatbot-messages");

        let step = 0;
        let userData = { nombre: "", empresa: "", producto: "", cantidad: "", servicio: "" };

        function addMessage(sender, text) {
          const msg = document.createElement("div");
          msg.classList.add("message", sender);
          msg.innerHTML = text;
          messages.appendChild(msg);
          messages.scrollTop = messages.scrollHeight;
        }

        function resetChat() {
          messages.innerHTML = "";
          step = 0;
        }

        openBtn.addEventListener("click", () => {
          container.style.display = "flex";
          openBtn.style.display = "none";
          resetChat();
          addMessage(
            "bot",
            "👋 ¡Hola! Soy el asistente virtual de <b>Puerto Sur</b>.<br>¿Qué deseas hacer hoy?<br>1️⃣ Ver productos<br>2️⃣ Solicitar cotización<br>3️⃣ Contactar con un ejecutivo"
          );
        });

        closeBtn.addEventListener("click", () => {
          container.style.display = "none";
          openBtn.style.display = "block";
        });

        sendBtn.addEventListener("click", handleUserInput);
        input.addEventListener("keypress", (e) => {
          if (e.key === "Enter") handleUserInput();
        });

        function handleUserInput() {
          const text = input.value.trim();
          if (!text) return;
          addMessage("user", text);
          input.value = "";

          // Volver al menú principal
          if ((step >= 10 && step <= 15) && text === "0") {
            step = 0;
            addMessage(
              "bot",
              "🔙 Has vuelto al menú principal.<br>1️⃣ Ver productos<br>2️⃣ Solicitar cotización<br>3️⃣ Contactar con un ejecutivo"
            );
            return;
          }

          if (step === 0) {
            if (text === "1") {
              addMessage(
                "bot",
                `👕 Puedes ver todos nuestros productos aquí: 
                <a href="../navegador_nav/productos.html" target="_blank" style="color:#007bbd; font-weight:bold;">Ver productos</a><br>0️⃣ Volver`
              );
              step = 10;
            } else if (text === "2") {
              addMessage("bot", "📝 Perfecto. Por favor, ingresa tu nombre completo:<br>0️⃣ Volver");
              step = 2;
            } else if (text === "3") {
              const whatsappNumber = "56978480067";
              const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hola%20Puerto%20Sur,%20me%20gustaría%20hablar con un ejecutivo.`;
              addMessage(
                "bot",
                `📞 Puedes contactarte directamente con un ejecutivo en WhatsApp:<br>
                👉 <a href="${whatsappLink}" target="_blank" style="color:#007bbd; font-weight:bold;">Abrir chat en WhatsApp</a><br>0️⃣ Volver`
              );
              step = 11;
            } else {
              addMessage(
                "bot",
                "❓ Opción no válida. Elige:<br>1️⃣ Ver productos<br>2️⃣ Solicitar cotización<br>3️⃣ Contactar con un ejecutivo"
              );
            }
          }
          // Flujo de cotización
          else if (step === 2) {
            if (text === "0") {
              step = 0;
              addMessage(
                "bot",
                "🔙 Has vuelto al menú principal.<br>1️⃣ Ver productos<br>2️⃣ Solicitar cotización<br>3️⃣ Contactar con un ejecutivo"
              );
              return;
            }
            userData.nombre = text;
            addMessage("bot", "🏢 ¿Cuál es el nombre de tu empresa? (0️⃣ Volver)");
            step = 3;
          } else if (step === 3) {
            if (text === "0") {
              step = 0;
              addMessage(
                "bot",
                "🔙 Has vuelto al menú principal.<br>1️⃣ Ver productos<br>2️⃣ Solicitar cotización<br>3️⃣ Contactar con un ejecutivo"
              );
              return;
            }
            userData.empresa = text;
            addMessage("bot", "👕 ¿Qué producto te interesa? (0️⃣ Volver)");
            step = 4;
          } else if (step === 4) {
            if (text === "0") {
              step = 0;
              addMessage(
                "bot",
                "🔙 Has vuelto al menú principal.<br>1️⃣ Ver productos<br>2️⃣ Solicitar cotización<br>3️⃣ Contactar con un ejecutivo"
              );
              return;
            }
            userData.producto = text;
            addMessage("bot", "🔢 ¿Cuántas unidades necesitas? (0️⃣ Volver)");
            step = 5;
          } else if (step === 5) {
            if (text === "0") {
              step = 0;
              addMessage(
                "bot",
                "🔙 Has vuelto al menú principal.<br>1️⃣ Ver productos<br>2️⃣ Solicitar cotización<br>3️⃣ Contactar con un ejecutivo"
              );
              return;
            }
            userData.cantidad = text;
            addMessage("bot", "🎨 ¿Qué servicio deseas?<br>1️⃣ Bordado<br>2️⃣ Estampado<br>0️⃣ Volver");
            step = 6;
          } else if (step === 6) {
            if (text === "0") {
              step = 0;
              addMessage(
                "bot",
                "🔙 Has vuelto al menú principal.<br>1️⃣ Ver productos<br>2️⃣ Solicitar cotización<br>3️⃣ Contactar con un ejecutivo"
              );
              return;
            }
            if (text === "1") userData.servicio = "Bordado";
            else if (text === "2") userData.servicio = "Estampado";
            else {
              addMessage("bot", "❗ Opción no válida. Elige 1️⃣ Bordado, 2️⃣ Estampado o 0️⃣ Volver");
              return;
            }

            addMessage("bot", "📨 Enviando tu cotización, por favor espera...");

            fetch("http://localhost:5000/send-quote", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(userData),
            })
              .then(res => res.json())
              .then(data => {
                if (data.success) {
                  addMessage(
                    "bot",
                    `✅ ¡Gracias <b>${userData.nombre}</b>! Tu cotización fue enviada correctamente.<br><br>
                    <b>Resumen:</b><br>👤 ${userData.nombre}<br>🏢 ${userData.empresa}<br>👕 ${userData.producto}<br>🔢 ${userData.cantidad}<br>🎨 ${userData.servicio}<br>0️⃣ Volver`
                  );
                } else {
                  addMessage("bot", "⚠️ No se pudo enviar la cotización. Intenta más tarde.<br>0️⃣ Volver");
                }
              })
              .catch(err => {
                console.error(err);
                addMessage("bot", "⚠️ Error al conectar con el servidor.<br>0️⃣ Volver");
              });

            step = 0;
            userData = { nombre: "", empresa: "", producto: "", cantidad: "", servicio: "" };
          }
          // Opción de volver desde productos o contacto
          else if (step === 10 || step === 11) {
            if (text === "0") {
              step = 0;
              addMessage(
                "bot",
                "🔙 Has vuelto al menú principal.<br>1️⃣ Ver productos<br>2️⃣ Solicitar cotización<br>3️⃣ Contactar con un ejecutivo"
              );
            } else {
              addMessage("bot", "❓ Opción no válida. Presiona 0️⃣ para volver al menú principal.");
            }
          }
        }
      });
  }
});





