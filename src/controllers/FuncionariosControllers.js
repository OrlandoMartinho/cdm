const db = require('../config/dbConfig');
const token = require('../utils/token');
const dbPromise = db.promise();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const UsersController = {
    cadastrarFuncionarios: async (req, res) => {
        const {senha, email, data_de_ingresso,cargo,nome, genero,data_de_nascimento,accessToken  } = req.body;
        // Verificar se todos os campos obrigatórios estão presentes
        if (!senha||!nome || !genero || !email || !data_de_nascimento ||!data_de_ingresso||!cargo||!accessToken) {
            return res.status(400).json({ Mensagem: "Campos incompletos" });
        }

        if(!await token.verificarTokenUsuario(accessToken)||token.usuarioTipo(accessToken)!=0){
            return res.status(401).json({ Mensagem: "Campos incompletos" });
        }
        const selectQuery='SELECT * FROM  usuarios  WHERE  email = ?'
     
        const [usersResults] = await dbPromise.query(selectQuery,[email]);
         

         if(usersResults.length>0){
            return res.status(403).json({Mensagem:"Funcionário já está cadastrado"}) 
        }
        const senhaEncriptada = await bcrypt.hashSync(senha, salt);
        const createQuery = "INSERT INTO usuarios (senha,tipo,email, data_de_ingresso,cargo,nome, genero,data_de_nascimento) VALUES (?, ?, ?, ?, ?,?)";                
        const [insetUser]=await  dbPromise.query(createQuery,[senhaEncriptada,2,email, data_de_ingresso,cargo,nome, genero,data_de_nascimento])                              
        return res.status(201).json({ Mensagem: "Funcionario cadastrado com sucesso",id_funcionario:insetUser.insertId});
    },
    editarFuncionario:async(req,res)=>{

        const { senha,email, data_de_ingresso,cargo,nome, genero,data_de_nascimento,accessToken ,id_funcionario } = req.body;
        // Verificar se todos os campos obrigatórios estão presentes
        if (!senha||!nome || !genero || !email || !data_de_nascimento ||!data_de_ingresso||!cargo||!accessToken) {
            return res.status(400).json({ Mensagem: "Campos incompletos" });
        }
        const senhaEncriptada = await bcrypt.hashSync(senha, salt);
        if(!await token.verificarTokenUsuario(accessToken)||token.usuarioTipo(accessToken)==2){
            return res.status(401).json({ Mensagem: "Campos incompletos" });
        }

        const updateQuery1 = 'UPDATE usuarios SET senha=?,email=?, data_de_ingresso=?,cargo=?,nome=?, genero=?,data_de_nascimento=? WHERE id_usuario = ?';
        await dbPromise.query(updateQuery1,[senhaEncriptada,email, data_de_ingresso,cargo,nome, genero,data_de_nascimento,id_funcionario])
        return res.status(201).json({ Mensagem: "Edição bem sucedida" });   
                    
    },
    obterTodosFuncionarios:async(req,res)=>{
        const {accessToken} = req.body
        if(!accessToken){
            return res.status(400).json({mensagem:"Token não fornecido"})
        }
      
        if(!await token.verificarTokenUsuario(accessToken)||token.usuarioTipo(accessToken)!=0){
            return res.status(401).json({ Mensagem: "Campos incompletos" });
        }
        const selectQuery2 = "SELECT * FROM usuarios WHERE tipo = 1";
        const [usersResults] =await dbPromise.query(selectQuery2)       
        return res.status(200).json({funcionarios:usersResults})
    },
    eliminarFuncionarios: async (req, res) => {
        try {
            const { accessToken,id_funcionario } = req.body;
            if(!await token.verificarTokenUsuario(accessToken)||token.usuarioTipo(accessToken)!=0){
                return res.status(401).json({ Mensagem: "Campos incompletos" });
            }
            const deleteUsuarioQuery = 'DELETE FROM usuarios WHERE id_usuario = ?';
            const deleteResults=await dbPromise.query(deleteUsuarioQuery, [id_funcionario]) 
            return  res.status(200).json({ mensagem: 'funcionario eliminado com sucesso' });
        } catch (err) {
           console.error('Erro ao eliminar usuário:', err);
           return res.status(500).json({ mensagem: 'Erro interno do servidor ao eliminar usuário' });
        }
    },
    obterFuncionarioPorID: async (req, res) => {
        try {
            const { accessToken } = req.body;
            if(!await token.verificarTokenUsuario(accessToken)||token.usuarioTipo(accessToken)!=1){
                return res.status(401).json({ Mensagem: "Campos incompletos" });
            }
            const deleteUsuarioQuery = 'SELECT * FROM usuarios WHERE id_usuario = ?';
            const deleteResults=await dbPromise.query(deleteUsuarioQuery, [token.usuarioId(accessToken)]) 
            return  res.status(200).json({ mensagem:  deleteResults[0] });
        } catch (err) {
           console.error('Erro ao eliminar usuário:', err);
           return res.status(500).json({ mensagem: 'Erro interno do servidor ao eliminar usuário' });
        } 
    }
}




module.exports = UsersController;
