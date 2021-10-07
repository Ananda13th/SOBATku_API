const express = require('express');
var dbConn = require('./../../config/db.config');

var Banner = function(dokter) {
    this.id_banner  = dokter.id_banner;
    this.url        = dokter.url;
    this.deskripsi  = dokter.deskripsi;
}

Banner.get = function(result) {
    dbConn.query("SELECT * FROM banner",
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

module.exports = Banner;