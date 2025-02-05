const express = require('express');
const router = express.Router();

const ambihrtfController = require('../controllers/ambihrtfController');

router.get('/', ambihrtfController.getAMBIHRTF);
router.post('/', express.json(), ambihrtfController.postAMBIHRTF);  //usa middleware para parsear payload a json

//Coordenadas disponibles
router.get('/availableOrder', ambihrtfController.getAvailableOrderDegrees);

module.exports = router;