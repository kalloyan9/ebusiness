document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    setupLoginForm();

    document.getElementById('checkout-button').addEventListener('click', checkoutCart);
});

function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        loginUser({ username, password });
    });
}

function loginUser(credentials) {
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Login successful!');
            fetchCart(data.userId);
        } else {
            alert('Login failed. Please check your credentials.');
        }
    })
    .catch(error => console.error('Error logging in:', error));
}

function fetchProducts() {
    fetch('http://localhost:3000/products')
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById('product-list');
            productList.innerHTML = '';
            data.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.innerHTML = `
                    <strong>${product.name}</strong>: $${product.price}<br>${product.description}
                    <button onclick="addToCart(${product.id})">Add to Cart</button>
                `;
                productList.appendChild(productDiv);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
}

function addToCart(productId) {
    fetch('http://localhost:3000/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchCart(data.userId);
    })
    .catch(error => console.error('Error adding to cart:', error));
}

function fetchCart(userId) {
    fetch(`http://localhost:3000/cart/${userId}`)
        .then(response => response.json())
        .then(data => {
            const cart = document.getElementById('cart');
            cart.innerHTML = '';
            data.items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('cart-item');
                itemDiv.textContent = `${item.name} x ${item.quantity}`;
                cart.appendChild(itemDiv);
            });
        })
        .catch(error => console.error('Error fetching cart:', error));
}

function checkoutCart() {
    fetch('http://localhost:3000/checkout', { method: 'POST' })
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => console.error('Error during checkout:', error));
}
