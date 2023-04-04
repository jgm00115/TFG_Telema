/** 
* Rutas para la ingesta de audio de un streaming
*/

const express = require('express');
const router = express.Router();

// controladores
const stream_controller = require('../controllers/streamController');

router.get('/:stream_key', stream_controller.get_ingest);

router.post('/:stream_key/:filename', express.raw(), stream_controller.stream_ingest);

module.exports = router;