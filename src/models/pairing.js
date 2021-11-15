const express = require('express');
var dbConn = require('./../../config/db.config');

var Pairing = function(pairing) {
    this.id_pairing = pairing.id_pairing;
    this.id_user = pairing.id_user;
    this.nomor_rm = pairing.nomor_rm;
}

Pairing.create = function(newPairing, result) {
    dbConn.query("INSERT INTO pairing_user_pasien SET ?", newPairing, 
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


Pairing.delete = function(idUser, noRm, result) {
    dbConn.query("DELETE FROM pairing_user_pasien WHERE nomor_rm = ? AND id_user = ?", [noRm, idUser], 
        function(err,res) {
            if(err) {
                console.log("error : ", err);
                result(err, null);
            }
            else
                result(null, res);
        }
    )
}

Pairing.search = function(noRm, result) {
    dbConn.query("SELECT * FROM pairing_user_pasien WHERE nomor_rm=?", noRm,
        function(err, res) {
            if(err) {
                console.log("error : ", err);
                result(err, null);
            }
            else
                result(null, res);
        }
    )
}

module.exports = Pairing;