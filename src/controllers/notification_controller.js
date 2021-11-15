var serviceAccount = require("../../flutter-fcm-2cfd1-firebase-adminsdk-zy4vc-62e802105e.json");
var admin = require("firebase-admin");
const {json} = require('body-parser');
const PendaftaranResp = require('../models/pendaftaranResp');
const Notifikasi = require("../models/notifikasi");
const Pairing = require("../models/pairing");
const e = require("express");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://flutter-fcm-2cfd1-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.firestore();

exports.getNotificationList = function async(req, res) {
    Notifikasi.get(req.params.idUser, function(error, result) {
        if(error)
            res.send(error);
        res.json({error_code: 200, message: "Success", data : result})
    })
}

exports.sendNotification = function async(kodeJadwal, antrian, res) {
    PendaftaranResp.search(kodeJadwal, function(error, result) {
        if(error) {
            console.log("Error : ", error);
        }
        else {
           result.forEach( value => {
               try {
                   if(value.id_user == "Dari RS") {
                        Pairing.search(value.nomor_rm, function(error, result) {
                            if(error)
                                res.send(error);
                            if(result.length == 0)
                                console.log("Pasien Tidak Ada Di App Database App Sobatku");
                            else
                                result.forEach((pairing) => {
                                    var data = JSON.parse(JSON.stringify(pairing));
                                    sendNotifFromFirebase(antrian, data, value, value.antrian);
                                })
                        })
                    } 
                   else {
                        sendNotifFromFirebase(antrian, value, value, value.antrian);
                   }
               }
               catch (error) {
                console.error(error);
              }
           });
        }
    });
}

function sendNotifFromFirebase(antrianBerjalan, data, dataTransaksi, antrian) {
    var counter = antrian-antrianBerjalan;
    if(counter == 10 || counter <=5 || antrianBerjalan == 1 && counter > 0) {
         db.collection('user').doc(data.id_user.toString()).collection('pasien').get()
        .then(
            snapshot => {
                snapshot.forEach( (pasien) => {
                    if(pasien.data().no_rm == data.nomor_rm) {
                        var regkey = pasien.data().token;
                        var payload = {
                            notification: {
                                title   : 'Antrian ' + dataTransaksi.dokter,
                                body    : "Pasien : " + pasien.id + '\nAntrian Anda Kurang : ' + counter + "\nAntrian Sekarang : " + antrianBerjalan,
                                sound   : "default"
                            }
                        };
                        var opt = {
                            priority:"high",
                            timeToLive: 60*60*24
                        }
                        admin.messaging().sendToDevice(regkey, payload, opt)
                        .then(function(response) {
                            var newNotif = new Notifikasi( 
                                {
                                    id_user : pasien.ref.parent.parent.id,
                                    judul   : 'Antrian ' + dataTransaksi.dokter,
                                    berita  : 'Antrian Sekarang : '+ antrianBerjalan
                                }
                            )
                            Notifikasi.create(newNotif, function(error, result) {
                                if(error) {
                                    console.log(error);
                                }
                            });
                            console.log("Berhasil");
                        }).catch(function(error) {
                            console.log("Error: ", error);
                        });
                    }
                })
            }
        )

    }
}

exports.notifikasiBebas = function async(req, res) {
    Pairing.search(req.params.noRm, function(error, result) {
        if(error)
            res.send(error);
        else
            result.forEach((pairing) => {
                var data = JSON.parse(JSON.stringify(pairing))
                sendCustomNotifFromFirebase(data, req.body.notifikasi);
            })
            res.send({error_code: 200, message: "Success"});
    })
}

function sendCustomNotifFromFirebase(data, notifikasi) {
    var id_user = data.id_user.toString();
    db.collection('user').doc(id_user).collection('pasien').get()
    .then(
        snapshot => {
            snapshot.forEach( (pasien) => {
                if(pasien.data().no_rm == data.nomor_rm) {
                    var regkey = pasien.data().token;
                    var payload = {
                        notification: {
                            title   : 'Notifikasi Pasien ' + pasien.id,
                            body    : notifikasi,
                            sound   : "default"
                        }
                    };
                    var opt = {
                        priority:"high",
                        timeToLive: 60*60*24
                    }
                    admin.messaging().sendToDevice(regkey, payload, opt)
                    .then(function(response) {
                        var newNotif = new Notifikasi( 
                            {
                                id_user : data.id_user,
                                judul   : 'Notifikasi Pasien',
                                berita  : notifikasi,
                            }
                        )
                        Notifikasi.create(newNotif, function(error, result) {
                            if(error) {
                                console.log(error);
                            }
                        });
                        console.log("Berhasil");
                    }).catch(function(error) {
                        console.log("Error: ", error);
                    });
                }
            })
        }
    )
}