// https://expressjs.com/
const express       = require('express');
const bodyParser    = require('body-parser');
const cors          = require('cors')
const {json}        = require('body-parser');
var serviceAccount  = require("./sobatku-59e37-firebase-adminsdk-7swhs-f3178a41ac.json");
var admin           = require("firebase-admin");
const port          = process.env.PORT || 3001;
const app           = express();

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}


app.use(cors(corsOptions));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const middleware = function (req, res, next) {
    console.log(req.headers);
    const dateNow =  Math.floor(new Date().getTime() / 1000);
    var max5 = dateNow + 300;
    var min5 = dateNow - 300;
    const id = "SOBAtku2107";
    var time = req.headers.time;
    var token = req.headers.token;
    if(time >= min5 && time <= max5) {
        var secretKey = "kataRahasi4";
        var signature = require('crypto').createHmac("sha256", secretKey).update(id + "&" + time).digest('base64');
        if(token == signature)
            next();
        else 
            res.json({error_code: 401, message: "Token Salah"});
    }
    else
        res.json({error_code: 401, message: "Unauthorized User"});
}

app.use(middleware);

const pasienRoutes = require('./src/routes/pasien_route');
const userRoutes = require('./src/routes/user_route');
const pairingRoutes = require('./src/routes/pairing_route');
const jadwalDokterRoutes = require('./src/routes/jadwal_dokter_route');
const pendaftaranRoutes = require('./src/routes/pendaftaran_route');
const logRoutes = require('./src/routes/log_route');
const dokterRoutes = require('./src/routes/dokter_route');
const notifRoutes = require('./src/routes/notification_route');
const bannerRoutes = require('./src/routes/banner_route');
const spesialisasiRoutes = require('./src/routes/spesialisasi.route');
const verificationRoutes = require('./src/routes/verification_routes');
const favoritRoutes = require('./src/routes/favorit_routes');
const cutiRoutes = require('./src/routes/cuti_route');
const aktivasiRoutes = require('./src/routes/aktivasi_route');
const bpjsRoutes = require('./src/routes/cek_bpjs_route');
const jadwalRoutes = require('./src/routes/jadwal_route');
const dataRsRoutes = require('./src/routes/dataRs_route');

app.use('/api/v1/pasien', pasienRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/pairing', pairingRoutes);
app.use('/api/v1/jadwal', jadwalDokterRoutes);
app.use('/api/v1/transaksi', pendaftaranRoutes);
app.use('/api/v1/log', logRoutes);
app.use('/api/v1/dokter', dokterRoutes);
app.use('/api/v1/notif', notifRoutes);
app.use('/api/v1/banner', bannerRoutes);
app.use('/api/v1/spesialisasi', spesialisasiRoutes);
app.use('/api/v1/verifikasi', verificationRoutes);
app.use('/api/v1/favorit', favoritRoutes);
app.use('/api/v1/cuti', cutiRoutes);
app.use('/api/v1/aktivasi', aktivasiRoutes);
app.use('/api/v1/bpjs', bpjsRoutes);
app.use('/api/v1/jadwal_jam', jadwalRoutes);
app.use('/', dataRsRoutes);



