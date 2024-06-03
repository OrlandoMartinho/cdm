const express = require('express');
const router = express.Router();
const funeraisController = require('../controllers/FuneraisControllers');

router.post('/cadastrar', funeraisController.cadastrarFuneral);

router.post('/todos_funerais',funeraisController.obterTodosFunerais)

router.post('/todos_funerais_do_usuario',funeraisController.obterTodosFuneraisUsuarios)

router.post('/adiar',funeraisController.adiarFuneral)

router.post('/eliminar', funeraisController.eliminarFuneral);

router.post('/legalizar', funeraisController.legalizarFuneral);

router.post('/confirmar',funeraisController.confirmarFuneral)

router.post('/aprovar_legalizacao',funeraisController.aprovarlegalizarFuneral)

module.exports = router;
