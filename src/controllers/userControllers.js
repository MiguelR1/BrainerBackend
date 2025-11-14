const userService = require('../services/userService');

const jwt = require('jsonwebtoken');

const CLAVE_SECRETA = 'Tu_Clave_Secreta_Muy_Larga_Y_Compleja_Aqui';

const bcrypt = require('bcrypt');


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
        
        const userFind = await userService.getUserByCedula(Cedula);
        
        const passwordMatch = await bcrypt.compare(Contraseña, userFind[0].Contraseña);

        if (!passwordMatch) {res.status(400).json({error: 'La cedula o la contraseña son incorrectas.'})}

        // const userFind = await userService.authLogin(Cedula, Contraseña, userFind[0].Contraseña);
        
        const token = jwt.sign(
            // PAYLOAD: Solo datos NO sensibles
            { id: userFind.Id, Nombre: userFind.Nombre }, // Asumiendo que 'user' tiene 'id', 'rol' y 'Cedula'
            CLAVE_SECRETA, 
            { expiresIn: '30m' }
        );

        // 3. Enviar el token y el mensaje de éxito en la respuesta
        res.status(200).json({
            // Puedes incluir datos básicos del usuario, pero el token es la clave.
            id: userFind.Id,
            usuario: userFind.Nombre, 
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

        if (!id || !Cedula || !Nombre || !Contraseña) {
            return res.status(400).json({error: 'Faltan datos obligatorios.'});
        }

        const getUser = await userService.getUserById(id);
        if (getUser.length === 0) {
            return res.status(404).json({error: 'Usuario no encontrado'});
        }else{
            const editUser = await userService.editUser(Cedula, Nombre, Contraseña, id);
            res.status(200).json({Mensaje:"Usuario editado con éxito",idUsuario: id});
        }
    } catch (error) {
        res.status(500).json({error: 'No se pudo traer los resultados', mensaje: error.message, req: req.body});
    }
}

async function getUsers(req, res){
    try {
        const users = await userService.getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({error: 'No se pudo traer los resultados'});
    }
}

async function getUserById(req, res){
    try {
        const {id} = req.query;

        if (!id) {
            return res.status(400).json({error: 'Faltan datos obligatorios.'});
        }

        const user = await userService.getUserById(id);

        if (!user) {
            return res.status(404).json({error: 'Usuario no encontrado'});
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error: 'No se pudo traer los resultados'});
    }
}

async function deleteUser(req, res){
    try {
        const {id} = req.query;

        const getUser = await userService.getUserById(id);

        if (getUser.length === 0) {
            return res.status(404).json({error: 'Usuario no encontrado'});
        }else{
            const deleteUser = await userService.deleteUser(id);
            res.status(200).json({Mensaje: 'Usuario eliminado con éxito', idUsuario: id})
        }
    } catch (error) {
        res.status(500).json({error: 'No se pudo traer los resultados'});
    }
}

// Tableros

async function getTableros(req, res){
    try {
        const {user} = req.query;

        if (!user) {
            return res.status(400).json({error: 'Falta el usuario.'});
        }else{
            const tableros = await userService.getTableros(user);
            return res.status(200).json({ Tableros: tableros });
        }
    } catch (error) {
        return res.status(500).json({error: 'No se pudo traer los resultados'});
    }
}

async function createTablero(req, res){
    try {
        const {nombre, descripcion, imagen, idUser} = req.body;
        
        // res.status(200).json({nombre, descripcion, imagen, idUser})
        
        if (!nombre || !descripcion || !imagen || !idUser) {
            return res.status(400).json({error: 'Faltan datos obligatorios.'});
        }

        const user = await userService.getUserById(idUser);
        
        if (!user) {
            return res.status(404).json({error: 'Usuario no encontrado'});
        }
        
        const newTablero = await userService.createTablero(nombre, descripcion, imagen, idUser);

        res.status(200).json({Mensaje: 'Tablero creado con éxito', idTablero: newTablero.insertId});
    } catch (error) {
        res.status(500).json({error: 'No se pudo crear el tablero'});
    }
}

async function getTableroById(req, res){
    try {
        const {idTablero} = req.query;

        if (!idTablero) {
            return res.status(400).json({error: 'Faltan datos obligatorios.'});
        }

        const tablero = await userService.getTableroById(idTablero);

        if (!tablero) {
            return res.status(404).json({error: 'Tablero no encontrado'});
        }

        res.status(200).json(tablero);
    } catch (error) {
        res.status(500).json({error: 'No se pudo traer los resultados'});
    }
}

async function deleteTablero(req, res){
    try {
        const {idTablero} = req.query;

        if (!idTablero) {
            return res.status(400).json({error: 'Faltan datos obligatorios.'});
        }

        const tablero = await userService.getTableroById(idTablero);

        if (!tablero) {
            return res.status(404).json({error: 'Tablero no encontrado'});
        }

        await userService.deleteTablero(idTablero);
        res.status(200).json({Mensaje: 'Tablero eliminado con éxito', idTablero: idTablero});
    } catch (error) {
        res.status(500).json({error: 'No se pudo eliminar el tablero'});
    }
}

async function editTablero(req, res){
    try {
        const {idTablero, nombreTablero, descripcion, imagen, idUser} = req.body;

        if (!idTablero || !nombreTablero || !idUser || !descripcion || !imagen) {
            return res.status(400).json({error: 'Faltan datos obligatorios.'});
        }

        const user = await userService.getUserById(idUser);
        const tablero = await userService.getTableroById(idTablero);

        if (!user) {
            return res.status(404).json({error: 'Usuario no encontrado'});
        }

        if (!tablero) {
            return res.status(404).json({error: 'Tablero no encontrado'});
        }

        await userService.editTablero(idTablero, nombreTablero, descripcion, imagen, idUser);
        res.status(200).json({Mensaje: 'Tablero editado con éxito', idTablero: idTablero});
    } catch (error) {
        res.status(500).json({error: 'No se pudo editar el tablero'});
    }
}

// Tareas

async function createTarea(req, res){
    try {
        const { nombre, descripcion, image, status, idTablero } = req.body;

        if (!nombre || !descripcion || !image || !status || !idTablero) {
            return res.status(400).json({ error: 'Faltan datos obligatorios.' });
        }

        const tablero = await userService.getTableroById(idTablero);
        
        if (!tablero) {
            return res.status(404).json({ error: 'Tablero no encontrado' });
        }else{
            const newTarea = await userService.createTarea(nombre, descripcion, image, status, idTablero);
            res.status(201).json({ Mensaje: 'Tarea creada con éxito', idTarea: newTarea.insertId });
        }

    } catch (error) {
        res.status(500).json({ error: 'No se pudo crear la tarea' });
    }
}

async function getTareasByTablero(req, res){
    try {
        const { idTablero } = req.query;

        if (!idTablero) {
            return res.status(400).json({ error: 'Faltan datos obligatorios.' });
        }

        const tareas = await userService.getTareasByTablero(idTablero);

        if (!tareas || tareas.length === 0) {
            return res.status(404).json({ error: 'No se encontraron tareas para este tablero.' });
        }

        res.status(200).json({Tareas: tareas});
    } catch (error) {
        res.status(500).json({ error: 'No se pudo obtener las tareas.' });
    }
}

async function getTareaById(req, res){
    try {
        const {idTarea} = req.query;

        if (!idTarea) {
            return res.status(400).json({error: 'Faltan datos obligatorios.'});
        }

        const tarea = await userService.getTareaById(idTarea);

        if (!tarea) {
            return res.status(404).json({error: 'Tarea no encontrada'});
        }

        res.status(200).json({Tarea: tarea});
    } catch (error) {
        res.status(500).json({error: 'No se pudo obtener la tarea.'});
    }
}

async function deleteTarea(req, res){
    try {
        const {idTarea} = req.query;

        if (!idTarea) {
            return res.status(400).json({error: 'Faltan datos obligatorios.'});
        }

        const tarea = await userService.getTareaById(idTarea);

        if (!tarea) {
            return res.status(404).json({error: 'Tarea no encontrada'});
        }

        await userService.deleteTarea(idTarea);
        res.status(200).json({Mensaje: 'Tarea eliminada con éxito', idTarea: idTarea});
    } catch (error) {
        res.status(500).json({error: 'No se pudo eliminar la tarea'});
    }
}

async function editTarea(req, res){
    try {
        const {idTarea, nombre, descripcion, image, status, idTablero} = req.body;

        if (!idTarea || !nombre || !descripcion || !image || !status || !idTablero) {
            return res.status(400).json({error: 'Faltan datos obligatorios.'});
        }

        const tarea = await userService.getTareaById(idTarea);

        if (!tarea) {
            return res.status(404).json({error: 'Tarea no encontrada'});
        }

        await userService.editTarea(idTarea, nombre, descripcion, image, status, idTablero);
        res.status(200).json({Mensaje: 'Tarea editada con éxito', idTarea: idTarea});
    } catch (error) {
        res.status(500).json({error: 'No se pudo editar la tarea'});
    }
}

module.exports = {
    // Funciones de usuario
                    login, 
                    register, 
                    editUser,
                    deleteUser,
                    getUsers,
                    getUserById,
    // Funciones de tableros
                    getTableros,
                    createTablero,
                    getTableroById,
                    deleteTablero,
                    editTablero,
    // Funciones de tareas
                    createTarea,
                    getTareasByTablero,
                    getTareaById,
                    deleteTarea,
                    editTarea
                };