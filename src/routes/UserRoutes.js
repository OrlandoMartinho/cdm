const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UserController');

router.post('/cadastrar', UsersController.cadastrarUsuario);

router.post('/login', UsersController.autenticarUsuario);

router.post('/listar',UsersController.obterTodosUsuarios)

router.put('/',UsersController.editarUsuario)

router.delete('/',UsersController.eliminarUsuario)

router.post('/obter_usuario_por_token', UsersController.obterUsuarioPorAccessToken);


router.post('/dashboard',UsersController.obterDashboard)
module.exports = router;
