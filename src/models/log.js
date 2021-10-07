const express = require('express');
var dbConn = require('./../../config/db.config');

var Log = function(log) {
    this.id_log = log.id_log;
    this.nomor_rm = log.nomor_rm;
    this.id_user = log.id_user;
    this.keterangan = log.keterangan;
    this.perubahan = log.perubahan;
}

Log.create = function(log, result) {
    dbConn.query("INSERT INTO log SET ?", log,
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

module.exports = Log;