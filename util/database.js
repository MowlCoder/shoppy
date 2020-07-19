const mongodb = require('mongodb');
const cfg = require('./../config');

const MongoClient = mongodb.MongoClient;

let _db = undefined;

const mongoConnect = (cb) => {
    MongoClient.connect(`mongodb+srv://mowl:${cfg.mongoDbPass}@shoppy.dj4e1.mongodb.net/shop?retryWrites=true&w=majority`)
    .then(client => {
        _db = client.db();
        cb();
    })
    .catch(err => {
        console.log(err);
    });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
