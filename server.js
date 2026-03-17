const express = require('express');

const cors = require('cors'); // 1. Importar cors

const app = express();
const PORT = 3000;

// 2. Usar cors ANTES de tus rutas.
// Esto permite el acceso desde CUALQUIER origen (*).
app.use(cors());

const db = require('./src/config/bd');

const userRoutes = require('./src/routes/userRoutes');


//Configuracion multer para guardar imagenes en carpea uploads
const multer = require('multer');
const path = require('path');

// Configuración del almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Asegúrate de que esta carpeta exista
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(express.json());

app.use('/api', userRoutes)

// Esta línea es la clave: para mostrar las imágenes desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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



// Exportamos la configuración
module.exports = upload;