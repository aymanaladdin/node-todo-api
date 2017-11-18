//MONOGOOSE CONFIGURATION

const mongoose = require('mongoose');

const dbUri = process.env.MONGODB_URI;

mongoose.Promise = global.Promise;
mongoose.connect(dbUri);

module.exports = { mongoose };

