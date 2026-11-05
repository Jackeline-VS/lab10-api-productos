# API REST de Productos — Node.js + Express + MySQL

**Universidad Nacional del Centro del Perú** · Facultad de Ingeniería de Sistemas
**Asignatura:** Desarrollo de Aplicaciones Web (IS093A) · **Guía Práctica Semana 10** · 05/11/2026
**Estudiante:** Jackeline Vivanco Solano · **Código:** 2022100549I

API RESTful con arquitectura MVC que implementa el CRUD del recurso `productos`
sobre MySQL, usando un pool de conexiones de `mysql2/promise` con `async/await`
y consultas preparadas para prevenir inyección SQL.

## Tecnologías

| Herramienta | Uso |
|---|---|
| Node.js 24 + npm | Entorno de ejecución |
| Express | Servidor HTTP y enrutamiento |
| mysql2/promise | Pool de conexiones y prepared statements |
| dotenv | Variables de entorno (credenciales fuera del código) |
| cors | Peticiones desde otros orígenes |
| nodemon | Recarga automática en desarrollo |
| MySQL (XAMPP) | Base de datos `db_lab10` |
| Thunder Client | Pruebas de la API |

## Estructura

```
lab10-api-productos/
├── database/
│   └── db_lab10.sql                 # Script de la BD y datos de prueba
├── src/
│   ├── app.js                       # Servidor, middlewares, rutas y manejo de errores
│   ├── config/
│   │   └── db.js                    # Pool de conexiones mysql2/promise
│   ├── controllers/
│   │   └── productosController.js   # Lógica CRUD
│   └── routes/
│       └── productosRoutes.js       # Endpoints del recurso
├── .env.example                     # Plantilla de variables (sin credenciales reales)
├── .gitignore                       # Excluye node_modules/ y .env
└── package.json
```

## Instalación y ejecución

```bash
git clone https://github.com/Jackeline-VS/lab10-api-productos.git
cd lab10-api-productos
npm install
cp .env.example .env        # completar las credenciales de MySQL
```

1. Iniciar MySQL en XAMPP y ejecutar `database/db_lab10.sql` en phpMyAdmin.
2. Levantar el servidor:

```bash
npm run dev     # desarrollo (nodemon)
npm start       # producción
```

Servidor en `http://localhost:3000`. El archivo `.env` **no se sube** al repositorio.

## Endpoints

Base: `http://localhost:3000/api/productos` · Todas las respuestas son `Content-Type: application/json`.

| Método | Ruta | Propósito | Éxito | Errores |
|---|---|---|---|---|
| GET | `/api/health` | Verificar que la API está activa | 200 | — |
| GET | `/api/productos` | Listar los productos activos | 200 | 500 |
| GET | `/api/productos/:id` | Obtener un producto por id | 200 | 400, 404, 500 |
| POST | `/api/productos` | Crear un producto | 201 | 400, 500 |
| PUT | `/api/productos/:id` | Actualizar un producto (total) | 200 | 400, 404, 500 |
| DELETE | `/api/productos/:id` | Eliminación **lógica** (`activo = 0`) | 200 | 400, 404, 500 |
| DELETE | `/api/productos/:id?tipo=fisica` | Eliminación **física** (borra la fila) | 200 | 400, 404, 500 |

### Body de POST y PUT (JSON)

```json
{
  "nombre": "Teclado Redragon",
  "descripcion": "Mecánico RGB",
  "precio": 150,
  "stock": 20,
  "categoria": "electronico"
}
```

| Campo | Tipo | Regla |
|---|---|---|
| nombre | string | obligatorio, mínimo 2 caracteres |
| descripcion | string | opcional |
| precio | number | obligatorio, mayor a 0 |
| stock | integer | opcional, entero ≥ 0 (por defecto 0) |
| categoria | string | obligatorio |

### Formato de errores

```json
{ "error": "Producto no encontrado" }
```

| Código | Cuándo |
|---|---|
| 400 | Datos inválidos, id no numérico o JSON mal formado |
| 404 | El producto no existe o la ruta no existe |
| 500 | Error del servidor o de la BD (no se envía el stack trace al cliente) |

## Decisiones técnicas

- **Pool de conexiones:** reutiliza hasta 10 conexiones abiertas en lugar de abrir una por petición.
- **`execute()` en vez de `query()`:** usa *prepared statements*; los valores viajan separados del SQL, por lo que un id como `1 OR 1=1` se trata como dato y no como código.
- **Eliminación lógica vs física:** por defecto se marca `activo = 0` para conservar el historial; con `?tipo=fisica` se elimina la fila.
- **Credenciales:** se leen de `.env` con dotenv; `.env` está en `.gitignore`.

## Uso de IA

Según la regla del laboratorio, los fragmentos asistidos por IA llevan el comentario
`// IA: [problema] → Solución manual: [explicación]` en `src/config/db.js` y
`src/controllers/productosController.js`.
