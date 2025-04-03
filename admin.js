// Config
const API_URL = 'http://localhost:3000/api';

// Upload Image
async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData
  });
  return response.json();
}

// Product CRUD Operations
async function getProducts() {
  const response = await fetch(`${API_URL}/products`);
  return response.json();
}

async function addProduct(product) {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  return response.json();
}

// Update form handler
document.getElementById('addProductForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('productName').value;
  const price = document.getElementById('productPrice').value;
  const imageFile = document.getElementById('productImageFile').files[0];
  
  // Upload image if exists
  let imageUrl = '';
  if (imageFile) {
    const uploadResult = await uploadImage(imageFile);
    imageUrl = uploadResult.imageUrl;
  }
  
  // Create product
  const product = {
    name,
    price,
    image: imageUrl || 'https://via.placeholder.com/300',
    sizes: getSelectedSizes()
  };
  
  await addProduct(product);
  alert('Produk berhasil ditambahkan!');
  loadProducts();
});

// Helper function
function getSelectedSizes() {
  return Array.from(document.querySelectorAll('input[name="size"]:checked'))
    .map(el => el.value);
}

// Load products
async function loadProducts() {
  const products = await getProducts();
  // Render products...
}