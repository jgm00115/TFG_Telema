/** 
* Rutas para la ingesta de audio de un streaming
*/

const express = require('express');
const router = express.Router();

// controladores
const ingest_controller = require('../controllers/ingestController');

router.get('/:stream_key', ingest_controller.get_ingest);

router.post('/:stream_key/:filename', ingest_controller.stream_ingest);

module.exports = router;