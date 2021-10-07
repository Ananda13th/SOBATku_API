const {json} = require('body-parser');
const Log = require('../models/log');

exports.createLog = function async(req, res) {
    const newLog = new Log(req.body);
    Log.create(newLog, function(err, log) {
        if(err)
            res.send("Error : ", err);
        else    
            res.send({message: "Success!", data: log});
    });
}