const db = require('../config/dbConfig');
const token = require('../utils/token');
const notify = require('../controllers/NotificacoesController');
const enviarEmail=require('../utils/notificarUsuarioNoEmail')
const regexTime = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
const ConsultasController = {

    cadastrarConsulta: async (req, res) => {
        const {accessToken, especialidade,data_da_consulta,nome,email,numero} = req.body;
        let id_usuario=token.usuarioId(accessToken)
        console.log(id_usuario)
       if(id_usuario===null){
         id_usuario = -1
       }

       if(!especialidade||!data_da_consulta||!nome||!email||!numero){
        console.log("Campos:",especialidade,"-",data_da_consulta,"-",nome,"-",email,"-",numero)
        return res.status(400).json({ mensagem: 'Complete bem os campos' });
       }
    
        const insertConsulta = 'INSERT INTO Consultas ( especialidade,data_da_consulta,nome,email,numero,id_usuario) VALUES (?,?,?,?,?,?)';
    
        db.query(insertConsulta, [ especialidade,data_da_consulta,nome,email,numero, id_usuario], (err, result) => {
            if (err) {
                console.log(err.message)
                return res.status(500).json({ mensagem: 'Erro interno do servidor' });
            }
    
           return res.status(200).json({ mensagem: 'Consulta adicionada com sucesso' });
        });    
    },
    // Método para adicionar um médico à consulta
    confirmarConsulta: async (req, res) => {

        const {accessToken,id_consulta,hora_da_consulta,nome_do_medico}=req.body
        const id_usuario=token.usuarioId(accessToken)
       if(id_usuario!=1||!(await token.verificarTokenUsuario(accessToken)) ){
            return res.status(401).json({ mensagem: 'Tokens inválidos' });
        }
        
            if(!id_consulta||!regexTime.test(hora_da_consulta)){
                res.status(400).json({ error: 'Complete bem os campos' });
                return;
            }
    
        // Verifica se a consulta existe antes de atualizá-la
        const consultaExistente = await new Promise((resolve, reject) => {
            const consultaQuery = 'SELECT * FROM Consultas WHERE id_consulta = ?';
            db.query(consultaQuery, [id_consulta], (err, results) => {
                if (err) {
                    console.log("Erro:"+err.message)
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    
        if (!consultaExistente.length > 0) {
            return res.status(404).json({ mensagem: 'Consulta não encontrada' });
        }
    
        const updateConsulta = 'UPDATE Consultas SET status = ? ,hora_da_consulta = ?,nome_do_medico = ? WHERE id_consulta = ?';
        const email=consultaExistente[0].email
        db.query(updateConsulta, [1, hora_da_consulta,nome_do_medico,id_consulta],async (err, result) => {
            if (err) {
                return res.status(500).json({ mensagem: 'Erro interno do servidor' });
            }
             
            const valor= await enviarEmail(email,hora_da_consulta);
                if(valor){
                    return res.status(200).json({ mensagem: 'Consulta aprovada com sucesso' });
                }else{

                    return res.status(200).json({ mensagem: 'Consulta aprovada com sucesso mas o usuário não foi notificado devido ao erro de conexão a internet' });
                
                }
          
        });    
    }
    ,
    // Método para eliminar consulta pelo ID do usuário ou médico
    eliminarConsultaPeloIdAcessToken: async (req, res) => {
        const {accessToken,id_consulta} = req.body;
        const id_usuario=token.usuarioId(accessToken);
        if(id_usuario==1||!(await token.verificarTokenUsuario(accessToken)) ){
            return res.status(401).json({ mensagem: 'Tokens inválidos' });
        }

         const   deleteConsulta = 'DELETE FROM Consultas WHERE id_consulta = ?';
     
        db.query(deleteConsulta, [id_consulta], (err) => { // Corrigido: passando id_consulta ao invés de id_consulta || id_consulta
            if (err) {
                return res.status(500).json({ mensagem: 'Erro ao eliminar consulta', erro: err });
            }
          return  res.status(200).json({ mensagem: 'Consulta eliminada com sucesso' });
        });
    },
    // Método para obter todas as consultas de um usuário
    obterTodasConsultaPeloTokenUsuario: async (req, res) => {
        const { accessToken } = req.body;
        const id_usuario = token.usuarioId(accessToken);

        if (id_usuario==1||!id_usuario || ! await token.verificarTokenUsuario(accessToken)) {
            return res.status(401).json({ mensagem: 'Token inválido' });
        }

        const selectQuery = 'SELECT * FROM Consultas WHERE id_usuario = ?';
        db.query(selectQuery, id_usuario, (err, result) => {
            if (err) {
                return res.status(500).json({ erro: "Erro ao obter consultas" });
            }

            if (result.length > 0) {
              return res.status(200).json({ Consultas: result });
            } else {
              return  res.status(404).json({ Mensagem: "Sem consultas para este usuário" });
            }
        });
    },
    // Método para obter todas as consultas de um médico
    obterTodasConsultaPeloTokenADM: async (req, res) => {
       
        const {accessToken}=req.body
        const id_usuario=token.usuarioId(accessToken)
        console.log(id_usuario)
       if(id_usuario!=1||!(await token.verificarTokenUsuario(accessToken)) ){
            return res.status(401).json({ mensagem: 'Tokens inválidos' });
        }

        const selectQuery = 'SELECT * FROM Consultas';
        db.query(selectQuery,(err, result) => {
            if (err) {
                return res.status(500).json({ erro: "Erro ao obter consultas" });
            }

            if (result.length > 0) {
              return  res.status(200).json({ Consultas: result });
            } else {
              return  res.status(200).json({ Mensagem: "Sem consultas pendentes" });
            }
        });
    }
    ,obterEspecialidades:async (req,res)=>{


        
        const {accessToken}=req.body
        const id_usuario=token.usuarioId(accessToken)
       if(id_usuario!=1||!(await token.verificarTokenUsuario(accessToken)) ){
            return res.status(401).json({ mensagem: 'Tokens inválidos' });
        }

        const selectQuery = 'SELECT nome FROM usuarios WHERE id_usuarios = ?';
        db.query(selectQuery,[id_usuario],(err, result) => {
            if (err) {
                return res.status(500).json({ erro: "Erro ao obter consultas" });
            }

        
              return  res.status(200).json({ Consultas: result[0].nome.split(",") });
         
        });


    },
    cadastrarEspecialidades:async (req,res)=>{


        
        const {accessToken,especialidade}=req.body
        const id_usuario=token.usuarioId(accessToken)
       if(id_usuario!=1||!(await token.verificarTokenUsuario(accessToken)) ){
            return res.status(401).json({ mensagem: 'Tokens inválidos' });
        }

        const selectQuery = 'UPDATE usuarios SET nome = ? WHERE id_usuario = ?';
        db.query(selectQuery,[,especialidade,id_usuario],(err, result) => {
            if (err) {
                return res.status(500).json({ erro: "Erro ao obter consultas" });
            }

        
              return  res.status(200).json({ Consultas: result[0].nome.split(",") });
         
        });


    }
};

module.exports = ConsultasController;
