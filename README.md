# Puerto Sur - Plataforma Web Integral

**Puerto Sur** es una solución digital moderna desarrollada para la empresa *Comercial Puerto Sur*, especializada en confeccion de ropa de seguridad, bordado y estampado.

Este proyecto transforma una presencia web estática y procesos manuales en una **aplicación web dinámica, interactiva y escalable**, diseñada para mejorar la experiencia del cliente B2B y optimizar la gestión interna.

## Características Principales

### Experiencia de Usuario (Frontend)
* **Arquitectura Dinámica (EJS):** Utiliza un motor de plantillas para renderizar vistas modulares, eliminando la redundancia de código y facilitando el mantenimiento.
* **Diseño "Mobile First":** Interfaz totalmente responsiva con menú de hamburguesa personalizado y grillas adaptables a cualquier dispositivo.
* **Navegación Avanzada:** Implementación de "Migas de Pan" (Breadcrumbs) y una barra lateral de categorías para una navegación fluida.
* **Interactividad Visual:** Tarjetas de productos con efectos 3D interactivos (utilizando **Atropos.js**) y carruseles infinitos de trabajos recientes.
* **Solicitud de Cotización:** Integración directa con WhatsApp para agilizar el proceso de ventas.

### Funcionalidad Inteligente (Backend & Servicios)
* **Servidor Node.js & Express:** Manejo robusto de rutas y renderizado de vistas del lado del servidor.
* **Chatbot con IA:** Asistente virtual potenciado por la API de **OpenAI**, capaz de responder preguntas frecuentes y guiar al usuario 24/7.
* **Gestión de Cotizaciones:** Sistema de envío de correos automatizado mediante **Nodemailer** para recibir solicitudes formales.
* **Gestión de Stock (Módulo Administrativo):** Integración de lógica para el control de inventario (Ingresos/Egresos).

---

## 🛠️ Tecnologías Utilizadas

### Frontend
* **HTML5 & CSS3:** Estilos personalizados y modernos (sin dependencia excesiva de frameworks pesados).
* **JavaScript (ES6+):** Lógica del lado del cliente para interactividad.
* **Librerías:** * `Atropos.js` (Efectos 3D)
    * `FontAwesome` (Iconografía)

### Backend
* **Node.js:** Entorno de ejecución.
* **Express:** Framework para el servidor web.
* **EJS:** Motor de plantillas (Embedded JavaScript).
* **Nodemailer:** Envío de correos electrónicos.
* **OpenAI API:** Inteligencia Artificial para el Chatbot.

---

## 📂 Estructura del Proyecto

El proyecto sigue una arquitectura MVC (Modelo-Vista-Controlador) simplificada:

```text
PuertoSur/
├── server/
│   ├── server.js          # Punto de entrada del servidor y API
│   └── views/             # Plantillas EJS (Vistas)
│       ├── index.ejs      # Página de Inicio
│       ├── partials/      # Componentes reutilizables (Header, Footer)
│       └── navegador_nav/ # Páginas de contenido y productos
├── styles/                # Hojas de estilo CSS globales y específicas
├── javaScripts/           # Lógica del cliente (Menús, Carruseles, etc.)
└── imgs/                  # Recursos gráficos optimizados