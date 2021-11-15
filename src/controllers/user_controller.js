const {json} = require('body-parser');
const Log = require('../models/log');
const User = require('../models/user');
const Vonage = require('@vonage/server-sdk');
const bcrypt = require("bcrypt");
const router = require('../routes/user_route');

const vonage = new Vonage({
    apiKey: "9e0312e3",
    apiSecret: "YYoccYWtrKbK9m95"
  })

exports.getUser = async function (req, res) {
    User.get(req.params.noHp, 
        async function(err, result) {
            if(err)
                res.send(err);
            else {
                //Bila Nomer HP Tidak Ditemukan
                if(result.length == 0)
                    res.send({error_code: 400, message: "Success!", data: []});
                else {
                    const validPassword = await bcrypt.compare(req.params.password, result[0].password);
                    if(validPassword)
                        res.send({error_code: 200, message: "Success!", data: result});
                    else
                          //Bila Nomer HP Ditemukan Tapi Password Salah
                        res.send({error_code: 400, message: "Success!", data: []});
                }
            }
        }
    );
}

exports.getAllUser = async function (req, res) {
    User.getAll(
        function(err, result) {
            if(err)
                res.send(err);
            else {
                //Bila Nomer HP Tidak Ditemukan
                if(result.length == 0)
                    res.send({error_code: 400, message: "Success!", data: []});
                else {
                    res.send({error_code: 200, message: "Success!", data: result});
                }
            }
        }
    );
}

exports.createUser = async function (req, res) {
    const salt = await bcrypt.genSalt(10);
    plainPassword = req.body.password;
    req.body.password = await bcrypt.hashSync(req.body.password, salt);
    const newUser = new User(req.body);
    User.create(newUser, function(err, user) {
        if(err) {
            var newNotif = new Log( {
                nomor_rm    : "-",
                id_user     : "-",
                kode_dokter : "-",
                keterangan  : "Pendaftaran User",
                perubahan   : "Pendaftaran User Gagal"
            })
            Log.create(newNotif, function(error, result) {});
            res.send("Error : ", err);  
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

exports.updateUSer = async function (req, res) {
    const salt = await bcrypt.genSalt(10);
    req.params.password = await bcrypt.hash(req.params.password, salt);
    User.update(req.params.id, req.params.email, req.params.password, 
        function(err, result) {
            if(err) {
                res.send("Error : ", err);  
                var newNotif = new Log( {
                    nomor_rm    : "-",
                    id_user     : req.params.id,
                    keterangan  : "Update User",
                    perubahan   : "Update User Gagal"
                })
                Log.create(newNotif, function(error, result) {});
            }
            else {   
                var newNotif = new Log( {
                    nomor_rm    : "-",
                    id_user     : req.params.id,
                    keterangan  : "Update User",
                    perubahan   : "Update User Berhasil, email : " + req.params.email + " password: " + req.params.password
                })
                Log.create(newNotif, function(error, result) {});
                res.send({error_code: 200, message: "Success!", data:result});
            }
        }
    )
}

exports.updateUserAdmin = async function (req, res) {
    User.updateAdmin(req.params.nama, req.params.noHp, req.params.id, req.params.email,
        function(err, result) {
            if(err) {
                res.send("Error : ", err);  
                var newNotif = new Log( {
                    nomor_rm    : "-",
                    id_user     : req.params.id,
                    keterangan  : "Update User",
                    perubahan   : "Update User Gagal"
                })
                Log.create(newNotif, function(error, result) {});
            }
            else {   
                var newNotif = new Log( {
                    nomor_rm    : "-",
                    id_user     : req.params.id,
                    keterangan  : "Update User",
                    perubahan   : "Update User Berhasil, email : " + req.params.email + " password: " + req.params.password
                })
                Log.create(newNotif, function(error, result) {});
                res.send({error_code: 200, message: "Success!", data:result});
            }
        }
    )
}

exports.resetPassword = async function (req,res) {
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

exports.aktivasi = function async (req, res) {
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

function sendMessage(nomorHp, newPassword) {
    console.log(nomorHp);
    const from = "RS Oen Solo"
    const to = nomorHp
    const text = 'Password Baru Anda : '+ newPassword 
    vonage.message.sendSms(from, to, text, (err, responseData) => {
        if (err) {
            console.log(err);
        } else {
            if(responseData.messages[0]['status'] === "0") {
                console.log("Message sent successfully.");
            } else {
                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            }
        }
    })
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

