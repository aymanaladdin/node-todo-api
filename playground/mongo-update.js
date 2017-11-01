const {MongoClient: mc, ObjectID: oid} = require('mongodb');

const db = "TodoApp" 
const url = `mongodb://localhost:27017/${db}`
 
mc.connect(url, (err, db)=>{
    if(err) { return console.log("Cannot Connect to the Mongo Server"); }
    console.log("connect Successfully!");

    db.collection('Todos')
        .findOneAndUpdate({ complete: false } ,
        { $set: {complete : true} } ,
        { upsert : true, returnOriginal: false }
    )
        .then((res)=>{
            console.log(res)
        })
        .catch((err)=>{
            console.log(err)
        })
        ;

    db.collection('Users')
        .findOneAndUpdate({name: "Rashed"},
        {$inc:{ age: 4}},
        {returnOriginal: false}
    )
    .then((res)=>{ console.log(res); })
    .catch((err)=>{console.log(err); })
    ;
    //db.close();
});

