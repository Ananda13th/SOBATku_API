const express = require('express')

const router = express.Router()

const dataRsController = require('../controllers/dataRs_controller');

router.post('/doPatientRegistration', dataRsController.getPendaftaran);
router.post('/doNotifQueue', dataRsController.getAntrian); // untuk notifikasi antrian ke HP
router.post('/doEditPatient', dataRsController.editPasien);
router.post('/doDeleteRegistration', dataRsController.deleteAntrian);


module.exports = router

// API RS kirim data ke database API SOBATku