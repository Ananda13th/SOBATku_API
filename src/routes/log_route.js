const express = require('express')

const router = express.Router()

const logController = require('../controllers/log_controller');

router.post('/', logController.createLog);

module.exports = router