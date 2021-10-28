const express = require('express')

const router = express.Router()

const userController = require('../controllers/user_controller');
router.put('/admin/:nomorHp', userController.aktivasi);

module.exports = router