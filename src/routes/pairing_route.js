const express = require('express')

const router = express.Router()

const pairingController = require('../controllers/pairing_controller');

router.delete('/:idUser/:noRm', pairingController.deletePairing);
router.post('/', pairingController.createPairing);

module.exports = router

// penghubung antara 1 user pasien memiliki banyak user(keluarga misalnya), atau 1 user bisa memiliki beberapa ID dengan no hp berbeda