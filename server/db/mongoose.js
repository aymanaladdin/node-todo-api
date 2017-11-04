//MONOGOOSE CONFIGURATION

const mongoose = require('mongoose');

const DB = "TodoApp";
const uri = `mongodb://localhost:27017/${DB}`;

mongoose.Promise = global.Promise;
mongoose.connect(uri);

module.exports = { mongoose };