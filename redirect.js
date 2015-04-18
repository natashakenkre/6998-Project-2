var http = require('http');
var dao = require('./apis_manager_dao');

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

module.exports = {
    initialize: function (app) {
        var managed_apis = dao.get_apis();
        var index;

        for (index in managed_apis) {
            console.log(managed_apis[index]);
        }

        app.get('/get', function (req, res) {
            exports.getJSON(optionsGET,
                function (statusCode, result) {
                    console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                    res.statusCode = statusCode;
                    res.send(result);
                });
        });

        app.get('/post', function (req, res) {
            exports.postJSON(optionsPOST,
                data,
                function (statusCode, result) {
                    console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                    res.statusCode = statusCode;
                    res.send(result);
                });
        });

        app.get('/delete', function (req, res) {
            exports.deleteJSON(optionsDELETE,
                '',
                function (statusCode, result) {
                    console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                    res.statusCode = statusCode;
                    res.send(result);
                });
        });
    }
}