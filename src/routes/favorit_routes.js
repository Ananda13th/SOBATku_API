const express = require('express')

const router = express.Router()

const favoritController = require('../controllers/favorit_controller');

router.get('/:idUser', favoritController.getDokterFavorit);
router.post('/', favoritController.addDokterFavorit);
router.delete('/:idUser/:idDokter', favoritController.deleteFavorit);

module.exports = router