const express = require('express');
var dbConn = require('./../../config/db.config');

var Banner = function(banner) {
    this.id_banner  = banner.id_banner;
    this.url        = banner.url;
    this.deskripsi  = banner.deskripsi;
}

Banner.get = function(result) {
    dbConn.query("SELECT * FROM `banner` WHERE CURRENT_DATE <= selesai AND CURRENT_DATE >= mulai ORDER BY mulai DESC",
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

Banner.getWithoutFormat = function(result) {
    dbConn.query("SELECT * FROM `banner` ORDER BY mulai DESC",
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

Banner.add = function(banner, result) {
    dbConn.query("INSERT INTO banner SET ?", banner, 
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

Banner.delete = function(idBanner, result) {
    dbConn.query("DELETE FROM banner WHERE id_gambar = ?", idBanner,
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

Banner.editBanner = function(banner, result) {
    dbConn.query("UPDATE banner SET " + 
        "judul = ?," +
        " url = ?," +
        " url_detail_banner = ?," +
        " url_sumber = ?," +
        " deskripsi = ?," +
        " keterangan = ?," +
        " mulai = ?," +
        " selesai = ?" +
        " WHERE id_gambar = ?", [banner.judul, banner.url, banner.url_detail_banner, banner.url_sumber, banner.deskripsi, banner.keterangan, banner.mulai, banner.selesai, banner.id_gambar],
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