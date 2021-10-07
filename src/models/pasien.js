const express = require('express');
var dbConn = require('./../../config/db.config');

var Pasien = function(pasien) {
    this.nama_pasien    = pasien.nama_pasien;
    this.nomor_bpjs     = pasien.nomor_bpjs;
    this.nomor_ktp      = pasien.nomor_ktp;
    this.nomor_rm       = pasien.nomor_rm;
}

Pasien.get = function(idUser, result) {
    dbConn.query(
        "SELECT ps.nama_pasien, ps.nomor_rm, ps.nomor_bpjs, ps.nomor_ktp FROM pairing_user_pasien p " +
        " JOIN user u ON p.id_user = u.id_user" +
        " JOIN pasien ps ON ps.nomor_rm = p.nomor_rm" + 
        " WHERE u.id_user = ?", idUser,
        function(err, res) {
            if(err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        }
    )
}

Pasien.create = function(newPasien, result) {
    dbConn.query("INSERT INTO pasien SET ?", newPasien, 
        function(err, res) {
            if(err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        }
    )
}

Pasien.search = function(noRm, result) {
    dbConn.query("SELECT * FROM pasien WHERE nomor_rm = ?", noRm,
        function(err, res) {
            if(err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                if(!res.length)
                    result(null, null);
                else
                    result(null, res);
            }   
        }
    )
}

module.exports = Pasien;