const express = require('express');
var dbConn = require('./../../config/db.config');

var Dokter = function(dokter) {
    this.id_dokter          = dokter.id_dokter;
    this.kode_dokter        = dokter.kode_dokter;
    this.nama               = dokter.nama;
    this.id_spesialisasi    = dokter.id_spesialisasi;
    this.nama_spesialisasi  = dokter.nama_spesialisasi;
}

Dokter.get = function(result) {
    dbConn.query("SELECT d.id_dokter, d.kode_dokter, d.foto, d.nama_dokter, s.nama_spesialisasi" +
        " FROM dokter d JOIN spesialisasi s ON d.kode_spesialisasi = s.kode_spesialisasi"+
        " INNER JOIN jadwal_dokter jd ON d.kode_dokter = jd.kode_dokter" + 
        " GROUP BY d.id_dokter, d.kode_dokter, d.foto, d.nama_dokter, s.nama_spesialisasi" +
        " ORDER BY d.nama_dokter ASC",
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

Dokter.search = function(kodeDokter, result) {
    dbConn.query("SELECT * FROM dokter d JOIN spesialisasi s ON d.kode_spesialisasi = s.kode_spesialisasi"+
    " WHERE d.kode_dokter = ?; ", kodeDokter,
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

Dokter.getBySpesialisasi = function(idSpesialisasi, result) {
    dbConn.query("SELECT * FROM dokter d WHERE d.kode_spesialisasi =? ORDER BY d.nama_dokter ASC", idSpesialisasi,
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

Dokter.getFavorit = function(idUser, result) {
    dbConn.query("SELECT * FROM dokter d JOIN spesialisasi s ON d.kode_spesialisasi = s.kode_spesialisasi"+
        " JOIN dokter_favorit df ON d.id_dokter = df.id_dokter"+
        " WHERE df.id_user = ?" +
        " ORDER BY d.nama_dokter ASC; ", idUser,
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

Dokter.tambahFavorit = function(data, result) {
    dbConn.query("INSERT INTO dokter_favorit SET ?", [data],
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

Dokter.hapusFavorit = function(idUser, idDokter, result) {
    dbConn.query("DELETE FROM dokter_favorit WHERE id_dokter=? AND id_user=?", [idDokter,idUser],
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

Dokter.cekCuti = function(kodeDokter, result) {
    dbConn.query("SELECT * FROM cuti_dokter WHERE kode_dokter = ? ORDER BY timestamp LIMIT 1", kodeDokter,
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

module.exports = Dokter;