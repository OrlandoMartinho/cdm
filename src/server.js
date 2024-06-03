const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = require('./private/Port.json');
const db = require('./config/dbConfig');
const jwt = require('jsonwebtoken');
const secretKey=require('./private/secretKey.json');

 


const app = express();

app.use(bodyParser.json());
app.use(cors());




// Importar as rotas
const usersRoutes = require('./routes/UserRoutes');
const notificacoesRoutes = require('./routes/NotificacoesRoutes');
const funcionariosRoutes = require('./routes/FuncionariosRoutes');
const sepulturaRoutes=require('./routes/SepulturasRoutes')
const contatosRoutes=require('./routes/contatosRoutes')


// Adicionar rotas
app.use('/usuarios', usersRoutes);
app.use('/notificacoes', notificacoesRoutes);
app.use('/funcionarios', funcionariosRoutes);
app.use('/sepulturas',sepulturaRoutes)
app.use('/contactos',contatosRoutes)
// Iniciar o servidor 
const PORT = process.env.PORT||port.PORT;
const HOST =process.env.HOST||port.HOST

// Inicializando o servidor
app.listen(PORT,HOST,() => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}/`);
});
  