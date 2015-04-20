var dao = require('./apis_manager_dao');
var api = require('./api');

module.exports = {
    initialize : function(app) {
        dao.startup_api();

        app.post('/api_manager', function (req, res) {
            if(!req.body.hasOwnProperty('api_name') ||
                !req.body.hasOwnProperty('api_url')) {
                res.statusCode = 400;
                return res.json('Error 400: Post syntax incorrect.');
            }
            var name = req.body.api_name;
            var url = req.body.api_url;

            var new_api = new api.API(-1, name, url);

            dao.save_api(new_api);

            return res.json(new_api);

        });

        app.put('/api_manager/:api_id', function (req, res) {
            var id = req.params.api_id;
            var api_obj = dao.load_api(id);

            api_obj.name = req.body.api_name || api_obj.name;
            api_obj.url = req.body.api_url || api_obj.url;

            dao.save_api(api_obj);

            return res.json(api_obj);
        });

        app.delete('/api_manager/:api_id', function (req, res) {
            var id = req.params.api_id;
            var api_obj = dao.delete_api(id);

            return res.json("Deleted!");
        });

        app.get('/api_manager/:api_id', function (req, res) {
            var api_obj = dao.load_api(req.params.api_id)
            console.log('exploring');
            return res.json(api_obj);
        });

        app.get('/api_close', function (req, res) {
            dao.cleanup_api();
        });
    }
}
