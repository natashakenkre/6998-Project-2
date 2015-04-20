var api = require('./api');
var mysql = require('mysql');

var connection_details = {
    host:   'us-cdbr-iron-east-02.cleardb.net',
    user:   'b31a1ff30df7f4',
    password:   '505ab38e',
    database:   'heroku_0f809a773200774',
    protocol:   'TCP'
};

var connection;

function handleDisconnect() {
    connection = mysql.createConnection(connection_details);

    connection.connect(function(err) {
        if(err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

module.exports = {
    save_api : function (api_obj) {
        var idless_api = {
            API_name : api_obj.name,
            URL_skeleton : api_obj.url
        };

        connection.query("INSERT INTO api_manager SET ?", idless_api, function (err, res) {
            if (err) {
                console.log(err)
            } else {
                console.log(res.insertId);
                console.log("saved");
            }
        });
    },

    load_api : function (id) {

        connection.query("SELECT * FROM api_manager WHERE API_id = ?", [id], function(err, rows, fields) {
            if (err) throw err;

            for (var i in rows) {
                console.log(rows[i]);
            }

            console.log("Loaded " + id);
            return new api.API(rows[0].API_id, rows[0].API_name, rows[0].URL_skeleton);
        });

    },

    delete_api : function (id) {
        connection.query("DELETE FROM api_manager WHERE API_id = ?", [id], function(err, rows, fields) {
            if (err) throw err;

            console.log("Deleted " + id);
        });
    },

    get_apis : function(callback) {
        connection.query("SELECT * FROM api_manager", function(err, rows, fields) {
            if (err) {
                console.log('error');
                throw err;
            }

            var api_list = [];
            for (var i in rows) {
                api_list.push(new api.API(rows[i].API_id, rows[i].API_name, rows[i].URL_skeleton));
            }

            callback(api_list);
        });
    },

    cleanup_api : function() {
        connection.close();
    },

    startup_api : function() {
        handleDisconnect();
    }

}

