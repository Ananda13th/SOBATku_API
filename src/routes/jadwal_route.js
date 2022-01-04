const express = require('express')

const router = express.Router()

const jadwalController = require('../controllers/jadwal_controller');

router.get('/:kodeDokter', jadwalController.getJam); // untuk admin web

module.exports = router