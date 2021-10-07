const express = require('express')

const router = express.Router()

const bannerController = require('../controllers/banner_controller');
router.get('/', bannerController.getBanner);

module.exports = router