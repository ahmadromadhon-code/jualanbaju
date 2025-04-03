// Simpan produk dalam localStorage jika belum ada
if (!localStorage.getItem('products')) {
    const initialProducts = [
        {
            id: 1,
            name: "Kaos Polos Premium",
            price: 120000,
            image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            sizes: ["S", "M", "L", "XL"]
        },
        {
            id: 2,
            name: "Kemeja Flanel",
            price: 180000,
            image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            sizes: ["S", "M", "L", "XL"]
        },
        {
            id: 3,
            name: "Hoodie Oversize",
            price: 250000,
            image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            sizes: ["S", "M", "L", "XL"]
        },
        {
            id: 4,
            name: "Celana Chino",
            price: 220000,
            image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            sizes: ["28", "30", "32", "34"]
        }
    ];
    localStorage.setItem('products', JSON.stringify(initialProducts));
}

// Navbar Hamburger Toggle
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

if (menuToggle && navLinks) {
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
}

// Load products for customer view
function loadProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">Rp ${product.price.toLocaleString('id-ID')}</p>
                <div class="size-selector">
                    <label>Ukuran:</label>
                    <div class="size-options">
                        ${product.sizes.map(size => `
                            <button class="size-btn" data-size="${size}">${size}</button>
                        `).join('')}
                    </div>
                </div>
                <button class="order-btn" data-product="${product.name}" data-price="${product.price}">Pesan Sekarang</button>
            </div>
        </div>
    `).join('');

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
}

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

// Load products when page loads
document.addEventListener('DOMContentLoaded', loadProducts);