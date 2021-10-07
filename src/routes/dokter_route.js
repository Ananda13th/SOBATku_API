const express = require('express');

const router = express.Router();

const dokterController = require('../controllers/dokter_controller');

router.get('/all/:test', dokterController.getDokter);
router.get('/:idSpesialisasi', dokterController.getDokterBySpesialisasi);

module.exports = router