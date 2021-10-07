const express = require('express')

const router = express.Router()

const pairingController = require('../controllers/pairing_controller');

router.delete('/:idUser/:noRm', pairingController.deletePairing);
router.post('/', pairingController.createPairing);

module.exports = router