const express = require('express');

const router = express.Router();

const userController = require('../controllers/user_controller');

router.get('/:noHp/:password', userController.getUser); // untuk hp bagian login cek
router.post('/', userController.createUser); // admin dan hp buat user baru
router.get('/', userController.getAllUser); // admin web
router.put('/:id/:email/:password', userController.updateUSer); // hp dan admin
router.put('/admin/', userController.updateUserAdmin); //kiriman web admin (update data pasien/ pembaharuan/pergantian ...)
router.put('/:noHp/:password', userController.resetPassword); //hp saja
router.post('/add/firebase', userController.saveToFirebase); // hp saja waktu start app sobatku untuk krim token hp
router.delete('/delete/firebase/:idUser/:namaPasien', userController.deleteFromFirebase); // untuk delete data pasien di firebase saat di hp di delete

module.exports = router
