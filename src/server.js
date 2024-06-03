const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = require('./private/Port.json');
const db = require('./config/dbConfig');
const jwt = require('jsonwebtoken');
const secretKey=require('./private/secretKey.json');
const path=require('path')
 


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
app.use('/contactos',contatosRoutes)
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
        res.status(201).json({mensagem:true})
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

// Inicializando o servidor
app.listen(PORT,HOST,() => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}/`);
});
  