const express = require('express')

const router = express.Router()

const notificationController = require('../controllers/notification_controller');

router.get('/:kodeJadwal/:antrian', notificationController.sendNotification);
router.get('/:idUser', notificationController.getNotificationList);

module.exports = router