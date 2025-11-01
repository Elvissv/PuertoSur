// Espera a que todo el contenido del HTML esté cargado
document.addEventListener("DOMContentLoaded", function() {

    // --- 1. LÓGICA PARA LINKS DEL HEADER Y SCROLL SUAVE ---
    const navLinks = document.querySelectorAll(".nav-links a");
    const currentPagePath = window.location.pathname;
    const relativePath = currentPagePath.substring(currentPagePath.lastIndexOf('/') + 1) || "index.html";

    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            const href = link.getAttribute("href");
            
            // Lógica de Scroll Suave (solo para anclas en index.html)
            if (relativePath === "index.html" && href.includes("index.html#")) {
                event.preventDefault();
                const targetId = href.split("#").pop();
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        });
    });

    // --- 2. LÓGICA PARA MARCAR EL ENLACE ACTIVO ---
    
    // Caso A: Estamos en la página de INICIO (index.html)
    if (relativePath === "index.html") {
        const sections = document.querySelectorAll("section[id]");
        if (sections.length > 0) {
            const updateActiveLink = () => {
                let currentSectionId = "welcome";
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    if (window.scrollY >= (sectionTop - 150)) {
                        currentSectionId = section.getAttribute("id");
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove("active");
                    const linkHref = link.getAttribute("href");
                    const isHomeActive = (linkHref === "index.html" && currentSectionId === "welcome");
                    const isActiveSection = (linkHref === `index.html#${currentSectionId}`);
                    if (isHomeActive || isActiveSection) {
                        link.classList.add("active");
                    }
                });
            };
            updateActiveLink();
            window.addEventListener("scroll", updateActiveLink);
        }
    } 
    // Caso B: Estamos en CUALQUIER OTRA página
    else {
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").endsWith(relativePath)) {
                link.classList.add("active");
            }
        });
    }

    // Lógica para marcar "Todos los productos"
    if (relativePath === "productos.html") {
        const allProductsLink = document.querySelector('.all-products-link');
        if (allProductsLink) {
            allProductsLink.classList.add('active'); 
        }
    }

    // --- 3. LÓGICA DEL CARRUSEL DE BIENVENIDA (CORREGIDA) ---
    const welcomeCarousel = document.getElementById('welcome');
    
    // Solo ejecuta esta lógica si estamos en index.html
    if (currentPagePath.endsWith("index.html") || currentPagePath.endsWith("/")) {
        
        const slides = welcomeCarousel ? welcomeCarousel.querySelectorAll('.carousel-slide') : [];
        const prevButton = welcomeCarousel ? welcomeCarousel.querySelector('.carousel-btn.prev') : null;
        const nextButton = welcomeCarousel ? welcomeCarousel.querySelector('.carousel-btn.next') : null;

        // Solo si existe el carrusel y tiene más de 1 slide
        if (welcomeCarousel && slides.length > 1 && prevButton && nextButton) { 
            let currentIndex = 0;
            let slideInterval = null; 
            
            // Función para mostrar un slide (REPRODUCE/PAUSA videos)
            function showSlide(index) {
                slides.forEach((slide, i) => {
                    // Muestra/Oculta el slide
                    slide.classList.toggle('active', i === index);
                    
                    // Busca si hay un video DENTRO de este slide
                    const mediaElement = slide.querySelector('video');
                    
                    if (mediaElement) { // Si es un slide con video
                        if (i === index) {
                            // Si es el slide que se va a mostrar, lo reinicia y reproduce
                            mediaElement.currentTime = 0; 
                            mediaElement.play().catch(e => console.error("Error al reproducir video:", e));
                        } else {
                            // Si es un slide que se va a ocultar, lo pausa
                            mediaElement.pause(); 
                        }
                    }
                });
                currentIndex = index;
            }

            // Función para ir al siguiente slide
            function nextSlide() {
                let nextIndex = currentIndex + 1;
                if (nextIndex >= slides.length) {
                    nextIndex = 0; 
                }
                showSlide(nextIndex);
            }

            // Función para ir al slide anterior
            function prevSlide() {
                let prevIndex = currentIndex - 1;
                if (prevIndex < 0) {
                    prevIndex = slides.length - 1; 
                }
                showSlide(prevIndex);
            }
            
            // Función para INICIAR el autoPlay (5 segundos)
            function startAutoPlay() {
                stopAutoPlay(); // Limpia cualquier intervalo anterior
                slideInterval = setInterval(nextSlide, 5000); 
            }

            // Función para DETENER el autoPlay
            function stopAutoPlay() {
                clearInterval(slideInterval);
                slideInterval = null; 
            }

            // --- Configuración Inicial ---
            showSlide(currentIndex); // Muestra el primer slide (video)
            startAutoPlay();         // Inicia el autoplay

            // --- Event Listeners para los botones ---
            nextButton.addEventListener('click', () => {
                stopAutoPlay(); 
                nextSlide(); 
                startAutoPlay(); // Reinicia el autoplay
            });

            prevButton.addEventListener('click', () => {
                stopAutoPlay(); 
                prevSlide(); 
                startAutoPlay(); // Reinicia el autoplay
            });

            // Detener/Reiniciar autoplay al pasar el mouse
            welcomeCarousel.addEventListener('mouseenter', stopAutoPlay);
            welcomeCarousel.addEventListener('mouseleave', startAutoPlay); 
        }
    }

});