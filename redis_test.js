var redis = require('redis');
var client  = redis.createClient();

client.on('connect', function() {
    console.log('connected');
});


client.set('test', 'hi!');

client.expire('test', 300);


//exports.genEtag = function (
// genEtag: generate an etag for a url and cache it. Return the etag
function genEtag(url) {
    var test = 'etag1';
    client.set(url, test);
    client.expire(url, 300);
    return test;
}

// cacheResource: cache a resource in redisDB using the etag
exports.cacheResource = function(etag,resource) {
    console.log('caching new resource',etag,resource);
    client.set(etag, resource);
    client.expire(etag, 300);
}

//returns etag associated with the url if it exists
// if it does not exist, generate a new etag
exports.requestWithUrl = function (url, callback) {
    client.exists(url, function(err, reply) {
        if (reply === 1) {
            console.log('found in redis');
            /*obj['etag'] = client.get(url, function(err, reply) {
                console.log(reply)
                return reply.toString(); });
            client.get(url, function(err, reply) {
                console.log('GET SEGMENT');
                obj['etag'] = reply;
                console.log(obj);
            });
            client.get(obj['etag'], function(err, reply) {
                obj['resource'] = reply;
                console.log(obj)
            });
*/
            client.get(url, function(err, etag) {
                client.mget(url, etag, function(err, replies) {
                    console.log("MGET");
                    console.log(replies)
                    //obj['etag'] = replies[0];
                    //obj['resource'] = replies[1];
                    callback(0,replies)
                });
            });
        } else {
            console.log('not found in redis');
            //obj['etag'] = genEtag(url);
            //obj['resource'] = null;
            //console.log(obj)
            replies = [genEtag(url), null];
            callback(0,replies);
        }

        console.log('object with requestwithurl');
        //console.log(obj);
        //callback(obj);
    });
};


exports.requestWithUrlEtag = function (url, etag) {
    var obj = {};
    if (client.get(url) === etag) {
        obj['etag'] = etag;
        obj['resource'] = client.get(etag);
    } else {
        return null;
    }
    return obj;
}







