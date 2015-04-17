var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var apis_manager = require('./apis_manager');

var app = express();
app.use(bodyParser.json());

var optionsGET = {
    host: 'theabsinthemind.herokuapp.com',
    path: '/countries',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

var optionsPOST = {
    host: 'theabsinthemind.herokuapp.com',
    path: '/countries',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

var optionsDELETE = {
    host: 'theabsinthemind.herokuapp.com',
    path: '/countries/13',
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json'
    }
};

exports.getJSON = function(options, onResult)
{
    var req = http.request(options, function(res)
    {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
        console.log('error: ' + err.message);
    });

    req.end();
};

exports.postJSON = function(options, data, onResult)
{
    var req = http.request(options, function(res)
    {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
        console.log('error: ' + err.message);
    });

    req.write(JSON.stringify(data));
    req.end();
};


exports.deleteJSON = function(options, itemId, onResult)
{
    var req = http.request(options, function(res)
    {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
        console.log('error: ' + err.message);
    });

    req.end();
};

app.get('/get', function (req, res) {
    exports.getJSON(optionsGET,
                    function(statusCode, result) {
                        console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                        res.statusCode = statusCode;
                        res.send(result);
                    });
});

app.get('/post', function (req, res) {
    exports.postJSON(optionsPOST,
                     data,
                     function(statusCode, result) {
                        console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                        res.statusCode = statusCode;
                        res.send(result);
                     });
});

app.get('/delete', function (req, res) {
    exports.deleteJSON(optionsDELETE,
                    '',
                    function(statusCode, result) {
                        console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                        res.statusCode = statusCode;
                        res.send(result);
                    });
});

var server = app.listen(8000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});

apis_manager.initialize(app)
