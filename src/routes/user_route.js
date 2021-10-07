const express = require('express');

const router = express.Router();

const userController = require('../controllers/user_controller');

router.get('/:noHp/:password', userController.getUser);
router.post('/', userController.createUser);
router.put('/:id/:email/:password', userController.updateUSer);
router.put('/:noHp', userController.resetPassword);

module.exports = router