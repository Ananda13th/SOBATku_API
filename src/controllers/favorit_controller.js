const Dokter = require('../models/dokter');
// HP SAJA
exports.addDokterFavorit = function(req, res) {
    Dokter.tambahFavorit(req.body,
        function(error, result) {
            if(error) {
                res.json({error_code: 500, message: "Internal Server Error", data : []});
            }
            else
                res.json({error_code: 200, message: "Success", data : result});
        }
    )
}

exports.getDokterFavorit = function(req, res) {
    Dokter.getFavorit( req.params.idUser,
        function(error, result) {
            if(error) {
                res.json({error_code: 500, message: "Internal Server Error", data : []});
            }
            else
                res.json({error_code: 200, message: "Success", data : result});
        })
}

exports.deleteFavorit = function(req, res) {
    Dokter.hapusFavorit(req.params.idUser, req.params.idDokter,
        function(error, result) {
            if(error) {
                res.json({error_code: 500, message: "Internal Server Error"});
            }
            else
                res.json({error_code: 200, message: "Success"});
        }
    )
}