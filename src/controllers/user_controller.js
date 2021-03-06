const {json} = require('body-parser');
var admin = require("firebase-admin");
const Log = require('../models/log');
const User = require('../models/user');
const Vonage = require('@vonage/server-sdk');
const bcrypt = require("bcrypt");
const router = require('../routes/user_route');

const vonage = new Vonage({
    apiKey: "9e0312e3",
    apiSecret: "YYoccYWtrKbK9m95"
  })


const db = admin.firestore();

exports.getUser = async function (req, res) {// ini cek hasil login pasien
    User.get(req.params.noHp, 
        async function(err, result) {
            if(err)
                res.send(err);
            else {
                //Bila Nomer HP Tidak Ditemukan
                if(result.length == 0)
                    res.send({error_code: 201, message: "Data Tidak Ditemukan", data: []});
                else {
                    const validPassword = await bcrypt.compare(req.params.password, result[0].password);
                    if(validPassword)
                        res.send({error_code: 200, message: "Success!", data: result});
                    else
                        //Bila Nomer HP Ditemukan Tapi Password Salah
                        res.send({error_code: 201, message: "Password/Nomor HP Salah", data: []});
                }
            }
        }
    );
}

exports.getAllUser = async function (req, res) {// admin saja
    User.getAll(
        function(err, result) {
            if(err)
                res.send(err);
            else {
                //Bila Nomer HP Tidak Ditemukan
                if(result.length == 0)
                    res.send({error_code: 201, message: "Data Tidak Ditemukan", data: []});
                else {
                    res.send({error_code: 200, message: "Success!", data: result});
                }
            }
        }
    );
}

exports.createUser = async function (req, res) {//admin dan hp
    const salt = await bcrypt.genSalt(10);
    plainPassword = req.body.password;
    req.body.password = await bcrypt.hashSync(req.body.password, salt);
    const newUser = new User(req.body);
    User.create(newUser, function(err, user) {
        if(err) {
            console.log("Error User: ", err.code);
            var newNotif = new Log( {
                nomor_rm    : "-",
                id_user     : "-",
                kode_dokter : "-",
                keterangan  : "Pendaftaran User",
                perubahan   : "Pendaftaran User Gagal : " + err.code
            })
            Log.create(newNotif, function(error, result) {});

            if(err.code == "ER_DUP_ENTRY")
                res.send({message: "Nomor HP Sudah Terdaftar", data: null}); 
            else 
                res.send({message: "Terjadi Kesalahan : " + err.code, data: null});  
        }
        else {
            var newNotif = new Log( {
                nomor_rm    : "-",
                id_user     : "-",
                kode_dokter : "-",
                keterangan  : "Pendaftaran User",
                perubahan   : 
                "Pendaftaran User Berhasil \n" +
                "Email : " + newUser.email +
                "\nPassword : " + plainPassword +
                "\nNo HP : " + newUser.nomor_hp
            })
            Log.create(newNotif, function(error, result) {});
            res.send({message: "Success!", data: user});
        }
    });
}

exports.updateUSer = async function (req, res) {//hp
    const salt = await bcrypt.genSalt(10);
    req.params.password = await bcrypt.hash(req.params.password, salt);
    User.update(req.params.id, req.params.email, req.params.password, 
        function(err, result) {
            if(err) {
                res.send("Error : ", err);  
                var newNotif = new Log( {
                    nomor_rm    : "-",
                    id_user     : req.params.id,
                    kode_dokter : "-",
                    keterangan  : "Update User",
                    perubahan   : "Update User Gagal"
                })
                Log.create(newNotif, function(error, result) {});
            }
            else {   
                var newNotif = new Log( {
                    nomor_rm    : "-",
                    id_user     : req.params.id,
                    kode_dokter : "-",
                    keterangan  : "Update User",
                    perubahan   : "Update User Berhasil, email : " + req.params.email + " password: " + req.params.password
                })
                Log.create(newNotif, function(error, result) {});
                res.send({error_code: 200, message: "Success!", data:result});
            }
        }
    )
}

exports.updateUserAdmin = async function (req, res) {// penerima kiriman dari admin web untuk perubahan data pasien
    User.updateAdmin(req.body.nama_user, req.body.nomor_hp, req.body.id_user, req.body.email,
        function(err, result) {
            if(err) {
                res.send("Error : ", err);  
                var newNotif = new Log( {
                    nomor_rm    : "-",
                    id_user     : req.body.id_user,
                    kode_dokter : "-",
                    keterangan  : "Update User",
                    perubahan   : "Update User Gagal"
                })
                Log.create(newNotif, function(error, result) {});
            }
            else {   
                var newNotif = new Log( {
                    nomor_rm    : "-",
                    id_user     : req.body.id_user,
                    kode_dokter : "-",
                    keterangan  : "Update User",
                    perubahan   : "Update User Berhasil : \nEmail : " + req.body.email + "\nNama : " + req.body.nama_user  + "\nHP : " + req.body.nomor_hp
                })
                Log.create(newNotif, function(error, result) {});
                res.send({error_code: 200, message: "Success!", data:result});
            }
        }
    )
}

exports.resetPassword = async function (req,res) {//hp saja
    console.log("Reset Password");
    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(req.params.password, salt);
    User.resetPassword(req.params.noHp, newPassword,
        function(err, result) {
            if(err) {
                console.log("Error");
                res.send("Error : ", err);  
            }
            else {  
                res.send({error_code: "200", message: "Success!"});
            }
        }
    )
}

exports.aktivasi = function async (req, res) {// hp dan admin untuk perubahan status user berhasil terdaftar
    console.log("Aktivasi")
    User.aktivasi(req.params.nomorHp, 
        function(err, result) {
            if(err) {
                console.log("Error");
                res.send("Error : ", err);  
            }
            else {  
                res.send({error_code: "200", message: "Success!"});
            }
        }
    )
}

exports.deleteFromFirebase = async function(req, res) {// delete data pasien di firebase (token, id pasien, dll)
    await db.collection("user").doc(req.params.idUser).collection("pasien").doc(req.params.namaPasien).delete();
}

exports.saveToFirebase = async function(req, res) {// save data pasien token dll
    if(req.body.fcmToken != null){

        db.collection('user').doc(req.body.idUser).collection('pasien')
        .doc(req.body.namaPasien).set({
            'token'    : req.body.fcmToken,
            'no_rm'    : req.body.noRm,
            'createAt' : new Date(),
        }).then;

        await db.collection("user").doc(req.body.idUser).set({
            'createAt' :  new Date(),
        });

        
    }
}
