const express = require('express');
var dbConn = require('./../../config/db.config');

var User = function(user) {
    this.id_user    = user.id_user;
    this.password   = user.password;
    this.nama_user  = user.nama_user;
    this.nomor_hp   = user.nomor_hp;
    this.email      = user.email;
}

User.get = function(noHp, result) {
    // var data = password.replace(/(\r\n|\n|\r)/gm, "");
    dbConn.query(
        "SELECT * FROM user WHERE nomor_hp=? AND aktif='1'", noHp, 
        function(err, res) {
            if(err) {
                console.log("error : ", err);
                result(err, null);
            } else {
                console.log(res);
                result(null, res);
            }
        }
    )
}

User.create = function(newUser, result) {
    dbConn.query(
        "INSERT INTO user SET ?", newUser,
        function(err, res) {
            if(err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                console.log(res);
                result(null, res);
            }
        }
    )
}

User.update = function(id, email, password, result) {
    dbConn.query(
        "UPDATE user SET email= ?, password= ? WHERE id_user = ?", [email,password,id], 
        function(err, res) {
            if(err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                console.log(res);
                result(null, res);
            }
        }
    )
}

User.resetPassword = function(noHp, newPassword, result) {
    dbConn.query(
        "UPDATE user SET password= ? WHERE nomor_hp = ?", [newPassword, noHp] ,
        function(err, res) {
            if(err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                console.log(res);
                result(null, res);
            }
        }
    )
}

User.createOtp = function(nomorHp, kodeOtp, result) {
    dbConn.query(
        "INSERT INTO daftar_otp SET nomor_hp= ?, kode_otp= ?", [nomorHp, kodeOtp], 
        function(err, res) {
            if(err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                console.log(res);
                result(null, res);
            }
        }
    )
}

User.verify = function(nomorHp, kodeOtp, result) {
    dbConn.query(
        "Update user u SET u.aktif='1' WHERE u.id_user = (SELECT u.id_user FROM user u JOIN daftar_otp d ON u.nomor_hp = d.nomor_hp WHERE d.nomor_hp= ? AND d.kode_otp= ?)", [nomorHp, kodeOtp], 
        function(err, res) {
            if(err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                if(res.changedRows == 0)
                    result(null, null);
                else
                    result(null, res);
            }
        }
    )
}

User.resend = function(nomorHp, kodeOtp, result) {
    dbConn.query(
        "Update daftar_otp d set d.kode_otp=? WHERE d.nomor_hp= ?", [kodeOtp, nomorHp], 
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

module.exports = User;