const express = require('express')

const router = express.Router()

const bpjsController = require('../controllers/cek_bpjs_controller');
router.get('/:noBpjs', bpjsController.cekStatusBpjs);
router.get('/rujukan/:noBpjs', bpjsController.cekRujukanBpjs);

module.exports = router

// cek bpjs aktif atau tidak beserta rujukan pasien bpjs