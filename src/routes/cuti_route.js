const express = require('express')

const router = express.Router()

const cutiController = require('../controllers/cuti_controller');
router.get('/:kodeJadwal', cutiController.cariJadwalCuti);
router.post('/:hari?/:jam?', cutiController.buatJadwalCuti);

module.exports = router