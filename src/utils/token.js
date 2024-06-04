const secretKey = require('../private/secretKey.json');
const jwt = require('jsonwebtoken');
const db = require('../config/dbConfig');

const token = {
    usuarioId: (accessToken) => {
        try {
            const decodedToken = jwt.verify(accessToken, secretKey.secretKey)
            if (decodedToken) {
                return decodedToken.id_usuario;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    },
    usuarioTipo: (accessToken) => {
        try {
            const decodedToken = jwt.verify(accessToken, secretKey.secretKey)
            if (decodedToken) {
                return decodedToken.usuarioTipo;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    },
    usuarioEmail: (accessToken) => {
        try {
            const decodedToken = jwt.verify(accessToken, secretKey.secretKey)
            console.log(decodedToken)
            if (decodedToken) {
                return decodedToken.usuarioEmail;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    }
    ,
    usuarioSenha:(accessToken)=>{
        try {
            const decodedToken = jwt.verify(accessToken, secretKey.secretKey)
            if (decodedToken) {
                return decodedToken.senha;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }

    }
    ,
    verificarTokenUsuario: (accessToken) => {
        return new Promise((resolve, reject) => {
            const id_usuario = token.usuarioEmail(accessToken);
            
            const query = 'SELECT token FROM usuarios WHERE email = ?';
            db.query(query, [id_usuario], (err, result) => {
                if (err) {
                    console.error('Erro ao buscar token do usuário:', err);
                    reject(err);
                } else {
                   
                    if (result.length === 0) {
                        resolve(false);
                    } else {
                        const userToken = result[0].token;
                        resolve(userToken === accessToken);
                    }
                }
            });
        });
    }
};

module.exports = token;
