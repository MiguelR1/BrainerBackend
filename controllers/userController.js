const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

const claveSecreta = 'CLAVESECRETA';

async function dameTableros(req, res){

    const {usuario} = req.query;

    try {
        // const tableros = await userService.dameTablero(usuario);
        const tableros = await userService.dameTablero(usuario);

        res.status(200).json({tableros});
    } catch (error) {
        console.error('No se encontraron tableros:',error);
        res.status(500).json({error:'No se encontró ningun tablero.'})
    }
}

async function authLogin(req, res) {
    
    const {usuario, contraseña} = req.body;

    try {
        if (!usuario || !contraseña) {
            res.status(400).json({
                mensaje: "Faltan campos obligatorios"
            })
        }
        const usuarios = await userService.authLogin(usuario, contraseña);

        const token = jwt.sign(
            {id: usuarios.id},
            claveSecreta,
            {expiresIn: '1m'}
        )

        res.status(200).json({
            usuario: usuarios,
            mensaje: "Se ha logeado de forma satisfactoria.",
            token: token
        })

        res.status(200).json({usuarios});
    } catch (error) {
        res.status(500).json({error: "No se pudo hacer login"})
    }
}


module.exports = {dameTableros, authLogin};