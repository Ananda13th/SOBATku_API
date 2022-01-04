const express = require('express');

const router = express.Router();

const verificationController = require('../controllers/verification_controllers');

router.get('/otp/create/:nomorHp', verificationController.createOtp);
router.put('/otp/verify/:nomorHp/:kodeOtp', verificationController.verifyOtp);
router.put('/resend/:nomorHp', verificationController.resendOtp);

module.exports = router

// hp saja kode OTP