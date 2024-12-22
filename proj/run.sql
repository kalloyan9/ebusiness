CREATE DATABASE IF NOT EXISTS e_business;
USE e_business;

-- Create Categories Table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Create Products Table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Insert Sample Categories
INSERT INTO categories (name) VALUES ('Honey'), ('Syrups'), ('Organic Treats');

-- INSERT INTO products (name, price, description, category_id) VALUES
-- ('Acacia Honey', 15.50, 'Pure acacia honey from organic sources.', 1),
-- ('Forest Honey', 12.00, 'Rich forest honey with a unique flavor.', 1),
-- ('Raspberry Syrup', 8.25, 'Organic raspberry syrup, perfect for desserts.', 2),
-- ('Blueberry Syrup', 9.50, 'Delicious blueberry syrup, made from organic fruit.', 2);
