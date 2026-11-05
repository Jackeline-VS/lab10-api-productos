-- Base de datos del Laboratorio 10: API REST de productos
CREATE DATABASE IF NOT EXISTS db_lab10
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_lab10;

CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255) NULL,
  precio DECIMAL(10,2) NOT NULL CHECK (precio > 0),
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  categoria VARCHAR(50) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO productos (nombre, descripcion, precio, stock, categoria) VALUES
('Laptop Lenovo', 'Core i5, 16 GB RAM', 2500.00, 10, 'electronico'),
('Mouse inalambrico', 'Logitech M170', 45.90, 50, 'electronico'),
('Calculo de una variable', 'James Stewart, 8va edicion', 180.00, 5, 'libro');