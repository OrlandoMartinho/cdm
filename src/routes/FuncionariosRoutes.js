const express = require('express');
const router = express.Router();
const funcionariosController = require('../controllers/FuncionariosControllers');

router.post('/cadastrar', funcionariosController.cadastrarFuncionarios);

router.post('/todos_funcionarios',funcionariosController.obterFuncionarioPorID)

router.put('/',funcionariosController.editarFuncionario)

router.delete('/',funcionariosController.eliminarFuncionarios)

router.post('/obter_funcionario_por_id', funcionariosController.obterFuncionarioPorID);

module.exports = router;
