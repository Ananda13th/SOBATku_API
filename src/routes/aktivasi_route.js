const express = require('express')

const router = express.Router()

const userController = require('../controllers/user_controller');
router.put('/admin/:nomorHp', userController.aktivasi);

module.exports = router
// Ini untuk aktifasi user dari 0 jadi 1 supaya bisa login setelah verifikasi no hp dengan kode OTP yang benar
// Dipakai dari hp dan web (web tanpa kode OTP)