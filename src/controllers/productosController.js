// src/controllers/productosController.js
// manual: revisé cada consulta; uso pool.execute() con placeholders ? (prepared statements) para evitar inyección SQL y respondo con 200/201/400/404/500.
const { pool } = require('../config/db');

const CAMPOS = 'id, nombre, descripcion, precio, stock, categoria';

// Devuelve un mensaje de error si los datos no son válidos, o null si están bien.
function validarProducto({ nombre, precio, stock, categoria }) {
  if (typeof nombre !== 'string' || nombre.trim().length < 2) {
    return 'El nombre es obligatorio (mínimo 2 caracteres)';
  }
  if (precio === undefined || precio === null || isNaN(precio) || Number(precio) <= 0) {
    return 'El precio debe ser un número mayor a 0';
  }
  if (stock !== undefined && (!Number.isInteger(Number(stock)) || Number(stock) < 0)) {
    return 'El stock debe ser un entero mayor o igual a 0';
  }
  if (typeof categoria !== 'string' || categoria.trim() === '') {
    return 'La categoría es obligatoria';
  }
  return null;
}

function idValido(id) {
  return Number.isInteger(Number(id)) && Number(id) > 0;
}

// GET /api/productos → lista los productos activos (200)
async function listarProductos(req, res) {
  try {
    const [filas] = await pool.execute(
      `SELECT ${CAMPOS} FROM productos WHERE activo = 1 ORDER BY id`
    );
    res.status(200).json(filas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al listar productos' });
  }
}

// GET /api/productos/:id → un producto (200), 400 si el id es inválido, 404 si no existe
async function obtenerProducto(req, res) {
  try {
    const { id } = req.params;
    if (!idValido(id)) {
      return res.status(400).json({ error: 'El id debe ser un número entero positivo' });
    }
    const [filas] = await pool.execute(
      `SELECT ${CAMPOS} FROM productos WHERE id = ? AND activo = 1`,
      [id]
    );
    if (filas.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(filas[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
}

// POST /api/productos → crea un producto (201) o 400 si los datos son inválidos
async function crearProducto(req, res) {
  try {
    const { nombre, descripcion, precio, stock, categoria } = req.body || {};
    const mensaje = validarProducto({ nombre, precio, stock, categoria });
    if (mensaje) {
      return res.status(400).json({ error: mensaje });
    }
    const [resultado] = await pool.execute(
      'INSERT INTO productos (nombre, descripcion, precio, stock, categoria) VALUES (?, ?, ?, ?, ?)',
      [nombre.trim(), descripcion ?? null, Number(precio), Number(stock ?? 0), categoria.trim()]
    );
    res.status(201).json({
      mensaje: 'Producto creado',
      producto: {
        id: resultado.insertId,
        nombre: nombre.trim(),
        descripcion: descripcion ?? null,
        precio: Number(precio),
        stock: Number(stock ?? 0),
        categoria: categoria.trim(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
}

// PUT /api/productos/:id → actualización total (200), 400 si datos inválidos, 404 si no existe
async function actualizarProducto(req, res) {
  try {
    const { id } = req.params;
    if (!idValido(id)) {
      return res.status(400).json({ error: 'El id debe ser un número entero positivo' });
    }
    const { nombre, descripcion, precio, stock, categoria } = req.body || {};
    const mensaje = validarProducto({ nombre, precio, stock, categoria });
    if (mensaje) {
      return res.status(400).json({ error: mensaje });
    }
    const [resultado] = await pool.execute(
      `UPDATE productos
          SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria = ?
        WHERE id = ? AND activo = 1`,
      [nombre.trim(), descripcion ?? null, Number(precio), Number(stock ?? 0), categoria.trim(), id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const [filas] = await pool.execute(`SELECT ${CAMPOS} FROM productos WHERE id = ?`, [id]);
    res.status(200).json({ mensaje: 'Producto actualizado', producto: filas[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
}

// DELETE /api/productos/:id → eliminación lógica (activo = 0) por defecto;
// con ?tipo=fisica se borra la fila de la tabla. 404 si no existe.
async function eliminarProducto(req, res) {
  try {
    const { id } = req.params;
    if (!idValido(id)) {
      return res.status(400).json({ error: 'El id debe ser un número entero positivo' });
    }
    const fisica = req.query.tipo === 'fisica';
    const sql = fisica
      ? 'DELETE FROM productos WHERE id = ?'
      : 'UPDATE productos SET activo = 0 WHERE id = ? AND activo = 1';
    const [resultado] = await pool.execute(sql, [id]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json({
      mensaje: fisica ? 'Producto eliminado físicamente' : 'Producto eliminado (lógico)',
      id: Number(id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
}

module.exports = {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};