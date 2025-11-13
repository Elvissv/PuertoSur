// Espera a que todo el contenido del HTML esté cargado
document.addEventListener("DOMContentLoaded", function() {

    // --- DEFINICIONES DE VARIABLES GLOBALES ---
    const navLinks = document.querySelectorAll(".nav-links a");
    const currentPagePath = window.location.pathname;
    const relativePath = currentPagePath.substring(currentPagePath.lastIndexOf('/') + 1) || "index.html";


    // --- 1. LÓGICA DEL NUEVO HEADER (Dropdown y Búsqueda) ---
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownArrow = document.getElementById('dropdownArrow');

    if (dropdownButton && dropdownMenu && dropdownArrow) {
        dropdownButton.addEventListener('click', (e) => {
            e.stopPropagation(); 
            dropdownMenu.classList.toggle('open');
            dropdownArrow.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!dropdownButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('open');
                dropdownArrow.classList.remove('open');
            }
        });
    }

    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    console.log('Buscando:', searchTerm);
                }
            }
        });
    }

    // --- 2. LÓGICA PARA MARCAR EL ENLACE ACTIVO ---
    if (relativePath === "index.html") {
        const sections = document.querySelectorAll("section[id]");

        if (sections.length > 0) {
            const observerOptions = {
                rootMargin: "-150px 0px -50% 0px"
            };

            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const currentSectionId = entry.target.id;
                        navLinks.forEach(link => {
                            link.classList.remove("active");
                            const linkHref = link.getAttribute("href");
                            if (currentSectionId === "welcome" && linkHref === "index.html") {
                                link.classList.add("active");
                            }
                            else if (linkHref === `index.html#${currentSectionId}`) {
                                link.classList.add("active");
                            }
                        });
                    }
                });
            }, observerOptions);
            sections.forEach(section => sectionObserver.observe(section));
        }
    }
    else {
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").endsWith(relativePath)) {
                link.classList.add("active");
            }
        });
    }

    // --- 3. LÓGICA DEL CARRUSEL DE BIENVENIDA ---
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
                    // Corrección: Revisa si el elemento es un VIDEO antes de pausar/reproducir
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

    // --- LÓGICA DEL MENÚ DE HAMBURGUESA ---
    const menuButton = document.getElementById('mobileMenuToggle');
    const navGroup = document.getElementById('navGrouping');
    
    if (menuButton && navGroup) {
        menuButton.addEventListener('click', () => {
            navGroup.classList.toggle('is-open');
            menuButton.classList.toggle('is-active');
        });
    }

    // ===================================
    // LÓGICA 4: ATROPOS 3D (¡NUEVO!)
    // ===================================
    // Busca todos los contenedores con la clase .my-atropos
    document.querySelectorAll('.my-atropos').forEach((el) => {
        // Inicializa Atropos en cada uno
        Atropos({
            el: el,
            activeOffset: 40,
            shadow: true,
            shadowScale: 1.05,
        });
    });

}); // <-- ¡AQUÍ ESTÁ LA CORRECCIÓN! (Cambiado de ');' a '});')
    // (La '}' extra del final fue eliminada)