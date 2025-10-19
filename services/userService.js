const dbPool = require('../config/db');

async function dameTablero(usuario){
    const [rows] = await dbPool.execute('SELECT nombre, Descripcion FROM tablero WHERE idUsuario = ?', [usuario]);
    return rows;
}

module.exports = {dameTablero};