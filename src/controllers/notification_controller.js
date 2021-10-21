var serviceAccount = require("../../flutter-fcm-2cfd1-firebase-adminsdk-zy4vc-8172239293.json");
var admin = require("firebase-admin");
const PendaftaranResp = require('../models/pendaftaranResp');
const Notifikasi = require("../models/notifikasi");


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

exports.sendNotification = function async(req, res) {
    PendaftaranResp.search(req.params.kodeJadwal, function(error, result) {
        if(error) {
            res.send("Error : ", error);
        }
        else {
           result.forEach( value => {
               try {
                sendNotifFromFirebase(req.params.antrian, value);
               }
               catch (error) {
                console.error(error);
              }
           });
           res.send("Done")
        }
    });
}

function sendNotifFromFirebase(noAntrian, data) {
    var counter = data.antrian-noAntrian;
    if(counter == 10 || counter <=5 || noAntrian == 1 && counter > 0) {
        var database = db.collection('user').get();
        database.then(user => {
            user.forEach( subcollection => {
                db.collection('user').doc(subcollection.id).collection('pasien').get()
                .then(
                    snapshot => {
                        snapshot.forEach( (pasien) => {
                            if(pasien.data().no_rm == data.nomor_rm) {
                                console.log(pasien.data().token);
                                var regkey = pasien.data().token;
                                var payload = {
                                    notification: {
                                        title   : 'Antrian ' + data.dokter,
                                        body    : "Pasien : " + pasien.id + '\nAntrian Anda Kurang : ' + counter + "\nAntrian Sekarang : " + noAntrian,
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
                                            judul   : 'Antrian ' + data.dokter,
                                            berita  : 'Antrian Sekarang : '+ noAntrian
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
            })
        })
    }
}