const {json} = require('body-parser');
const Pasien = require('../models/pasien');
const Log = require('../models/log');


exports.getPasien = function(req, res) {
    Pasien.get(req.params.idUser, function(error, pasien) {
        if(error)
            res.send(error);
        res.json({error_code: 200, message: "Success", data : pasien})
    });
}

exports.createPasien = function async(pasien, res) {
    console.log("Data Pasien : ", pasien);
    Pasien.create(pasien, function(error, result) {
        if(error) {
            console.log(error)
            var newNotif = new Log( {
                nomor_rm    : pasien.nomor_rm,
                id_user     : "-",
                kode_dokter : "-",
                keterangan  : "Tambah User Dari RS",
                perubahan   : "Pendaftaran Gagal : "+ error 
            })
            Log.create(newNotif, function(error, result) {});
        }
        else {
            console.log(result);
            var newNotif = new Log({
                nomor_rm    : pasien.nomor_rm,
                id_user     : "-",
                kode_dokter : "-",
                keterangan  : "Tambah User Dari RS",
                perubahan   : "Pendaftaran Berhasil : " + "\nNama Pasien : " + pasien.nama_pasien + "\nNomor RM : " + pasien.nomor_rm,
            })
            Log.create(newNotif, function(error, result) {});
        }
    });
}

exports.searchPasien = function async(req, res) {
    Pasien.search(req.params.noRm, req.params.namaBelakang, function(error, result) {
        if(error)
            res.send("Error : ", error);
        else {
            if(result == null) {
                res.send({error_code: 201, message: "Data Pasien Tidak Ada!"});
            }
            else {
                res.send({error_code: 200, message: "Success", data: result});
            }
        }  
    })
}

exports.updateBpjs = function async(req, res) {
    Pasien.update(req.params.nomorBpjs, req.params.nomorRm,
        function(error, result) {
            if(error)
                res.send("Error : ", error);
            else
            res.send({error_code: 200, message: "Success"});
        }
    );
}
