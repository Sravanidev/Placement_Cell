const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/placement_cell_development');

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to mongoDB"));

db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
})

module.exports = db;