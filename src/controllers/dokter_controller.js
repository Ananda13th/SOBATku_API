const {json} = require('body-parser');
const Dokter = require('../models/dokter');

exports.getDokter = function(req, res) {// hp dan admin
    Dokter.get(
        function(error, result) {
            if(error) {
                res.json({error_code: 400, message: "Failed", data : []});
                res.send(error);
            }
            else {
                res.json({error_code: 200, message: "Success", data : result});
            }
        })
}

exports.getDokterBySpesialisasi = function(req, res) {// hp saja
    Dokter.getBySpesialisasi(req.params.idSpesialisasi, 
        function(error, result) {
            if(error) {
                res.json({error_code: 400, message: "Failed", data : []});
                res.send(error);
            }
            else {
                res.json({error_code: 200, message: "Success", data : result});
            }
        }
    )
}






