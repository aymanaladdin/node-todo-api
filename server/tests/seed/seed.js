const jwt = require("jsonwebtoken");

const {ObjectID: oid} = require("mongodb");

const {User} = require("./../../models/user");
const {Todo} = require("./../../models/todo");



const u1_id = new oid();
const u2_id = new oid();

const users = [{
    _id : u1_id,
    password : "u_1pass",
    email : "ayman@example.com",
    tokens: [{
        access : "auth",
        token : jwt.sign({_id: u1_id.toHexString(), access: 'auth'}, "abc123").toString()
    }]
}, {
    _id : u2_id,
    password : "u_2pass",
    email : "ayman@example.eg",
}]

const todos = [{
    _id: new oid(),
    text: "first from test"
},
{
    _id: new oid(),
    text: "secnd from test",
    complete: true,
    completedAt: 332213
}];


const seedUsers = (done)=>{
    User.remove({})
        .then(()=>{
            return Promise.all([new User(users[0]).save(), new User(users[1]).save()])
        })
        .then(()=> done());
}

const seedTodos = (done)=>{
    Todo.remove({})
        .then(()=>{
            return Todo.insertMany(todos);
        })
        .then(()=> done());
}

module.exports = {users, todos, seedUsers, seedTodos};