const express = require('express')

const router = express.Router()

const dataRsController = require('../controllers/dataRs_controller');

router.post('/doPatientRegistration', dataRsController.getPendaftaran);
router.post('/doNotifQueue', dataRsController.getAntrian);
router.post('/doEditPatient', dataRsController.editPasien);
router.post('/doDeleteRegistration', dataRsController.deleteAntrian);


module.exports = router