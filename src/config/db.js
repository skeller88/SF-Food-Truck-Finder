var mongoose = require('mongoose');

var CONNECTION_STRING = 'mongodb://127.0.0.1:27017/foodtrucks';

var connectionString = process.env.MONGOLAB_URI || process.env.MONGOHQ_URI ||
CONNECTION_STRING;

exports.connect = function() {
    mongoose.connect(connectionString, function(err, res) {
        if (err) {
            console.error('ERROR connecting to: ' + connectionString + '. ' +
                err);
        } else {
            console.log('Successfully connected to: ' + connectionString);
        }
    });

    var db = mongoose.connection;

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', function() {
        mongoose.connection.close(function () {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });

    db.on('error', console.error.bind(console, 'connection error:'));
};

exports.disconnect = function() {
    mongoose.disconnect(function(err, res) {
        if (err) {
            console.error('ERROR disconnecting from: ' + connectionString +
                '. ' + err);
        } else {
            console.log('Successfully disconnected from: ' + connectionString);
        }
    });
};