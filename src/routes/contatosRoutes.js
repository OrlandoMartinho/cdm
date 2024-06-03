const express = require('express');
const router = express.Router();
const ContactosController = require('../controllers/ContatosController');


router.post('/cadastrar', ContactosController.cadastrarContacto);

router.post('/listar', ContactosController.listarContactos);

router.post('/obterPorId', ContactosController.obterContactoPorId);

router.post('/responder_usuario',ContactosController.responderUsuario)

router.delete('/', ContactosController.eliminarContactoPeloId);

module.exports = router;
