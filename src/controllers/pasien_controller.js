const {json} = require('body-parser');
const Pasien = require('../models/pasien');

exports.getPasien = function(req, res) {
    Pasien.get(req.params.idUser, function(error, pasien) {
        if(error)
            res.send(error);
        res.json({error_code: 200, message: "Success", data : pasien})
    });
}

exports.createPasien = function async(req, res) {
    const newPasien = new Pasien(req.body);
    Pasien.create(newPasien, function(error, pasien) {
        if(error) {
            res.send("Error : ", error);
        }
        else {
            res.send({error_code: 200, message: "Success", data: pasien});
        }
    });
}

exports.searchPasien = function async(req, res) {
    Pasien.search(req.params.noRm, req.params.namaBelakang, function(error, result) {
        if(error)
            res.send("Error : ", error);
        else {
            if(result == null) {
                res.send({error_code: 400, message: "Data Pasien Tidak Ada!"});
            }
            else {
                res.send({error_code: 200, message: "Success"});
            }
        }  
    })
}
