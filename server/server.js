require("./config/config");

const express = require('express')
const body_parser = require('body-parser');
const _ = require("lodash");
const bcrypt = require("bcryptjs");

const {ObjectID : oid} = require("mongodb");

const {mongoose} = require('./db/mongoose');
const {User} = require("./models/user");
const {Todo} = require("./models/todo");
const {authenticate} = require('./middleware/authenticate');

const port = process.env.PORT;

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

app.get('/todos/:id', (req, res)=>{
    let id = req.params.id;

    if(! oid.isValid(id)) {
        return res.status(404).send("Item Not Found!");
    }

    Todo.findById(id)
        .then((todo)=>{
            if(todo === null) {
                 return res.status(404).send("Item Not Found");
            }
            res.send({todo});
        })
        .catch((err)=>{
            res.status(400).send("Something went wrong");
        })
    ;

});

app.delete('/todos/:id', (req, res)=>{

    let id = req.params.id;

    if(!oid.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id)
        .then((todo)=>{
            if(! todo){
                return res.status(404).send();
            }
            res.send({todo})
        })
        .catch((err)=>{
            res.status(400).send();
        })
    ;
});

app.patch('/todos/:id', (req, res)=>{
    let id = req.params.id;
    
    if(!oid.isValid(id)) {
        return res.status(404).send();
    }
    
    let body = _.pick(req.body, ["text", "complete"]);
    
    if(_.isBoolean(body.complete) && body.complete) {
        body.completedAt = new Date().getTime();
    }
    else{
        body.complete = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true, runValidators: true})
        .then((todo)=>{
            if(! todo) {
                return res.status(404).send();
            }

            res.send({todo});
        })
        .catch((err)=>{
            res.status(400).send();
        })
    ;
});

app.post("/users", (req, res)=>{
    const body = _.pick(req.body, ["email", "password"]);
    const user = new User(body);

    user.save()
        .then((user)=> {
            return user.generateAuthToken();
        })
        .then((token)=> res.header("x-auth", token).send(user))
        .catch((err)=> res.status(400).send(err));

});

app.post('/users/login', (req, res)=>{
    const body = _.pick(req.body, ["email", "password"]);
    let resUser = {};
    
    if(!body.email || !body.password) return res.status(400).send();

    User.findByCredentials(body.email, body.password)
        .then((user)=> {
            resUser = user;
            return user.generateAuthToken();
        })
        .then((token)=> res.header('x-auth', token).send(resUser))
        .catch((e)=> res.status(400).send(e));

    // User.findOne({email: body.email})
    //     .then((user)=>{
    //         if(!user) return Promise.reject({error: "Invalid Email"});
    //         resUser = user;
    //         return bcrypt.compare(body.password, user.password);
    //     })
    //     .then((match)=>{
    //         if(!match) return Promise.reject({error: "Password not Match!"});

    //         res.send(resUser);
    //     })
    //     .catch((err)=> res.status(400).send(err));
});

app.get('/users/me',authenticate, (req, res)=>{
    res.send(req.user);    
});

/*---------------------------------------------------------------------------------------*/

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}.`);
});


module.exports = {app};