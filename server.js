// server.js
const express = require('express');
const taskRoutes = require('./routes/taskRoutes'); // <-- 1. Importa el router

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/tasks', taskRoutes); 

// Aquí irían tus rutas, pero lo dejaremos simple por ahora
app.get('/', (req, res) => {
    res.send('API de Tareas funcionando');
});

app.listen(PORT, () => {
    console.log(`🚀 API corriendo en http://localhost:${PORT}`);
});