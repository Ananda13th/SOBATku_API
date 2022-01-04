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
        "'foto', d.foto," + 
        "'hari', jd.hari,"+ 
        "'jadwal', CONCAT('[', GROUP_CONCAT(JSON_OBJECT( 'jam', jd.jam, 'aktif', jd.aktif, 'id', jd.id_jadwal) ) ,']')) AS data"+ 
        " FROM dokter d"+
        " JOIN jadwal_dokter jd ON d.kode_dokter = jd.kode_dokter"+ 
        " WHERE d.kode_spesialisasi = ? AND jd.hari= ? AND jd.aktif= 'Y'" +
        " GROUP BY d.kode_dokter, jd.hari, d.nama_dokter, d.foto;", [idSpesialisasi, hari],
        function(err, res) {
            if(err) {
                result(err, null);
            } else {
                result(null, res);
            }
        }
    )
}

JadwalDokter.getById = function(kodeDokter, result) {
    dbConn.query(
        "SELECT JSON_OBJECT("+
        "'nama', d.nama_dokter,"+ 
        "'kode_dokter', d.kode_dokter," +
        "'foto', d.foto," + 
        "'hari', jd.hari,"+ 
        "'jadwal', CONCAT('[', GROUP_CONCAT(JSON_OBJECT( 'jam', jd.jam, 'aktif', jd.aktif, 'id', jd.id_jadwal) ) ,']')) AS data"+ 
        " FROM dokter d"+
        " JOIN jadwal_dokter jd ON d.kode_dokter = jd.kode_dokter"+ 
        " WHERE d.kode_dokter = ? AND jd.aktif= 'Y'" +
        " GROUP BY d.kode_dokter, jd.hari, d.nama_dokter, d.foto;", kodeDokter,
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