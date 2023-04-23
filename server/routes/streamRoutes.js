const express = require('express');
const router = express.Router();

const streamController = require('../controllers/streamController');

router.post('/', express.json(), streamController.postStream);  //usa middleware para parsear payload a json
router.get('/:id/hrtfs', streamController.getStreamHRTFS);

module.exports = router;