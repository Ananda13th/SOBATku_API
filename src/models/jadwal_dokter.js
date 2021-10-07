const express = require('express');
var dbConn = require('./../../config/db.config');

var JadwalDokter = function(jadwalDokter) {
    this.kode_jadwal = jadwalDokter.kode_jadwal;
    this.id_dokter = jadwalDokter.id_dokter;
    this.id_jadwal = jadwalDokter.id_jadwal;
    this.aktif = jadwalDokter.aktif
}

JadwalDokter.getBySchedule = function(idSpesialisasi, hari, result) {
    dbConn.query(
        "SELECT JSON_OBJECT("+
        "'nama', d.nama_dokter,"+ 
        "'kode_dokter', d.kode_dokter," +
        "'hari', j.hari,"+ 
        "'jadwal', CONCAT('[', GROUP_CONCAT(JSON_OBJECT( 'jam', j.jam, 'id', jd.kode_jadwal) ) ,']')) AS data"+ 
        " FROM dokter d"+
        " JOIN jadwal_dokter jd ON d.id_dokter = jd.id_dokter"+ 
        " JOIN jadwal j ON jd.id_jadwal = j.id_jadwal" +
        " WHERE d.id_spesialisasi = ? AND j.hari= ?" +
        " GROUP BY d.id_dokter, j.hari;", [idSpesialisasi, hari],
        function(err, res) {
            if(err) {
                result(err, null);
            } else {
                result(null, res);
            }
        }
    )
}

JadwalDokter.getById = function(idDokter, result) {
    dbConn.query(
        "SELECT JSON_OBJECT("+
        "'nama', d.nama_dokter,"+ 
        "'kode_dokter', d.kode_dokter," +
        "'hari', j.hari,"+ 
        "'jadwal', CONCAT('[', GROUP_CONCAT(JSON_OBJECT( 'jam', j.jam, 'id', jd.kode_jadwal) ) ,']')) AS data"+ 
        " FROM dokter d"+
        " JOIN jadwal_dokter jd ON d.id_dokter = jd.id_dokter"+ 
        " JOIN jadwal j ON jd.id_jadwal = j.id_jadwal" +
        " WHERE d.id_dokter = ?" +
        " GROUP BY d.id_dokter, j.hari;", idDokter,
        function(err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            } else {
                result(null, res);
            }
        }
    )
}

module.exports = JadwalDokter;