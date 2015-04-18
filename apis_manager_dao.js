var api = require('./api');

module.exports = {
    save_api : function (api_obj) {
        console.log("Saved");
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
    }
}

