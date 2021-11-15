const express = require('express')

const router = express.Router()

const jadwalController = require('../controllers/jadwal_controller');

router.get('/', jadwalController.getJam);

module.exports = router