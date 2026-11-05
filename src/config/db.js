// src/config/db.js
// Pool de conexiones a MySQL usando mysql2/promise (async/await).
const mysql = require('mysql2/promise');
require('dotenv').config();

// Las credenciales se leen del .env: nunca se escriben en el código.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // si no hay conexiones libres, espera en cola
  connectionLimit: 10,      // máximo de conexiones simultáneas
  queueLimit: 0,            // cola sin límite
});

// Verifica que la base de datos responda antes de levantar el servidor.
async function probarConexion() {
  const conexion = await pool.getConnection();
  await conexion.ping();
  conexion.release(); // devuelve la conexión al pool
}

module.exports = { pool, probarConexion };