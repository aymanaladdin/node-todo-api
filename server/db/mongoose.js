//MONOGOOSE CONFIGURATION

const mongoose = require('mongoose');

const DB = "TodoApp";
const localUri  = `mongodb://localhost:27017/${DB}`;

const mlabUri = "mongodb://admin:admin@ds245805.mlab.com:45805/todoapp" ;

mongoose.Promise = global.Promise;
mongoose.connect(localUri);

module.exports = { mongoose };

