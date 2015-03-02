var db = require('./../config/db');

var FoodTrucks = require('./../collections/food-trucks');

// Expects a longitude and latitude query string, and handles the logic of
// defining the optional paramaters "limit" and "within", as well as ensuring
// the proper type of all parameters.
exports.find = function(req, res, next) {
    var limit, within, longitude, latitude;
    try {
        // TODO(shane): make translation of query string to integers
        // into middleware or an inner function in this route handler.
        // TODO(shane): changing the default values of "limit" and "within" may
        // cause certain tests to fail. Make less brittle.
        limit = req.query.limit ? parseInt(req.query.limit) : 10;
        within = req.query.within ? parseInt(req.query.within) : 2;
        longitude = req.query.longitude ? parseFloat(
            req.query.longitude) : undefined;
        latitude = req.query.latitude ? parseFloat(req.query.latitude) : undefined;

    } catch(err) {
        res.status(404).send('Invalid parameters causing error: ' + JSON.stringify(err));
    }

    var coordinates = [longitude, latitude];

    var options = {
        coordinates: coordinates,
        limit: limit,
        within: within
    };

    function sendResponse(err, results) {
        if (err) {
            res.status(500).send('Database query failed: ' + JSON.stringify(err));
        }
        res.status(200).send(results);
    }

    FoodTrucks.findClosestFoodTrucks(options, sendResponse);
};