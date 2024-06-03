const db = require('../config/dbConfig');
const token = require('../utils/token');
const dbPromise = db.promise();
const gerarCodigoDeVerificacao=require('../utils/gerarcodigoDeVerificacao')
const notify=require('../controllers/NotificacoesController')
const funeralController = {
    cadastrarFuneral: async (req, res) => {
        const {nome_completo,filiacao,causa_da_morte,data_de_falecimento,localizacao,data_de_sepultamento ,nacionalidade,accessToken} = req.body;
        // Verificar se todos os campos obrigatórios estão presentes
        if (!nome_completo||!filiacao||!causa_da_morte||!data_de_falecimento||!localizacao||!data_de_sepultamento ||!nacionalidade||!accessToken) {
            return res.status(400).json({ Mensagem: "Campos incompletos" });
        }

        if(!await token.verificarTokenUsuario(accessToken)||token.usuarioTipo(accessToken)!=2){
            return res.status(401).json({ Mensagem: "Campos incompletos" });
        }
        const selectQuery='SELECT * FROM  sepulturas  WHERE  numero_de_lote > 0 ?'
     
        const [usersResults] = await dbPromise.query(selectQuery);
         
        if(usersResults.length==0){
            return res.status(403).json({Mensagem:"Sem sepulturas vazias "}) 
        }

        const rupe = gerarCodigoDeVerificacao;
        const id_usuario =token.usuarioId(accessToken)
        const id_funeral=usersResults[0].id_funeral
        const createQuery = "INSERT INTO usuarios (rupe,id_funeral,id_usuario,nome_completo,filiacao,causa_da_morte,data_de_falecimento,localizacao,data_de_sepultamento ,nacionalidade) VALUES (?, ?, ?, ?, ?,?,?,?,?)";                
        const [insetUser]=await  dbPromise.query(createQuery,[rupe,id_funeral,id_usuario,nome_completo,filiacao,causa_da_morte,data_de_falecimento,localizacao,data_de_sepultamento ,nacionalidade])                              
        const updateQuery='UPDATE sepulturas SET numero_de_lote = ? where id_funeral = ?'
        await dbPromise.query(updateQuery,usersResults[0].numero_de_lote-1,id_funeral) 
        return res.status(201).json({ Mensagem: "Funeral cadastrado com sucesso",id_funeral:insetUser.insertId,rupe_gerado:rupe});                             
    },
    obterTodosFunerais:async(req,res)=>{
        const {accessToken} = req.body
        if(!accessToken){
            return res.status(400).json({mensagem:"Token não fornecido"})
        }
      
        if(!await token.verificarTokenUsuario(accessToken)||token.usuarioTipo(accessToken)==2){
            return res.status(401).json({ Mensagem: "Campos incompletos" });
        }
        const selectQuery2 = "SELECT * FROM funerais";
        const [usersResults] =await dbPromise.query(selectQuery2)       
        return res.status(200).json({funerais:usersResults})
    },
    obterTodosFuneraisUsuarios:async(req,res)=>{
        const {accessToken} = req.body
        if(!accessToken){
            return res.status(400).json({mensagem:"Token não fornecido"})
        }
      
        if(!await token.verificarTokenUsuario(accessToken)||token.usuarioTipo(accessToken)!=2){
            return res.status(401).json({ Mensagem: "Campos incompletos" });
        }
        const selectQuery2 = "SELECT * FROM funerais where id_usuario = ?";
        const [usersResults] =await dbPromise.query(selectQuery2,token.usuarioId(accessToken))       
        return res.status(200).json({funerais:usersResults})
    },
    eliminarFuneral: async (req, res) => {
        try {
            const { accessToken,id_funeral } = req.body;
            if(!await token.verificarTokenUsuario(accessToken)||token.usuarioTipo(accessToken)!=0){
                return res.status(401).json({ Mensagem: "Campos incompletos" });
            }
            const deleteUsuarioQuery = 'DELETE FROM funerais WHERE id_funeral = ?';
            const deleteResults=await dbPromise.query(deleteUsuarioQuery, [id_funeral]) 
            const [funerais]=await dbPromise.query('SELECT * FROM funerais where id_funeral = ?', [id_funeral])
            notify.addNotificacao("O seu funeral foi cancelado ",funerais[0].id_usuario) 
            return  res.status(200).json({ mensagem: 'Funeral eliminado com sucesso' });
        } catch (err) {
           console.error('Erro ao eliminar usuário:', err);
           return res.status(500).json({ mensagem: 'Erro interno do servidor ao eliminar usuário' });
        }
    },
    confirmarFuneral: async (req, res) => {
        try {
            const { accessToken,id_funeral } = req.body;
            if(!await token.verificarTokenUsuario(accessToken)||token.usuarioTipo(accessToken)!=1){
                return res.status(401).json({ Mensagem: "Campos incompletos" });
            }
            const deleteUsuarioQuery = 'UPDATE funerais SET agendado =1 WHERE id_funeral = ?';
            const deleteResults=await dbPromise.query(deleteUsuarioQuery, [id_funeral]) 
            const [funerais]=await dbPromise.query('SELECT * FROM funerais where id_funeral = ?', [id_funeral])
            notify.addNotificacao("O seu funeral foi aprovado ",funerais[0].id_usuario) 
            return  res.status(200).json({ mensagem: 'Funeral confirmado com sucesso' });
        } catch (err) {
           console.error('Erro ao eliminar usuário:', err);
           return res.status(500).json({ mensagem: 'Erro interno do servidor ao eliminar usuário' });
        }
    },  
    legalizarFuneral: async (req, res) => {
        try {
            const { accessToken,id_funeral } = req.body;
            if(!await token.verificarTokenUsuario(accessToken)||token.usuarioTipo(accessToken)!=1){
                return res.status(401).json({ Mensagem: "Campos incompletos" });
            }
            const rupe = gerarCodigoDeVerificacao;
            const deleteUsuarioQuery = 'UPDATE funerais SET legalizado =1,rupe = ? WHERE id_funeral = ?';
            const deleteResults=await dbPromise.query(deleteUsuarioQuery, [rupe,id_funeral]) 
            notify.addNotificacao("Novo pedido de legalizacão id_funeral:",id_funeral,0) 
            return  res.status(200).json({ mensagem: 'Pedido feito com sucesso',rupe_gerado:rupe});
        } catch (err) {
           console.error('Erro ao eliminar usuário:', err);
           return res.status(500).json({ mensagem: 'Erro interno do servidor ao eliminar usuário' });
        }
    },
    aprovarlegalizarFuneral: async (req, res) => {
        try {
            const { accessToken,id_funeral } = req.body;
            if(!await token.verificarTokenUsuario(accessToken)||token.usuarioTipo(accessToken)!=1){
                return res.status(401).json({ Mensagem: "Campos incompletos" });
            }
            const deleteUsuarioQuery = 'UPDATE funerais SET legalizado =2 WHERE id_funeral = ?';
            const deleteResults=await dbPromise.query(deleteUsuarioQuery, [id_funeral]) 
            const [funerais]=await dbPromise.query('SELECT * FROM funerais where id_funeral = ?', [id_funeral])
            notify.addNotificacao("O seu funeral foi legalizado com sucesso ",funerais[0].id_usuario) 
            return  res.status(200).json({ mensagem: 'Funeral legalizado  com sucesso' });
        } catch (err) {
           console.error('Erro ao eliminar usuário:', err);
           return res.status(500).json({ mensagem: 'Erro interno do servidor ao eliminar usuário' });
        }
    }
    ,
    adiarFuneral: async (req, res) => {
        try {
            const { accessToken,id_funeral ,data_de_sepultamento} = req.body;
            if(!await token.verificarTokenUsuario(accessToken)||token.usuarioTipo(accessToken)!=1){
                return res.status(401).json({ Mensagem: "Campos incompletos" });
            }

            const rupe = gerarCodigoDeVerificacao;
            const deleteUsuarioQuery = 'UPDATE funerais SET adiar = 0,rupe = ?,data_de_sepultamento = ? WHERE id_funeral = ?';
            const deleteResults=await dbPromise.query(deleteUsuarioQuery, [rupe,data_de_sepultamento,id_funeral]) 
            const [funerais]=await dbPromise.query('SELECT * FROM funerais where id_funeral = ?', [id_funeral])
            notify.addNotificacao("Novo pedido de adiamento de funeral ",0) 
            return  res.status(200).json({mensagem:'Funeral adiado com sucesso',rupe_gerado:rupe});
        } catch (err) {
           console.error('Erro ao eliminar usuário:', err);
           return res.status(500).json({ mensagem: 'Erro interno do servidor ao eliminar usuário' });
        }
    },
    aprovarAdiarFuneral: async (req, res) => {
        try {
            const { accessToken,id_funeral ,data_de_sepultamento} = req.body;
            if(!await token.verificarTokenUsuario(accessToken)||token.usuarioTipo(accessToken)!=1){
                return res.status(401).json({ Mensagem: "Campos incompletos" });
            }

            const rupe = gerarCodigoDeVerificacao;
            const deleteUsuarioQuery = 'UPDATE funerais SET adiar = 1,rupe = ?,data_de_sepultamento = ? WHERE id_funeral = ?';
            const deleteResults=await dbPromise.query(deleteUsuarioQuery, [rupe,data_de_sepultamento,id_funeral]) 
            const [funerais]=await dbPromise.query('SELECT * FROM funerais where id_funeral = ?', [id_funeral])
            notify.addNotificacao("O seu adiamento de funeral foi aprovado",funerais[0].id_usuario) 
            return  res.status(200).json({mensagem:'Funeral adiado com sucesso',rupe_gerado:rupe});
        } catch (err) {
           console.error('Erro ao eliminar usuário:', err);
           return res.status(500).json({ mensagem: 'Erro interno do servidor ao eliminar usuário' });
        }
    }
    
}




module.exports = funeralController;
