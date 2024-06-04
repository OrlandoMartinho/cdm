const express = require('express');
const router = express.Router();
const sepulturasController = require('../controllers/SepulturasControllers');

router.post('/cadastrar', sepulturasController.cadastrarSepulturas);

router.post('/todas_sepulturas',sepulturasController.obterTodasSepulturas)

router.post('/obter_sepultura_por_id', sepulturasController.obterSepulturaPorID);

module.exports = router;
