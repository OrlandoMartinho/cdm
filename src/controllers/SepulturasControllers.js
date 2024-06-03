const db = require('../config/dbConfig');
const token = require('../utils/token');
const dbPromise = db.promise();

const UsersController = {
    cadastrarSepulturas: async (req, res) => {
        const { quadra	,numero_de_lote,accessToken  } = req.body;
        // Verificar se todos os campos obrigatórios estão presentes
        if (!quadra || !numero_de_lote||!accessToken) {
            return res.status(400).json({ Mensagem: "Campos incompletos" });
        }

        if(!await token.verificarTokenUsuario(accessToken)||token.usuarioTipo(accessToken)!=0){
            return res.status(401).json({ Mensagem: "Campos incompletos" });
        }

        const createQuery = "INSERT INTO sepulturas (quadra,numero_de_lote) VALUES ( ?,?)";                
        const [insetUser]=await  dbPromise.query(createQuery,[quadra,numero_de_lote])                              
        return res.status(201).json({ Mensagem: "Sepultura cadastrada com sucesso",id_sepultura:insetUser.insertId});
                                   
    },
    obterTodasSepulturas:async(req,res)=>{
        const {accessToken} = req.body
        if(!accessToken){
            return res.status(400).json({mensagem:"Token não fornecido"})
        }
      
        if(!await token.verificarTokenUsuario(accessToken)||token.usuarioTipo(accessToken)!=0){
            return res.status(401).json({ Mensagem: "Campos incompletos" });
        }
        const selectQuery2 = "SELECT * FROM sepulturas";
        const [usersResults] =await dbPromise.query(selectQuery2)       
        return res.status(200).json({funcionarios:usersResults})
    },
    obterSepulturaPorID: async (req, res) => {
        try {
            const { accessToken,id_sepultura } = req.body;
            if(!await token.verificarTokenUsuario(accessToken)||token.usuarioTipo(accessToken)!=0){
                return res.status(401).json({ Mensagem: "Campos incompletos" });
            }
            const deleteUsuarioQuery = 'SELECT * FROM sepulturas WHERE id_sepultura = ?';
            const deleteResults=await dbPromise.query(deleteUsuarioQuery, [id_sepultura]) 
            return  res.status(200).json({ mensagem:  deleteResults[0] });
        } catch (err) {
           console.error('Erro ao eliminar usuário:', err);
           return res.status(500).json({ mensagem: 'Erro interno do servidor ao eliminar usuário' });
        } 
    }
}




module.exports = UsersController;
