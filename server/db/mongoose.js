//MONOGOOSE CONFIGURATION

const mongoose = require('mongoose');

const dbUri = process.env.MOBGODB_URI;

mongoose.Promise = global.Promise;
mongoose.connect(dbUri);

module.exports = { mongoose };

