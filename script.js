// Navbar Hamburger Toggle
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Size selector functionality
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from all buttons in this size group
        this.parentElement.querySelectorAll('.size-btn').forEach(b => {
            b.classList.remove('active');
        });
        // Add active class to clicked button
        this.classList.add('active');
    });
});

// Order button functionality
document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const productName = this.getAttribute('data-product');
        const productPrice = this.getAttribute('data-price');
        const sizeGroup = this.parentElement.querySelector('.size-options');
        const selectedSize = sizeGroup.querySelector('.active');
        
        if (!selectedSize) {
            alert('Silakan pilih ukuran terlebih dahulu');
            return;
        }
        
        const size = selectedSize.getAttribute('data-size');
        
        // Format the WhatsApp message
        const whatsappNumber = "6281234567890"; // Ganti dengan nomor WhatsApp pemilik toko
        const message = `Halo, saya ingin memesan:\n\n*Produk:* ${productName}\n*Harga:* Rp ${parseInt(productPrice).toLocaleString('id-ID')}\n*Ukuran:* ${size}\n\nApakah produk ini tersedia?`;
        
        // Encode the message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // Open WhatsApp
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});