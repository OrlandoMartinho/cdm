const db = require('../config/dbConfig');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = require('../private/secretKey.json');
const token = require('../utils/token');
const gerarCodigoDeVerificacao=require('../utils/gerarcodigoDeVerificacao')
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const notify = require('../controllers/NotificacoesController');
const dbPromise = db.promise();

const UsersController = {
    cadastrarUsuario: async (req, res) => {
        const { email, morada,nome, senha, genero,data_de_nascimento  } = req.body;
        // Verificar se todos os campos obrigatórios estão presentes
        if (!nome || !senha || !genero || !email || !data_de_nascimento ||!morada) {
            return res.status(400).json({ Mensagem: "Campos incompletos" });
        }

        const selectQuery='SELECT * FROM  usuarios  WHERE  email = ?'
     
        const [usersResults] = await dbPromise.query(selectQuery,[email]);
         

         if(usersResults.length>0){
            return res.status(403).json({Mensagem:"Usuário já está cadastrado"}) 
        }

        try {    
            const senhaEncriptada = await bcrypt.hashSync(senha, salt);
            // Inserir o novo usuário na tabela `usuarios`
            const createQuery = "INSERT INTO usuarios (tipo,nome, senha, genero, email, data_de_nascimento,morada) VALUES (?,?, ?, ?, ?,?,?)";
                        
            const [insetUser]=await  dbPromise.query(createQuery,[2,nome, senhaEncriptada, genero,email,data_de_nascimento,morada])
                    
            const [user] = await dbPromise.query(selectQuery,[email]);
            const usuario=user[0] 
            const accessToken = jwt.sign({usuarioEmail:email, id_usuario: usuario.id_usuario,usuarioTipo:usuario.tipo,senha:usuario.senha}, secretKey.secretKey);
            const updateQuery = 'UPDATE usuarios SET token = ? WHERE id_usuario = ?';
            const params = [accessToken,usuario.id_usuario];
            await dbPromise.query(updateQuery, params)    
            const notificacao = "O "+email+" Cadastrou-se na CDM";
            notify.addNotificacao(notificacao,0);                     
            return res.status(201).json({ Mensagem: "Usuário cadastrado com sucesso",accessToken:accessToken,usuarioTipo:2});
              
        } catch (err) {
            console.error({ Erro: err });
            return res.status(500).json({ Mensagem: "Erro interno do servidor", erro: err });
        }
                         
    },
    autenticarUsuario: async (req, res) => {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(403).json({ Mensagem: "Campos incompletos" });
        }
        const selectQuery = "SELECT * FROM usuarios WHERE email = ?";
    try {
        const [usersResults]=await dbPromise.query(selectQuery, [email])

        if(usersResults.length===0){
            return res.status(404).json({ Mensagem: "Usuário não cadastrado" });
        }
        try {
            const usuario =usersResults[0];
            const isPasswordValid = await bcrypt.compareSync(senha, usuario.senha);

            if (!isPasswordValid) {
                return res.status(401).json({ Mensagem: "Senha incorreta" });
            } else {
                const accessToken = jwt.sign({usuarioEmail:email, id_usuario: usuario.id_usuario,usuarioTipo:usuario.tipo,senha:usuario.senha}, secretKey.secretKey);
                const updateQuery = 'UPDATE usuarios SET token = ? WHERE id_usuario = ?';
                const params = [accessToken,usuario.id_usuario];
                await dbPromise.query(updateQuery, params) 
                      
                return res.status(201).json({ Mensagem: "Autenticação bem-sucedida", accessToken :accessToken,usuarioTipo:usuario.tipo});   
           }    

        } catch (err) {
            console.log({ Erro: err });
            return res.status(500).json({ Mensagem: "Erro interno do servidor"});
        }
    } catch (err) {
        console.log({ Erro: err });
        return res.status(500).json({ Mensagem: "Erro interno do servidor"});
    }
    },
    editarUsuario:async(req,res)=>{

        const { accessToken,email,telefone, morada,nome, senha, genero,data_de_nascimento } = req.body;
        console.log(accessToken)
        const tokenValido = await token.verificarTokenUsuario(accessToken);
        if (!tokenValido) {
            return res.status(401).json({ mensagem: 'Token inválido' });
        }
  
        if (!nome || !senha || !genero || !email || !data_de_nascimento||!morada||!telefone) {
            return res.status(400).json({ Mensagem: "Campos incompletos" });
        }

        try {
                        // Encriptar a senha com `bcrypt`
            const id_usuario=token.usuarioId(accessToken)
            const senhaEncriptada = await bcrypt.hashSync(senha, salt);
                        // Inserir o novo usuário na tabela `usuarios`
            const updateQuery1 = 'UPDATE usuarios SET nome=?, senha=?, genero=?, email=?, data_de_nascimento=?,morada = ?,telefone = ? WHERE id_usuario = ?';
            await dbPromise.query(updateQuery1,[nome,senhaEncriptada, genero, email,data_de_nascimento,morada,telefone,id_usuario])
                
            const accessToken2 = jwt.sign({ id_usuario: token.usuarioId(accessToken),usuarioEmail:email,senha:token.usuarioSenha(accessToken),usuarioTipo:2}, secretKey.secretKey);
                                    
            const updateQuery = 'UPDATE usuarios SET token = ? WHERE id_usuario = ?';
                
            const params = [accessToken2, token.usuarioId(accessToken)];
                                
            await dbPromise.query(updateQuery,params)
           
            return res.status(201).json({ Mensagem: "Edição bem sucedida", novo_token:accessToken2 ,usuarioTipo:token.usuarioTipo(accessToken)});   
                    
        } catch (err) {
            console.error({ Erro: err });
            return res.status(500).json({ Mensagem: "Erro interno do servidor", erro: err });
        }

    },
    obterTodosUsuarios:async(req,res)=>{
        const {accessToken} = req.body
        if(!accessToken){
            return res.status(400).json({mensagem:"Token não fornecido"})
        }
        console.log(await token.verificarTokenUsuario(accessToken))
        if(!await token.verificarTokenUsuario(accessToken)||token.usuarioTipo(accessToken)!=0){
            return res.status(401).json({mensagem:"Token inválido"})
        }
        const selectQuery2 = "SELECT * FROM usuarios where tipo = 2";
        const [usersResults] =await dbPromise.query(selectQuery2)       
        return res.status(200).json({usuarios:usersResults})
    },
    eliminarUsuario: async (req, res) => {
        try {
            const { accessToken } = req.body;
            const id_usuario = token.usuarioId(accessToken);
            if (!id_usuario || !await token.verificarTokenUsuario(accessToken)||token.usuarioTipo(accessToken)!=2) {
                return res.status(401).json({ mensagem: 'Token inválido' });
            }
            const deleteUsuarioQuery = 'DELETE FROM usuarios WHERE id_usuario = ?';
            const deleteResults=await dbPromise.query(deleteUsuarioQuery, [id_usuario]) 
            if (deleteResults.affectedRows === 0) {
                return res.status(404).json({ mensagem: 'Usuário não encontrado' });
            }  
            return  res.json({ mensagem: 'Usuário eliminado com sucesso' });
        } catch (err) {
           console.error('Erro ao eliminar usuário:', err);
           return res.status(500).json({ mensagem: 'Erro interno do servidor ao eliminar usuário' });
        }
    },
    obterUsuarioPorAccessToken: async (req, res) => {
        const { accessToken } = req.body;
        console.log(await token.verificarTokenUsuario(accessToken))
        if (!accessToken || ! await (token.verificarTokenUsuario(accessToken))||token.usuarioTipo(accessToken)!=2 ) {
            return res.status(401).json({ mensagem: 'Token inválido' });
        }
        const selectQuery = 'SELECT * FROM usuarios WHERE token = ?';
        const [usuario] =await dbPromise.query(selectQuery, [accessToken]) 
        return  res.status(200).json({ usuario:usuario[0] });   
    },
    obterDashboard: async (req, res) => {
        const { accessToken } = req.body;
        console.log(await token.verificarTokenUsuario(accessToken))
        if (!accessToken || ! await (token.verificarTokenUsuario(accessToken))||token.usuarioTipo(accessToken)==2 ) {
            return res.status(401).json({ mensagem: 'Token inválido' });
        }
        const selectQuery = 'SELECT * FROM usuarios where tipo = 2';
        const selectQueryFuncionarios = 'SELECT * FROM usuarios where tipo = 1';
        const selectQueryFunerais ='SELECT * FROM funerais'
        const selectQuerySepulturas = 'SELECT * FROM sepulturas';
        const [usuario] =await dbPromise.query(selectQuery) 
        const [funcionarios] =await dbPromise.query(selectQueryFuncionarios) 
        const [funerais] =await dbPromise.query(selectQueryFunerais) 
        const [sepulturas] =await dbPromise.query(selectQuerySepulturas) 
        return  res.status(200).json({ usuarios:usuario,funcionarios:funcionarios,funerais:funerais,sepulturas:sepulturas });   
    }
}




module.exports = UsersController;
