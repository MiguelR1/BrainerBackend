const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const authMiddleware =  require('../authMiddleware/authMiddleware');

router.get('/login', userController.login);
router.get('/register', userController.register);
router.get('/editUser', userController.editUser);

router.get('/getTableros', authMiddleware, userController.getTableros)

module.exports = router;