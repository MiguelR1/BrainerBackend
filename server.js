// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Importamos la conexión (Esto ejecuta la prueba de conexión en db.js)
const db = require('./config/db'); 
const taskRoutes = require('./routes/taskRoutes'); // <-- 1. Importa el router


const app = express();
const PORT = 3000;

// MIDDLEWARES
app.use(cors()); 
app.use(bodyParser.json()); 

app.use('/tasks', taskRoutes); 

// Aquí irían tus rutas, pero lo dejaremos simple por ahora
app.get('/', (req, res) => {
    res.send('API de Tareas funcionando');
});

app.listen(PORT, () => {
    console.log(`🚀 API corriendo en http://localhost:${PORT}`);
});