const express = require('express');
var dbConn = require('./../../config/db.config');

var Jadwal = function(jadwal) {
    this.id_jadwal      = jadwal.id_jadwal;
    this.kode_jadwal    = jadwal.kode_jadwal;
    this.hari           = jadwal.hari;
    this.jam            = jadwal.jam
}

module.exports = Jadwal;