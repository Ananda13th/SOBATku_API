const express = require('express');

const router = express.Router();

const dokterController = require('../controllers/dokter_controller');

router.get('/all/:test', dokterController.getDokter); // Untuk hp dan admin
router.get('/:idSpesialisasi', dokterController.getDokterBySpesialisasi); // hp saja bagian pilih dokter awal spesialisasi

module.exports = router
