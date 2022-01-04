const express = require('express')

const router = express.Router()

const notificationController = require('../controllers/notification_controller');

router.get('/:kodeJadwal/:antrian', notificationController.sendNotification);//hp
router.get('/:idUser', notificationController.getNotificationList);//hp
router.post('/:noRm', notificationController.notifikasiBebas);// kiriman notif dari admin web ke hp pasien

module.exports = router

