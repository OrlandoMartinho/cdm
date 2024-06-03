const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UserController');

router.post('/cadastrar', UsersController.cadastrarUsuario);

router.post('/login', UsersController.autenticarUsuario);

router.post('/todos_usuarios',UsersController.obterTodosUsuarios)

router.put('/',UsersController.editarUsuario)

router.delete('/',UsersController.eliminarUsuario)

router.post('/obter_usuario_por_token', UsersController.obterUsuarioPorAccessToken);

module.exports = router;
