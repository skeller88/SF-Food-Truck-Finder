var mongoose = require('mongoose');

var foodTruckSchema = mongoose.Schema({
    address: String,
    fooditems: String,
    coordinates: {
        index: '2dsphere',
        // [longitude, latitude]
        type: [Number],
    },
    name: String
});

module.exports = mongoose.model('FoodTruck', foodTruckSchema);
