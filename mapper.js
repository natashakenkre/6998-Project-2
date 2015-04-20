var express = require('express');
var bodyParser = require('body-parser');
var apis_manager = require('./apis_manager');
var redirect = require('./redirect');
var authentication = require('./authentication')

var app = express();
app.use(bodyParser.json());

var server = app.listen(8000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('ApiManager App listening at http://%s:%s', host, port);

});

apis_manager.initialize(app);
redirect.initialize(app);
authentication.initialize(app);