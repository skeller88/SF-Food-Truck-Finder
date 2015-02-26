var pmongo = require('promised-mongo');

var collections = ['foodtrucks'];
var databaseName = 'foodtrucks';
var connectionString = process.env.MONGOHQ_URL || 'mongodb://127.0.0.1:27017';
connectionString = connectionString + '/' + databaseName;

console.log('Connecting to ', connectionString);
module.exports = pmongo(connectionString, collections);

// exports.connect = function() {
//     mongoose.connect(connectionString, function(err, res) {
//         if (err) {
//             console.error('ERROR connecting to: ' + connectionString + '. ' +
//                 err);
//         } else {
//             console.log('Successfully connected to: ' + connectionString);
//         }
//     });

//     var db = mongoose.connection;
//     mongoomise.promisifyAll(db, require('./../util/promise'));

//     // If the Node process ends, close the Mongoose connection
//     process.on('SIGINT', function() {
//         mongoose.connection.close(function () {
//             console.log('Mongoose default connection disconnected through app termination');
//             process.exit(0);
//         });
//     });

//     db.on('error', console.error.bind(console, 'connection error:'));
// };

// exports.disconnect = function() {
//     mongoose.disconnect(function(err, res) {
//         if (err) {
//             console.error('ERROR disconnecting from: ' + connectionString +
//                 '. ' + err);
//         } else {
//             console.log('Successfully disconnected from: ' + connectionString);
//         }
//     });
// };