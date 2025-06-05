let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
  const count = cart.reduce((acc, item) => acc + item.qty, 0);
  document.querySelectorAll('#cart-count').forEach(e => e.textContent = count);
  localStorage.setItem('cart', JSON.stringify(cart));
}

async function fetchData() {
  const res = await fetch('data.json');
  return await res.json();
}

if (document.getElementById('product-list')) {
  fetchData().then(data => {
    const list = document.getElementById('product-list');
    data.forEach(product => {
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `
        <img src="${product.image}" width="150"><br>
        <strong>${product.name}</strong><br>
        $${product.price.toFixed(2)}<br>
        <a href="product.html?id=${product.id}">View</a><br>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      list.appendChild(div);
    });
  });
  updateCartCount();
}

if (document.getElementById('product-detail')) {
  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get('id'));
  fetchData().then(data => {
    const product = data.find(p => p.id === id);
    const div = document.getElementById('product-detail');
    div.innerHTML = `
      <img src="${product.image}" width="150"><br>
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <strong>$${product.price.toFixed(2)}</strong><br>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
  });
  updateCartCount();
}

function addToCart(id) {
  fetchData().then(data => {
    const product = data.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) existing.qty++;
    else cart.push({ ...product, qty: 1 });
    updateCartCount();
  });
}

if (document.getElementById('cart-items')) {
  const container = document.getElementById('cart-items');
  let total = 0;
  cart.forEach((item, index) => {
    total += item.qty * item.price;
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <strong>${item.name}</strong><br>
      $${item.price.toFixed(2)} x ${item.qty}<br>
      <button onclick="removeFromCart(${index})">Remove</button>
    `;
    container.appendChild(div);
  });
  document.getElementById('total-price').textContent = total.toFixed(2);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  location.reload();
}

updateCartCount();
