-- Създаване на база данни
CREATE DATABASE e_business;

-- Използване на базата данни
USE e_business;

-- Таблица за категории
CREATE TABLE Categories (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL
);

-- Таблица за продукти
CREATE TABLE Products (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    CategoryID INT NOT NULL,
    Description TEXT,
    Price DECIMAL(10, 2) NOT NULL,
    Stock INT NOT NULL,
    FOREIGN KEY (CategoryID) REFERENCES Categories(ID)
);

-- Примерни данни за категории
INSERT INTO Categories (Name) VALUES
('Мед'),
('Сиропи');

-- Примерни данни за продукти
INSERT INTO Products (Name, CategoryID, Description, Price, Stock) VALUES
('Био акациев мед', 1, '100% органичен акациев мед', 15.50, 100),
('Лавандулов мед', 1, 'Мед с уникален лавандулов аромат', 12.00, 50),
('Сироп от малина', 2, 'Домашен сироп от малина', 10.00, 70),
('Сироп от бъз', 2, 'Традиционен сироп от бъз', 8.50, 30);

