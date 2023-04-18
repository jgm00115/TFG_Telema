const express = require('express');
const router = express.Router();

const hrtfController = require('../controllers/hrtfController');

router.get('/', hrtfController.getHRTF);
router.post('/', express.json(), hrtfController.postHRTF);

module.exports = router;