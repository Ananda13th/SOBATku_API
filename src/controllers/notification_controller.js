const admin = require("firebase-admin");
const {json} = require('body-parser');
const PendaftaranResp = require('../models/pendaftaranResp');
const Notifikasi = require("../models/notifikasi");
const Pairing = require("../models/pairing");

const db = admin.firestore();

exports.getNotificationList = function async(req, res) {
    Notifikasi.get(req.params.idUser, function(error, result) {
        if(error)
            res.send(error);
        res.json({error_code: 200, message: "Success", data : result})
    })
}

exports.sendNotification = function async(kodeJadwal, antrian, res) {// notif kiriman antrian dari RS diterima di sini kemudian
    /* CARI DATA PENDAFTARAN DARI KODEJADWAL YANG DIKIRIMKAN DARI RS*/
    PendaftaranResp.search(kodeJadwal, function(error, result) {
        if(error) {
            console.log("Error : ", error);
        }
        else {
            /* LAKUKAN ITERASI PADA SETIAP HASIL PENCARIAN*/
            result.forEach( dataPendaftaran => {
               try {
                   if(dataPendaftaran.id_user == "Dari RS") {
                       /* BILA PENDAFTARAN DARI RS, AKAN DICARI DATA USER DAN PASIEN PADA TABEL PAIRING
                          DARI NOMOR RM YANG ADA PADA DATA PENDAFTARAN
                       */
                        Pairing.search(dataPendaftaran.nomor_rm, function(error, result) {
                            if(error)
                                res.send(error);
                            if(result.length == 0)
                                console.log("Pasien Tidak Ada Di Database App Sobatku");
                            else
                                /* SETIAP PAIRING YANG DITEMUKAN AKAN DIKIRIM UNTUK NOTIFIKASI 
                                   HASIL BALIKAN PAIRING BERUPA NOMOR RM DAN ID USER
                                */
                                result.forEach((pairing) => {
                                    var dataPairing = JSON.parse(JSON.stringify(pairing));
                                    sendNotifFromFirebase(antrian, dataPairing, dataPendaftaran, dataPendaftaran.antrian);
                                })
                        })
                    } 
                   else {
                        /* BILA PENDAFTARAN DARI APLIKASI, DATA TRANSAKSI DAN ID USER SUDAH TERSEDIA */
                        sendNotifFromFirebase(antrian, dataPendaftaran, dataPendaftaran, dataPendaftaran.antrian);
                   }
               }
               catch (error) {
                console.error(error);
              }
           });
        }
    });
}

function sendNotifFromFirebase(antrianBerjalan, data, dataTransaksi, antrian) {// lanjut disini jika sudah ketemu
    var counter = antrian-antrianBerjalan;
    if(counter == 10 || counter <=5 || antrianBerjalan == 1 && counter > 0) {
        /* MENGAMBIL SEMUA DATA PASIEN DARI ID USER */
         db.collection('user').doc(data.id_user.toString()).collection('pasien').get()
        .then(
            snapshot => {
                snapshot.forEach( (pasien) => {
                    /* MELAKUKAN PENGECEKAN APAKAH PASIEN MEMILIKI NOMOR RM 
                       YANG SAMA DENGAN DATA YANG DIKIRIM
                    */
                    if(pasien.data().no_rm == data.nomor_rm) {
                        /* MENGAMBIL DEVICE TOKEN YANG DISIMPAN PADA FIRESTORE */
                        var regkey = pasien.data().token;
                        /* BUAT ISI NOTIFIKASI */
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
                           
                            if(response.results[0].error != null)
                                console.log(response.results[0].error);
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
                        }).catch(function(error) {
                            console.log("Error: ", error);
                        });
                    }
                })
            }
        )

    }
}

exports.notifikasiBebas = function async(req, res) {// notif dari admin web lanjut custom notif
    Pairing.search(req.params.noRm, function(error, result) {
        if(error)
            res.send(error);
        else
            result.forEach((pairing) => {
                var data = JSON.parse(JSON.stringify(pairing))
                sendCustomNotifFromFirebase(data, req.body);
            })
            res.send({error_code: 200, message: "Success"});
    })
}

function sendCustomNotifFromFirebase(data, notifikasi) {// ini custom nya dari admin web
    var id_user = data.id_user.toString();
    db.collection('user').doc(id_user).collection('pasien').get()
    .then(
        snapshot => {
            snapshot.forEach( (pasien) => {
                if(pasien.data().no_rm == data.nomor_rm) {
                    var regkey = pasien.data().token;
                    var payload = {
                        notification: {
                            title   : notifikasi.judul,
                            body    : "Untuk Saudara/i " + pasien.id + ", " +notifikasi.notifikasi,
                            sound   : "default"
                        }
                    };
                    console.log(payload);
                    var opt = {
                        priority:"high",
                        timeToLive: 60*60*24
                    }
                    admin.messaging().sendToDevice(regkey, payload, opt)
                    .then(function(response) {
                        var newNotif = new Notifikasi( 
                            {
                                id_user : data.id_user,
                                judul   : notifikasi.judul,
                                berita  : "Untuk Saudara/i " + pasien.id + ", " +notifikasi.notifikasi,
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