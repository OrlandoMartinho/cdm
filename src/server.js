const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = require('./private/Port.json');
const db = require('./config/dbConfig');
const jwt = require('jsonwebtoken');
const secretKey=require('./private/secretKey.json');
const path=require('path')
const token = require('./utils/token'); 
const dbPromise=db.promise()

const app = express();

app.use(bodyParser.json());
app.use(cors());




// Importar as rotas
const usersRoutes = require('./routes/UserRoutes');
const notificacoesRoutes = require('./routes/NotificacoesRoutes');
const funcionariosRoutes = require('./routes/FuncionariosRoutes');
const sepulturaRoutes=require('./routes/SepulturasRoutes')
const contatosRoutes=require('./routes/contatosRoutes');
const funeralRoutes =require('./routes/FuneraisRoutes')


// Adicionar rotas
app.use('/usuarios', usersRoutes);
app.use('/notificacoes', notificacoesRoutes);
app.use('/funcionarios', funcionariosRoutes);
app.use('/sepulturas',sepulturaRoutes)
app.use('/contatos',contatosRoutes)
app.use('/funerais',funeralRoutes)
// Iniciar o servidor 
const PORT = process.env.PORT||port.PORT;
const HOST =process.env.HOST||port.HOST

app.use(express.static(path.join(__dirname,'..', 'public'))); 
// Rota para retornar a página HTML
app.post('/', (req, res) => {
  const {accessToken}=req.body
    token.verificarTokenUsuario(accessToken).then(resultado => {
      if(resultado){
        res.status(201).json({mensagem:true,usuarioTipo:token.usuarioTipo(accessToken)})
      }else{
        res.status(201).json({mensagem:false})
      }
     })
    .catch(erro => {
      console.error(erro);
       res.status(500).json({mensagem:"Erro interno do servidor"})
     });

});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'index.html'));
});


app.post('/pesquisar', async (req, res) => {
  const { accessToken, tableName, keyValue } = req.body;

  if (!accessToken) {
      return res.status(400).json({ mensagem: "Token não fornecido" });
  }

  // Verificação do token de acesso
  if (!await token.verificarTokenUsuario(accessToken) || token.usuarioTipo(accessToken) != 0) {
      return res.status(401).json({ mensagem: "Campos incompletos ou acesso não autorizado" });
  }

  try {
      const selectQuery = `SELECT * FROM ?? WHERE id LIKE ?`;
      const [results] = await dbPromise.query(selectQuery, [tableName, `%${keyValue}%`]);
      return res.status(200).json({ resultado: results });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ mensagem: "Erro ao realizar a pesquisa" });
  }
});

// Inicializando o servidor
app.listen(PORT,HOST,() => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}/`);
});
  