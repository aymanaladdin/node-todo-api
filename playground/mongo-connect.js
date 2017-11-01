const mongoClient = require('mongodb').MongoClient;

const db = "TodoApp" 
const url = `mongodb://localhost:27017/${db}`

mongoClient.connect(url, (err, db)=>{
    if(err) { return console.log("Cannot Connect to the Mongo Server"); }

    console.log("connect Successfully!")
    db.close();
});