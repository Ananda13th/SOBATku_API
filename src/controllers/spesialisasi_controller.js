const {json} = require('body-parser');
const Spesialisasi = require('../models/spesialisasi');

exports.getSpesialisasi = function(req, res) {// hp saja
    Spesialisasi.get(function(err, result) {
        if(err)
            res.send(err);
        else
            res.json({error_code: 200, message: "Success", data : result});
    });
}
