const express = require('express')
const body_parser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {User} = require("./models/user");
const {Todo} = require("./models/todo");

const app = express();

app.use(body_parser.json());

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

app.listen(3000, ()=>{
    console.log("Server is running on port 3000.");
});


module.exports = {app};