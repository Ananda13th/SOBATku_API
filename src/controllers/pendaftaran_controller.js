const {json} = require('body-parser');
const e = require('express');
const { response } = require('express');
const Log = require('../models/log');
const PendaftaranResp = require('../models/pendaftaranResp');

exports.createPendaftaran = async function(req, res) {
    const timestamp = createTimestamp();
    const signature = createSignature(timestamp);
    
    var axios = require('axios');
    var config = {
        headers : 
        {
            'id'          : 'ancient one',
            'time'        : timestamp,
            'token'       : signature,
            'Content-Type': 'application/json; charset=UTF-8',
        }
    }
    try { 
        /* LIVE */
        //await axios.post('http://192.167.4.207:9696/pendaftaran/public/index.php/antrian', req.body, config)
        /* DEV */
        await axios.post('192.167.4.73/antrian/public/index.php/antrian', req.body, config)
        .then(function(response) {
            console.log(response);
            if(response.data.status == "100") {
                PendaftaranResp.create(response.data, req.params.idUser, req.body.kodejadwal, req.body.str,
                    function(error, result) {
                        if(error) {
                            var newNotif = new Log({
                                    nomor_rm    : req.body.rm,
                                    id_user     : req.params.idUser,
                                    kode_dokter : req.body.str,
                                    keterangan  : "Pendaftaran Poli",
                                    perubahan   : "Pendaftaran Gagal : " + error,
                                })
                            Log.create(newNotif, function(error, result) {});
                            res.send("Error : ", error);
                        }
                        else {
                            var newNotif = new Log( {
                                    nomor_rm    : req.body.rm,
                                    id_user     : req.params.idUser,
                                    kode_dokter : req.body.str,
                                    keterangan  : "Pendaftaran Poli",
                                    perubahan   : "Pendaftaran Berhasil"+ "\nKode Dokter : " + req.body.str + "\nKode Jadwal : " + req.body.kodejadwal
                                })
                            Log.create(newNotif, function(error, result) {});
                            res.send({error_code: 200, message: response.data.message});
                        }
                    }
                );
            } else {
                var newNotif = new Log( {
                    nomor_rm    : req.body.rm,
                    id_user     : req.params.idUser,
                    kode_dokter : req.body.str,
                    keterangan  : "Pendaftaran Poli",
                    perubahan   : response.data.message + "\nKode Dokter : " + req.body.str + "\nKode Jadwal : " + req.body.kodejadwal
                })
            Log.create(newNotif, function(error, result) {});
                res.send({message: response.data.message});
            }
        });
    }
    catch (err) {
        console.log(err);
        if(err.code === 'ETIMEDOUT') {
            res.send({error_code: 500, message: err.code + ", Harap Hubungi IT Rumah Sakit"});
        
            var newNotif = new Log({
                    nomor_rm    : req.body.rm,
                    id_user     : req.params.idUser,
                    kode_dokter : req.body.str,
                    keterangan  : "Pendaftaran Poli",
                    perubahan   : "Pendaftaran Gagal : "+ err.code,
                })
            Log.create(newNotif, function(error, result) {});
        }
        else {
            res.send({error_code: 500, message: "Internal Server Error, Harap Hubungi IT Rumah Sakit"});
        }
    }
}

exports.getPendaftaran = function async(req, res) {
    PendaftaranResp.get(req.params.noRm, function(error, result) {
        if(error)
            res.send(error);
        res.send({data: result});
    })
}

function createTimestamp() {
    const dateNow =  Math.floor(new Date().getTime() / 1000);
    return dateNow.toString();
}

function createSignature(timestamp) {
    var signature = require('crypto').createHmac("sha256", "secretkey")
        .update("ancient one" + "&" + timestamp).digest('base64');
    return signature.toString();
}




