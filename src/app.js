// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { probarConexion } = require('./config/db');
const productosRoutes = require('./routes/productosRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());         // permite peticiones desde otros orígenes
app.use(express.json()); // convierte el body JSON en req.body

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.status(200).json({ estado: 'ok', mensaje: 'API funcionando' });
});

// Rutas del recurso productos
app.use('/api/productos', productosRoutes);

// 404 para cualquier ruta que no exista
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador global de errores (JSON mal formado → 400; otros → 500 sin stack trace)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

async function iniciar() {
  try {
    await probarConexion();
    console.log('✅ Conectado a MySQL (db_lab10)');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ No se pudo conectar a MySQL:', error.message);
    process.exit(1);
  }
}

iniciar();