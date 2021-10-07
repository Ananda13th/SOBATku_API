const express = require('express')

const router = express.Router()

const pendaftaranController = require('../controllers/pendaftaran_controller');

router.post('/:idUser', pendaftaranController.createPendaftaran);
router.get('/:idUser', pendaftaranController.getPendaftaran);

module.exports = router