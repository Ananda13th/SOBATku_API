const express = require('express');

const router = express.Router();

const userController = require('../controllers/user_controller');

router.get('/:noHp/:password', userController.getUser);
router.post('/', userController.createUser);
router.get('/', userController.getAllUser);
router.put('/:id/:email/:password', userController.updateUSer);
router.put('/admin/', userController.updateUserAdmin);
router.put('/:noHp/:password', userController.resetPassword);
router.post('/add/firebase', userController.saveToFirebase);
router.delete('/delete/firebase/:idUser/:namaPasien', userController.deleteFromFirebase);

module.exports = router