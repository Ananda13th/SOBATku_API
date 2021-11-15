const express = require('express')

const router = express.Router()

const medinController = require('../controllers/medin_controller');

router.post('/doPatientRegistration', medinController.getPendaftaran);
router.post('/doNotifQueue', medinController.getAntrian);
router.post('/doEditPatient', medinController.editPasien);
router.post('/doDeleteRegistration', medinController.deleteAntrian);


module.exports = router