DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price INT,
  stock_quantity INT,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPhone", "electronics", 400, 10),
("Apple MacBook Air", "electronics", 679, 8),
("Apple Watch", "electronics", 350, 17),
("Sectional Sofa", "furniture", 500, 15),
("TV Stand", "furniture", 150, 12),
("Upholstered Platform Queen Bed", "furniture", 210, 13),
("Eyeshadow Pallete", "beauty", 50, 20),
("Full Coverage Concealer", "beauty", 25, 25),
("Medium Coverage Foundation", "beauty", 35, 23),
("Echo Dot", "Alexa", 40, 30);

