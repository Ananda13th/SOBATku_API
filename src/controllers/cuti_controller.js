const { json } = require("body-parser");
const Cuti = require("../models/cuti");
const moment = require('moment');

exports.cariJadwalCuti = function async(req, res) {
    Cuti.cekCuti(req.params.kodeJadwal, function(error, result) {
        if(error)
            res.send(error);
        if(result.length == 0) {
            res.json({error_code: 200, message: "Success", data : false});
        }
        else {
            res.json({error_code: 200, message: "Success", data : true});
        }
    });
}

exports.ambilJadwalCuti = function async(req, res) {
    Cuti.ambilCuti(function(error, result) {
        if(error)
            res.send(error);
        if(result.length == 0) {
            res.json({error_code: 200, message: "Success", data : []});
        }
        else {
            res.json({error_code: 200, message: "Success", data : result});
        }
    })
}

exports.buatJadwalCuti = function async(req, res) {
    var request = req.body;
    var startDate = moment(request.mulai);
    var endDate = moment(request.selesai);

    Cuti.ambilJadwal(request.kode_dokter, function(error, result) {
        if(error)
            res.send(error);
        if(result.length == 0 )
            res.json({error_code: 201, message: "Jadwal Tidak Ditemukan"});
        else {
            result.forEach(jadwal => {
                var start = startDate.clone()
                if(req.params.hari != null) {
                    while(start.isSameOrBefore(endDate)) {
                        if(req.params.hari == jadwal.hari && req.params.hari == start.weekday()) {
                            if(req.params.jam != null && req.params.jam == jadwal.jam.substring(0,2)) {
                                var kodeJadwal = request.kode_dokter + "." + start.format('YYMMDD') + jadwal.jam.substring(0,2);
                                Cuti.inputCuti(request.kode_dokter, kodeJadwal, function(error, result) {});
                            }
                            else if(req.params.jam == null) {
                                var kodeJadwal = request.kode_dokter + "." + start.format('YYMMDD') + jadwal.jam.substring(0,2);
                                Cuti.inputCuti(request.kode_dokter, kodeJadwal, function(error, result) {});
                            }
                        }
                        start.add(1, 'days');
                    }
                } 
                else {
                    while(start.isSameOrBefore(endDate)) {
                        if(jadwal.hari == start.weekday()) {
                            var kodeJadwal = request.kode_dokter + "." + start.format('YYMMDD') + jadwal.jam.substring(0,2);
                            Cuti.inputCuti(request.kode_dokter, kodeJadwal, function(error, result) {});
                        }
                        start.add(1, 'days');
                    }
                }
            });
            res.json({error_code: 200, message: "Berhasil Menambah Cuti, Harap Cek di Daftar Cuti"});
        }
    });
}
