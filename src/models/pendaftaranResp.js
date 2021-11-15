const { query } = require('express');
const express = require('express');
var dbConn = require('../../config/db.config');

var PendaftaranResp = function(transaksi) {
    this.mr                 = transaksi.mr;
    this.kode_dokter        = transaksi.kode_dokter;
    this.dokter             = transaksi.dokter;
    this.kode_spesialis     = transaksi.kode_spesialis;
    this.spesialis          = transaksi.spesialis;
    this.antrian            = transaksi.antrian;
    this.status             = transaksi.status;
    this.date               = transaksi.date;
    this.type               = transaksi.type;
    this.time               = transaksi.time;
    this.notifikasi         = transaksi.notifikasi;
}

PendaftaranResp.get = function(nomorRm, result) {
    //var data = nomorRm.replace(/(\r\n|\n|\r)/gm, "");
    dbConn.query("SELECT * FROM transaksi t JOIN pasien p ON t.nomor_rm = p.nomor_rm WHERE t.nomor_rm=?", nomorRm, 
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

PendaftaranResp.search = function(kodeJadwal, result) {
    dbConn.query("SELECT nomor_rm, dokter, antrian, id_user FROM transaksi WHERE kode_jadwal=?", kodeJadwal, 
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

PendaftaranResp.updateAntrian = function(kodeJadwal, noAntrian, result) {
    dbConn.query("UPDATE transaksi SET antrian_sekarang = ? WHERE kode_jadwal=?", [noAntrian, kodeJadwal], 
    function(err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    })
}

PendaftaranResp.create = function(newTransaksi, idUser, kodejadwal, kodeDokter, result) {
    dbConn.query(
        "INSERT INTO transaksi SET " +
        "nomor_rm = " + "'" + newTransaksi.mr + "'" +
        ", kode_dokter = " + "'" + kodeDokter + "'" +
        ", dokter = "+ "'" + newTransaksi.dokter + "'"+
        ", spesialis = " + "'" + newTransaksi.spesialis + "'" +
        ", antrian = " + "'" + newTransaksi.antrian + "'" +
        ", tanggal = " + "'" + newTransaksi.date + "'" +
        ", waktu = " + "'" + newTransaksi.time.replace(".", ":") + "'" +
        ", tipe_pembayaran = " + "'" + newTransaksi.type + "'" +
        ", id_user = "+ "'" + idUser + "'" +
        ", kode_jadwal = " + "'" + kodejadwal + "'", 
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

PendaftaranResp.hapusTransaksi = function(antrian, result) {
    dbConn.query(
        "DELETE FROM transaksi WHERE kode_jadwal = ? AND nomor_rm = ?", [antrian.kodejadwal, antrian.mr],
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





module.exports = PendaftaranResp;