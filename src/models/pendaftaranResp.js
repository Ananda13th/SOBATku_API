const { query } = require('express');
const express = require('express');
var dbConn = require('../../config/db.config');

var PendaftaranResp = function(transaksi) {
    this.nomor_rm           = transaksi.nomor_rm;
    this.kode_dokter        = transaksi.kode_dokter;
    this.dokter             = transaksi.dokter;
    this.kode_spesialis     = transaksi.kode_spesialis;
    this.spesialis          = transaksi.spesialis;
    this.antrian            = transaksi.antrian;
    this.status             = transaksi.status;
    this.tanggal            = transaksi.tanggal;
    this.tipe_pembayaran    = transaksi.tipe_pembayaran;
    this.waktu              = transakis.waktu;
    this.notifikasi         = transaksi.notifikasi;
}

PendaftaranResp.get = function(idUser, result) {
    var data = idUser.replace(/(\r\n|\n|\r)/gm, "");
    dbConn.query("SELECT * FROM transaksi t JOIN pasien p ON t.nomor_rm = p.nomor_rm WHERE t.id_user=?", data, 
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
    dbConn.query("SELECT nomor_rm, dokter, antrian FROM transaksi WHERE kode_jadwal=?", kodeJadwal, 
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

module.exports = PendaftaranResp;