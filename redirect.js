var dao = require('./apis_manager_dao');
var request = require('request');

function GEToptions(host, path, query, fields) {
    var constructed_path = path;

    if (fields != null) {
        constructed_path += "&fields=" + fields;
    }

    if (query != null) {
        constructed_path += "?q=" + query;
    }
    
    var fin =  {
        uri : 'http://'+host+'/'+constructed_path,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        json: true
    }
    console.log(fin);

    return fin;
}

function DELETEoptions(host, path, id) {
    var constructed_path = path + '/' + id;

    var fin =  {
        uri : 'http://'+host+'/'+constructed_path,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        json: true
    }
    console.log(fin);

    return fin;
}

function POSToptions(host, path, data) {
    var fin =  {
        uri : 'http://'+host+'/'+path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        json: true,
        body: data
    }
    console.log(fin);

    return fin;
}

function PUToptions(host, path, id, data) {
    var fin =  {
        uri : 'http://'+host+'/'+path+'/'+id,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        json: true,
        body: data
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
    
    request(options, function(error, response, body) {
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
                exports.getJSON(GEToptions(api.url, req.params.path, req.query.q, req.query.fields),
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

            app.put('/' + api.id + '/:path/:id', function (req, res) {
                exports.postJSON(PUToptions(api.url, req.params.path, req.params.id, req.body),
                    req.body,
                    function (statusCode, result) {
                        console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                        res.statusCode = statusCode;
                        res.send(result);
                    });
            });

            app.post('/' + api.id + '/:path', function (req, res) {
                exports.postJSON(POSToptions(api.url, req.params.path, req.body),
                    req.body,
                    function (statusCode, result) {
                        res.statusCode = statusCode;
                        res.send(result);
                    });
            });

            app.delete('/' + api.id +'/:path/:id', function (req, res) {
                console.log(req);
                exports.deleteJSON(DELETEoptions(api.url, req.params.path, req.params.id),
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
