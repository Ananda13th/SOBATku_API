const express = require('express');
var dbConn = require('./../../config/db.config');

var Cuti = function(cuti) {
    this.kode_dokter  = cuti.kode_dokter;
    this.mulai        = cuti.mulai;
    this.selesai      = cuti.selesai;
}


Cuti.cekCuti = function(kodeJadwal, result) {
    dbConn.query("SELECT * FROM jadwal_cuti WHERE kode_jadwal = ?", kodeJadwal,
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

Cuti.ambilJadwal = function(kodeDokter, result) {
    dbConn.query(
        "SELECT jadwal.hari, jadwal.jam FROM jadwal_dokter" +
        " JOIN dokter ON dokter.kode_dokter = jadwal_dokter.kode_dokter" +
        " JOIN jadwal ON jadwal.id_jadwal = jadwal_dokter.id_jadwal" +
        " WHERE dokter.kode_dokter = ?", kodeDokter, 
        function(err, res) {
            if(err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        }
    );
}

Cuti.ambilCuti = function(result) {
    dbConn.query(
        "SELECT * FROM jadwal_cuti ORDER BY timestamp DESC",
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

Cuti.inputCuti = function(kodeDokter, kodeJadwal, result) {
    dbConn.query(
        "INSERT INTO jadwal_cuti SET kode_dokter=?, kode_jadwal=?", [kodeDokter,kodeJadwal], 
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

module.exports = Cuti;