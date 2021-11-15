const {json} = require('body-parser');
const Jadwal = require('../models/jadwal');

exports.getJam = function(req, res) {
    Jadwal.getJam(function(err, result) {
        if(err)
            res.send(err);
        res.json({error_code: 200, message: "Success", data : result});
    });
}
