document.addEventListener("DOMContentLoaded", function() {

    // --- Lógica para las pestañas (Tabs) de categorías ---
    const categoryButtons = document.querySelectorAll('.product-categories button');
    const categoryContents = document.querySelectorAll('.category-content');

    // Revisa si existen los botones antes de ejecutar
    if (categoryButtons.length > 0 && categoryContents.length > 0) {
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-target');
                const targetContent = document.getElementById(targetId);

                // 1. Quitar 'active' de todos los botones y contenidos
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                categoryContents.forEach(content => content.classList.remove('active'));

                // 2. Poner 'active' en el botón clickeado y el contenido correspondiente
                button.classList.add('active');
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    /* Añadimos la clase 'active-page-link' al botón "Todos los productos" 
      del header para que se marque en azul.
      Usamos una clase diferente a 'active' para no confundirla con el CSS del nav-links.
    */
    const allProductsLink = document.querySelector('.all-products-link');
    if (allProductsLink) {
        // Le añadimos la clase 'active' que definimos en 'productos.css'
        allProductsLink.classList.add('active');
    }

});