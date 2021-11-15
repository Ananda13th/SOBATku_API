const express = require('express')

const router = express.Router()

const pasienController = require('../controllers/pasien_controller');

router.get('/:idUser', pasienController.getPasien);
router.get('/search/:noRm/:namaBelakang', pasienController.searchPasien);
router.post('/', pasienController.createPasien);
router.put('/:nomorBpjs/:nomorRm', pasienController.updateBpjs);

module.exports = router