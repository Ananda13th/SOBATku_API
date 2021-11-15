const express = require('express')

const router = express.Router()

const bannerController = require('../controllers/banner_controller');
router.get('/', bannerController.getBanner);
router.get('/all/', bannerController.getBannerNoFormat);
router.post('/', bannerController.addBanner);
router.delete('/:idBanner', bannerController.deleteBanner);
router.post('/editBanner', bannerController.editBanner);

module.exports = router