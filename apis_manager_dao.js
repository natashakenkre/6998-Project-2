var api = require('./api');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host:   'us-cdbr-iron-east-02.cleardb.net',
    user:   'b31a1ff30df7f4',
    password:   '505ab38e',
    database:   'heroku_0f809a773200774',
    protocol:   'TCP'
});

module.exports = {
    save_api : function (api_obj) {
        var idless_api = {
            api_name = api_obj.api_name,
            api_url = api_obj.api_url
        };

        connection.query("INSERT INTO api_manager SET ?", idless_api, function (err, res) {
            if (err) {
                console.log(err)
            } else {
                console.log("saved");
            }
        });
    },

    load_api : function (id) {
        console.log("Loaded " + id);
        return new api.API(id, "default_name", "default_url");
    },

    delete_api : function (id) {
        console.log("Deleted " + id);
    },

    get_apis : function() {
        return [new api.API(1, "customers_api", "theabsinthecostumer.herokuapp.com/")];
    },

    cleanup_api : function() {
        connection.close();
    },

    startup_api : function() {
        connection.connect();
    }

}

