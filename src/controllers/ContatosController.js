const db = require('../config/dbConfig');
const token = require('../utils/token');
const notify = require('../controllers/NotificacoesController');
const  responderEmail=require('../utils/ResponderContacto')
const dbPromise = db.promise();
const ContactosController = {

    // Método para cadastrar um novo contato
    cadastrarContacto: async (req, res) => {
        const { mensagem, email ,nome} = req.body;
        if(!mensagem||!email||!nome){
            return res.status(400).json({Mensagem:"Verifique os campos e tente novamente"})
        }
        const insertContacto = 'INSERT INTO contatos ( email,mensagem,nome) VALUES (?,?,?)';
        await dbPromise.query(insertContacto, [email,mensagem,nome]) 
        const notificacao = "Novo contacto recebido do email "+email;
        notify.addNotificacao(notificacao,0);   
        return res.status(200).json({ mensagem: 'Contacto adicionado com sucesso' });
      
    },
    // Método para listar todos os contatos de um usuário
    listarContactos: async (req, res) => {
        const { accessToken } = req.body;

        if (token.usuarioTipo(accessToken)!=0||!(await token.verificarTokenUsuario(accessToken))) {
            return res.status(401).json({ mensagem: 'Tokens inválidos' });
        }

        const selectQuery = 'SELECT * FROM contatos ';
        const [contatos] =await dbPromise.query(selectQuery) 
         
        return res.status(200).json({ contatos: contatos });
    },
    // Método para obter um contato por ID
    obterContactoPorId: async (req, res) => {
        const { accessToken ,id_contato} = req.body;

        if (token.usuarioTipo(accessToken)!=0||!(await token.verificarTokenUsuario(accessToken))) {
            return res.status(401).json({ mensagem: 'Tokens inválidos' });
        }

        const selectQuery = 'SELECT * FROM contatos where id_contato = ?';
        const [contatos] =await dbPromise.query(selectQuery,id_contato) 
         
        return res.status(200).json({ contato: contatos[0] });
    },
    // Método para eliminar um contato
    eliminarContactoPeloId: async (req, res) => {
        const { accessToken ,id_contato} = req.body;

        if (token.usuarioTipo(accessToken)!=0||!(await token.verificarTokenUsuario(accessToken))) {
            return res.status(401).json({ mensagem: 'Tokens inválidos' });
        }

        const selectQuery = 'SELECT * FROM contatos where id_contato = ?';
        const [contatos] =await dbPromise.query(selectQuery,id_contato) 
         
        return res.status(404).json({ contato: contatos[0] });
    },
    responderUsuario:async (req,res)=>{

        const { accessToken, conteudo,email } = req.body;

        if(!await token.verificarTokenUsuario(accessToken)||token.usuarioNome(accessToken)!='administarador'){
           return res.status(401).json({Mensagem:"Token não autorizado"})
        }

        if(responderEmail(email,conteudo)){
            return res.status(200).json({Mensagem:"Contacto respondido com sucesso"})
        }else{
            return res.status(400).json({Mensagem:"Erro ao responder Mensagem"})
        }
    }
  
};

module.exports = ContactosController;
