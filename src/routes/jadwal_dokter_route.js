const express = require('express')

const router = express.Router()

const jadwalDokterController = require('../controllers/jadwal_dokter_controller');

router.get('/:idSpesialisasi/:hari', jadwalDokterController.getJadwalDokter); // ini untuk pemilihan jadwal dokter search awal
router.get('/:kodeDokter', jadwalDokterController.getJadwalDokterById);// untuk HP saja bagian menu jadwal dokter menampilkan jam dan hari

module.exports = router

