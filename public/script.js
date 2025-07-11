const API = '/api';
let editId = null;

document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const product = {
    name: document.getElementById('name').value,
    price: parseFloat(document.getElementById('price').value),
    description: document.getElementById('desc').value,
    image: document.getElementById('image').value || 'https://via.placeholder.com/300x200.png?text=No+Image',
    category: document.getElementById('category').value
  };

  const method = editId ? 'PUT' : 'POST';
  const url = editId ? `${API}/products/${editId}` : `${API}/products`;

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });

  editId = null;
  document.getElementById('productForm').reset();
  fetchProducts();
  loadCategories();
});

function editProduct(product) {
  document.getElementById('name').value = product.name;
  document.getElementById('price').value = product.price;
  document.getElementById('desc').value = product.description;
  document.getElementById('image').value = product.image;
  document.getElementById('category').value = product.category;
  editId = product._id;
}

function cancelEdit() {
  document.getElementById('productForm').reset();
  editId = null;
}

async function fetchProducts(category = '') {
  const res = await fetch(`${API}/products`);
  const data = await res.json();
  const filtered = category ? data.filter(p => p.category === category) : data;
  display(filtered);
}

async function deleteProduct(id) {
  await fetch(`${API}/products/${id}`, { method: 'DELETE' });
  fetchProducts();
  loadCategories();
}

async function searchProduct() {
  const query = document.getElementById('search').value;
  const res = await fetch(`${API}/search?q=${query}`);
  const data = await res.json();
  display(data);
}

function filterByCategory() {
  const category = document.getElementById('categoryFilter').value;
  fetchProducts(category);
}

async function loadCategories() {
  const res = await fetch(`${API}/categories`);
  const categories = await res.json();
  const select = document.getElementById('categoryFilter');
  select.innerHTML = '<option value="">All</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

function display(products) {
  const container = document.getElementById('products');
  container.innerHTML = '';
  products.forEach(p => {
    container.innerHTML += `
      <div class="product">
        <img src="${p.image}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p><strong>₹${p.price}</strong></p>
        <p>${p.description}</p>
        <small>${p.category}</small><br/>
        <button onclick="deleteProduct('${p._id}')">Delete</button>
        <button onclick='editProduct(${JSON.stringify(p)})'>Edit</button>
      </div>
    `;
  });
}

fetchProducts();
loadCategories();
