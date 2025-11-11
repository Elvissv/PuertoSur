// javaScripts/detalle_producto.js

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Lógica de Galería de Imágenes
    const mainImage = document.querySelector('.main-image img');
    const thumbnails = document.querySelectorAll('.thumbnail');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Quitar clase active de todos
            thumbnails.forEach(t => t.classList.remove('active'));
            // Poner clase active al clickeado
            this.classList.add('active');
            
            // Cambiar imagen principal
            const newSrc = this.querySelector('img').src;
            mainImage.src = newSrc;
        });
    });

    // 2. Selector de Tallas
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            sizeBtns.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // 3. Modal de Guía de Tallas
    const modal = document.getElementById('sizeGuideModal');
    const openBtn = document.getElementById('sizeGuideBtn');
    const closeBtn = document.getElementById('closeModal');

    if (openBtn && modal && closeBtn) {
        openBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
});