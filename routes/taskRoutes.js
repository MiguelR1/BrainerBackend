const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta GET para obtener los tablero segun el usuario
router.get('/tableros', userController.dameTableros);

module.exports = router;