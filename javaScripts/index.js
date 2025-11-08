// Espera a que todo el contenido del HTML esté cargado
document.addEventListener("DOMContentLoaded", function() {

    // --- DEFINICIONES DE VARIABLES GLOBALES (MOVIDAS AL INICIO) ---
    // (Estas variables son necesarias para Lógica 2 y 3)
    const navLinks = document.querySelectorAll(".nav-links a");
    const currentPagePath = window.location.pathname;
    const relativePath = currentPagePath.substring(currentPagePath.lastIndexOf('/') + 1) || "index.html";


    // --- 1. LÓGICA DEL NUEVO HEADER (Dropdown y Búsqueda) ---
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownArrow = document.getElementById('dropdownArrow');

    // Solo ejecuta esto si los botones existen en la página
    if (dropdownButton && dropdownMenu && dropdownArrow) {

        dropdownButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que el click cierre el menú inmediatamente
            dropdownMenu.classList.toggle('open');
            dropdownArrow.classList.toggle('open');
        });

        // Cierra el menú si se hace click fuera de él
        document.addEventListener('click', (e) => {
            if (!dropdownButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('open');
                dropdownArrow.classList.remove('open');
            }
        });
    }

    // Lógica para la Barra de Búsqueda
    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            // Si el usuario presiona "Enter"
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    // A futuro, aquí puedes hacer que la búsqueda funcione
                    console.log('Buscando:', searchTerm);
                    // Ejemplo: window.location.href = '/buscar?q=' + searchTerm;
                }
            }
        });
    }

    // --- 2. LÓGICA PARA MARCAR EL ENLACE ACTIVO (OPTIMIZADA) ---
    // (Ahora sí encontrará las variables 'relativePath' y 'navLinks')
    if (relativePath === "index.html") {
        const sections = document.querySelectorAll("section[id]");

        if (sections.length > 0) {
            // Opciones: El link se activa 150px antes de que la sección llegue al borde superior.
            const observerOptions = {
                rootMargin: "-150px 0px -50% 0px"
            };

            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // Si la sección está visible en el área definida
                    if (entry.isIntersecting) {
                        const currentSectionId = entry.target.id;

                        navLinks.forEach(link => {
                            link.classList.remove("active");
                            const linkHref = link.getAttribute("href");

                            // El link de 'Inicio' (index.html) se activa solo con la sección 'welcome'
                            if (currentSectionId === "welcome" && linkHref === "index.html") {
                                link.classList.add("active");
                            }
                            // El resto de links se activan por su #id
                            else if (linkHref === `index.html#${currentSectionId}`) {
                                link.classList.add("active");
                            }
                        });
                    }
                });
            }, observerOptions);

            // Le decimos al observador que vigile cada sección
            sections.forEach(section => sectionObserver.observe(section));
        }
    }
    // Caso B: Estamos en CUALQUIER OTRA página (Simple y rápido)
    else {
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").endsWith(relativePath)) {
                link.classList.add("active");
            }
        });
    }

    // --- 3. LÓGICA DEL CARRUSEL DE BIENVENIDA ---
    // (Ahora sí encontrará la variable 'currentPagePath')
    const welcomeCarousel = document.getElementById('welcome');
    if (currentPagePath.endsWith("index.html") || currentPagePath.endsWith("/")) {

        const slides = welcomeCarousel ? welcomeCarousel.querySelectorAll('.carousel-slide') : [];
        const prevButton = welcomeCarousel ? welcomeCarousel.querySelector('.carousel-btn.prev') : null;
        const nextButton = welcomeCarousel ? welcomeCarousel.querySelector('.carousel-btn.next') : null;

        if (welcomeCarousel && slides.length > 1 && prevButton && nextButton) {
            let currentIndex = 0;
            let slideInterval = null;

            function showSlide(index) {
                slides.forEach((slide, i) => {
                    slide.classList.toggle('active', i === index);
                    const mediaElement = slide.querySelector('video');
                    if (mediaElement) {
                        if (i === index) {
                            mediaElement.currentTime = 0;
                            mediaElement.play().catch(e => console.error("Error al reproducir video:", e));
                        } else {
                            mediaElement.pause();
                        }
                    }
                });
                currentIndex = index;
            }

            function nextSlide() {
                let nextIndex = currentIndex + 1;
                if (nextIndex >= slides.length) {
                    nextIndex = 0;
                }
                showSlide(nextIndex);
            }

            function prevSlide() {
                let prevIndex = currentIndex - 1;
                if (prevIndex < 0) {
                    prevIndex = slides.length - 1;
                }
                showSlide(prevIndex);
            }

            function startAutoPlay() {
                stopAutoPlay();
                slideInterval = setInterval(nextSlide, 5000);
            }

            function stopAutoPlay() {
                clearInterval(slideInterval);
                slideInterval = null;
            }

            showSlide(currentIndex);
            startAutoPlay();
            nextButton.addEventListener('click', () => {
                stopAutoPlay();
                nextSlide();
                startAutoPlay();
            });
            prevButton.addEventListener('click', () => {
                stopAutoPlay();
                prevSlide();
                startAutoPlay();
            });
            welcomeCarousel.addEventListener('mouseenter', stopAutoPlay);
            welcomeCarousel.addEventListener('mouseleave', startAutoPlay);
        }
    }

});