const express = require('express')

const router = express.Router()

const bannerController = require('../controllers/banner_controller');
router.get('/', bannerController.getBanner); // get untuk banner HP

// akses banner admin web
router.get('/all/', bannerController.getBannerNoFormat);
router.post('/', bannerController.addBanner);
router.delete('/:idBanner', bannerController.deleteBanner);
router.post('/editBanner', bannerController.editBanner);

module.exports = router

// hp akses bagian gambar2 yang keluar dan setingan banner untuk admin web