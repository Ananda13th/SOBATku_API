const Banner = require("../models/banner");

exports.getBanner = function async(req, res) {
    Banner.get(function(error, result) {
        if(error)
            res.send(error);
        res.json({error_code: 200, message: "Success", data : result})
    })
}