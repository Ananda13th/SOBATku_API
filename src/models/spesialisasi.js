const express = require('express');
var dbConn = require('./../../config/db.config');

var Spesialisasi = function(spesialisasi) {
    this.id_spesialisasi    = spesialisasi.id_spesialisasi;
    this.kode_spesialisasi  = spesialisasi.kode_spesialisasi;
    this.nama_spesialisasi  = spesialisasi.nama_spesialisasi;
}

Spesialisasi.get = function(result) {
    dbConn.query("SELECT * FROM spesialisasi s ORDER BY s.nama_spesialisasi ASC ", 
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

module.exports = Spesialisasi;


