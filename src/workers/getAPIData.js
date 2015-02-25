var async = require('async');
var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');

var db = require('./../config/db');
var FoodTruck = require('./../models/foodTruck').FoodTruck;
var promise = require('./../util/promise');
var serverHelpers = require('./../util/serverHelpers');
var updateFoodTrucks = require('./../models/foodTruck').updateFoodTrucks;

// TODO(shane): change token to food truck finder token, and don't use
// cleartext.
APP_TOKEN = 'S9xZv2avu4REIdEZhsDGgglvS';
var FOOD_TRUCK_HOST = 'data.sfgov.org';
// TODO(shane): refactor to use the larger and more comprehensive data set
// including the times when the food truck is open:
// var FOOD_TRUCK_PATH = '/resource/jjew-r69b.json';
var FOOD_TRUCK_PATH = '/resource/rqzj-sfat.json';

// DataSF limit on number of records per request
var numRecords = 49999;
var queryString1 = '?$limit=' + numRecords + '&$order=:id';
var queryString2 = '?$limit=' + numRecords + '&$order=:id&$offset=' +
numRecords;

var firstEndpointOptions = {
    headers: {
        'X-App-Token': APP_TOKEN
    },
    host: FOOD_TRUCK_HOST,
    path: FOOD_TRUCK_PATH + queryString1
};

var secondEndpointOptions = {
    headers: {
        'X-App-Token': APP_TOKEN
    },
    host: FOOD_TRUCK_HOST,
    path: FOOD_TRUCK_PATH + queryString2
};

db.connect();

// TODO(shane): right now this logic isn't necessary because I'm not using
// the larger database at '/resource/jjew-r69b.json'. Keep it anyways because
// I plan to switch databases soon.
// Two requests are enough to get all of the food truck data (~55k records)
// given that only 50k records can be returned per API call.
// TODO(shane): create requests programmatically so that this logic scales
// if the dataset grows > 100K.
async.parallel([
    function(callback) {
        http.get(firstEndpointOptions, function(res) {
            serverHelpers.collectData(res, callback);
        });
    },
    function(callback) {
        var body = '';

        http.get(secondEndpointOptions, function(res) {
            serverHelpers.collectData(res, callback);
        });
    }
], function(err, results) {
    // TODO(shane): figure out why JSON.parse(results) throws an error. Then
    // get this try-catch to work.
//        try {
//            foodTrucks = JSON.parse(body);
//            console.log('inside************************', body);
//        } catch(err) {
//            res.statusCode = 400;
//            res.send('error parsing JSON: ' + err.message);
//        }

    if (err) {
        console.error(err);
        return;
    }

    var firstFoodTrucks = JSON.parse(results[0]);
    var secondFoodTrucks = JSON.parse(results[1]);

    allFoodTrucks = firstFoodTrucks.concat(secondFoodTrucks);

    foodTruckDocs = serverHelpers.convertDataToDocs(allFoodTrucks);

    console.log('Downloaded ' + foodTruckDocs.length +
        ' food trucks from DataSF.');

    updateFoodTrucks(foodTruckDocs).then(function() {
        db.disconnect();
    });
});