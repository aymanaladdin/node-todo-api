const {MongoClient, ObjectID} = require('mongodb');

const db = "TodoApp" 
const url = `mongodb://localhost:27017/${db}`
 
MongoClient.connect(url, (err, db)=>{
    if(err) { return console.log("Cannot Connect to the Mongo Server"); }
    console.log("connect Successfully!");

    // db.collection('Users').deleteMany({name: "Eslam"})
    // .then((res)=>{
    //     console.log(res);
    // })

    db.collection('Users').findOneAndDelete({location: "USA"})
    .then((res)=>{
        console.log(res);
    });

    //db.close();
});

