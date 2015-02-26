var db = require('./../config/db');

var FoodTrucks = db.collection('foodtrucks');

// expects a longitude and latitude query string
exports.find = function(req, res, next) {
    var limit = req.query.limit || 10;
    var within = req.query.within || 100000;
    var longitude = parseFloat(req.query.longitude);
    var latitude = parseFloat(req.query.latitude);
    var coordinates = [longitude, latitude];

    // TODO(shane): refactor database business logic into separate file.
    FoodTrucks.ensureIndex({ 'location': '2dsphere' })
    .then(function() {
        return FoodTrucks.aggregate([
            {
                '$geoNear': {
                    distanceField: 'distance',
                    // Because of 'spherical: true', the distance is returned
                    // in meters. Convert meters to miles.
                    distanceMultiplier: 1/1609.34,
                    maxDistance: within,
                    near: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    spherical: true
                }
            },
            {
                $limit: limit
            },
            // $sort must be before $project to take advantage of indexes:
            // docs.mongodb.org/manual/reference/operator/aggregation/sort/
            {
                $sort: {
                    distance: 1,
                    name: 1
                }
            },
            {
                $project: {
                    _id: 0,
                    address: 1,
                    distance: 1,
                    fooditems: 1,
                    location: 1,
                    name: 1
                }
            },

        ]);
    }).then(function(results) {
        console.log(results);
        res.status(200).send(results);
    });
};