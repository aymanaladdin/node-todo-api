//MONOGOOSE CONFIGURATION

const mongoose = require('mongoose');

const DB = "TodoApp";
const uri = "mongodb://admin:admin@ds245805.mlab.com:45805/todoapp" || `mongodb://localhost:27017/${DB}`;

mongoose.Promise = global.Promise;
mongoose.connect(uri);

module.exports = { mongoose };

