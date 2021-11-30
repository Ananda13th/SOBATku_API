const Banner = require("../models/banner");
const moment = require('moment');


exports.getBanner = function async(req, res) {
    Banner.get(function(error, result) {
        if(error)
            res.send(error);
        res.json({error_code: 200, message: "Success", data : result});
    })
}

exports.getBannerNoFormat = function async(req, res) {
    Banner.getWithoutFormat(function(error, result) {
        if(error)
            res.send(error);
        res.json({error_code: 200, message: "Success", data : result});
    })
}

exports.addBanner = function async(req, res) {
    
    var mulai = moment(req.body.mulai);
    var selesai = moment(req.body.selesai);

    req.body.mulai = mulai.add(moment.duration(7, 'hours')).format("YYYY-MM-DD HH:mm:ss");
    req.body.selesai = selesai.add(moment.duration(7, 'hours')).format("YYYY-MM-DD HH:mm:ss");
    console.log(req.body);

    Banner.add(req.body, function(error, result) {
        if(error)
            res.send(error);
        else
            res.json({error_code: 200, message: "Success"});
    })
}

exports.editBanner = function async(req, res) {
    Banner.editBanner(req.body, 
        function(error, result) {
            if(error)
                res.send(error);
            else
                res.json({error_code: 200, message: "Success"});
        }
    );
}

exports.deleteBanner = function async(req, res) {
    Banner.delete(req.params.idBanner, 
        function(error, result) {
            if(error)
                res.send(error);
            else
                res.json({error_code: 200, message: "Success", data : result});
        }
        
    )
}