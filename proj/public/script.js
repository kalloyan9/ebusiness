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
        console.log('Logout button found'); // Check if the button is found
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('userId');
            alert('Logged out successfully!');
            window.location.href = 'http://localhost:3000/login.html'; // Redirect to login page
        });
    } else {
        console.warn('Logout button not found');
    }
}


async function fetchCategories() {
    try {
        const response = await fetch('/categories');
        const categories = await response.json();
        const categoryList = document.getElementById('category-list');
        categoryList.innerHTML = categories
            .map(category => `<div>${category.name}</div>`)
            .join('');
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

async function setupProductForm() {
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

                const data = await response.json();
                if (data.success) {
                    alert('Product added successfully!');
                } else {
                    alert('Error adding product');
                }
            } catch (error) {
                console.error('Error adding product:', error);
                alert('An error occurred while adding the product.');
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
