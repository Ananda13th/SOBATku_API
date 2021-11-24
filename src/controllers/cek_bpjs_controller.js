const {json} = require('body-parser');
const { response } = require('express');

const consumer_id= "16669"
const consumer_password= "7aK5895896"
const user_key = "f8a3cfdfe2df67c7fdac993603794346"
const axios = require('axios');
var crypto = require('crypto');
const { decompressFromEncodedURIComponent } = require('lz-string');
const baseUrlBpjs = 'https://apijkn-dev.bpjs-kesehatan.go.id/vclaim-rest-dev/';


exports.cekStatusBpjs = async function (req, res) {
    const timestamp = createTimestamp();
    const signature = createSignature(timestamp);
    const dateTime = new Date(new Date().setHours(new Date().getHours() + 7));
    
    var config = {
        headers : 
        {
            'X-cons-id'     : consumer_id,
            'X-timestamp'   : timestamp,
            'X-signature'   : signature,
            'user_key'      : user_key,
            'Content-Type'  : 'application/json; charset=UTF-8',
        }
    }
    
    try {
        await axios.get(baseUrlBpjs+'Peserta/nokartu/' + req.params.noBpjs +'/tglSEP/'+ dateTime.toISOString().substr(0,10), config)
        .then(function(response) {
            var kodeResponse = response.data.metaData.code;
            if(kodeResponse == "200") {
                var decompressedResponse = decryptResponse(timestamp, response.data.response);  
                res.json({error_code : "200", data: decompressedResponse.peserta.statusPeserta.keterangan});
            }
            else if(kodeResponse != "200") {
                res.send({error_code :response.data.metaData.code, message : response.data.metaData.message});
            }
        });

    } catch (err) {
        res.send(err);
    }

}

exports.cekRujukanBpjs = async function (req, res) {
    const timestamp = createTimestamp();
    const signature = createSignature(timestamp);
    var config = {
        headers : 
        {
            'X-cons-id'     : consumer_id,
            'X-timestamp'   : timestamp,
            'X-signature'   : signature,
            'user_key'      : user_key,
            'Content-Type'  : 'application/json; charset=UTF-8',
        }
    }
    
    try {
        await axios.get(baseUrlBpjs+'Rujukan/Peserta/' + req.params.noBpjs, config)
        .then(function(response) {
            var kodeResponse = response.data.metaData.code;
            if(kodeResponse == "200") {
                var decompressedResponse = decryptResponse(timestamp, response.data.response);  
                res.send(decompressedResponse);
            }
            else if(kodeResponse != "200") {
                res.send({error_code :response.data.metaData.code, message : response.data.metaData.message});
            }
        });

    } catch (err) {
        res.send(err);
    }

}

function createTimestamp() {
    const dateNow = Math.floor(new Date().getTime() / 1000);
    return dateNow.toString();
}

function createSignature(timestamp) {
    var signature = require('crypto').createHmac("sha256", consumer_password)
        .update(consumer_id + "&" + timestamp).digest('base64');
    return signature.toString();
}

function decryptResponse(timestamp, encryptedString) {
    const key = consumer_id+consumer_password+timestamp
    var key_hash = crypto.createHash("sha256").update(key).digest();
    var iv = key_hash.slice(0,16);

    try{
        var decoder = crypto.createDecipheriv('aes-256-cbc', key_hash, iv);
        var output = decoder.update(encryptedString,'base64','utf8') + decoder.final('utf8');
    }
    catch(error) {
        console.log(error);
    }

    try{
        var decompressedString = decompressFromEncodedURIComponent(output);
    }
    catch(error) {
        console.log(error);
    }
    
    const response =  JSON.parse(decompressedString);
    return response;
}