// src/routes/productosRoutes.js
const express = require('express');
const {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} = require('../controllers/productosController');

const router = express.Router();

router.get('/', listarProductos);        // Listar productos
router.get('/:id', obtenerProducto);     // Obtener un producto
router.post('/', crearProducto);         // Crear producto
router.put('/:id', actualizarProducto);  // Actualizar producto
router.delete('/:id', eliminarProducto); // Eliminar producto

module.exports = router;