var bodyParser = require('body-parser');
var config = require('./config');
var ejs = require('ejs');
var express = require('express');
var fs = require('fs');
var http = require("http");
var path = require('path');
var request = require("request")
var querystring = require('querystring');

const cheerio = require('cheerio')
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
    // console.log(req.body);

    // Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3
    // Accept-Encoding: gzip, deflate, br
    // Accept-Language: zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7
    // Cache-Control: no-cache
    // Connection: keep-alive
    // Host: f2e-test.herokuapp.com
    // Pragma: no-cache
    // Upgrade-Insecure-Requests: 1
    // User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1


    let site = 'https://f2e-test.herokuapp.com';
    let loginURL = 'https://f2e-test.herokuapp.com/login';
    let loginAPI = 'https://f2e-test.herokuapp.com/api/auth'
    let dataAPI = 'https://f2e-test.herokuapp.com/api/products?offset=0&limit=1000';
    let user = 'f2e-candidate';
    let pwd = 'P@ssw0rd'

    let url = 'https://f2e-test.herokuapp.com/api/products?offset=0&limit=1000';
    let auth = '';

    request({
        url: loginURL,
        // json: true
    }, function (error, response, body) {
        if (response && response.statusCode === 200) {
            const $ = cheerio.load(response.body);

            auth = $('input[name="csrf"]')[0].attribs.value;
            console.log(auth);
            querystring
            let formData = {
                'username': user,
                'password': pwd,
                'csrf': auth
            }

            request({
                method: 'POST',
                url: loginAPI,
                headers: {
                    'Referer': 'https://f2e-test.herokuapp.com/login',
                    'Host': 'f2e-test.herokuapp.com',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Connection': 'keep-alive',
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
                },
                data: querystring.stringify(formData)
            }, function (error, response, body) {
                console.log(response);
                if (response && response.statusCode === 200) {

                    request({
                        url: dataAPI,
                        // json: true
                    }, function (error, response, body) {
                        if (response && response.statusCode === 200) {
                            let file = "./output/result.json";
                            filePath = path.resolve(__dirname, file);

                            fs.writeFile(filePath, JSON.stringify(body), (err) => {
                                if (err) throw err;
                            });

                            res.send('done, please check /server/output/result.json');
                        } else {
                            res.send(error);
                        }
                    })


                    // res.send(response);

                }
            })

            res.send(auth);

        } else if (err) {
            if (err) throw err;
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