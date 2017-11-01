const {MongoClient: mc , ObjectID: oid} = require('mongodb');

const db = "TodoApp" 
const url = `mongodb://localhost:27017/${db}`
 
mc.connect(url, (err, db)=> {
    if(err) { return console.log("Cannot Connect to the Mongo Server"); }
    console.log("connect Successfully!");

    // db.collection("Todos").find().toArray()
    // .then((todos)=>{
    //     console.log(JSON.stringify(todos, undefined, 2));
    // })
    // .catch((err)=>{
    //     console.log(err);
    // });

    db.collection("Users").find({name: "Ayman"}).toArray()
    .then((users)=>{
        console.log(JSON.stringify(users, undefined, 1));
        return users
    })
    .then((users)=> {
        console.log(`Users count is ${users.length}`);
    })
    .catch((err)=>{
        console.log(err);
    });
  
   // db.close();
})