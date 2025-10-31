// Espera a que todo el contenido del HTML esté cargado
document.addEventListener("DOMContentLoaded", function() {

    // --- 1. LÓGICA PARA LINKS DEL HEADER Y SCROLL SUAVE ---
    const navLinks = document.querySelectorAll(".nav-links a");
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            const href = link.getAttribute("href");
            const [targetPage, targetAnchor] = href.split("#");

            if (targetPage === currentPage && targetAnchor) {
                event.preventDefault();
                const targetSection = document.getElementById(targetAnchor);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        });
    });

    // --- 2. LÓGICA PARA MARCAR EL ENLACE ACTIVO ---
    if (currentPage === "index.html") {
        const sections = document.querySelectorAll("section[id]");
        if (sections.length > 0) {
            const updateActiveLink = () => {
                let currentSectionId = "welcome"; 
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    // Se activa 150px antes de llegar a la sección
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
    } else {
        const activeLink = document.querySelector(`.nav-links a[href="${currentPage}"]`);
        if (activeLink) {
            activeLink.classList.add("active");
        }
        if (currentPage === "productos.html") {
            const allProductsLink = document.querySelector('.all-products-link');
            if(allProductsLink) {
                allProductsLink.classList.add('active'); 
            }
        }
    }

    // --- 3. LÓGICA PARA EL CARRUSEL EN LA SECCIÓN DE BIENVENIDA ---
    const welcomeCarousel = document.getElementById('welcome'); // Ahora el carrusel está en #welcome
    const slides = welcomeCarousel ? welcomeCarousel.querySelectorAll('.carousel-slide') : [];
    const prevButton = welcomeCarousel ? welcomeCarousel.querySelector('.carousel-btn.prev') : null;
    const nextButton = welcomeCarousel ? welcomeCarousel.querySelector('.carousel-btn.next') : null;

    if (currentPage === "index.html" && welcomeCarousel && slides.length > 1 && prevButton && nextButton) { // Asegúrate de que haya más de 1 slide
        let currentIndex = 0;
        let slideInterval = null; 
        
        // Función para mostrar un slide
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
                // Si el slide es un video, lo reinicia cuando se vuelve activo
                const mediaElement = slide.querySelector('video, img');
                if (mediaElement && mediaElement.tagName === 'VIDEO') {
                    if (i === index) {
                        mediaElement.currentTime = 0; // Reinicia el video
                        mediaElement.play().catch(e => console.error("Error al reproducir video:", e)); // Intenta reproducir (maneja posibles errores de autoplay)
                    } else {
                        mediaElement.pause(); // Pausa videos inactivos
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
        
        // Función para INICIAR el autoPlay
        function startAutoPlay() {
            stopAutoPlay(); // Asegura que no haya intervalos duplicados
            slideInterval = setInterval(nextSlide, 5000); 
        }

        // Función para DETENER el autoPlay
        function stopAutoPlay() {
            clearInterval(slideInterval);
            slideInterval = null; 
        }

        // --- Configuración Inicial ---
        showSlide(currentIndex); // Muestra la primera imagen/video
        startAutoPlay();         // Inicia el autoplay

        // --- Event Listeners ---
        nextButton.addEventListener('click', () => {
            stopAutoPlay(); 
            nextSlide(); 
            startAutoPlay(); // Reinicia el autoplay después de un clic manual
        });

        prevButton.addEventListener('click', () => {
            stopAutoPlay(); 
            prevSlide(); 
            startAutoPlay(); // Reinicia el autoplay después de un clic manual
        });

        // Detener/Reiniciar autoplay al pasar el mouse
        welcomeCarousel.addEventListener('mouseenter', stopAutoPlay);
        welcomeCarousel.addEventListener('mouseleave', startAutoPlay); 
    }

}); 