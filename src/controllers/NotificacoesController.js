const db = require('../config/dbConfig');
const token = require('../utils/token');
const dbPromise = db.promise();

const notificacoesController = {
    addNotificacao:async (notificacao,id_usuario) => {
        try {
                const inserirNotificacao = `INSERT INTO notificacoes (descricao,id_usuario) VALUES (?,?)`;
                await dbPromise.query(inserirNotificacao, [notificacao,id_usuario])
                console.log("Nova notificação adicionada com sucesso");  
        } catch (error) {
            console.error('Erro ao decodificar o token do usuário:', error.message);
        }
    },
    obterTodasNotificacoes: async (req, res) => {
        const {accessToken} = req.body
        if(!await token.verificarTokenUsuario(accessToken)){
            return res.status(401).json({mensagem:"Token invalido"})
        }
        const id_usuario = token.usuarioId(accessToken)
        const selectQuery2 = "SELECT * FROM notificacoes where id_usuario = ?";
        const [notificacoesResult]=await dbPromise.query(selectQuery2,id_usuario)
        return res.status(200).json({notificacoes:notificacoesResult})
    },
    apagarTodasNotificacoesDoUsuario: async (req, res) => {
        const {accessToken} = req.body
        if(!await token.verificarTokenUsuario(accessToken)){
            return res.status(401).json({mensagem:"Token invalido"})
        }
        const id_usuario = token.usuarioId(accessToken);
        const deleteQuery='DELETE  FROM notificacoes WHERE id_usuario = ?'
        await dbPromise.query(deleteQuery,id_usuario)
        return res.status(200).json({mensagem:"Notificações eliminadas"})                                                                                      
    }    
};

module.exports = notificacoesController;
