const express = require('express')

const router = express.Router()

const cutiController = require('../controllers/cuti_controller');
router.get('/jadwal/admin/all', cutiController.ambilJadwalCuti); // admin web
router.get('/:kodeJadwal', cutiController.cariJadwalCuti); // untuk hp (bagian dokter), admin bagian jadwal cuti
router.post('/:hari?/:jam?', cutiController.buatJadwalCuti); // untuk admin web

module.exports = router

// 