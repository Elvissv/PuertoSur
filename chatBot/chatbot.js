
document.addEventListener("DOMContentLoaded", () => {
  // Only insert chatbot HTML if it doesn't exist
  if (!document.getElementById("chatbot-container")) {
    fetch("../chatBot/chatbot.html")
      .then(response => response.text())
      .then(html => {
        document.body.insertAdjacentHTML("beforeend", html);
        initChatbot();
      });
  } else {
    initChatbot();
  }

  function initChatbot() {
    const openBtn = document.getElementById("open-chatbot");
    const closeBtn = document.getElementById("close-chatbot");
    const container = document.getElementById("chatbot-container");
    const inputArea = document.querySelector(".chatbot-input-area");
    const input = document.getElementById("chatbot-input");
    const sendBtn = document.getElementById("send-chatbot");
    const messages = document.getElementById("chatbot-messages");

    // --- Chat Configuration ---
    const chatFlow = {
      start: {
        message: "👋 ¡Hola! Soy el asistente virtual de <b>Puerto Sur</b>.<br>¿Cómo podemos ayudarte hoy?",
        options: [
          { label: "👕 Ver Productos", action: "link", url: "/productos" },
          { label: "📝 Solicitar Cotización", next: "quote_intro" }, // Goes to quote flow
          { label: "📞 Contactar un Ejecutivo", action: "whatsapp" }
        ]
      },
      quote_intro: {
        message: "📝 Para iniciar tu cotización, necesito algunos datos.<br>Primero, ¿Cuál es tu nombre completo?",
        input: true,
        field: "nombre",
        next: "quote_company"
      },
      quote_company: {
        message: "🏢 ¡Gracias! ¿Cuál es el nombre de tu empresa? (Si es particular, escribe 'Particular')",
        input: true,
        field: "empresa",
        next: "quote_product"
      },
      quote_product: {
        message: "👕 ¿Qué tipo de producto te interesa cotizar?",
        input: true, // simplified for now, could be options
        field: "producto",
        next: "quote_quantity"
      },
      quote_quantity: {
        message: "🔢 ¿Cuántas unidades aproximadas necesitas?",
        input: true,
        type: "number",
        field: "cantidad",
        next: "quote_service"
      },
      quote_service: {
        message: "🎨 ¿Deseas algún servicio adicional?",
        options: [
          { label: "Bordado", value: "Bordado", next: "quote_confirm" },
          { label: "Estampado", value: "Estampado", next: "quote_confirm" },
          { label: "Ninguno / Solo Producto", value: "Solo Producto", next: "quote_confirm" }
        ]
      },
      quote_confirm: {
        message: "⏳ Procesando tu solicitud...",
        action: "submit_quote"
      },
      quote_success: {
        message: "✅ ¡Tu cotización ha sido enviada con éxito!<br>Un ejecutivo te contactará pronto.",
        options: [
          { label: "🏠 Volver al Inicio", next: "start" }
        ]
      },
      quote_error: {
        message: "⚠️ Hubo un error al enviar tu cotización. Por favor, intenta contactarnos por WhatsApp.",
        options: [
          { label: "📞 Contactar por WhatsApp", action: "whatsapp" },
          { label: "🏠 Volver al Inicio", next: "start" }
        ]
      }
    };

    let currentState = null;
    let userData = {};

    // --- Functions ---

    function toggleChat(show) {
      container.style.display = show ? "flex" : "none";
      openBtn.style.display = show ? "none" : "block";
      if (show && messages.children.length === 0) {
        renderState("start");
      }
    }

    function addMessage(sender, text) {
      const msg = document.createElement("div");
      msg.classList.add("message", sender);
      msg.innerHTML = text;
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
    }

    function renderState(stateKey) {
      currentState = stateKey;
      const state = chatFlow[stateKey];

      if (!state) return;

      // Display Bot Message
      addMessage("bot", state.message);

      // Handle Input Area Visibility
      if (state.input) {
        inputArea.classList.remove("hidden");
        input.value = "";
        input.focus();
        input.placeholder = state.placeholder || "Escribe aquí...";
        input.type = state.type || "text";
      } else {
        inputArea.classList.add("hidden");
      }

      // Handle Options (Buttons)
      if (state.options) {
        const optionsContainer = document.createElement("div");
        optionsContainer.classList.add("chat-options");

        state.options.forEach(opt => {
          const btn = document.createElement("button");
          btn.classList.add("chat-option-btn");
          btn.textContent = opt.label;
          btn.onclick = () => handleOptionClick(opt);
          optionsContainer.appendChild(btn);
        });

        messages.appendChild(optionsContainer);
        messages.scrollTop = messages.scrollHeight;
      }

      // Handle Special Actions (e.g., submit quote)
      if (state.action === "submit_quote") {
        submitQuote();
      }
    }

    function handleOptionClick(opt) {
      // Add user selection as a message for context (optional, makes it look like a chat)
      addMessage("user", opt.label);

      if (opt.action === "link") {
        window.open(opt.url, "_blank");
        // Optional: return to start or stay?
        setTimeout(() => renderState("start"), 1000);
      } else if (opt.action === "whatsapp") {
        const phone = "56978480067";
        const text = "Hola Puerto Sur, quisiera hacer una consulta.";
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
        setTimeout(() => renderState("start"), 1000);
      } else if (opt.next) {
        if (opt.value && currentState === "quote_service") {
          userData.servicio = opt.value;
        }
        renderState(opt.next);
      }
    }

    function handleInputSubmit() {
      const text = input.value.trim();
      if (!text) return;

      addMessage("user", text);
      input.value = "";

      const state = chatFlow[currentState];

      // Save data if field is defined
      if (state.field) {
        userData[state.field] = text;
      }

      if (state.next) {
        renderState(state.next);
      }
    }

    function submitQuote() {
      // Simulate API call
      console.log("Submitting Quote Data:", userData);

      fetch("http://localhost:5000/send-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            renderState("quote_success");
          } else {
            renderState("quote_error");
          }
        })
        .catch(err => {
          console.error("Error sending quote:", err);
          // For demo/fallback purposes if server is down:
          // renderState("quote_error"); 
          // OR assume success if you want to test UI without backend
          renderState("quote_error"); // Keeping it real for now
        });

      // Clear data after submission logic (or in start)
      userData = {};
    }

    // --- Event Listeners ---
    openBtn.addEventListener("click", () => toggleChat(true));
    closeBtn.addEventListener("click", () => toggleChat(false));
    sendBtn.addEventListener("click", handleInputSubmit);
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleInputSubmit();
    });
  }
});
