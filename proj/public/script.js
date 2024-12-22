document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    fetchCategories();

    const addProductForm = document.getElementById('add-product-form');
    addProductForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('product-name').value;
        const price = document.getElementById('product-price').value;
        const description = document.getElementById('product-description').value;
        const category_id = document.getElementById('category-select').value;

        if (name && price && description && category_id) {
            const productData = { name, price, description, category_id };
            addProduct(productData);
        } else {
            alert("Please fill all fields.");
        }
    });
});

function fetchProducts() {
    fetch('http://localhost:3000/products')
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById('product-list');
            productList.innerHTML = '';
            data.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.innerHTML = `<strong>${product.name}</strong>: $${product.price}<br>${product.description}`;
                productList.appendChild(productDiv);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
}

function fetchCategories() {
    fetch('http://localhost:3000/categories')
        .then(response => response.json())
        .then(data => {
            const categorySelect = document.getElementById('category-select');
            categorySelect.innerHTML = ''; // Clear existing options
            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
}

function addProduct(productData) {
    fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
        fetchProducts(); // Reload the product list after adding a new product
    })
    .catch(error => console.error('Error adding product:', error));
}
