var redis = require('redis');
var client  = redis.createClient();

client.on('connect', function() {
    console.log('connected');
});





//exports.genEtag = function (
// genEtag: generate an etag for a url and cache it. Return the etag
exports.genEtag = function (req,res,next) {
    var url = req.originalUrl;
    var date = new Date();
    var test = url+ date.getSeconds();
    client.set(url, test);
    client.expire(url, 300);
    return test;
}

// cacheResource: cache a resource in redisDB using the etag
exports.cacheResource = function(etag,resource) {
    console.log('caching new resource',etag,resource);
    client.set(etag, JSON.stringify(resource));
    client.expire(etag, 300);
}

//returns etag associated with the url if it exists
// if it does not exist, generate a new etag
exports.requestWithUrl = function (req, res, next) {
    console.log('etag1');
    console.log(req.headers);
    var url = req.originalUrl;
    client.exists(url, function(err, reply) {
        obj = {};
        if (reply === 1) {
            console.log('found in redis');
            client.get(url, function(err, etag) {
                client.mget(url, etag, function(err, replies) {
                    //generation of new object
                    obj['etag'] = replies[0];
                    obj['resource'] = replies[1];
                    
                    //set properties in req to pass them along
                    req.etagobj = obj;
                    req.cached = true;
                    next();
                });
            });
        } else {
            console.log('not found in redis');
            obj['etag'] = exports.genEtag(req, res);
            obj['resource'] = null;
            req.etagobj = obj;
            req.cached = false;
            next();
        }

    });
};

exports.returnResource = function (req,res, callback) {
    client.get(req.etagobj.etag, function(err, reply) {
        res.send(reply);
    });
};

exports.requestWithUrlEtag = function (req,res, next) {
    //insert etag checking here
    var etag = req.headers['if-none-match'];
    client.get(req.originalUrl, function(err, reply) {
        if (err) {
            throw err;
        } else {
            if (reply != etag) {
                next();
                //res.send('invalid etag, do a normal request without one');
            } else {
                next();
            }
        }
    });
};







