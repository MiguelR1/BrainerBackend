const db = require('../config/bd');
const bcrypt = require('bcrypt');

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

async function authLogin(Cedula, Contraseña){
    const [user] = await db.execute('SELECT Id, Nombre from usuario WHERE Cedula = ? AND Contraseña = ?', [Cedula, Contraseña]);
    return user[0];
}

async function register(Nombre, Cedula, Contraseña){
    const [newUser] = await db.execute("INSERT INTO usuario (Nombre, Cedula, Contraseña) VALUES (?, ?, ?) ", [Nombre, Cedula, await hashearPassword(Contraseña)])
    return newUser;
}

async function getTableros(user){
    const [tableros] = await db.execute("SELECT * FROM tablero WHERE idUser = ?", [user]);
    return tableros;
}

async function getUserByCedula(cedula){
    const [user] = await db.execute("SELECT * FROM usuario WHERE Cedula = ?", [cedula]);
    return user;
}

async function getUserById(id){
    const [user] = await db.execute("SELECT * FROM usuario WHERE id = ?", [id]);
    return user;
}

async function editUser(Cedula, Nombre, Contraseña, id){
    const [user] = await db.execute("UPDATE usuario SET Cedula = ?, Nombre = ?, Contraseña = ? WHERE id = ?", [Cedula, Nombre, Contraseña, id]);
    return user;
}

module.exports = {
                    authLogin, 
                    register, 
                    getTableros,
                    getUserByCedula,
                    getUserById,
                    editUser
                };