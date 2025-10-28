const userService = require('../services/userService');

const jwt = require('jsonwebtoken');

const CLAVE_SECRETA = 'Tu_Clave_Secreta_Muy_Larga_Y_Compleja_Aqui';

// User Funciones
async function register(req, res){
    try {
        const {Nombre, Cedula, Contraseña} = req.body;

        if (!Nombre || !Cedula || !Contraseña) {
            res.status(400).json({error: 'Faltan datos obligatorios.'})
        }

        const getUser = await userService.getUserByCedula(Cedula);

        if (getUser.length > 0) {
            res.status(200).json({
                "Status": 1,
                "Mensaje": "Ya existe un usuario registrado con esa cédula."
            })
        }else{
            const registerUser = await userService.register(Nombre, Cedula, Contraseña);
    
            if (registerUser.affectedRows == 1) {
                res.status(200).json({
                    "status": 0,
                    "Mensaje": "El usuario ha sido registrado con éxito."
                })
            }
        }

    } catch (error) {
        res.status(500).json({error: 'No se pudo registrar al usuario.'})
    }
}

async function login(req, res) {
    try {
        const {Cedula, Contraseña} = req.body;

        if (!Cedula || !Contraseña) { res.status(400).json({error: 'Faltan datos obligatorios.'})};

        const user = await userService.authLogin(Cedula, Contraseña);
        
        const token = jwt.sign(
            // PAYLOAD: Solo datos NO sensibles
            { id: user.Id, Nombre: user.Nombre }, // Asumiendo que 'user' tiene 'id', 'rol' y 'Cedula'
            CLAVE_SECRETA, 
            { expiresIn: '30m' }
        );

        // 3. Enviar el token y el mensaje de éxito en la respuesta
        res.status(200).json({
            // Puedes incluir datos básicos del usuario, pero el token es la clave.
            id: user.Id,
            usuario: user.Nombre, 
            mensaje: 'Ha hecho login de manera satisfactoria.',
            token: token
        });

    } catch (error) {
        res.status(500).json({error: 'No se pudo hacer login.'})
    }
}

async function editUser(req, res) {
    try {
        const {id, Cedula, Nombre, Contraseña} = req.body;

        const editUser = await userService.editUser(Cedula, Nombre, Contraseña, id);

        res.status(200).json({editUser});

    } catch (error) {
        res.status(500).json({error: 'No se pudo traer los resultados'});
    }
}

async function getTableros(req, res){
    try {
        const {user} = req.header;
        const tableros = await userService.getTableros(user);
        
        res.status(200).json({
            tableros: tableros
        });
    } catch (error) {
        res.status(500).json({error: 'No se pudo traer los resultados'});
    }
}

module.exports = {
                    login, 
                    register, 
                    getTableros,
                    editUser
                };