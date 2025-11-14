const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const authMiddleware =  require('../authMiddleware/authMiddleware');

// Rutas de Usuario
router.get('/login', userController.login);
router.post('/register', userController.register);
router.put('/editUser', authMiddleware, userController.editUser);
router.delete('/deleteUser', authMiddleware, userController.deleteUser);
router.get('/getUsers', authMiddleware, userController.getUsers);
router.get('/getUserById', authMiddleware, userController.getUserById);

//Rutas de tableros
router.get('/getTableros', authMiddleware, userController.getTableros);
router.post('/createTablero', authMiddleware, userController.createTablero);
router.get('/getTableroById', authMiddleware, userController.getTableroById);
router.delete('/deleteTablero', authMiddleware, userController.deleteTablero);
router.put('/editTablero', authMiddleware, userController.editTablero);

// Rutas de tareas
router.post('/createTarea', authMiddleware, userController.createTarea);
router.get('/getTareasByTablero', authMiddleware, userController.getTareasByTablero);
router.get('/getTareaById', authMiddleware, userController.getTareaById);
router.delete('/deleteTarea', authMiddleware, userController.deleteTarea);
router.put('/editTarea', authMiddleware, userController.editTarea);

module.exports = router;