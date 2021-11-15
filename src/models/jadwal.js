const express = require('express');
var dbConn = require('./../../config/db.config');

var Jadwal = function(jadwal) {
    this.id_jadwal      = jadwal.id_jadwal;
    this.kode_jadwal    = jadwal.kode_jadwal;
    this.hari           = jadwal.hari;
    this.jam            = jadwal.jam
}

Jadwal.getJam = function(result) {
    dbConn.query("SELECT DISTINCT jam FROM `jadwal` GROUP BY jam ASC",
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

module.exports = Jadwal;