const db = require('../config/bd');
const bcrypt = require('bcrypt');

//Funciones de user

async function hashearPassword(passwordEnTextoPlano) {
  const saltRounds = 10;
  try {
    const hash = await bcrypt.hash(passwordEnTextoPlano, saltRounds);
    return hash;
  } catch (error) {
    console.error('Error al hashear la contraseña:', error);
    throw error;
  }
}

async function verifyPassword(password, hash) {
    const passwordMatch = await bcrypt.compare(password, hash);
    return passwordMatch;
}

async function authLogin(Cedula, Contraseña){
    const [user] = await db.execute('SELECT Id, Nombre from usuario WHERE Cedula = ? AND Contraseña = ?', [Cedula, password]);
    return user[0];
}

async function register(Nombre, Cedula, Contraseña){
    const [newUser] = await db.execute("INSERT INTO usuario (Nombre, Cedula, Contraseña) VALUES (?, ?, ?) ", [Nombre, Cedula, await hashearPassword(Contraseña)])
    return newUser;
}

async function getUserByCedula(cedula){
    const [user] = await db.execute("SELECT * FROM usuario WHERE Cedula = ?", [cedula]);
    return user;
}

async function getUserById(id){
    const [user] = await db.execute("SELECT * FROM usuario WHERE Id = ?", [id]);
    return user[0];
}

async function getUsers(){
    const [users] = await db.execute("SELECT * FROM usuario");
    return users;
}

async function editUser(Cedula, Nombre, Contraseña, id){
    const [user] = await db.execute("UPDATE usuario SET Cedula = ?, Nombre = ?, Contraseña = ? WHERE Id = ?", [Cedula, Nombre, await hashearPassword(Contraseña), id]);
    return user;
}

async function deleteUser(id){
    const [userDeleted] = await db.execute("DELETE FROM usuario WHERE Id = ?", [id]);
    return userDeleted;
}

// Tableros

async function getTableros(user){
    const [tableros] = await db.execute("SELECT * FROM tablero WHERE idUser = ?", [user]);
    return tableros;
}

async function createTablero(nombreTablero, descripcionTablero, imagenTablero, idUser){
    const [newTablero] = await db.execute("INSERT INTO tablero (Nombre, descripcion, imagen, idUser) VALUES (?, ?, ?, ?)", [nombreTablero, descripcionTablero, imagenTablero, idUser]);
    return newTablero;
}

async function getTableroById(idTablero){
    const [tablero] = await db.execute("SELECT * FROM tablero WHERE Id = ?", [idTablero]);
    return tablero[0];
}

async function deleteTablero(idTablero){
    const [tableroDeleted] = await db.execute("DELETE FROM tablero WHERE Id = ?", [idTablero]);
    return tableroDeleted;
}

async function editTablero(idTablero, nombreTablero, descripcionTablero, imagenTablero, idUser){
    const [tablero] = await db.execute("UPDATE tablero SET Nombre = ?, descripcion = ?, imagen = ?, idUser = ? WHERE Id = ?", [nombreTablero, descripcionTablero, imagenTablero, idUser, idTablero]);
    return tablero;
}

// Funciones de tareas

async function createTarea(nombre, descripcion, image, status, idTablero){
    const [newTarea] = await db.execute("INSERT INTO tareadescrip (Nombre, Descripcion, Image, idStatus, idTablero) VALUES (?, ?, ?, ?, ?)", [nombre, descripcion, image, status, idTablero]);
    return newTarea;
}

async function getTareasByTablero(idTablero){
    const [tareas] = await db.execute("SELECT * FROM tareadescrip WHERE idTablero = ?", [idTablero]);
    return tareas;
}

async function getTareaById(idTarea){
    const [tarea] = await db.execute("SELECT * FROM tareadescrip WHERE Id = ?", [idTarea]);
    return tarea[0];
}

async function deleteTarea(idTarea){
    const [tareaDeleted] = await db.execute("DELETE FROM tareadescrip WHERE Id = ?", [idTarea]);
    return tareaDeleted;
}

async function editTarea(idTarea, nombre, descripcion, image, status, idTablero){
    const [tarea] = await db.execute("UPDATE tareadescrip SET Nombre = ?, Descripcion = ?, Image = ?, idStatus = ?, idTablero = ? WHERE Id = ?", [nombre, descripcion, image, status, idTablero, idTarea]);
    return tarea;
}

module.exports = {
    // Funciones de usuario
                    authLogin, 
                    verifyPassword,
                    register, 
                    getUserByCedula,
                    getUserById,
                    editUser,
                    deleteUser,
                    getUsers,
    // Funciones de tableros
                    getTableros,
                    createTablero,
                    getTableroById,
                    deleteTablero,
                    editTablero,
    // Funciones de tareas
                    createTarea,
                    getTareaById,
                    getTareasByTablero,
                    deleteTarea,
                    editTarea
                };