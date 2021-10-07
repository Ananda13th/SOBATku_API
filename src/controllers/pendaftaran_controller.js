const {json} = require('body-parser');
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
        await axios.post('http://192.167.4.73/antrian/public/index.php/antrian', req.body, config)
        .then(function(response) {
            if(response.data.status == "100") {
                PendaftaranResp.create(response.data, req.params.idUser, req.body.kodejadwal, req.body.kodeDokter,
                    function(error, result) {
                        if(error) {
                            console.log("Di crate : " + error);
                            var newNotif = new Log({
                                    nomor_rm    : req.body.rm,
                                    id_user     : req.params.idUser,
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
                                    keterangan  : "Pendaftaran Poli",
                                    perubahan   : "Pendaftaran Berhasil"
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
                    keterangan  : "Pendaftaran",
                    perubahan   : response.data.message
                })
            Log.create(newNotif, function(error, result) {});
                res.send({message: response.data.message});
            }
        });
    }
    catch (err) {
        console.log(err);
        var newNotif = new Log({
                nomor_rm    : req.body.rm,
                id_user     : req.params.idUser,
                keterangan  : "Pendaftaran Poli",
                perubahan   : "Pendaftaran Gagal : "+ err.response.data.message,
            })
        Log.create(newNotif, function(error, result) {});
        res.send({message: err.response.data.message});
    }
}

exports.getPendaftaran = function async(req, res) {
    PendaftaranResp.get(req.params.idUser, function(error, result) {
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




