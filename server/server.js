const express = require('express')
const body_parser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {User} = require("./models/user");
const {Todo} = require("./models/todo");

const app = express();

app.use(body_parser.json());

/*---------------------------------------(ROUTES)----------------------------------------*/

app.post('/todos', (req, res)=>{
    
    const todo = new Todo({ text: req.body.text });
    
    todo.save()
        .then((doc)=>{
            res.send(doc);
        })
        .catch((err)=>{
            res.status(400).send(err);
        });    
});

app.get('/todos', (req, res)=>{
    Todo.find()
        .then((todos)=>{
            res.send({todos})  //more effective to convert array data to object as later we can add more propreties
        })
        .catch((err)=>{
            console.log(err);
        })
    ;
});



/*---------------------------------------------------------------------------------------*/

app.listen(3000, ()=>{
    console.log("Server is running on port 3000.");
});


module.exports = {app};