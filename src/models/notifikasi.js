const express = require('express');
var dbConn = require('./../../config/db.config');

var Notifikasi = function(dokter) {
    this.id_user     = dokter.id_user;
    this.judul       = dokter.judul;
    this.berita      = dokter.berita;
}

Notifikasi.get = function(idUser, result) {
    dbConn.query("SELECT * FROM notifikasi WHERE id_user = ?", idUser,
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

Notifikasi.create = function(newNotif, result) {
    dbConn.query("INSERT INTO notifikasi SET ?", newNotif,
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

module.exports = Notifikasi;