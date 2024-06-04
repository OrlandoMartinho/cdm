const db = require('../config/dbConfig');
const token = require('../utils/token');
const dbPromise = db.promise();
const gerarCodigoDeVerificacao=require('../utils/gerarcodigoDeVerificacao')
const notify=require('../controllers/NotificacoesController')
const funeralController = {
    cadastrarFuneral: async (req, res) => {
        const { genero, numero_do_bi, nome_do_responsavel, nome_completo, filiacao, causa_da_morte, data_de_nascimento, data_de_falecimento, data_de_sepultamento, nacionalidade, numero_do_acento_do_obito, parentesco, accessToken } = req.body;
        
        // Verificar se todos os campos obrigatórios estão presentes
        if (!nome_completo || !filiacao || !causa_da_morte || !data_de_falecimento || !data_de_sepultamento || !nacionalidade || !accessToken || !numero_do_acento_do_obito || !numero_do_bi || !nome_do_responsavel) {
            return res.status(400).json({ Mensagem: "Campos incompletos" });
        }
    
        // Verificar o token do usuário
        if (!await token.verificarTokenUsuario(accessToken) || token.usuarioTipo(accessToken) !== 2) {
            return res.status(401).json({ Mensagem: "Token inválido ou usuário não autorizado" });
        }
    
        // Consultar as sepulturas disponíveis
        const selectQuery = 'SELECT * FROM sepulturas WHERE numero_de_lote > 0';
        const [sepulturas] = await dbPromise.query(selectQuery);
        
        // Verificar se existem sepulturas disponíveis
        if (sepulturas.length === 0) {
            return res.status(403).json({ Mensagem: "Sem sepulturas vazias" });
        }
    
        // Gerar o código de verificação (RUPE)
        const rupe = gerarCodigoDeVerificacao();
    
        // Extrair informações da primeira sepultura disponível
        const sepultura = sepulturas[0];
        const id_funeral = sepultura.id_sepultura;
        const localizacao = `quadra nº ${sepultura.quadra}, lote nº ${sepultura.numero_de_lote}`;
    
        // Inserir os dados do funeral no banco de dados
        const createQuery = "INSERT INTO funerais (numero_do_bi, nome_do_responsavel, rupe, id_sepultura, id_usuario, genero, nome_completo, filiacao, causa_da_morte, data_de_nascimento, data_de_falecimento, localizacao, data_de_sepultamento, nacionalidade, numero_do_acento_do_obito, parentesco) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const [insetUser] = await dbPromise.query(createQuery, [numero_do_bi, nome_do_responsavel, rupe, id_funeral, token.usuarioId(accessToken), genero, nome_completo, filiacao, causa_da_morte, data_de_nascimento, data_de_falecimento, localizacao, data_de_sepultamento, nacionalidade, numero_do_acento_do_obito, parentesco]);
    
        // Atualizar o número de lote da sepultura
        const updateQuery = 'UPDATE sepulturas SET numero_de_lote = ? WHERE id_sepultura = ?';
        await dbPromise.query(updateQuery, [sepultura.numero_de_lote - 1, id_funeral]);
    
        // Retornar resposta de sucesso
        return res.status(201).json({ Mensagem: "Funeral cadastrado com sucesso", id_funeral: insetUser.insertId, rupe_gerado: rupe });
    }
    ,
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
            const { accessToken, id_funeral } = req.body;
        
            if (!await token.verificarTokenUsuario(accessToken) || token.usuarioTipo(accessToken) != 0) {
                return res.status(401).json({ mensagem: "Campos incompletos ou acesso não autorizado" });
            }
        
            const [funerais] = await dbPromise.query('SELECT * FROM funerais WHERE id_funeral = ?', [id_funeral]);
        
            if (funerais.length === 0) {
                return res.status(404).json({ mensagem: "Funeral não encontrado" });
            }
        
            notify.addNotificacao("O seu funeral foi cancelado", funerais[0].id_usuario);
        
            const deleteUsuarioQuery = 'DELETE FROM funerais WHERE id_funeral = ?';
            await dbPromise.query(deleteUsuarioQuery, [id_funeral]);
        
            return res.status(200).json({ mensagem: 'Funeral eliminado com sucesso' });
        } catch (err) {
            console.error('Erro ao eliminar funeral:', err);
            return res.status(500).json({ mensagem: 'Erro interno do servidor ao eliminar funeral' });
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
            if(!await token.verificarTokenUsuario(accessToken)||token.usuarioTipo(accessToken)!=2){
                return res.status(401).json({ Mensagem: "Campos incompletos" });
            }

            const rupe = gerarCodigoDeVerificacao();
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
