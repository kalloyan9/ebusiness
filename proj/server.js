const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Import the 'path' module

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public'))); // Add this line

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'e_business',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Routes

// Fetch all products
app.get('/products', (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching products');
        } else {
            res.json(results);
        }
    });
});

// Fetch products by category
app.get('/products/category/:categoryId', (req, res) => {
    const { categoryId } = req.params;
    const sql = 'SELECT * FROM products WHERE category_id = ?';
    db.query(sql, [categoryId], (err, results) => {
        if (err) {
            res.status(500).send('Error fetching products by category');
        } else {
            res.json(results);
        }
    });
});

// User login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT id FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            res.status(500).send('Error during login');
        } else if (results.length === 0) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        } else {
            res.json({ success: true, userId: results[0].id });
        }
    });
});

// Add to cart
app.post('/cart', (req, res) => {
    const { userId, productId } = req.body;
    const cartQuery = 'SELECT id FROM carts WHERE user_id = ?';
    db.query(cartQuery, [userId], (err, results) => {
        if (err) {
            res.status(500).send('Error fetching cart');
        } else {
            const cartId = results.length > 0 ? results[0].id : null;
            if (!cartId) {
                const createCartQuery = 'INSERT INTO carts (user_id) VALUES (?)';
                db.query(createCartQuery, [userId], (err, result) => {
                    if (err) {
                        res.status(500).send('Error creating cart');
                    } else {
                        addCartItem(result.insertId, productId, res);
                    }
                });
            } else {
                addCartItem(cartId, productId, res);
            }
        }
    });
});

// Fetch cart
app.get('/cart/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = `
        SELECT p.name, ci.quantity, p.price 
        FROM cart_items ci
        JOIN carts c ON ci.cart_id = c.id
        JOIN products p ON ci.product_id = p.id
        WHERE c.user_id = ?
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) {
            res.status(500).send('Error fetching cart');
        } else {
            res.json({ items: results });
        }
    });
});

// Checkout
app.post('/checkout', (req, res) => {
    const { userId } = req.body;
    const fetchCartQuery = `
        SELECT ci.product_id, ci.quantity, p.price 
        FROM cart_items ci
        JOIN carts c ON ci.cart_id = c.id
        JOIN products p ON ci.product_id = p.id
        WHERE c.user_id = ?
    `;
    db.query(fetchCartQuery, [userId], (err, cartItems) => {
        if (err) {
            res.status(500).send('Error fetching cart for checkout');
        } else if (cartItems.length === 0) {
            res.status(400).send('Cart is empty');
        } else {
            const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
            const createOrderQuery = 'INSERT INTO orders (user_id, total) VALUES (?, ?)';
            db.query(createOrderQuery, [userId, total], (err, result) => {
                if (err) {
                    res.status(500).send('Error creating order');
                } else {
                    const orderId = result.insertId;
                    const orderItemsQuery = `
                        INSERT INTO order_items (order_id, product_id, quantity, price)
                        VALUES ?
                    `;
                    const orderItemsValues = cartItems.map(item => [
                        orderId, item.product_id, item.quantity, item.price
                    ]);
                    db.query(orderItemsQuery, [orderItemsValues], (err) => {
                        if (err) {
                            res.status(500).send('Error adding items to order');
                        } else {
                            const clearCartQuery = `
                                DELETE ci 
                                FROM cart_items ci
                                JOIN carts c ON ci.cart_id = c.id
                                WHERE c.user_id = ?
                            `;
                            db.query(clearCartQuery, [userId], (err) => {
                                if (err) {
                                    res.status(500).send('Error clearing cart');
                                } else {
                                    res.json({ success: true, message: 'Checkout successful!' });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

// Helper function to add an item to the cart
function addCartItem(cartId, productId, res) {
    const sql = 'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, 1)';
    db.query(sql, [cartId, productId], (err) => {
        if (err) {
            res.status(500).send('Error adding to cart');
        } else {
            res.json({ message: 'Product added to cart' });
        }
    });
}

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the E-Business System API');
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
