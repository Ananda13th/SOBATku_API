const express = require('express');
var dbConn = require('../../config/db.config');

var PendaftaranReq = function(transaksi) {
    this.str        = transaksi.str;
    this.rm         = transaksi.rm;
    this.kodejadwal = transaksi.kodejadwal;
    this.tipe       = transaksi.tipe;
}

module.exports = PendaftaranReq;