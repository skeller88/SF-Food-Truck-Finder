var mongoose = require('mongoose');

var foodTruckSchema = mongoose.Schema({
    address: String,
    fooditems: String,
    coordinates: {
        index: '2dsphere',
        // [longitude, latitude]
        type: [Number]
    },
    name: String
});

exports.findClosestFoodTrucks = function(coordinates) {
    var point = {
        coordinates: coordinates,
        type: 'Point'
    };

    return  exports.FoodTruck.aggregate([{
        $geoNear: {
            distanceField: 'distance',
            // radius of Earth to convert radians --> miles
            distanceMultiplier: 1/3963.192,
            near: point,
            spherical: true
        }
    }], function(err, result) {
        if (err) {
            throw Error(err);
        }
        console.log(result);
        return result;
    });
};

/**
 * @param {array} foodTrucks - The food trucks fetched from server and
 * transformed, ready to be inserted into the database.
 */
exports.updateFoodTrucks = function(foodTrucks) {
    FoodTruck.remove(function(err, removedCount) {
        console.log('Removed ', removedCount, ' food truck models.');

        FoodTruck.collection.insert(foodTrucks, function(err, docs) {
            if (err) {
                console.error(err);
            }
            console.log('Added', docs.length, 'food trucks.');
        });
    });
};

exports.FoodTruck = mongoose.model('FoodTruck', foodTruckSchema);
