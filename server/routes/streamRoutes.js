const express = require('express');
const router = express.Router();

const streamController = require('../controllers/streamController');

router.get('/', streamController.getStreams);
router.post('/', express.json(), streamController.postStream);  //usa middleware para parsear payload a json
router.get('/:id/hrtfs', streamController.getStreamHRTFS);
router.get('/:id/hrtfs/:rotation', streamController.rotate);

module.exports = router;