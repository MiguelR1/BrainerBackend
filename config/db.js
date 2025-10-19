// config/db.js
const mysql = require('mysql2/promise');

// Configuración de la conexión. Es mejor usar variables de entorno (process.env) 
// para las credenciales, pero aquí están codificadas para el ejemplo.
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todoapp',
    waitForConnections: true,
    connectionLimit: 10,  // Permite hasta 10 conexiones simultáneas
    queueLimit: 0
});

// Opcional: Probar la conexión al iniciar la API
pool.getConnection()
    .then(connection => {
        console.log('✅ Conexión a MySQL establecida con éxito.');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error al conectar a MySQL:', err.message);
    });

// Exportamos el pool para poder usarlo en otras partes de la API
module.exports = pool;