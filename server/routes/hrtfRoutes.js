const express = require('express');
const router = express.Router();

const hrtfController = require('../controllers/hrtfController');

router.get('/', hrtfController.getHRTF);
router.post('/', express.json(), hrtfController.postHRTF);  //usa middleware para parsear payload a json

//Coordenadas disponibles
router.get('/availableCoords', hrtfController.getAvailableCoords);

module.exports = router;