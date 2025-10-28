const mysql = require('mysql2/promise'); // Usamos mysql2

const db = mysql.createPool({
    host: 'localhost',      // O la IP de tu servidor de BD
    user: 'root',           // Tu usuario de MySQL
    password: '', // Tu contraseña de MySQL
    database: 'todoapp', // El nombre de tu base de datos
    waitForConnections: true,
    connectionLimit: 10,     // Máximo de conexiones simultáneas
    queueLimit: 0
});

module.exports = db;