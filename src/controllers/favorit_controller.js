const Dokter = require('../models/dokter');

exports.addDokterFavorit = function(req, res) {
    Dokter.tambahFavorit(req.body,
        function(error, result) {
            if(error) {
                res.json({error_code: 400, message: "Failed", data : []});
                res.send(error);
            }
            res.json({error_code: 200, message: "Success", data : result});
        }
    )
}

exports.getDokterFavorit = function(req, res) {
    Dokter.getFavorit( req.params.idUser,
        function(error, result) {
            if(error) {
                res.json({error_code: 400, message: "Failed", data : []});
                res.send(error);
            }
            res.json({error_code: 200, message: "Success", data : result});
        })
}

exports.deleteFavorit = function(req, res) {
    Dokter.hapusFavorit(req.params.idUser, req.params.idDokter,
        function(error, result) {
            if(error) {
                res.json({error_code: 400, message: "Failed"});
                res.send(error);
            }
            res.json({error_code: 200, message: "Success"});
        }
    )
}