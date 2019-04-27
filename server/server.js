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

    let auth = '';

    //1. Auth get csrf,
    request({
        url: loginURL,
    }, function (error, response, body) {
        if (response && response.statusCode === 200) {
            const $ = cheerio.load(response.body);

            auth = $('input[name="csrf"]')[0].attribs.value;
            console.log(auth);
            let formData = {
                'username': user,
                'password': pwd,
                'csrf': auth
            }

            //2. Login: username,password, csrf value
            request({
                method: 'POST',
                url: loginAPI,
                body: querystring.stringify(formData),
                headers: {
                    'Referer': 'https://f2e-test.herokuapp.com/login',
                    'Host': 'f2e-test.herokuapp.com',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Connection': 'keep-alive',
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
                },
            }, function (error, response, body) {
                console.log("set-cookie");
                console.log(response.headers["set-cookie"]);
                //3. Get login success response
                if (response && response.statusCode === 302) {
                    res.header["set-cookie"] = response.headers["set-cookie"];

                    //4. Get Json Data
                    request({
                        url: dataAPI,
                        body: querystring.stringify(formData),
                        headers: {
                            'Referer': 'https://f2e-test.herokuapp.com/login',
                            'Host': 'f2e-test.herokuapp.com',
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Cookie': response.headers["set-cookie"],
                            'Connection': 'keep-alive',
                            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
                        },
                    }, function (error, response, body) {
                        if (response && response.statusCode === 200) {
                            let file = "./output/result.json";
                            let filePath = path.resolve(__dirname, file);

                            fs.writeFile(filePath, JSON.stringify(JSON.parse(body).data, null, 2), (err) => {
                                if (err) throw err;
                            });

                            res.send('done, please check /server/output/result.json');
                        } else {
                            res.send(error);
                        }
                    })
                }
            })
        }
    })
});

app.listen(config.port, function listenHandler() {
    console.info(`Running on ${config.port}`);
});