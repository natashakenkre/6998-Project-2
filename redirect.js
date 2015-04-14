var http = require('http');
var dao = require('./apis_manager_dao');
var querystring = require('querystring');
var request = require('request');

function options(host, path, method, id, query, fields) {
    var constructed_path = path;

    if (fields != null) {
        constructed_path += "&fields=" + fields;
    }

    if (query != null) {
        constructed_path += "?q=" + query;
    }
    
    var fin =  {
        uri : host+'/'+constructed_path,
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        json: true
    }
    console.log(fin);

    return fin;
}

exports.getJSON = function(options, onResult) {
    request(options, function(error, response, body) {
        if (error) {
            throw(error)
        }
        if (!error && response.statusCode==200) {
            console.log(body)
            onResult(response.statusCode, body)
        }
    });
};

exports.postJSON = function(options, data, onResult)
{
    console.log(data);
    var test_options = options;
    test_options['body'] = data;
    
    request(test_options, function(error, response, body) {
        if (error) {
            console.log(error)
        }
        if (!error) {
            console.log(body);
            onResult(response.statusCode, body);
        }
    });
};


exports.deleteJSON = function(options, itemId, onResult)
{
    request(options, function(error, response, body) {
        if (error) {
            throw(error)
        }
        if (!error) {
            console.log(body);
            onResult(response.statusCode, body);
        }
    });
/*
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
    */
};

module.exports = {
    initialize: function (app) {
        var managed_apis = dao.get_apis();
        var index;

        for (index in managed_apis) {
            var api = managed_apis[index];
            console.log(api);
            app.get('/' + api.id + '/:path(*)', function (req, res) {
                console.log(req)
                exports.getJSON(options(api.url, req.params.path, 'GET', null, req.query.q, req.query.fields),
                    function (statusCode, result) {
                        console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                        res.statusCode = statusCode;
                        res.send(result);
                    });
            });

            app.get('/' + api.id + '/:path&fields=:fields' , function (req, res) {
                exports.getJSON(GEToptions(api.url, req.params.path, req.query.q, req.params.fields),
                    function (statusCode, result) {
                        console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                        res.statusCode = statusCode;
                        res.send(result);
                    });
            });

            app.get('/' + api.id + '/:path/:id', function (req, res) {
                exports.getJSON(GEToptions(api.url, req.params.path + '/' + req.params.id, req.query.q, req.query.fields),
                    function (statusCode, result) {
                        console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                        res.statusCode = statusCode;
                        res.send(result);
                    });
            });

            app.get('/' + api.id + '/:path/:id&fields=:fields' , function (req, res) {
                exports.getJSON(GEToptions(api.url, req.params.path + '/' + req.params.id, req.query.q, req.params.fields),
                    function (statusCode, result) {
                        console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                        res.statusCode = statusCode;
                        res.send(result);
                    });
            });

            app.put('/' + api.id + '/:path(*)', function (req, res) {
                console.log("we in that put");
                exports.postJSON(options(api.url, req.params.path, 'PUT'),
                    req.body,
                    function (statusCode, result) {
                        console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                        res.statusCode = statusCode;
                        res.send(result);
                    });
            });

            app.post('/' + api.id + '/:path', function (req, res) {
                var data = JSON.stringify(req.body);

                exports.postJSON(POSToptions(api.url, req.params.path, data),
                    data,
                    function (statusCode, result) {
                        res.statusCode = statusCode;
                        res.send(result);
                    });
            });

            app.delete('/' + api.id +'/:path(*)', function (req, res) {
                console.log(req);
                exports.deleteJSON(options(api.url, req.params.path, 'DELETE'),
                    '',
                    function (statusCode, result) {
                        console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                        res.statusCode = statusCode;
                        res.send(result);
                    });
            });
        }
    }
}
