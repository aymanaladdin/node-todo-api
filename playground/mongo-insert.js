const {MongoClient, ObjectID} = require('mongodb');

const db = "TodoApp" 
const url = `mongodb://localhost:27017/${db}`
 
MongoClient.connect(url, (err, db)=>{
    if(err) { return console.log("Cannot Connect to the Mongo Server"); }
    console.log("connect Successfully!");

    const todo = {text: "something todo later", complete: false};
    const user = {name: "Ayman", age: 25, location: "Dameitta Egypt"};
    
    // db.collection("Todos").insertOne(todo, (err, res)=> {
    //     if(err) { return console.log("Cannot insert the Doc to Todos"); }
    
    //     console.log("Doc added successfully, ", JSON.stringify(res.ops, undefined, 2));    
    // });
    
    // db.collection("Users").insertOne(user, (err, res)=> {
    //     if(err) { return console.log("Cannot insert the Doc to Users"); }
    //     console.log("Doc added successfully, ", JSON.stringify(res.ops, undefined, 2));
        
    // });

   // db.close();
});

