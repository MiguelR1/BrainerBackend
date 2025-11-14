const express = require('express');
const app = express();
const db = require('./src/config/bd');
const PORT = 3000;

const userRoutes = require('./src/routes/userRoutes');

app.use(express.json());

app.use('/api', userRoutes)

app.listen(PORT, () => {
    console.log(`Servidor Express y MySQL escuchando en http://localhost:${PORT}`);
    // Prueba rápida de conexión al iniciar el servidor
    db.getConnection()
        .then(connection => {
            console.log('✅ Conexión exitosa a MySQL.');
            connection.release();
        })
        .catch(err => {
            console.error('❌ ERROR de Conexión a MySQL:', err.message);
        });
});
