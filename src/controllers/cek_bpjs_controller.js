const {json} = require('body-parser');
const { response } = require('express');

const consumer_id= "16669"
const consumer_password= "7aK5895896"
const user_key = "f8a3cfdfe2df67c7fdac993603794346"
const axios = require('axios');
var crypto = require('crypto');
const { decompressFromEncodedURIComponent } = require('lz-string');
const { bpjs_url } = require('../../config/url');
 // URL BPJS VER2 PENGEMBANGAN
const baseUrlBpjs = bpjs_url;


exports.cekStatusBpjs = async function (req, res) {// cek no bpjs  pasien di bpjs apakah aktif/tidak
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

    /*** BYPASS AGAR BISA DAFTAR PASIEN SELAMA BPJS VER2 MASIH PENGEMBANGAN ***/
    // res.json({error_code : "200", data: "aktif"});
    
    /*** FUNGSI BILA BPJS VER2 SUDAH LIVE ***/
    try {
        await axios.get(baseUrlBpjs+'Peserta/nokartu/' + req.params.noBpjs +'/tglSEP/'+ dateTime.toISOString().substr(0,10), config)
        .then(function(response) {
            console.log("BPJS Cek Keaktifan");
            console.log("Response Status   : ", response.status);
            console.log("Response Message  : ", response.statusText);
            if(response.status == "500")
                res.json({error_code :response.data.metaData.code, message : "Terjadi Kesalahan Saat Koneksi ke Server BPJS, Harap Coba Lagi Nanti"});
            else if(response.status == "200"){
                if(response.data.metaData.code == "200") {
                    var decompressedResponse = decryptResponse(timestamp, response.data.response);  
                    res.json({error_code : "200", data: decompressedResponse.peserta.statusPeserta.keterangan});
                }
                else if(response.data.metaData.code == "201") {
                    res.json({error_code :response.data.metaData.code, message : "Nomor BPJS " + response.data.metaData.message});
                }
                else {
                    console.log(response);
                    res.json({error_code :response.data.metaData.code, message :  response.data.metaData.message});
                }
            }
            else {
                res.json({error_code :response.status, message : response.statusText});
            }
        });

    } catch (err) {
        res.json(err);
    }
}

exports.cekRujukanBpjs = async function (req, res) {// dipanggil saat pasien daftar poli dengan status bayar BPJS 
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

    /*** BYPASS AGAR BISA DAFTAR POLI RUJUKAN SELAMA BPJS VER2 MASIH PENGEMBANGAN ***/
    // res.json({error_code : "200", data: "aktif"});
    
    /*** FUNGSI BILA BPJS VER2 SUDAH LIVE ***/
    try {
        await axios.get(baseUrlBpjs+'Rujukan/Peserta/' + req.params.noBpjs, config)
        .then(function(response) {
            console.log("BPJS Cek Rujukan");
            console.log("Response Status   : ", response.status);
            console.log("Response Message  : ", response.statusText);
            if(response.status == "500")
                res.send({error_code :response.data.metaData.code, message : "Terjadi Kendala di Server BPJS, Harap Coba Lagi Nanti"});
            else if(response.status == "200"){
                if(response.data.metaData.code == "200") {
                    var decompressedResponse = decryptResponse(timestamp, response.data.response);  
                    res.send({error_code: response.data.metaData.code, data: decompressedResponse});
                }
                else if(response.data.metaData.code == "201") {
                    res.send({error_code :response.data.metaData.code, message : response.data.metaData.message});
                }
                else {
                    res.send({error_code :response.data.metaData.code, message :  response.data.metaData.message});
                }
            }
            else {
                res.send({error_code :response.status, message : response.statusText});
            }
        });

    } catch (err) {
        res.send(err);
    }

}

function createTimestamp() {// dipanggil saat cek status/rujukan no bpjs
    const dateNow = Math.floor(new Date().getTime() / 1000);
    return dateNow.toString();
}

function createSignature(timestamp) {// dipanggil saat cek status/rujukan no bpjs
    var signature = require('crypto').createHmac("sha256", consumer_password)
        .update(consumer_id + "&" + timestamp).digest('base64');
    return signature.toString();
}

function decryptResponse(timestamp, encryptedString) {// untuk decrypt saat cek status bpjs pasien
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