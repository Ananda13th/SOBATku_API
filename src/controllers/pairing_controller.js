const {json} = require('body-parser');
const Pairing = require('../models/pairing');

exports.createPairing = function async(req, res) {
    const newPairing = new Pairing(req.body);
    Pairing.create(newPairing, function(error, result) {
        if(error)
            res.send({error_code : 400, message : error});
        else    
            res.send({error_code: 200, message: "Success"});
    });
}

exports.deletePairing = function(req, res) {
    Pairing.delete(req.params.idUser, req.params.noRm, 
        function(error, result) {
            if(error)
                res.send("Error : ", error);
            else    
                res.send({message: "Success", data: result});
        }
    );
}



