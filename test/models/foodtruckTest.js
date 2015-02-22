// TODO(shane): make automated tests rather than manually checking
// expected output in the command line
// Run using `node src/util/dbHelpers.js
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');

var FoodTruck = require('../../src/models/foodtruck');
var CONNECTION_STRING = require('../../src/util/dbHelpers').CONNECTION_STRING;

mongoose.connect(CONNECTION_STRING);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    createFoodTrucks()
    .then(findNearbyFoodTrucks)
    .then(cleanup);
});

function createFoodTrucks() {
    var foodTrucks = [
        {
            name: 'jimbo\'s cheese and tomatoes',
            address: '123 jimbo lane',
            fooditems: 'cheese, tomatoes',
            loc: [-121.3416406, 37.7813239]
        },
        {
            name: 'Nathan\'s catering',
            address: 'Assessors Block 8720/Lot008',
            fooditems: 'Italian subs, Cuban sandwich, Gyro',
            loc: [-122.391771646847, 37.7714019465879]
        },
        {
            name: 'Bombay Blvd.',
            address: '333 MARKET ST',
            fooditems: 'Indian Style: BBQ, Variety of Curries, Rice, Wraps, Breads (Naan, Rotis, Parathas), Desserts, Pizza. Beverages, Condiments, Indian Soups, Salads & Appetizer Varieties.',
            loc: [-122.397585967453, 37.7921033879545]
        }
    ];

    return FoodTruck.create(foodTrucks, function(err, success) {
        if (err) {
            console.error(err);
        }
        var created = Array.prototype.slice.call(arguments, 1);
        console.log(created);
    });
}

function findNearbyFoodTrucks() {
    var point = {
        coordinates: [-121.2416406, 37.7813239],
        type: 'Point'
    };

    return  FoodTruck.aggregate([{
        $geoNear: {
            distanceField: 'distance',
            // radius of Earth to convert radians --> miles
            distanceMultiplier: 1/3963.192,
            near: point,
            spherical: true
        }
    }], function(err, result) {
        if (err) {
            console.log(err);
        }
        console.log('\n', '---------Nearby Food Trucks---------', '\n', result);
    });
}

function cleanup() {
    FoodTruck.remove(function(err, removedCount) {
        console.log('Removed ', removedCount, ' food truck models.');
        mongoose.disconnect();
    });
}