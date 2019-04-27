var bodyParser = require('body-parser');
var config = require('./config');
var ejs = require('ejs');
var express = require('express');
var fs = require('fs');
var http = require("http");
var path = require('path');
var request = require("request")

const app = express();
app.use('/public', express.static('public'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());

//HTTPS 
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/start', function (req, res, next) {
    // console.log(req.query);
    console.log(req.body);
    let url = 'https://opendata.epa.gov.tw/ws/Data/ATM00698/?$format=json';
    console.log(url);

    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (response && response.statusCode === 200) {
            let file = "./output/result.json";
            filePath = path.resolve(__dirname, file);

            fs.writeFile(filePath, JSON.stringify(body), (err) => {
                if (err) throw err;
                console.log(err);
            });

            res.send('done! please check /server/output/result.json');

        } else if (err) {
            if (err) throw err;
            console.log(err);
        }
    })


});


// app.get('/getData', function (req, res) {
//     let data = {};
//     let filePath = "";
//     const query = req.query;

//     let file = "./data/d" + (query && query.id ? query.id : "1") + ".json";
//     filePath = path.resolve(__dirname, file);
//     // query.page
//     // query.index

//     data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
//     res.setHeader('Content-Type', 'application/json');
//     res.send(data);
// });

app.listen(config.port, function listenHandler() {
    console.info(`Running on ${config.port}`);
});


// 'use strict';
// var path = require('path');
// var express = require('express');

// var app = express();

// var staticPath = path.join(__dirname, '/');
// app.use(express.static(staticPath));

// // Allows you to set port in the project properties.
// app.set('port', process.env.PORT || 3000);

// var server = app.listen(app.get('port'), function() {
//     console.log('listening');
// });