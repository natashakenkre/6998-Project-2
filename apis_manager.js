module.exports = {
    initialize : function(app) {
        app.post('/api_manager', function (req, res) {
            if(!req.body.hasOwnProperty('api_name') ||
                !req.body.hasOwnProperty('api_url')) {
                res.statusCode = 400;
                return res.json('Error 400: Post syntax incorrect.');
            }

            var name = req.body.api_name;
            var url = req.body.api_url;

            var new_api = new API(-1, name, url);

            save_api(new_api);

            return res.json(new_api);

        });

        app.put('/api_manager/:api_id', function (req, res) {
            var id = req.params.api_id;
            var api = load_api(id);

            api.name = req.body.api_name || api.name;
            api.url = req.body.api_url || api.url;

            save_api(api);

            return res.json(api);
        });

        app.delete('/api_manager/:api_id', function (req, res) {
            var id = req.params.api_id;
            var api = delete_api(id);

            return res.json("Deleted!");
        });
    }
}

function API(id, name, url) {
    this.id = id;
    this.name = name;
    this.url = url;
}

function save_api(api) {
    console.log("Saved");
}

function load_api(id) {
    console.log("Loaded " + id);
    return new API(id, "default_name", "default_url");
}

function delete_api(id) {
    console.log("Deleted " + id);
}