const Dokter = require('../models/dokter');
const Log = require('../models/log');
const PendaftaranResp = require('../models/pendaftaranResp');
const moment = require('moment');
const { sendNotification } = require('./notification_controller');
const Pasien = require('../models/pasien');
const { createPasien } = require('./pasien_controller');

exports.getPendaftaran = function async(req, res) {
    var response = req.body

    response.api_key = Buffer.from(response.api_key, 'base64').toString('ASCII');
    response.mr = Buffer.from(response.mr, 'base64').toString('ASCII');
    response.doctor_code = Buffer.from(response.doctor_code, 'base64').toString('ASCII');
    response.schedule_date = Buffer.from(response.schedule_date, 'base64').toString('ASCII');
    response.time_start = Buffer.from(response.time_start, 'base64').toString('ASCII');
    response.payment_type = Buffer.from(response.payment_type, 'base64').toString('ASCII');
    response.queue = Buffer.from(response.queue, 'base64').toString('ASCII');
    response.notifikasi =  Buffer.from(response.notifikasi, 'base64').toString('ASCII');

    var detailDokter;
    var dataPendaftaran;
    var rekamMedis = response.mr;

    Dokter.search(response.doctor_code, function(error, result) {
        if(error) {
            res.send({error_code : "500", message : "Internal Server Error"});
            console.log("Error : ", error);
        }
        else if(result.length == 0)
            res.send({error_code : "201", message : "Dokter Tidak Ditemukan"});
        else {
            detailDokter = result[0];
            dataPendaftaran = new PendaftaranResp({
                mr                 : rekamMedis,
                kode_dokter        : response.doctor_code,
                dokter             : detailDokter.nama_dokter,
                kode_spesialis     : detailDokter.id_spesialisasi,
                spesialis          : detailDokter.nama_spesialisasi,
                antrian            : response.queue,
                status             : "",
                date               : response.schedule_date,
                type               : response.payment_type,
                time               : response.time_start+".00",
                notifikasi         : response.notifikasi,
            })
            
            var kodeJadwal = response.doctor_code+"."+moment(response.schedule_date).format("YYMMDD")+response.time_start;

            PendaftaranResp.create(dataPendaftaran, "Dari RS", kodeJadwal, detailDokter.kode_dokter,
                function(error, result) {
                    if(error) {
                        console.log("Di crate : " + error);
                        res.send({error_code : "500", message : "Terjadi Kesalahan"});
                        var newNotif = new Log({
                                nomor_rm    : response.mr,
                                id_user     : "Dari RS",
                                kode_dokter : detailDokter.kode_dokter,
                                keterangan  : "Pendaftaran Poli Dari RS",
                                perubahan   : "Pendaftaran Gagal : " + error,
                        })
                        Log.create(newNotif, function(error, result) {});
                    }
                    else {
                        var newNotif = new Log({
                                nomor_rm    : response.mr,
                                id_user     : "Dari RS",
                                kode_dokter : detailDokter.kode_dokter,
                                keterangan  : "Pendaftaran Poli Dari RS",
                                perubahan   : "Pendaftaran Berhasil"+ "\nKode Dokter : " + detailDokter.kode_dokter + "\nKode Jadwal : " + kodeJadwal
                        })
                        Log.create(newNotif, function(error, result) {});
                        res.send({error_code : "200", message : "Berhasil Tambah Data"});
                    }
                })
            }
        }
    )
}

exports.editPasien = function async (req, res) {
    var response = req.body;
    response.api_key = Buffer.from(response.api_key, 'base64').toString('ASCII');
    response.old_mr = Buffer.from(response.old_mr, 'base64').toString('ASCII');
    response.new_mr = Buffer.from(response.new_mr, 'base64').toString('ASCII');
    response.name = Buffer.from(response.name, 'base64').toString('ASCII');
    Pasien.searchForEdit(response, 
        function(error, result) {
            if(error) {
                console.log(error)
                res.send({error_code : "500", message : "Terjadi Kesalahan"});
            }
            else {
                if(result == null) {
                    const pasien =new Pasien({
                        nama_pasien : response.name,
                        nomor_bpjs  : "0",
                        nomor_ktp   : "0",
                        nomor_rm    : response.new_mr
                    })
                    createPasien(pasien);
                    res.send({error_code: "200", message : "Sukses Tambah Pasien"});
                }
                else if(result != null) {
                    Pasien.updateFromRs(response, 
                        function(error, result) {
                            if(error) {
                                console.log(error)
                            }
                            else {
                                console.log(result);
                                res.send({error_code: "200", message : "Sukses Edit Pasiens"});
                            }
                        }
                    )
                }
            }
        }
    )
}

exports.getAntrian = function async (req, res) {

    var response = req.body;
    response.api_key = Buffer.from(response.api_key, 'base64').toString('ASCII');
    response.kodejadwal = Buffer.from(response.kodejadwal, 'base64').toString('ASCII');
    response.antrianberjalan = Buffer.from(response.antrianberjalan, 'base64').toString('ASCII');
    
    PendaftaranResp.updateAntrian(response.kodejadwal, response.antrianberjalan, 
        function(error, result) {
            if(error) {
                console.log(error);
                res.send({error_code : "500", message : "Internal Server Error"});
            }
            if(result.affectedRows == 0) {
                res.send({error_code : "201", message : "Antrian Tidak Ditemukan"});
            }
            else {
                sendNotification(response.kodejadwal, response.antrianberjalan);
                res.send({error_code : "200", message : "Sukses Update Antrian"});
            }
        }
    )
}

exports.deleteAntrian = function async(req, res) {
    var response = req.body;
    response.api_key = Buffer.from(response.api_key, 'base64').toString('ASCII');
    response.doctor_code = Buffer.from(response.doctor_code, 'base64').toString('ASCII');
    response.schedule_date = Buffer.from(response.schedule_date, 'base64').toString('ASCII');
    response.time_start = Buffer.from(response.time_start, 'base64').toString('ASCII');
    response.mr = Buffer.from(response.mr, 'base64').toString('ASCII');
    var kodeJadwal = response.doctor_code+"."+moment(response.schedule_date).format("YYMMDD")+response.time_start;
    console.log("Response Dekrip : ", response);
    console.log("Kode Jadwal : ", kodeJadwal);

    PendaftaranResp.hapusTransaksi(response, kodeJadwal, 
        function(error, result) {
            if(error) {
                console.log(error);
                var newNotif = new Log({
                    nomor_rm    : response.mr,
                    id_user     : "Dari RS",
                    kode_dokter : response.doctor_code,
                    keterangan  : "Hapus Pendaftaran",
                    perubahan   : "Gagal Hapus Pendaftaran, " + error
                })
                Log.create(newNotif, function(error, result) {});
                res.send({error_code : "500", message : "Internal Server Error"});
            }
            if(result.affectedRows == 0) {
                var newNotif = new Log({
                    nomor_rm    : response.mr,
                    id_user     : "Dari RS",
                    kode_dokter : response.doctor_code,
                    keterangan  : "Hapus Pendaftaran",
                    perubahan   : "Gagal Hapus Pendaftaran, Antrian atau Nomor Rekam Medis Tidak Ditemukan : " + "\nKode Jadwal : " + response.kodejadwal + "\nRekam Medis : " + response.mr
                })
                Log.create(newNotif, function(error, result) {});
                res.send({error_code : "201", message : "Antrian atau Nomor Rekam Medis Tidak Ditemukan"});
            }
            else {
                console.log(result);
                var newNotif = new Log({
                    nomor_rm    : response.mr,
                    id_user     : "Dari RS",
                    kode_dokter : response.doctor_code,
                    keterangan  : "Hapus Pendaftaran",
                    perubahan   : "Hapus Pendaftaran : " + "\nKode Jadwal : " + response.kodejadwal + "\nRekam Medis : " + response.mr
                })
                Log.create(newNotif, function(error, result) {});
                res.send({error_code : "200", message : "Sukses Hapus Antrian"});
            }
        }
    )
}