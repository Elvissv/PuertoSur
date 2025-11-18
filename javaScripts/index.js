// Espera a que todo el contenido del HTML esté cargado
document.addEventListener("DOMContentLoaded", function() {

    // --- DEFINICIONES DE VARIABLES GLOBALES ---
    const navLinks = document.querySelectorAll(".nav-links a");
    const currentPagePath = window.location.pathname;
    const relativePath = currentPagePath.substring(currentPagePath.lastIndexOf('/') + 1) || "index.html";

    // ===================================
    // 1. LÓGICA GLOBAL DEL HEADER
    // ===================================

    // --- Lógica del Menú Móvil ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');

    // Función para abrir el menú
    function openMobileMenu() {
        if (mobileMenu) mobileMenu.classList.add('active');
        if (mobileOverlay) mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evita scroll del fondo
    }

    // Función para cerrar el menú
    function closeMobileMenu() {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restaura scroll
    }

    // Asignar eventos
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMobileMenu);
    }
    
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMobileMenu);
    }
    
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    // --- Lógica de Búsqueda (Desktop y Móvil) ---
    const searchInputDesktop = document.getElementById('search-input');
    const searchInputMobile = document.getElementById('mobile-search-input');

    function handleSearch(event) {
        if (event.key === 'Enter') {
            const searchTerm = event.target.value.trim();
            if (searchTerm) {
                console.log('Buscando (desktop):', searchTerm);
                // window.location.href = '/buscar?q=' + encodeURIComponent(searchTerm);
            }
        }
    }

    function handleSearchMobile(event) {
        if (event.key === 'Enter') {
            const searchTerm = event.target.value.trim();
            if (searchTerm) {
                console.log('Buscando (móvil):', searchTerm);
                // window.location.href = '/buscar?q=' + encodeURIComponent(searchTerm);
                closeMobileMenu(); // Cierra el menú después de buscar
            }
        }
    }

    if (searchInputDesktop) {
        searchInputDesktop.addEventListener('keypress', handleSearch);
    }

    if (searchInputMobile) {
        searchInputMobile.addEventListener('keypress', handleSearchMobile);
    }

    // ===================================
    // 3. LÓGICA ESPECÍFICA DEL INDEX (Carrusel Bienvenida)
    // ===================================
    const welcomeCarousel = document.getElementById('welcome');
    
    if ((currentPagePath.endsWith("index.html") || currentPagePath.endsWith("/")) && welcomeCarousel) {

        const slides = welcomeCarousel.querySelectorAll('.carousel-slide');
        const prevButton = welcomeCarousel.querySelector('.carousel-btn.prev');
        const nextButton = welcomeCarousel.querySelector('.carousel-btn.next');

        if (slides.length > 1 && prevButton && nextButton) {
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

    // ===================================
    // 4. LÓGICA ESPECÍFICA DEL INDEX (Tarjetas 3D Atropos)
    // ===================================
    
    const atroposCards = document.querySelectorAll('.my-atropos');
    
    if (atroposCards.length > 0) {
        // Inicializa Atropos en cada tarjeta
        atroposCards.forEach((el) => {
            Atropos({
                el: el,
                activeOffset: 40,
                shadow: true,
                shadowScale: 1.05,
            });
        });
    }

}); // <-- FIN DEL DOMCONTENTLOADED (¡LLAVE EXTRA ELIMINADA!)