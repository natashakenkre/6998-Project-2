var dao = require('./apis_manager_dao');
var request = require('request');
var cacher = require('./redis_manager.js');

//redis callbacks
var etagCheck = function (req, res, next) {
    //console.log('etag1');
    cacher.requestWithUrl(req.originalUrl, etagCheckCB);
    res.send('hi');
    //next();
};

var etagCheckCache = function (req, res, next) {
    if (req.cached ==true) {
        console.log('theres a cache');
        //console.log(req);
        cacher.returnResource(req,res,next);
    } else {
        console.log('no cache');
        next();
    }
    //next();
};

var etagCheckCB = function(req, res) {
    var obj = {}
    obj['etag'] = res[0];
    obj['resource'] = res[1];
    if (obj.resource ===null) {
        req.etagged = false;
        var reso='resource';

        cacher.cacheResource(obj.etag, reso);
    } else {
        req.etagobj = obj;
        console.log(obj)
        //res.send(obj.resource);
        console.log('found in redis');
    }

};

var etagSet = function(req,res, next) {
    app.set('etag', function (body,encoding) {
        return req.etagobj.etag;});
    console.log('etag set');
    next();
};



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
    //console.log(fin);

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
    //console.log(fin);

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
    //console.log(fin);

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
    //console.log(fin);

    return fin;
}

exports.getJSON = function(options, onResult) {
    request(options, function(error, response, body) {
        if (error) {
            throw(error)
        }
        if (!error && response.statusCode==200) {
            //console.log(body)
            onResult(response.statusCode, body)
        }
    });
};

exports.postJSON = function(options, data, onResult)
{
    //console.log(data);

    request(options, function(error, response, body) {
        if (error) {
            console.log(error)
        }
        if (!error) {
            //console.log(body);
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
            //console.log(body);
            onResult(response.statusCode, body);
        }
    });
};

module.exports = {
    initialize: function (app) {
        dao.get_apis(function (res) {

            var managed_apis = res;
            var index;

            for (index in managed_apis) {
                var api = managed_apis[index];
                app.get('/' + api.id + '/:path(*)', [cacher.requestWithUrlEtag, cacher.requestWithUrl, etagCheckCache], function (req, res) {
                    console.log(req.headers)
                    exports.getJSON(GEToptions(api.url, req.params.path, req.query.q, req.query.fields),
                        function (statusCode, result) {
                            console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                            res.statusCode = statusCode;
                            cacher.cacheResource(req.etagobj.etag,result);
                            app.set('etag', function (body,encoding) {
                                return req.etagobj.etag;});
                            res.send(result);
                        });
                });

                app.get('/' + api.id + '/:path(*)&fields=:fields', [cacher.requestWithUrlEtag, cacher.requestWithUrl, etagCheckCache], function (req, res) {
                    exports.getJSON(GEToptions(api.url, req.params.path, req.query.q, req.params.fields),
                        function (statusCode, result) {
                            console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                            res.statusCode = statusCode;
                            cacher.cacheResource(req.etagobj.etag,result);
                            app.set('etag', function (body,encoding) {
                                return req.etagobj.etag;});
                            res.send(result);
                        });
                });

                app.put('/' + api.id + '/:path/:id', [cacher.genEtag], function (req, res) {
                    exports.postJSON(PUToptions(api.url, req.params.path, req.params.id, req.body),
                        req.body,
                        function (statusCode, result) {
                            console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                            res.statusCode = statusCode;
                            cacher.cacheResource(req.etagobj.etag,result);
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
                    //console.log(req);
                    exports.deleteJSON(DELETEoptions(api.url, req.params.path, req.params.id),
                        '',
                        function (statusCode, result) {
                            console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                            res.statusCode = statusCode;
                            res.send(result);
                        });
                });
            }
        });
    }
}
