const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123',
  database: 'e_business',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the database.');
});

// Routes
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving products.');
    } else {
      res.json(results);
    }
  });
});

app.get('/categories', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving categories.');
    } else {
      res.json(results);
    }
  });
});

app.post('/products', (req, res) => {
  const { name, price, description, category_id } = req.body;
  const sql = 'INSERT INTO products (name, price, description, category_id) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, price, description, category_id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error adding product.');
    } else {
      res.send('Product added successfully.');
    }
  });
});

app.get('/', (req, res) => {
    res.send('Welcome to the E-Business API');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
