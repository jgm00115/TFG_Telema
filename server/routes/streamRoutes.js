const express = require('express');
const router = express.Router();

const streamController = require('../controllers/streamController');

router.get('/', streamController.getStreams);
router.post('/', express.json(), streamController.postStream);  //uses middleware to parse payload to json
router.get('/:id/stream', streamController.getStream);
router.get('/:id/hrtfs', streamController.getStreamHRTFS);
router.get('/:id/ambiHrtfs', streamController.getStreamAmbiHRTFS);
router.get('/:id/hrtfs/:rotation', streamController.rotate);

module.exports = router;