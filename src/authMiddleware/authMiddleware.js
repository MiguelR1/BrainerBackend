// authMiddleware.js

const jwt = require('jsonwebtoken');

// ⚠️ Usa la misma clave secreta que usaste para firmar el token.
const CLAVE_SECRETA = 'Tu_Clave_Secreta_Muy_Larga_Y_Compleja_Aqui'; 

const verificarJWT = (req, res, next) => {
    // 1. Obtener la cabecera de autorización
    const token = req.headers['authorization'];
    
    // 2. Verificar el Token
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. No hay token proporcionado.' });
    }

    try {
        // La función verify() comprueba la firma y la expiración (campo 'exp')
        const payloadDecodificado = jwt.verify(token, CLAVE_SECRETA);
        
        // 3. Si es exitoso, adjuntar la información del usuario a la solicitud (req)
        // Esto permite a las rutas protegidas acceder a datos como req.usuario.id
        req.token = payloadDecodificado; 
        
        // Continuar con la siguiente función (la ruta final o el siguiente middleware)
        next(); 
    } catch (error) {
        // 4. Manejar Errores (Token Inválido o Expirado)
        
        // Si el token ha expirado, jwt.verify lanza un error específico.
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado. Por favor, vuelva a iniciar sesión.' });
        }
        
        // Manejar cualquier otro error de verificación (firma inválida, formato incorrecto, etc.)
        return res.status(401).json({ error: 'Token inválido o corrupto.' });
    }
};

module.exports = verificarJWT;