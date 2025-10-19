const userService = require('../services/userService');

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


module.exports = {dameTableros};