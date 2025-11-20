// javaScripts/productos.js

document.addEventListener("DOMContentLoaded", function() {

    // --- 1. SELECCIÓN DE ELEMENTOS (CORREGIDO) ---
    // Ahora buscamos directamente todos los botones con la clase 'category-btn'
    // Esto funciona para el diseño antiguo Y para el nuevo diseño lateral.
    const categoryButtons = document.querySelectorAll('.category-btn');
    const categoryContents = document.querySelectorAll('.category-content');

    // Solo ejecutamos si hay botones y contenido
    if (categoryButtons.length > 0 && categoryContents.length > 0) {
        
        // --- Función para activar una categoría ---
        function activateCategory(targetId) {
            // Buscamos el botón específico que tiene ese data-target
            const targetBtn = document.querySelector(`.category-btn[data-target="${targetId}"]`);
            // Buscamos el contenido (div) con ese ID
            const targetContent = document.getElementById(targetId);

            if (targetBtn && targetContent) {
                // 1. Quitar clase 'active' de TODOS los botones y contenidos
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                categoryContents.forEach(content => content.classList.remove('active'));

                // 2. Añadir clase 'active' SOLO al seleccionado
                targetBtn.classList.add('active');
                targetContent.classList.add('active');
                
                // Opcional: Scroll suave para que el usuario vea el cambio
                // (Útil en móviles)
                const isMobile = window.innerWidth < 768;
                if (isMobile) {
                    targetContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }

        // --- Asignar el evento CLICK a cada botón ---
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-target');
                activateCategory(targetId);
            });
        });

        // --- LÓGICA DE URL (HASH) ---
        const hash = window.location.hash.substring(1); // Quita el #
        if (hash) {
            activateCategory(hash);
        }
    }
});