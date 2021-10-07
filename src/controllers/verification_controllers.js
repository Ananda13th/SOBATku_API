const User = require('../models/user');
const Vonage = require('@vonage/server-sdk');

const vonage = new Vonage({
    apiKey: "9e0312e3",
    apiSecret: "YYoccYWtrKbK9m95"
  })

exports.verifyOtp = function async(req, res) {
    User.verify(req.params.nomorHp, req.params.kodeOtp, 
        function(err, result) {
            if(err) {
                res.send("Error : ", err);  
            }
            else {  
                if(result == null)
                    res.send({error_code: "400", message: "Kode OTP Salah"});
                else
                    res.send({error_code: "200", message: "Kode OTP Berhasil Diverfikasi"});
            }
        }
    )
}

exports.createOtp = function async(req, res) {
    var kodeOtp = Math.floor(100000 + Math.random() * 900000);
    User.createOtp(req.params.nomorHp, kodeOtp, 
        function(err, result) {
            if(err) {
                console.log("Error");
                res.send("Error : ", err);  
            }
            else {  
                console.log("Berhasil");
                sendSMS(req.params.nomorHp, kodeOtp);
                res.send({error_code: "200", message: "Success!"});
            }
        }
    )
}

exports.resendOtp = function async(req, res) {
    var kodeOtp = Math.floor(100000 + Math.random() * 900000);
    User.resend(req.params.nomorHp, kodeOtp,
        function(err, result) {
            if(err) {
                console.log("Error");
                res.send("Error : ", err);  
            }
            else {  
                console.log("Berhasil");
                sendSMS(req.params.nomorHp, kodeOtp);
                res.send({error_code: "200", message: "Kode Terkirim"});
            }
        }
    )
}

function sendSMS(nomorHp, kodeOTP) {
    const from = "RS Oen Solo"
    const to = nomorHp
    const text = 'Anda telah mendaftar di aplikasi Dr. OEN SOBAtku dengan akun :\n\nNomor HP :'+ nomorHp + '\nKode Verifikasi : '+kodeOTP
    vonage.message.sendSms(from, to, text, (err, responseData) => {
        if (err) {
            console.log(err);
        } else {
            if(responseData.messages[0]['status'] === "0") {
                console.log("Message sent successfully.");
            } else {
                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            }
        }
    })
}
