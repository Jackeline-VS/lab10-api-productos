// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { probarConexion } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());         // permite peticiones desde otros orígenes
app.use(express.json()); // convierte el body JSON en req.body

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.status(200).json({ estado: 'ok', mensaje: 'API funcionando' });
});

// Aquí se montarán las rutas de productos (Paso 3)

// 404 para cualquier ruta que no exista
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
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