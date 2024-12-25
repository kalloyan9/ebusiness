// Wait for the DOM to load before executing
document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('Please log in to access this page.');
        window.location.href = 'login.html';
        return;
    }

    setupLogoutButton();
    fetchCategories();
    setupProductForm();
    setupCart();
    setupProductDisplay();
});

function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });
                const data = await response.json();
                if (data.success) {
                    localStorage.setItem('userId', data.userId);
                    alert('Login successful!');
                    document.getElementById('logout-button').style.display = 'block';
                    fetchCart();
                } else {
                    alert('Invalid credentials');
                }
            } catch (error) {
                console.error('Error logging in:', error);
                alert('An error occurred during login.');
            }
        });
    } else {
        console.warn('Login form not found in the DOM.');
    }
}

function setupLogoutButton() {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('userId');
            alert('Logged out successfully!');
            window.location.href = 'login.html';
        });
    }
}

async function fetchCategories() {
    try {
        const response = await fetch('/categories');
        const categories = await response.json();
        const categorySelect = document.getElementById('category-select');

        if (categorySelect) {
            categorySelect.innerHTML = categories
                .map((category) => `<option value="${category.id}">${category.name}</option>`)
                .join('');
        } else {
            console.warn('Category select element not found.');
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

function setupProductForm() {
    const productForm = document.getElementById('add-product-form');
    if (productForm) {
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('product-name').value;
            const price = document.getElementById('product-price').value;
            const description = document.getElementById('product-description').value;
            const categoryId = document.getElementById('category-select').value;

            try {
                const response = await fetch('/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, price, description, category_id: categoryId }),
                });

                if (response.ok) {
                    alert('Product added successfully!');
                    setupProductDisplay(); // Refresh product display
                } else {
                    console.error('Error adding product:', await response.text());
                }
            } catch (error) {
                console.error('Error adding product:', error);
            }
        });
    }
}

async function setupCart() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.warn('No user logged in. Cannot fetch cart.');
        return;
    }

    try {
        const response = await fetch(`/cart/${userId}`);
        const data = await response.json();

        const cartElement = document.getElementById('cart');
        if (cartElement) {
            cartElement.innerHTML = '';
            data.items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.textContent = `${item.name} - ${item.quantity} x $${item.price}`;
                cartElement.appendChild(itemElement);
            });
        } else {
            console.warn('Cart element not found in the DOM.');
        }
    } catch (error) {
        console.error('Error fetching cart:', error);
    }
}

async function setupProductDisplay() {
    const productContainer = document.getElementById('product-list');
    if (!productContainer) {
        console.warn('Product list container not found.');
        return;
    }

    try {
        const response = await fetch('/products');
        const products = await response.json();

        productContainer.innerHTML = ''; // Clear existing content
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product-item');
            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            productContainer.appendChild(productElement);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

async function addToCart(productId) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('Please log in to add products to your cart.');
        return;
    }

    try {
        const response = await fetch('/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, productId }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Product added to cart!');
        } else {
            console.error('Error adding to cart:', data.message);
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}
