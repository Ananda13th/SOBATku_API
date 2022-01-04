const {json} = require('body-parser');
const Jadwal = require('../models/jadwal');

exports.getJam = function(req, res) {// admin web saja
    Jadwal.getJam(req.params.kodeDokter, function(err, result) {
        if(err)
            res.send(err);
        else
            res.json({error_code: 200, message: "Success", data : result});
    });
}
