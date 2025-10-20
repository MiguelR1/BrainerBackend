const dbPool = require('../config/db');

async function dameTablero(usuario){
    const [rows] = await dbPool.execute('SELECT nombre, Descripcion FROM tablero WHERE idUsuario = ?', [usuario]);
    return rows;
}

async function authLogin(usuario, contraseña){
    const [usuarios] = await dbPool.execute("select * from USUARIOS WHERE usuario = ? AND contraseña = ?", [usuario, contraseña]);

    return usuarios[0];
}

module.exports = {dameTablero, authLogin};