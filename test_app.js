var express = require('express');
var redisTest = require('./redis_test.js');

var app = express();

//return function for callback
//etag callback function
var etagSet = function(err, replies) {
    console.log('in the callback');
    console.log(replies)
    var obj = {}
    obj['etag'] = replies[0];
    obj['resource'] = replies[1];
    if (obj.resource === null) {
        console.log('new url');
        //grab resource regularly here
        //probably need to adjust callback for adding
        var reso = 'resource here!';
        redisTest.cacheResource(obj.etag, reso);
    } else {
        console.log('found an old one');
    } 
    app.set('etag', function (body, encoding) {
        return obj.etag;});
};


app.get('/', function(req, res) {
    res.send('Hello World');

});


app.get('/testredis', function(req, res) {
    //replace blah with actual url
    redisTest.requestWithUrl('blah', etagSet);
    //what = {'etag':'shiet', 'resource':'doubleshiet'};
    //console.log(what)
    //console.log(what.etag);

    //setting the etag in the header
    //app.set('etag', function (body, encoding) {
    //    return what.etag;});

    //look this up more in detail
//    console.log(app.get('etag'));

    res.send('Redis');
});

var server = app.listen(3000, '0.0.0.0', function() {
    console.log('server up');

});
