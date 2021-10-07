const express = require('express')

const router = express.Router()

const spesialisasiController = require('../controllers/spesialisasi_controller');

router.get('/', spesialisasiController.getSpesialisasi);

module.exports = router