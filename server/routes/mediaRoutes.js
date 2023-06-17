/** 
* Rutas para la obtención de recursos multimedia
*/

const express = require('express');
const router = express.Router();

// controladores
const mediaControllers = require('../controllers/mediaControllers');

router.get('/:id/:filename',mediaControllers.get_media);

module.exports = router;