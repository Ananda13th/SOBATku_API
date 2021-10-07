const express = require('express')

const router = express.Router()

const jadwalDokterController = require('../controllers/jadwal_dokter_controller');

router.get('/:idSpesialisasi/:hari', jadwalDokterController.getJadwalDokter);
router.get('/:idDokter', jadwalDokterController.getJadwalDokterById);

module.exports = router