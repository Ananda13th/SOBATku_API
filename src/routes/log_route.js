const express = require('express')

const router = express.Router()

const logController = require('../controllers/log_controller'); // log menyimpan daftar+update user, daftar poli sukses gagal, API RS add edit delete

router.post('/', logController.createLog);

module.exports = router