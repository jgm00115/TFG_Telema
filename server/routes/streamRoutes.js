const express = require('express');
const router = express.Router();

const streamController = require('../controllers/streamController');

router.get('/', streamController.getStreams);
router.post('/', express.json(), streamController.postStream);  //uses middleware to parse payload to json
router.put('/:id/cameras', express.json(), streamController.updateCameras);
router.post('/:id/cameras/:cameraID', express.json(), streamController.updateCameraPosition);
router.put('/:id/venue', express.json(), streamController.updateVenue);
router.get('/:id/stream', streamController.getStream);
router.put('/:id/stream', express.json(), streamController.updateStream);
router.post('/:id/stream/end', streamController.endStream);
router.delete('/:id', streamController.deleteStream);
router.get('/:id/hrtfs', streamController.getStreamHRTFS);
router.get('/:id/ambiHrtfs', streamController.getStreamAmbiHRTFS);
router.get('/:id/hrtfs/:rotation', streamController.rotate);
router.get('/:id/cameras', streamController.getCameras);
router.get('/:id/instruments', streamController.getInstruments);
router.put('/:id/instruments', express.json(), streamController.updateInstruments);

module.exports = router;