const {json} = require('body-parser');
const Jadwal_Dokter = require('../models/jadwal_dokter');

exports.getJadwalDokter = function(req, res) {
    var dataCollection = [];
    Jadwal_Dokter.getBySchedule(req.params.idSpesialisasi, req.params.hari, 
        function(error, jadwal) {
            if(error) {
                res.json({error_code: 400, message: "Failed", data : []});
                res.send(error);
            }
            jadwal.forEach((data) => {
                console.log(data.data);
                var obj = JSON.parse(data.data);
                obj.jadwal = JSON.parse(obj.jadwal);
                dataCollection.push(obj);
            })
            console.log(dataCollection);
            res.json({error_code: 200, message: "Success", data : dataCollection})
        }
    );
}

exports.getJadwalDokterById = function(req, res) {
    var dataCollection = [];
    Jadwal_Dokter.getById(req.params.idDokter, 
        function(error, result) {
            if(error) {
                res.json({error_code: 400, message: "Failed", data : []});
                res.send(error);
            }
            var obj = JSON.parse(JSON.stringify(result));
            obj.forEach(element => {
                var object = JSON.parse(element.data);
                object.jadwal = JSON.parse(object.jadwal);
                dataCollection.push(object);
            });
            res.json({error_code: 200, message: "Success", data : dataCollection});
        }
    );
}
