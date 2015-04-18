var http = require('http');
var dao = require('./apis_manager_dao');

function options(host, path, method, id, query, fields) {
    var constructed_path = path;

    if (fields != null) {
        constructed_path += "&fields=" + fields;
    }

    if (query != null) {
        constructed_path += "?q=" + query;
    }
    
    return {
        host : host,
        path: constructed_path,
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    }
}

exports.getJSON = function(options, onResult) {
    var req = http.request(options, function(res)
    {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            console.log(output);
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
            var api = managed_apis[index];

            app.get('/' + api.id + '/:path', function (req, res) {
                exports.getJSON(options(api.url, req.params.path, 'GET', null, req.query.q, req.query.fields),
                    function (statusCode, result) {
                        console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                        res.statusCode = statusCode;
                        res.send(result);
                    });
            });

            app.get('/' + api.id + '/:path&fields=:fields' , function (req, res) {
                exports.getJSON(options(api.url, req.params.path, 'GET', null, req.query.q, req.params.fields),
                    function (statusCode, result) {
                        console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                        res.statusCode = statusCode;
                        res.send(result);
                    });
            });

            app.post('/' + api.id + '/:path', function (req, res) {
                exports.postJSON(options(api.url, req.params.path, 'POST', null),
                    data,
                    function (statusCode, result) {
                        res.statusCode = statusCode;
                        res.send(result);
                    });
            });

            app.delete('/' + api.id, function (req, res) {
                exports.deleteJSON(options(api.url, '/countries', 'DELETE', 4),
                    '',
                    function (statusCode, result) {
                        res.statusCode = statusCode;
                        res.send(result);
                    });
            });
        }
    }
}