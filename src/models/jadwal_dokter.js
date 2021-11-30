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
        "'hari', jd.hari,"+ 
        "'jadwal', CONCAT('[', GROUP_CONCAT(JSON_OBJECT( 'jam', jd.jam, 'aktif', jd.aktif, 'id', jd.id_jadwal) ) ,']')) AS data"+ 
        " FROM dokter d"+
        " JOIN jadwal_dokter jd ON d.kode_dokter = jd.kode_dokter"+ 
        " WHERE d.kode_spesialisasi = ? AND jd.hari= ?" +
        " GROUP BY d.kode_dokter, jd.hari, d.nama_dokter;", [idSpesialisasi, hari],
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
        "'hari', jd.hari,"+ 
        "'jadwal', CONCAT('[', GROUP_CONCAT(JSON_OBJECT( 'jam', jd.jam, 'aktif', jd.aktif, 'id', jd.id_jadwal) ) ,']')) AS data"+ 
        " FROM dokter d"+
        " JOIN jadwal_dokter jd ON d.kode_dokter = jd.kode_dokter"+ 
        " WHERE d.kode_dokter = ?" +
        " GROUP BY d.kode_dokter, jd.hari, d.nama_dokter;", kodeDokter,
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


// JadwalDokter.getBySchedule = function(idSpesialisasi, hari, result) {
//     dbConn.query(
//         "SELECT JSON_OBJECT("+
//         "'nama', d.nama_dokter,"+ 
//         "'kode_dokter', d.kode_dokter," +
//         "'hari', j.hari,"+ 
//         "'aktif', jd.aktif, " +
//         "'jadwal', CONCAT('[', GROUP_CONCAT(JSON_OBJECT( 'jam', j.jam, 'id', jd.kode_jadwal, 'aktif', jd.aktif) ) ,']')) AS data"+ 
//         " FROM dokter d"+
//         " JOIN jadwal_dokter jd ON d.kode_dokter = jd.kode_dokter"+ 
//         " JOIN jadwal j ON jd.id_jadwal = j.id_jadwal" +
//         " WHERE d.kode_spesialisasi = ? AND j.hari= ?" +
//         " GROUP BY d.kode_dokter, j.hari;", [idSpesialisasi, hari],
//         function(err, res) {
//             if(err) {
//                 result(err, null);
//             } else {
//                 result(null, res);
//             }
//         }
//     )
// }


// JadwalDokter.getById = function(kodeDokter, result) {
//     dbConn.query(
//         "SELECT JSON_OBJECT("+
//         "'nama', d.nama_dokter,"+ 
//         "'kode_dokter', d.kode_dokter," +
//         "'hari', j.hari,"+ 
//         "'jadwal', CONCAT('[', GROUP_CONCAT(JSON_OBJECT( 'jam', j.jam, 'id', jd.kode_jadwal) ) ,']')) AS data"+ 
//         " FROM dokter d"+
//         " JOIN jadwal_dokter jd ON d.kode_dokter = jd.kode_dokter"+ 
//         " JOIN jadwal j ON jd.id_jadwal = j.id_jadwal" +
//         " WHERE d.kode_dokter = ?" +
//         " GROUP BY d.kode_dokter, j.hari;", kodeDokter,
//         function(err, res) {
//             if(err) {
//                 console.log(err);
//                 result(err, null);
//             } else {
//                 result(null, res);
//             }
//         }
//     )
// }

module.exports = JadwalDokter;