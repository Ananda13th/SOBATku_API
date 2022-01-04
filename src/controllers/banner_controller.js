const Banner = require("../models/banner");
const moment = require('moment');


exports.getBanner = function async(req, res) {// tampilan banner di hp dengan jangka waktu tertentu
    Banner.get(function(error, result) {
        if(error) {
            console.log(error);
            res.send(error);
        }
        else
            res.json({error_code: 200, message: "Success", data : result});
    })
}

exports.getBannerNoFormat = function async(req, res) {// tampilan semua banner di web admin
    Banner.getWithoutFormat(function(error, result) {
        if(error)
            res.send(error);
        else
            res.json({error_code: 200, message: "Success", data : result});
    })
}

exports.addBanner = function async(req, res) {// menambahkan banner dari admin web
    
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

exports.editBanner = function async(req, res) {// edit banner dari admin web
    Banner.editBanner(req.body, 
        function(error, result) {
            if(error)
                res.send(error);
            else
                res.json({error_code: 200, message: "Success"});
        }
    );
}

exports.deleteBanner = function async(req, res) {// delete banner dari admin web
    Banner.delete(req.params.idBanner, 
        function(error, result) {
            if(error)
                res.send(error);
            else
                res.json({error_code: 200, message: "Success", data : result});
        }
        
    )
}